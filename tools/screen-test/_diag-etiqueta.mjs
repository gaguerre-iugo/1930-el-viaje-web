// Diagnóstico de una etiqueta lavada del panel de Herramientas: color y opacidad
// de la etiqueta y de cada ancestro, más la caja para medir el píxel real.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(here, "..", "..");
const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const objetivo = process.argv[3] || "Lectura fácil";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);
await page.click("#reflow-tools");
await page.waitForTimeout(2200);

const datos = await page.evaluate((objetivo) => {
  const paneles = [...document.querySelectorAll(".reflow-reader-panel")].filter((nodo) => {
    const caja = nodo.getBoundingClientRect();
    return caja.width > 120 && caja.height > 200;
  });
  const raiz = paneles[0];
  if (!raiz) return { error: "sin panel visible" };
  /* El elemento más chico cuyo texto contiene el objetivo. */
  const candidatos = [...raiz.querySelectorAll("*")].filter(
    (nodo) => (nodo.textContent || "").includes(objetivo) && nodo.getBoundingClientRect().width > 4
  );
  const etiqueta = candidatos[candidatos.length - 1];
  if (!etiqueta) return { error: `no se encontró «${objetivo}»` };

  const propios = [...etiqueta.childNodes]
    .filter((nodo) => nodo.nodeType === 3)
    .map((nodo) => nodo.textContent.trim())
    .join("");
  const cadena = [];
  let nodo = etiqueta;
  while (nodo && nodo !== document.body) {
    const estilo = getComputedStyle(nodo);
    cadena.push({
      etiqueta: `<${nodo.tagName.toLowerCase()} class="${(nodo.className || "").toString().slice(0, 40)}">`,
      color: estilo.color,
      opacidad: estilo.opacity,
      filtro: estilo.filter,
      fondo: estilo.backgroundColor,
      mezcla: estilo.mixBlendMode,
    });
    nodo = nodo.parentElement;
  }
  const caja = etiqueta.getBoundingClientRect();
  return {
    texto: (etiqueta.textContent || "").trim().slice(0, 30),
    etiqueta: `<${etiqueta.tagName.toLowerCase()} class="${(etiqueta.className || "").toString().slice(0, 50)}">`,
    tieneTextoPropio: Boolean(propios.trim()),
    dentroDelPanel: Boolean(etiqueta.closest(".reflow-reader-panel")),
    enLinea: etiqueta.getAttribute("style"),
    rect: [Math.round(caja.x), Math.round(caja.y), Math.round(caja.width), Math.round(caja.height)],
    cadena,
  };
}, objetivo);

console.log(JSON.stringify(datos, null, 1).slice(0, 3000));
if (datos.rect) {
  await page.screenshot({ path: path.join(raiz, "tmp", "etiqueta.png") });
  await fs.writeFile(
    path.join(raiz, "tmp", "etiqueta.txt"),
    datos.rect.join("|"),
    "utf8"
  );
}
await browser.close();
