// Verifica que las respuestas de las actividades ya no viajen en el HTML
// (revisión UX, punto 5) y que la corrección siga funcionando igual.
//
// Comprueba, contra el libro servido:
//   1. que el HTML de las actividades no tenga `data-correct` ni
//      `data-correct-answers`;
//   2. que el archivo de respuestas esté disponible y tenga todas las
//      actividades;
//   3. que lo que el motor marca en el DOM sea exactamente lo que dice el
//      archivo;
//   4. que elegir la opción correcta dé «correcto» y una incorrecta dé
//      «incorrecto» (si el motor marcara todo como correcto, el punto 3 solo no
//      lo detectaría).
//
// Uso:
//   node verify-quiz-answers.mjs
//   node verify-quiz-answers.mjs --url http://127.0.0.1:5501/index.html
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
const base = target.replace(/\/[^/]*$/, "");
const archivoRespuestas = path.join(raiz, "content", "i18n", "es-UY", "quiz-answers.json");

const failures = [];
const fail = (message) => failures.push(message);

/* ---------------------------------------------------- 1. el HTML está limpio */
const actividades = (await fs.readdir(raiz)).filter((nombre) => /^(qz\d+|quiz_final)\.html$/.test(nombre));
let atributosEnElHtml = 0;
const conAtributos = [];
for (const nombre of actividades) {
  const texto = await fs.readFile(path.join(raiz, nombre), "utf8");
  const encontrados =
    (texto.match(/data-correct="/g) || []).length +
    (texto.match(/data-correct-answers=/g) || []).length;
  if (encontrados) {
    atributosEnElHtml += encontrados;
    conAtributos.push(`${nombre} (${encontrados})`);
  }
}
console.log("=== Respuestas fuera del HTML ===");
console.log(`  archivos de actividad revisados: ${actividades.length} · atributos de respuesta: ${atributosEnElHtml}`);
if (atributosEnElHtml) {
  fail(`quedan respuestas en el HTML: ${conAtributos.join(", ")}`);
}

/* ------------------------------------------- 2. el archivo de respuestas */
const respuestas = JSON.parse(await fs.readFile(archivoRespuestas, "utf8"));
const totalOpciones = Object.values(respuestas).reduce((suma, mapa) => suma + Object.keys(mapa).length, 0);
console.log(`\n=== Archivo de respuestas ===\n  actividades: ${Object.keys(respuestas).length} · opciones: ${totalOpciones}`);

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

/* ------------------------- 3. el DOM dice exactamente lo que dice el archivo */
const equivalencia = await page.evaluate((respuestas) => {
  const secciones = [
    ...document.querySelectorAll(
      '[data-section-type="activity_quiz"], [data-section-type="quiz_sequence"]'
    ),
  ];
  const discrepancias = [];
  const montadas = [];
  let comparadas = 0;
  for (const seccion of secciones) {
    const id = seccion.dataset.id || seccion.dataset.sectionId;
    montadas.push(id);
    const mapa = respuestas[id];
    if (!mapa) {
      discrepancias.push(`${id}: no está en el archivo de respuestas`);
      continue;
    }
    for (const opcion of seccion.querySelectorAll(".quiz-option, .activity-option")) {
      const entrada = opcion.querySelector('input[type="radio"], input[type="checkbox"]');
      const clave =
        opcion.dataset.activityItem ||
        (entrada && entrada.value) ||
        (opcion.dataset.explanationId || "").replace(/_exp$/, "");
      if (!clave || !(clave in mapa)) continue;
      comparadas += 1;
      const enDom = opcion.dataset.correct === "true";
      if (enDom !== Boolean(mapa[clave])) {
        discrepancias.push(`${clave}: el DOM dice ${enDom} y el archivo ${Boolean(mapa[clave])}`);
      }
    }
  }
  return { comparadas, discrepancias, secciones: secciones.length, montadas };
}, respuestas);
console.log(
  `\n=== El motor contra el archivo ===\n  actividades montadas: ${equivalencia.secciones} · opciones comparadas: ${equivalencia.comparadas}`
);
if (equivalencia.discrepancias.length) {
  fail(`discrepancias: ${equivalencia.discrepancias.slice(0, 4).join(" | ")}`);
}

/* --------------------------------------------- 4. corregir bien y corregir mal */
const corregir = (idSeccion, quiereCorrecta) =>
  page.evaluate(
    ({ idSeccion, quiereCorrecta }) => {
      const seccion = document.querySelector(`[data-section-id="${idSeccion}"]`);
      if (!seccion) return { error: "sin sección" };
      const opciones = [...seccion.querySelectorAll(".quiz-option")];
      const elegida = opciones.find(
        (opcion) => (opcion.dataset.correct === "true") === quiereCorrecta
      );
      if (!elegida) return { error: "sin opción para probar" };
      const entrada = elegida.querySelector('input[type="radio"]');
      entrada.click();
      const envio = seccion.querySelector("button.quiz-submit, .quiz-actions button");
      if (envio) {
        envio.disabled = false;
        envio.click();
      }
      return { clave: entrada.value, esperaCorrecta: quiereCorrecta };
    },
    { idSeccion, quiereCorrecta }
  );

const leerVeredicto = (idSeccion) =>
  page.evaluate((idSeccion) => {
    const seccion = document.querySelector(`[data-section-id="${idSeccion}"]`);
    const opciones = seccion ? [...seccion.querySelectorAll(".quiz-option")] : [];
    return {
      correcta: opciones.some((opcion) => opcion.classList.contains("is-correct")),
      incorrecta: opciones.some((opcion) => opcion.classList.contains("is-incorrect")),
    };
  }, idSeccion);

console.log("\n=== Corrección ===");
/* Sólo las actividades que el libro monta: los seis archivos sueltos qz001–qz006
   no están en el orden de lectura y no se pueden responder desde el libro. */
const secuencias = equivalencia.montadas;
let probadas = 0;
for (const id of secuencias.slice(0, 4)) {
  await corregir(id, true);
  await page.waitForTimeout(900);
  const veredicto = await leerVeredicto(id);
  probadas += 1;
  console.log(`  ${id.padEnd(11)} respuesta correcta → ${veredicto.correcta ? "correcto" : "NO marcó correcto"}`);
  if (!veredicto.correcta) fail(`${id}: la opción correcta no se marcó como correcta`);
}

/* Una incorrecta en la primera secuencia del libro: si el motor marcara todo
   como correcto, esta prueba lo delata. */
const primera = secuencias[0];
await page.reload({ waitUntil: "load" });
await page.waitForSelector("#reflow-next", { timeout: 30000 });
await page.waitForTimeout(4500);
await corregir(primera, false);
await page.waitForTimeout(900);
const veredictoIncorrecto = await leerVeredicto(primera);
console.log(
  `  ${primera.padEnd(11)} respuesta incorrecta → ${veredictoIncorrecto.incorrecta ? "incorrecto" : "NO marcó incorrecto"}`
);
if (!veredictoIncorrecto.incorrecta) {
  fail(`${primera}: una respuesta incorrecta no se marcó como incorrecta`);
}

console.log(`\nURL: ${target} · actividades probadas: ${probadas}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 4) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 3).join(" | ")}`);
console.log(
  failures.length ? `FALLAS:\n - ${failures.join("\n - ")}` : "OK: las respuestas ya no viajan en el HTML y la corrección funciona"
);
await browser.close();
process.exit(failures.length ? 1 : 0);
