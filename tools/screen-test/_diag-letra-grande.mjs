// Reproduce el desbordamiento con el tamaño de letra en Extra grande y mide la fila.
// En Normal el texto entra en una línea y no desborda: la configuración del usuario
// (letra grande o zoom) es la que hace que la fila necesite dos líneas.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 947, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Tamaño de letra: se elige el tercero (Extra grande) desde el panel. */
await page.click("#reflow-tools");
await page.waitForTimeout(1800);
const tamanos = await page.evaluate(() => {
  const botones = Array.from(document.querySelectorAll("[data-reflow-font-size]"));
  if (botones.length >= 3) {
    botones[2].click();
    return botones.map((nodo) => nodo.getAttribute("data-reflow-font-size"));
  }
  return [];
});
console.log("tamaños disponibles: " + JSON.stringify(tamanos));
await page.waitForTimeout(1500);
await page.keyboard.press("Escape");
await page.waitForTimeout(1500);

/* Ir a la actividad y responder con la tercera opción. */
await page.click("#reflow-index");
await page.waitForTimeout(1800);
await page.evaluate(() => {
  const botones = Array.from(document.querySelectorAll(".reflow-reader-panel li > button"));
  const actividad = botones.find((nodo) => /actividad/i.test(nodo.textContent || ""));
  if (actividad) actividad.click();
});
await page.waitForTimeout(2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);
await page.evaluate(() => {
  const controles = Array.from(
    document.querySelectorAll("#content input[type='radio'], #content [role='radio']")
  );
  const tercero = controles[2] || controles[controles.length - 1];
  if (tercero) tercero.click();
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (enviar && !enviar.disabled) enviar.click();
});
await page.waitForTimeout(2400);

const datos = await page.evaluate(() => {
  const filas = Array.from(document.querySelectorAll("#content .quiz-option")).map((nodo) => {
    const estilo = getComputedStyle(nodo);
    const r = nodo.getBoundingClientRect();
    return {
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24),
      altoCaja: Math.round(r.height),
      altoContenido: nodo.scrollHeight,
      seSale: nodo.scrollHeight > Math.ceil(r.height) + 2,
      height: estilo.height,
      minHeight: estilo.minHeight,
      heightEnLinea: nodo.style.getPropertyValue("height") + " " + nodo.style.getPropertyPriority("height"),
      minHeightEnLinea: nodo.style.getPropertyValue("min-height"),
    };
  });
  return { escala: getComputedStyle(document.documentElement).fontSize, filas };
});

console.log("tamaño de fuente de la raíz: " + datos.escala);
for (const fila of datos.filas) {
  console.log(
    "  " + (fila.seSale ? "SE SALE " : "ok       ") +
    " caja " + fila.altoCaja + " contenido " + fila.altoContenido +
    " height " + fila.height + " min " + fila.minHeight +
    " enLinea(h " + fila.heightEnLinea + " / min " + fila.minHeightEnLinea + ") · " + fila.texto
  );
}
await page.screenshot({ path: "tmp/quiz-letra-grande.png" });
await browser.close();
