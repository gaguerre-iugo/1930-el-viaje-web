// Devolución del cuestionario: pausar, continuar la MISMA y detener sin perder la lectura.
//
// Dos bugs que este test fija:
//  1) Al reanudar una devolución pausada sonaba OTRA frase: el puente de
//     HTMLMediaElement.play le asignaba `state.ttsAudio` al audio de la
//     devolución y, al reanudar, el guardia de fuente le reescribía el src con
//     el último ítem del libro. Sólo se veía con el libro YA reproducido antes
//     (con `state.ttsCurrentAudioId` seteado), que es el uso real.
//  2) «Detener» durante la devolución apagaba la lectura en voz alta, escondía
//     el reproductor y dejaba el botón deshabilitado: no se podía continuar.
//
// Uso:
//   node verify-quiz-feedback-pause.mjs
//   node verify-quiz-feedback-pause.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (b) => { const i = args.indexOf(b); return i >= 0 ? args[i + 1] : undefined; };
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const sid = argVal("--quiz") || "qz007";

const fallas = [];
const fallar = (m) => fallas.push(m);

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on("pageerror", (e) => fallar("error de página: " + String(e).slice(0, 160)));

/* Registra cada <audio> que crea el libro, para saber cuál suena. */
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

/* Enciende la lectura en voz alta. */
await page.click("#reflow-tools");
await page.waitForTimeout(800);
const interruptor = await page.$(".reflow-setting-read-aloud [role='switch']");
if (!interruptor) fallar("no se encontró el interruptor de lectura en voz alta");
else { await interruptor.click(); await page.waitForTimeout(1200); }
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

const clic = async (sel) => {
  const visible = await page.evaluate((s) => {
    const el = document.querySelector(s);
    const r = el && el.getBoundingClientRect();
    return !!r && r.width > 0 && r.height > 0;
  }, sel);
  if (!visible) {
    await page.evaluate(() => { const f = document.getElementById("reflow-tts-fab"); if (f) f.click(); });
    await page.waitForTimeout(400);
  }
  try { await page.click(sel, { timeout: 5000 }); }
  catch (_e) { await page.evaluate((s) => { const el = document.querySelector(s); if (el) el.click(); }, sel); }
  await page.waitForTimeout(150);
};

const dev = () => page.evaluate(() => {
  const d = (window.__audiosTracked || []).slice(-1)[0];
  const toggle = document.getElementById("reflow-tts-toggle");
  const player = document.getElementById("reflow-tts-player");
  const api = window.__adtReflowAudio;
  const content = document.getElementById("content");
  const caja = content.getBoundingClientRect();
  const idx = api && Number(api.currentIndex);
  const item = api && api.items && api.items[idx];
  const visible = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.left < caja.right && r.right > caja.left;
  };
  return {
    src: d ? String(d.src || "").split("/").pop().split("?")[0] : null,
    t: d ? Math.round(d.currentTime * 100) / 100 : null,
    pausado: d ? d.paused : null,
    esDevolucion: d ? /_exp\.mp3/.test(String(d.src || "")) : null,
    enLectura: Boolean(document.querySelector(".quiz-feedback.tts-active-block")),
    boton: toggle ? toggle.getAttribute("aria-label") : null,
    botonDeshabilitado: toggle ? toggle.disabled : null,
    reproductorOculto: player ? player.hidden : null,
    apiPlaying: api ? Boolean(api.isPlaying) : null,
    apiItemId: item && item.id || null,
    apiItemVisible: item ? visible(item.el) : null
  };
});

/* 1) Reproducir el LIBRO antes (uso real: el lector venía escuchando). */
const libro = await page.evaluate(() => {
  const api = window.__adtReflowAudio;
  const i = api.items.findIndex((it) => it.el && it.el.closest('[data-section-id="pg019_sec001"]'));
  api.playAtIndex(i >= 0 ? i : 0);
  return i;
});
await page.waitForTimeout(2500);
const trasLibro = await dev();
if (trasLibro.pausado === true) fallar("el libro no arrancó (no se pudo preparar el caso real)");
await page.evaluate(() => window.__adtReflowAudio.pause && window.__adtReflowAudio.pause());
await page.waitForTimeout(500);

/* 2) Ir al quiz y responder mal, para que lea la devolución. */
const idx = await page.evaluate((s) => {
  const api = window.__adtReflowAudio;
  const panel = document.querySelector(`[data-section-id="${s}"] .quiz-panel`);
  return api.items.findIndex((it) => it.el && it.el.closest(".quiz-panel") === panel);
}, sid);
if (idx < 0) fallar(`no se encontró el cuestionario ${sid}`);
await page.evaluate((i) => window.__adtReflowAudio.playAtIndex(i), idx);
await page.waitForTimeout(2500);
await page.evaluate(() => window.__adtReflowAudio.pause && window.__adtReflowAudio.pause());
await page.waitForTimeout(500);
await page.evaluate((s) => {
  const panel = document.querySelector(`[data-section-id="${s}"] .quiz-panel`);
  const card = panel.querySelector(".quiz-card");
  const ops = card.querySelectorAll(".quiz-option");
  const input = ops[ops.length - 1].querySelector('input[type="radio"]');
  if (input) input.click();
  const sub = card.querySelector(".quiz-submit");
  if (sub) sub.click();
}, sid);
await page.waitForTimeout(2000);

const leyendo = await dev();
console.log("leyendo devolución:", JSON.stringify(leyendo));
if (!leyendo.enLectura) fallar("la devolución no se estaba leyendo");
if (!leyendo.esDevolucion) fallar("lo que suena no es el audio de la devolución");
if (leyendo.boton !== "Pausar") fallar(`el botón debía decir «Pausar» y dice «${leyendo.boton}»`);

/* 3) Pausar la devolución. */
await clic("#reflow-tts-toggle");
await page.waitForTimeout(900);
const pausada = await dev();
console.log("pausada:            ", JSON.stringify(pausada));
if (pausada.pausado !== true) fallar("el clic no pausó la devolución");
if (pausada.esDevolucion !== true) fallar("al pausar cambió el audio");
if (pausada.boton !== "Reproducir") fallar(`tras pausar el botón debía decir «Reproducir» y dice «${pausada.boton}»`);

/* 4) Continuar: tiene que seguir la MISMA devolución, desde donde quedó. */
await clic("#reflow-tts-toggle");
await page.waitForTimeout(1200);
const seguida = await dev();
console.log("continuada:         ", JSON.stringify(seguida));
if (seguida.pausado !== false) fallar("el clic no reanudó la devolución");
if (!seguida.esDevolucion) fallar(`al continuar sonó «${seguida.src}» en vez de la devolución`);
if (!(seguida.t > pausada.t)) fallar(`continuó desde ${seguida.t} y había quedado en ${pausada.t} (reinició)`);

/* 5) Detener durante la devolución: corta la devolución y deja seguir leyendo. */
await clic("#reflow-tts-stop");
await page.waitForTimeout(1200);
const detenida = await dev();
console.log("detenida:           ", JSON.stringify(detenida));
if (detenida.enLectura) fallar("«Detener» no cortó la devolución");
if (detenida.reproductorOculto) fallar("«Detener» escondió el reproductor (la lectura tiene que quedar encendida)");
if (detenida.botonDeshabilitado) fallar("«Detener» dejó deshabilitado el botón Reproducir");

/* 6) Continuar después de Detener: la narración arranca en la página visible. */
await clic("#reflow-tts-toggle");
await page.waitForTimeout(2500);
const continuadaTrasDetener = await dev();
console.log("tras Detener+Play:  ", JSON.stringify(continuadaTrasDetener));
if (continuadaTrasDetener.apiPlaying !== true) fallar("tras Detener, «Reproducir» no arrancó la narración");
if (continuadaTrasDetener.esDevolucion) fallar("tras Detener, «Reproducir» volvió a sonar la devolución");
if (continuadaTrasDetener.apiItemVisible !== true) {
  fallar(`tras Detener, la narración arrancó en «${continuadaTrasDetener.apiItemId}», fuera de la pantalla`);
}

await page.screenshot({ path: "tmp/quiz-feedback-pause.png" });
await browser.close();

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: la devolución se pausa, continúa la misma y se detiene sin perder la lectura");
