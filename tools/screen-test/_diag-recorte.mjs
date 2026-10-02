// Identifica el visor del paginado comparando transforms antes y después de pasar
// de página, le aplica el recorte y deja la captura para ver si el sangrado para.
//
// El visor es, por definición, la caja de la página visible: recortarlo no puede
// esconder contenido legítimo, solo lo que pertenece a las páginas vecinas.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

await page.click("#reflow-index");
await page.waitForTimeout(1800);
await page.evaluate(() => {
  const botones = Array.from(document.querySelectorAll(".reflow-reader-panel li > button"));
  const actividad = botones.find((nodo) => /actividad/i.test(nodo.textContent || ""));
  if (actividad) actividad.click();
});
await page.waitForTimeout(2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(1500);

/* Huella de cada elemento: transform + posición. */
const huella = () =>
  page.evaluate(() => {
    const lista = [];
    const todos = Array.from(document.querySelectorAll("body *"));
    todos.forEach((nodo, indice) => {
      const estilo = getComputedStyle(nodo);
      if (estilo.transform === "none" && estilo.position !== "fixed") return;
      const caja = nodo.getBoundingClientRect();
      lista.push({
        indice,
        etiqueta:
          "<" + nodo.tagName.toLowerCase() + " " + (nodo.className || "").toString().slice(0, 40) + ">",
        transform: estilo.transform,
        x: Math.round(caja.x),
        ancho: Math.round(caja.width),
      });
    });
    return lista;
  });

const antes = await huella();
await page.click("#reflow-next");
await page.waitForTimeout(2200);
const despues = await huella();

/* El que se movió: mismo índice, distinto transform o x. */
const movidos = [];
for (const uno of antes) {
  const otro = despues.find((dos) => dos.indice === uno.indice);
  if (!otro) continue;
  if (otro.transform !== uno.transform || Math.abs(otro.x - uno.x) > 4) {
    movidos.push({ etiqueta: uno.etiqueta, de: uno.transform + " x" + uno.x, a: otro.transform + " x" + otro.x });
  }
}
console.log("=== elementos que se movieron al pasar de página ===");
console.log(JSON.stringify(movidos.slice(0, 6), null, 1).slice(0, 1200));

/* Volver a la actividad y recortar el visor que se mueve. */
await page.click("#reflow-index");
await page.waitForTimeout(1600);
await page.evaluate(() => {
  const botones = Array.from(document.querySelectorAll(".reflow-reader-panel li > button"));
  const actividad = botones.find((nodo) => /actividad/i.test(nodo.textContent || ""));
  if (actividad) actividad.click();
});
await page.waitForTimeout(2400);
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);

/* Responder para reproducir el estado que sangra. */
await page.evaluate(() => {
  const control = document.querySelector("#content input[type='radio'], #content [role='radio']");
  if (control) control.click();
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (enviar && !enviar.disabled) enviar.click();
});
await page.waitForTimeout(2200);

const resultado = await page.evaluate(() => {
  /* Se recortan los elementos posicionados que envuelven la tarjeta del quiz. */
  const tarjeta = document.querySelector("#content .quiz-panel, #content .quiz-card");
  const aplicados = [];
  let nodo = tarjeta ? tarjeta.parentElement : null;
  let nivel = 0;
  while (nodo && nodo !== document.body && nivel < 6) {
    const estilo = getComputedStyle(nodo);
    const caja = nodo.getBoundingClientRect();
    if (caja.width > 400 && estilo.overflowX === "visible") {
      nodo.style.setProperty("overflow", "clip", "important");
      aplicados.push(
        "<" + nodo.tagName.toLowerCase() + " " + (nodo.className || "").toString().slice(0, 40) + "> " + Math.round(caja.width) + "x" + Math.round(caja.height)
      );
    }
    nodo = nodo.parentElement;
    nivel += 1;
  }
  return aplicados;
});
console.log("=== contenedores recortados ===");
console.log(JSON.stringify(resultado, null, 1));
await page.waitForTimeout(600);
await page.screenshot({ path: "tmp/quiz-recorte.png" });
await browser.close();
