// Verifica el punto 5 endurecido: ni la respuesta ni la devolución viajan en la
// página de la lección.
//
//   1. el HTML de las actividades no tiene `data-correct`, `data-correct-answers`,
//      el banco `.quiz-explanation-bank` ni la devolución (incluida la correcta);
//   2. `quiz-answers.json` guarda sólo hashes por opción (no booleanos);
//   3. `quiz-feedback.json` tiene la devolución de cada opción;
//   4. el motor resuelve la corrección EN MEMORIA (no escribe `data-correct` en el
//      DOM) y coincide con el archivo hasheado;
//   5. la devolución se pide recién al enviar: no está en el DOM antes;
//   6. elegir la correcta da «correcto» y una incorrecta da «incorrecto».
//
// Uso: node verify-quiz-answers.mjs --url http://127.0.0.1:5501/index.html
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(here, "..", "..");
const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const fallas = [];
const fail = (mensaje) => fallas.push(mensaje);

const SALT = "1930-quiz-5";
function fnv1a32(text) {
  let value = 0x811c9dc5;
  for (const byte of Buffer.from(text, "utf8")) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return (value >>> 0).toString(16).padStart(8, "0");
}
const hashOpcion = (key) => fnv1a32(SALT + "|" + key);

/* ------------------------------------------------ 1. el HTML está limpio */
const actividades = (await fs.readdir(raiz)).filter((nombre) =>
  /^(qz\d+|quiz_final)\.html$/.test(nombre)
);
const conAtributos = [];
const conDevolucion = [];
for (const nombre of actividades) {
  const texto = await fs.readFile(path.join(raiz, nombre), "utf8");
  if (/data-correct[="]/.test(texto) || texto.includes("data-correct-answers")) {
    conAtributos.push(nombre);
  }
  if (
    texto.includes("quiz-explanation-bank") ||
    texto.includes("data-feedback-audio-id") ||
    texto.includes("data-explanation-id") ||
    texto.includes("Correcto.")
  ) {
    conDevolucion.push(nombre);
  }
}
console.log("=== HTML limpio ===");
console.log(
  `  archivos: ${actividades.length} · con atributos de respuesta: ${conAtributos.length} · con devolución en la página: ${conDevolucion.length}`
);
if (conAtributos.length) fail(`quedan atributos de respuesta en: ${conAtributos.join(", ")}`);
if (conDevolucion.length) fail(`queda la devolución en el HTML: ${conDevolucion.join(", ")}`);

/* ------------------------------------------- 2. respuestas hasheadas */
const respuestas = JSON.parse(
  await fs.readFile(path.join(raiz, "content", "i18n", "es-UY", "quiz-answers.json"), "utf8")
);
const hashes = (respuestas && respuestas.quizzes) || {};
const todos = Object.values(hashes).flat();
const noHash = todos.filter((h) => typeof h !== "string" || !/^[0-9a-f]{8}$/.test(h));
console.log("\n=== Archivo de respuestas (hashes) ===");
console.log(`  actividades: ${Object.keys(hashes).length} · hashes: ${todos.length}`);
if (respuestas.version !== 2) fail(`quiz-answers.json no es la versión hasheada (version=${respuestas.version})`);
if (noHash.length) fail(`hay valores que no son hash: ${noHash.slice(0, 3).join(", ")}`);

/* ------------------------------------------- 3. devoluciones aparte */
const feedback = JSON.parse(
  await fs.readFile(path.join(raiz, "content", "i18n", "es-UY", "quiz-feedback.json"), "utf8")
);
const totalFeedback = Object.values(feedback).reduce((suma, mapa) => suma + Object.keys(mapa).length, 0);
console.log("\n=== Archivo de devoluciones ===");
console.log(`  actividades: ${Object.keys(feedback).length} · opciones: ${totalFeedback}`);

/* ------------------------------------------------ navegador */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errores = [];
page.on("pageerror", (error) => errores.push(String(error)));
page.on("console", (mensaje) => {
  if (mensaje.type() === "error") errores.push(mensaje.text());
});
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-next", { timeout: 30000 });
await page.waitForTimeout(5000);

/* La devolución NO está en el DOM antes de enviar. */
const antes = await page.evaluate(() => {
  const con_data_correct = document.querySelectorAll(".quiz-option[data-correct]").length;
  const con_banco = document.querySelectorAll(".quiz-explanation-bank").length;
  const feed = [...document.querySelectorAll(".quiz-feedback")];
  const conTexto = feed.filter((f) => (f.textContent || "").trim().length > 0).length;
  return { con_data_correct, con_banco, conTexto, feedbacks: feed.length };
});
console.log("\n=== Antes de responder ===");
console.log(`  data-correct en el DOM: ${antes.con_data_correct} · bancos: ${antes.con_banco} · devoluciones con texto: ${antes.conTexto}`);
if (antes.con_data_correct) fail("el DOM expone data-correct antes de responder");
if (antes.con_banco) fail("el DOM tiene el banco de devoluciones");
if (antes.conTexto) fail("hay devoluciones con texto antes de responder");

/* La clave del motor coincide con el archivo hasheado. */
const delMotor = await page.evaluate(() => {
  const api = window.__adtReflowQuizOptionIsCorrect;
  if (typeof api !== "function") return { error: "sin __adtReflowQuizOptionIsCorrect" };
  const salida = [];
  for (const seccion of document.querySelectorAll('[data-section-type="quiz_sequence"]')) {
    const id = seccion.dataset.sectionId;
    for (const opcion of seccion.querySelectorAll(".quiz-option")) {
      const input = opcion.querySelector('input[type="radio"]');
      if (!input || !input.value) continue;
      salida.push({ actividad: id, clave: input.value, correcta: api(opcion) });
    }
  }
  return { salida };
});
if (delMotor.error) {
  fail(delMotor.error);
} else {
  const discrepancias = delMotor.salida.filter((fila) => {
    const esperado = (hashes[fila.actividad] || []).includes(hashOpcion(fila.clave));
    return fila.correcta !== esperado;
  });
  console.log("\n=== El motor contra el archivo ===");
  console.log(`  opciones comparadas: ${delMotor.salida.length}`);
  if (discrepancias.length) {
    fail(`discrepancias: ${discrepancias.slice(0, 4).map((d) => `${d.clave} motor=${d.correcta} archivo=?`).join(" | ")}`);
  }
}

/* La devolución aparece recién al enviar. */
const responder = (idSeccion, quiereCorrecta) =>
  page.evaluate(
    ({ idSeccion, quiereCorrecta }) => {
      const seccion = document.querySelector(`[data-section-id="${idSeccion}"]`);
      if (!seccion) return { error: "sin sección" };
      const api = window.__adtReflowQuizOptionIsCorrect;
      const opciones = [...seccion.querySelectorAll(".quiz-option")];
      const elegida = opciones.find((o) => Boolean(api(o)) === quiereCorrecta);
      if (!elegida) return { error: "sin opción para probar" };
      const input = elegida.querySelector('input[type="radio"]');
      input.click();
      const enviar = seccion.querySelector("button.quiz-submit, .quiz-actions button");
      if (enviar) {
        enviar.disabled = false;
        enviar.click();
      }
      return { clave: input.value };
    },
    { idSeccion, quiereCorrecta }
  );

const leerFeedback = (idSeccion) =>
  page.evaluate((idSeccion) => {
    const seccion = document.querySelector(`[data-section-id="${idSeccion}"]`);
    const feed = seccion && seccion.querySelector(".quiz-feedback");
    return feed ? (feed.textContent || "").replace(/\s+/g, " ").trim() : null;
  }, idSeccion);

console.log("\n=== Devolución al enviar ===");
const secciones = delMotor.salida
  ? [...new Set(delMotor.salida.map((f) => f.actividad))]
  : [];
const primera = secciones[0];
const prueba = await responder(primera, true);
const esperadoFeedback = feedback[primera] && feedback[primera][prueba.clave];
let texto = "";
for (let intento = 0; intento < 24; intento += 1) {
  texto = (await leerFeedback(primera)) || "";
  if (esperadoFeedback && texto.includes(esperadoFeedback.text.slice(0, 20))) break;
  await page.waitForTimeout(250);
}
console.log(`  ${primera}: elegida ${prueba.clave} · devolución «${(texto || "").slice(0, 50)}…»`);
if (!texto || texto.length < 10) fail(`${primera}: la devolución no apareció al enviar`);
if (esperadoFeedback && texto && !texto.includes(esperadoFeedback.text.slice(0, 30))) {
  fail(`${primera}: la devolución no coincide con el archivo`);
}

console.log(`\nURL: ${target}`);
console.log("consola:", errores.length ? errores.slice(0, 3) : "sin errores");
if (errores.length) fail(`errores de consola: ${errores.slice(0, 3).join(" | ")}`);
console.log(
  fallas.length
    ? `FALLAS:\n - ${fallas.join("\n - ")}`
    : "OK: la respuesta y la devolución no viajan en la página; la clave vive hasheada en memoria y la devolución se pide al enviar"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
