// Inspecciona el globo del glosario: qué elemento es, de quién es y qué colores
// tiene hoy. El requerimiento (punto 18) pide pop-up claro con los tokens de EVA.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Avanzar hasta una página con palabras del glosario. */
let terminos = 0;
for (let intento = 0; intento < 6 && terminos === 0; intento += 1) {
  terminos = await page.evaluate(() => document.querySelectorAll(".glossary-term").length);
  if (terminos === 0) {
    await page.click("#reflow-next");
    await page.waitForTimeout(1800);
  }
}
console.log(`palabras del glosario en la página: ${terminos}`);
if (terminos === 0) {
  console.log("no se encontraron términos; no se puede inspeccionar el globo");
  await browser.close();
  process.exit(0);
}

await page.click(".glossary-term");
await page.waitForTimeout(1200);

const datos = await page.evaluate(() => {
  const aRgb = (valor) => {
    const n = (String(valor).match(/[\d.]+/g) || []).map(Number);
    return { r: n[0] || 0, g: n[1] || 0, b: n[2] || 0, a: n.length > 3 ? n[3] : 1 };
  };
  const luminancia = ({ r, g, b }) => {
    const canal = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  };
  /* Candidatos a globo: aparecen al hacer clic y flotan. */
  const candidatos = [
    ...document.querySelectorAll(
      '[data-radix-popper-content-wrapper], [role="dialog"], [role="tooltip"], [data-state="open"], .reflow-glossary-popup, .reflow-glossary-bubble'
    ),
  ].filter((nodo) => {
    const caja = nodo.getBoundingClientRect();
    return caja.width > 80 && caja.height > 40;
  });
  const globo = candidatos[candidatos.length - 1];
  if (!globo) return { error: "no se encontró el globo" };
  /* El panel interno suele ser el hijo con fondo propio. */
  const conFondo = [globo, ...globo.querySelectorAll("*")].filter((nodo) => {
    const fondo = aRgb(getComputedStyle(nodo).backgroundColor);
    return fondo.a > 0.4;
  });
  const caja = globo.getBoundingClientRect();
  const describir = (nodo) => {
    const estilo = getComputedStyle(nodo);
    const fondo = aRgb(estilo.backgroundColor);
    const texto = aRgb(estilo.color);
    const a = luminancia(fondo);
    const b = luminancia(texto);
    return {
      etiqueta: `<${nodo.tagName.toLowerCase()} class="${(nodo.className || "").toString().slice(0, 60)}">`,
      fondo: estilo.backgroundColor,
      texto: estilo.color,
      contraste: Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2)),
      borde: estilo.borderColor,
      radio: estilo.borderRadius,
    };
  };
  return {
    caja: { ancho: Math.round(caja.width), alto: Math.round(caja.height) },
    globo: describir(globo),
    conFondo: conFondo.slice(0, 3).map(describir),
    /* Un texto del globo, para ver de qué color sale la definición. */
    textos: [...globo.querySelectorAll("p, span, h1, h2, h3, dd, dt")]
      .filter((nodo) => (nodo.textContent || "").trim().length > 3)
      .slice(0, 3)
      .map(describir),
  };
});

console.log(JSON.stringify(datos, null, 1).slice(0, 2200));
await page.screenshot({ path: "tmp/globo-glosario-inspeccion.png" });
await browser.close();
