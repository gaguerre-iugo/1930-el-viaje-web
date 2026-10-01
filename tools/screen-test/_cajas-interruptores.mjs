// Abre el panel de Herramientas, deja la captura y las cajas de cada interruptor
// para medirlas sobre los píxeles (tmp/mide_interruptores.py).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(here, "..", "..");
const url = process.argv[2] || "http://127.0.0.1:5501/index.html";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);
await page.click("#reflow-tools");
await page.waitForTimeout(2200);

const cajas = await page.evaluate(() => {
  const paneles = [...document.querySelectorAll(".reflow-reader-panel")].filter((nodo) => {
    const caja = nodo.getBoundingClientRect();
    return caja.width > 120 && caja.height > 200;
  });
  const raiz = paneles[0];
  if (!raiz) return [];
  return [...raiz.querySelectorAll("[role='switch'], input[type='checkbox']")].map((nodo, indice) => {
    const caja = nodo.getBoundingClientRect();
    const fila = nodo.closest("div, section, li");
    const etiqueta = fila ? (fila.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26) : `switch ${indice}`;
    return {
      etiqueta: etiqueta || `switch ${indice}`,
      rect: [Math.round(caja.x), Math.round(caja.y), Math.round(caja.width), Math.round(caja.height)],
      estado: nodo.getAttribute("aria-checked"),
      opacidad: getComputedStyle(nodo).opacity,
      fondo: getComputedStyle(nodo).backgroundColor,
    };
  });
});

await page.screenshot({ path: path.join(raiz, "tmp", "interruptores.png") });
await fs.writeFile(
  path.join(raiz, "tmp", "interruptores.txt"),
  cajas.map((caja) => [caja.etiqueta, ...caja.rect].join("|")).join("\n"),
  "utf8"
);
for (const caja of cajas) console.log(`  ${JSON.stringify(caja)}`);
await browser.close();
