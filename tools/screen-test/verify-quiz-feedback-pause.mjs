// Verifica el botón Reproducir/Pausar mientras se lee la devolución del quiz.
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (b) => { const i = args.indexOf(b); return i >= 0 ? args[i + 1] : undefined; };
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const sid = argVal("--quiz") || "quiz_final";

const fallas = [];
const fallar = (m) => fallas.push(m);

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on("pageerror", (e) => fallar("error de página: " + String(e).slice(0, 160)));

await page.addInitScript(() => {
  const original = window.Audio;
  const tracked = [];
  function Tracked(src) { const a = new original(src); tracked.push(a); return a; }
  Tracked.prototype = original.prototype;
  window.Audio = Tracked;
  window.__audiosTracked = tracked;
});

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

await page.click("#reflow-tools");
await page.waitForTimeout(800);
const interruptor = await page.$(".reflow-setting-read-aloud [role='switch']");
if (!interruptor) fallar("no se encontró el interruptor de lectura en voz alta");
else { await interruptor.click(); await page.waitForTimeout(1200); }
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

await page.evaluate((s) => {
  const content = document.getElementById("content");
  const sec = document.querySelector(`[data-section-id="${s}"]`);
  const colW = content.clientWidth;
  const left = sec.getBoundingClientRect().left - content.getBoundingClientRect().left + content.scrollLeft;
  window.__adtReflowGoToVisualPage(Math.round(left / colW) + 1);
}, sid);
await page.waitForTimeout(1000);

// Devolución = audio propio del quiz; el último Audio creado es el de la devolución.
await page.evaluate((s) => {
  const sec = document.querySelector(`[data-section-id="${s}"]`);
  const card = sec.querySelectorAll(".quiz-card")[0];
  const opciones = card.querySelectorAll(".quiz-option");
  const input = opciones[opciones.length - 1].querySelector('input[type="radio"]');
  if (input) input.click();
  const sub = card.querySelector(".quiz-submit");
  if (sub) sub.click();
}, sid);
await page.waitForTimeout(1600);

const estado = () => page.evaluate(() => {
  const audios = window.__audiosTracked || [];
  const devolucion = audios.length ? audios[audios.length - 1] : null;
  const toggle = document.getElementById("reflow-tts-toggle");
  return {
    devolucionSrc: devolucion ? String(devolucion.src || "").split("/").pop().split("?")[0] : null,
    devolucionSonando: Boolean(devolucion && !devolucion.paused && !devolucion.ended),
    devolucionT: devolucion ? Math.round(devolucion.currentTime * 100) / 100 : null,
    botonLabel: toggle ? toggle.getAttribute("aria-label") : null,
    botonIcon: toggle ? (toggle.querySelector(".reflow-tts-player-icon") || {}).dataset?.reflowIcon : null,
    enLectura: !!document.querySelector(".quiz-feedback.tts-active-block"),
    visible: (() => { const r = toggle && toggle.getBoundingClientRect(); return !!r && r.width > 0; })()
  };
});

const asegurarVisible = async () => {
  const v = await page.evaluate(() => {
    const t = document.getElementById("reflow-tts-toggle");
    const r = t && t.getBoundingClientRect();
    return !!r && r.width > 0 && r.height > 0;
  });
  if (!v) {
    await page.evaluate(() => document.getElementById("reflow-tts-fab").click());
    await page.waitForTimeout(400);
  }
};

const leyendo = await estado();
console.log("LEYENDO:", JSON.stringify(leyendo));
if (!leyendo.enLectura) fallar("la devolución no se estaba leyendo");
if (!leyendo.devolucionSonando) fallar("el audio de la devolución no estaba sonando");
if (leyendo.botonLabel !== "Pausar") fallar(`el botón debía decir «Pausar» y dice «${leyendo.botonLabel}»`);

await asegurarVisible();
await page.click("#reflow-tts-toggle");
await page.waitForTimeout(900);
const pausado = await estado();
console.log("CLIC 1 (pausar):", JSON.stringify(pausado));
if (pausado.devolucionSonando) fallar("el primer clic NO pausó la devolución");
if (pausado.botonLabel !== "Reproducir") fallar(`tras pausar el botón debía decir «Reproducir» y dice «${pausado.botonLabel}»`);

await asegurarVisible();
await page.click("#reflow-tts-toggle");
await page.waitForTimeout(900);
const reanudado = await estado();
console.log("CLIC 2 (reanudar):", JSON.stringify(reanudado));
if (!reanudado.devolucionSonando) fallar("el segundo clic no reanudó la devolución");
if (reanudado.botonLabel !== "Pausar") fallar(`tras reanudar el botón debía decir «Pausar» y dice «${reanudado.botonLabel}»`);

// Acelerar el final y comprobar que el botón vuelve a «Reproducir».
await page.evaluate(() => {
  const audios = window.__audiosTracked || [];
  const d = audios[audios.length - 1];
  if (d) d.playbackRate = 6;
});
await page.waitForFunction(() => !document.querySelector(".quiz-feedback.tts-active-block"), null, { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(600);
const terminado = await estado();
console.log("FIN:", JSON.stringify(terminado));
if (terminado.enLectura) fallar("la devolución no terminó (no se pudo comprobar el estado final)");
else if (terminado.botonLabel !== "Reproducir") fallar(`al terminar el botón debía decir «Reproducir» y dice «${terminado.botonLabel}»`);

/* «Detener» también tiene que cortar la devolución del cuestionario. */
await page.evaluate((s) => {
  const sec = document.querySelector(`[data-section-id="${s}"]`);
  const card = sec.querySelectorAll(".quiz-card")[1];
  const opciones = card.querySelectorAll(".quiz-option");
  const input = opciones[opciones.length - 1].querySelector('input[type="radio"]');
  if (input) input.click();
  const sub = card.querySelector(".quiz-submit");
  if (sub) sub.click();
}, sid);
await page.waitForTimeout(1600);
const leyendo2 = await estado();
if (!leyendo2.enLectura) fallar("la 2.ª devolución no se estaba leyendo");
await asegurarVisible();
await page.click("#reflow-tts-stop");
await page.waitForTimeout(900);
const detenido = await estado();
console.log("DETENER:", JSON.stringify(detenido));
if (detenido.devolucionSonando) fallar("«Detener» no cortó la devolución");
if (detenido.enLectura) fallar("«Detener» no quitó la marca de lectura de la devolución");

await page.screenshot({ path: "tmp/quiz-feedback-pause.png" });
await browser.close();

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: el botón pausa y reanuda la devolución del quiz");
