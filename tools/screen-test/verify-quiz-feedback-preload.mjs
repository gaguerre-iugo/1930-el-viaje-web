// La devolución no debe mostrar el texto base antes del editorial.
//
// El mensaje se escribe en dos pasos: un texto base inmediato («La respuesta no
// es correcta.») y, cuando resuelve `__adtReflowQuizFeedbackFor`, el del archivo.
// Si el archivo no está precargado, en la PRIMERA respuesta el texto base queda a
// la vista mientras llega el fetch (medido: ~600 ms). El arranque ahora pide
// `quiz-feedback.json` junto con las claves de corrección.
//
// Uso:
//   node verify-quiz-feedback-preload.mjs
//   node verify-quiz-feedback-preload.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (b) => { const i = args.indexOf(b); return i >= 0 ? args[i + 1] : undefined; };
const base = argVal("--url") || "http://127.0.0.1:5501/index.html";
const target = base + (base.includes("?") ? "&" : "?") + "cb=" + Date.now();
const sid = argVal("--quiz") || "qz007";

const fallas = [];
const fallar = (m) => fallas.push(m);

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on("pageerror", (e) => fallar("error de página: " + String(e).slice(0, 160)));

/* Cuándo se pidió el archivo de devoluciones, en relación con la respuesta. */
let pedidoEnMs = null;
await page.on("request", (req) => {
  if (/quiz-feedback\.json/.test(req.url()) && pedidoEnMs === null) {
    pedidoEnMs = Date.now();
  }
});

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

if (pedidoEnMs === null) {
  fallar("quiz-feedback.json no se pidió durante la carga (no está precargado)");
} else {
  console.log("quiz-feedback.json pedido al cargar: OK");
}

/* Ir al quiz (el mensaje es visual: no hace falta TTS). */
await page.evaluate((s) => {
  const api = window.__adtReflowAudio;
  const panel = document.querySelector(`[data-section-id="${s}"] .quiz-panel`);
  const i = api.items.findIndex((it) => it.el && it.el.closest(".quiz-panel") === panel);
  if (i >= 0) api.playAtIndex(i);
}, sid);
await page.waitForTimeout(2500);
await page.evaluate(() => window.__adtReflowAudio.pause && window.__adtReflowAudio.pause());
await page.waitForTimeout(500);

/* Primera respuesta de la sesión: se observa el texto de la devolución. */
await page.evaluate((s) => {
  window.__cambios = [];
  const t0 = performance.now();
  const panel = document.querySelector(`[data-section-id="${s}"] .quiz-panel`);
  const card = panel.querySelectorAll(".quiz-card")[0];
  const ops = card.querySelectorAll(".quiz-option");
  const input = ops[ops.length - 1].querySelector('input[type="radio"]');
  const feedback = card.querySelector(".quiz-feedback");
  new MutationObserver(() => {
    const t = feedback.querySelector(".quiz-feedback-text");
    const texto = (t ? t.textContent : "").replace(/\s+/g, " ").trim();
    const previo = window.__cambios.length
      ? window.__cambios[window.__cambios.length - 1].texto : null;
    if (texto === previo) return;
    window.__cambios.push({ ms: Math.round(performance.now() - t0), texto: texto.slice(0, 70) });
  }).observe(feedback, { childList: true, characterData: true, subtree: true });
  if (input) input.click();
  const sub = card.querySelector(".quiz-submit");
  if (sub) sub.click();
  window.__respuestaEnMs = Date.now();
}, sid);
await page.waitForTimeout(2500);

const cambios = await page.evaluate(() => window.__cambios);
console.log("transiciones del mensaje:", JSON.stringify(cambios));
if (!cambios.length) fallar("no se registró ningún mensaje de devolución");

const baseMs = cambios.length ? cambios[0].ms : 0;
const editorialMs = cambios.length > 1 ? cambios[1].ms : baseMs;
const visibleMs = editorialMs - baseMs;
console.log(`texto base visible: ${visibleMs} ms`);

if (visibleMs > 150) {
  fallar(`el texto base quedó a la vista ${visibleMs} ms (debería reemplazarse casi al instante)`);
}
if (cambios.length && !/Considerá|Correcto/.test(cambios[cambios.length - 1].texto)) {
  fallar(`el mensaje final no parece el editorial: «${cambios[cambios.length - 1].texto}»`);
}

await browser.close();

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: las devoluciones están precargadas y el mensaje no muestra el texto base");
