// Lista los elementos del panel de Herramientas cuyo texto no se lee sobre su
// fondo real (contraste < 4,5). Sirve para saber qué falta tematizar.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);
await page.click("#reflow-tools");
await page.waitForTimeout(2000);

const datos = await page.evaluate(() => {
  const aRgb = (valor) => {
    const numeros = (valor.match(/[\d.]+/g) || []).map(Number);
    return { r: numeros[0] || 0, g: numeros[1] || 0, b: numeros[2] || 0, a: numeros.length > 3 ? numeros[3] : 1 };
  };
  const luminancia = ({ r, g, b }) => {
    const canal = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  };
  const contraste = (uno, otro) => {
    const a = luminancia(uno);
    const b = luminancia(otro);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const fondos = (elemento) => {
    const pila = [];
    let nodo = elemento;
    while (nodo && nodo !== document.documentElement) {
      const fondo = aRgb(getComputedStyle(nodo).backgroundColor);
      if (fondo.a > 0.4) pila.push(fondo);
      nodo = nodo.parentElement;
    }
    if (!pila.length) pila.push({ r: 255, g: 255, b: 255, a: 1 });
    return pila[pila.length - 1];
  };
  const paneles = [...document.querySelectorAll(".reflow-reader-panel")].filter((nodo) => {
    const caja = nodo.getBoundingClientRect();
    return caja.width > 120 && caja.height > 200;
  });
  const raiz = paneles[0];
  if (!raiz) return { error: "sin panel visible" };
  const problemas = [];
  const vistos = new Set();
  for (const elemento of raiz.querySelectorAll("*")) {
    const caja = elemento.getBoundingClientRect();
    if (caja.width < 2 || caja.height < 2) continue;
    /* Sólo elementos con texto propio o con placeholder. */
    const textoPropio = [...elemento.childNodes]
      .filter((nodo) => nodo.nodeType === 3)
      .map((nodo) => nodo.textContent.trim())
      .join(" ")
      .trim();
    const placeholder = elemento.getAttribute && elemento.getAttribute("placeholder");
    const etiqueta = textoPropio || placeholder;
    if (!etiqueta) continue;
    const estilo = getComputedStyle(elemento);
    const color = aRgb(estilo.color);
    const fondo = fondos(elemento);
    const ratio = contraste(color, fondo);
    if (ratio >= 4.5) continue;
    const clave = `${estilo.color}|${estilo.backgroundColor}|${etiqueta.slice(0, 20)}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    problemas.push({
      etiqueta: `<${elemento.tagName.toLowerCase()} class="${(elemento.className || "").toString().slice(0, 54)}">`,
      texto: etiqueta.slice(0, 26),
      color: estilo.color,
      fondoPropio: estilo.backgroundColor,
      fondoReal: `rgb(${fondo.r}, ${fondo.g}, ${fondo.b})`,
      ratio: Number(ratio.toFixed(2)),
      tamano: estilo.fontSize,
      peso: estilo.fontWeight,
    });
  }
  return { total: raiz.querySelectorAll("*").length, problemas };
});

console.log(`elementos en el panel: ${datos.total}`);
console.log(`con contraste insuficiente: ${datos.problemas.length}\n`);
for (const problema of datos.problemas) {
  console.log(
    `  ${problema.ratio.toString().padStart(5)}:1  ${problema.color.padEnd(22)} sobre ${problema.fondoReal.padEnd(20)} «${problema.texto}» ${problema.tamano}/${problema.peso}`
  );
  console.log(`            ${problema.etiqueta}`);
}
await browser.close();
