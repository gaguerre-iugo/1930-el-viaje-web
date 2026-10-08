// Verifica los puntos 15 y 17: kicker visible, dimensión oculta, reintento
// señalizado, incorrecta que sigue marcada, «Siguiente pregunta» y cierre de la
// secuencia al responder las tres.
//
// Uso:
//   node verify-quiz-retry.mjs
//   node verify-quiz-retry.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";
const SECUENCIA = argVal("--seccion") || "qz010";

const failures = [];
const fail = (message) => failures.push(message);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-next", { timeout: 30000 });
await page.waitForTimeout(5000);

/* --------------------------------------------------------- kicker y dimensión */
const tipografia = await page.evaluate((SECUENCIA) => {
  const seccion = document.querySelector(`[data-section-id="${SECUENCIA}"]`);
  if (!seccion) return null;
  const kicker = seccion.querySelector(".quiz-kicker");
  const dimension = seccion.querySelector(".quiz-dimension");
  const estilo = (elemento) => {
    if (!elemento) return null;
    const computado = getComputedStyle(elemento);
    return {
      display: computado.display,
      visible: elemento.getClientRects().length > 0,
      texto: elemento.textContent.replace(/\s+/g, " ").trim(),
    };
  };
  return { kicker: estilo(kicker), dimension: estilo(dimension) };
}, SECUENCIA);

console.log("=== Kicker y dimensión (punto 17) ===");
console.log(`  kicker:    ${JSON.stringify(tipografia && tipografia.kicker)}`);
console.log(`  dimensión: ${JSON.stringify(tipografia && tipografia.dimension)}`);
if (!tipografia || !tipografia.kicker || !tipografia.kicker.visible) {
  fail("el kicker «Pregunta N de 3» no se ve");
}
if (tipografia && tipografia.kicker && !/Pregunta \d+ de 3/.test(tipografia.kicker.texto)) {
  fail(`el kicker no dice la pregunta: ${tipografia.kicker.texto}`);
}
if (tipografia && tipografia.dimension && tipografia.dimension.visible) {
  fail("la dimensión de lectura sigue visible");
}

/* ------------------------------------- intento incorrecto y nuevo intento */
const responder = (SECUENCIA, indicePanel, quiereCorrecta) =>
  page.evaluate(
    ({ SECUENCIA, indicePanel, quiereCorrecta }) => {
      const seccion = document.querySelector(`[data-section-id="${SECUENCIA}"]`);
      const paneles = [...seccion.querySelectorAll(".quiz-panel")];
      const panel = paneles[indicePanel];
      const opciones = [...panel.querySelectorAll(".quiz-option")];
      const esCorrecta = (opcion) =>
        Boolean(window.__adtReflowQuizOptionIsCorrect
          ? window.__adtReflowQuizOptionIsCorrect(opcion)
          : opcion.dataset.correct === "true");
      const elegida = opciones.find((opcion) => esCorrecta(opcion) === quiereCorrecta);
      const entrada = elegida.querySelector('input[type="radio"]');
      entrada.click();
      const envio = panel.querySelector("button.quiz-submit");
      envio.disabled = false;
      envio.click();
      return entrada.value;
    },
    { SECUENCIA, indicePanel, quiereCorrecta }
  );

const estadoPanel = (SECUENCIA, indicePanel) =>
  page.evaluate(
    ({ SECUENCIA, indicePanel }) => {
      const seccion = document.querySelector(`[data-section-id="${SECUENCIA}"]`);
      const panel = [...seccion.querySelectorAll(".quiz-panel")][indicePanel];
      const feedback = panel.querySelector(".quiz-feedback");
      return {
        incorrectasMarcadas: panel.querySelectorAll(".quiz-option.is-incorrect").length,
        correctasMarcadas: panel.querySelectorAll(".quiz-option.is-correct").length,
        siguientePregunta: Boolean(feedback.querySelector(".quiz-next-question")),
        cierre: Boolean(seccion.querySelector(".quiz-sequence-closing")),
        textoCierre: (seccion.querySelector(".quiz-sequence-closing") || {}).textContent || "",
        seguirLeyendo: Boolean(
          seccion.querySelector(".quiz-sequence-closing .quiz-keep-reading")
        ),
        textoFeedback: feedback.textContent.replace(/\s+/g, " ").trim().slice(0, 90),
      };
    },
    { SECUENCIA, indicePanel }
  );

console.log("\n=== Intento incorrecto (punto 15) ===");
const elegida = await responder(SECUENCIA, 0, false);
await page.waitForTimeout(1000);
let estado = await estadoPanel(SECUENCIA, 0);
console.log(`  elegí ${elegida} · incorrectas marcadas ${estado.incorrectasMarcadas} · siguiente pregunta ${estado.siguientePregunta}`);
console.log(`  devolución: «${estado.textoFeedback}»`);
if (!estado.incorrectasMarcadas) fail("la opción incorrecta no quedó marcada");
if (!estado.siguientePregunta) fail("no se ofreció «Siguiente pregunta» en la primera pregunta");

/* El lector prueba otra opción: la anterior tiene que seguir marcada. */
await page.evaluate((SECUENCIA) => {
  const seccion = document.querySelector(`[data-section-id="${SECUENCIA}"]`);
  const panel = seccion.querySelectorAll(".quiz-panel")[0];
  const otra = [...panel.querySelectorAll(".quiz-option")].find(
    (opcion) => !opcion.classList.contains("is-incorrect")
  );
  otra.querySelector('input[type="radio"]').click();
}, SECUENCIA);
await page.waitForTimeout(600);
estado = await estadoPanel(SECUENCIA, 0);
console.log(`  al elegir otra: incorrectas marcadas ${estado.incorrectasMarcadas}`);
if (!estado.incorrectasMarcadas) {
  fail("al elegir otra opción se borró la marca de la incorrecta anterior");
}

/* ------------------------------------------- responder las tres y ver el cierre */
console.log("\n=== Cierre de la secuencia (punto 17) ===");
for (let indice = 0; indice < 3; indice += 1) {
  await responder(SECUENCIA, indice, indice !== 1);
  await page.waitForTimeout(900);
}
estado = await estadoPanel(SECUENCIA, 2);
console.log(`  cierre visible: ${estado.cierre}`);
console.log(`  texto: «${estado.textoCierre.replace(/\s+/g, " ").trim().slice(0, 120)}»`);
if (!estado.cierre) fail("no apareció el cierre al responder las tres preguntas");
if (estado.cierre && !/Terminaste las 3 preguntas/.test(estado.textoCierre)) {
  fail(`el cierre no dice que terminó las tres: ${estado.textoCierre}`);
}
console.log(`  ¿ofrece «Seguir leyendo»? ${estado.seguirLeyendo}`);
if (estado.cierre && !estado.seguirLeyendo) fail("el cierre no ofrece «Seguir leyendo»");

const ultimo = await estadoPanel(SECUENCIA, 2);
console.log(`  en la última pregunta, ¿ofrece «Siguiente pregunta»? ${ultimo.siguientePregunta}`);
if (ultimo.siguientePregunta) fail("la última pregunta ofrece «Siguiente pregunta»");

console.log(`\nURL: ${target} · secuencia ${SECUENCIA}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 4) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 3).join(" | ")}`);
console.log(
  failures.length ? `FALLAS:\n - ${failures.join("\n - ")}` : "OK: los puntos 15 y 17 se cumplen"
);
await browser.close();
process.exit(failures.length ? 1 : 0);
