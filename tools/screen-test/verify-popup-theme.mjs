// Verifica el tema claro de los pop-ups del runtime (revisión UX, punto 18, cierre):
// el globo del glosario y los diálogos en capa tienen que ser claros y legibles.
//
// Ojo con el color: el runtime escribe en oklch y oklab, así que la medición los
// lee por su luminosidad (el primer número) y no parseando los números como r/g/b,
// que es el error que hacía ver un casi blanco como un rojo oscuro.
//
// Uso: node verify-popup-theme.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errores = [];
page.on("pageerror", (error) => errores.push(String(error)));
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Ir a una página con palabras del glosario. */
let terminos = await page.evaluate(() => document.querySelectorAll(".glossary-term").length);
for (let intento = 0; intento < 6 && terminos === 0; intento += 1) {
  await page.click("#reflow-next");
  await page.waitForTimeout(1800);
  terminos = await page.evaluate(() => document.querySelectorAll(".glossary-term").length);
}
if (terminos === 0) {
  console.log("no se encontraron palabras del glosario para abrir el globo");
  await browser.close();
  process.exit(1);
}

await page.click(".glossary-term");
await page.waitForTimeout(1200);

const medicion = await page.evaluate(() => {
  /* Lee rgb(), #rrggbb, oklch() y oklab() por su luminosidad. */
  const color = (valor) => {
    const texto = String(valor);
    const perceptual = texto.match(/^ok(?:lch|lab)\(\s*([\d.]+)/);
    if (perceptual) {
      const luz = Math.max(0, Math.min(1, Number(perceptual[1])));
      const gris = Math.round(luz * 255);
      const alfa = texto.match(/\/\s*([\d.]+)\s*\)/);
      return { r: gris, g: gris, b: gris, a: alfa ? Number(alfa[1]) : 1 };
    }
    if (texto.startsWith("#")) {
      const hex = texto.slice(1);
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    const n = (texto.match(/[\d.]+/g) || []).map(Number);
    return { r: n[0] || 0, g: n[1] || 0, b: n[2] || 0, a: n.length > 3 ? n[3] : 1 };
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

  const candidatos = [
    ...document.querySelectorAll(
      '[data-radix-popper-content-wrapper], [role="dialog"], [role="tooltip"]'
    ),
  ].filter((nodo) => {
    const caja = nodo.getBoundingClientRect();
    return caja.width > 80 && caja.height > 40;
  });
  const globo = candidatos[candidatos.length - 1];
  if (!globo) return { error: "no se encontró el globo abierto" };

  /* El elemento pintado: el que tiene fondo opaco. */
  const pintado = [globo, ...globo.querySelectorAll("div, section")]
    .filter((nodo) => color(getComputedStyle(nodo).backgroundColor).a > 0.4)
    .pop();
  if (!pintado) return { error: "el globo no tiene fondo propio" };

  const estilo = getComputedStyle(pintado);
  const fondo = color(estilo.backgroundColor);
  /* El texto más chico del globo: la definición, que es lo que hay que leer. */
  const textos = [...globo.querySelectorAll("p, span, dd, dt")].filter(
    (nodo) => (nodo.textContent || "").trim().length > 8
  );
  const definicion = textos.length ? textos[textos.length - 1] : null;
  const estiloDefinicion = definicion ? getComputedStyle(definicion) : null;
  return {
    globo: {
      etiqueta: `<${pintado.tagName.toLowerCase()} class="${(pintado.className || "").toString().slice(0, 50)}">`,
      fondo: estilo.backgroundColor,
      luminanciaFondo: Number(luminancia(fondo).toFixed(3)),
      color: estilo.color,
      contraste: Number(contraste(color(estilo.color), fondo).toFixed(2)),
    },
    definicion: estiloDefinicion
      ? {
          color: estiloDefinicion.color,
          contraste: Number(contraste(color(estiloDefinicion.color), fondo).toFixed(2)),
        }
      : null,
  };
});

console.log("=== Pop-ups del runtime en claro (punto 18, cierre) ===");
console.log(`  ${JSON.stringify(medicion)}`);
if (medicion.error) {
  fallar(medicion.error);
} else {
  if (medicion.globo.luminanciaFondo < 0.5) {
    fallar(`el globo no es claro (luminancia ${medicion.globo.luminanciaFondo})`);
  }
  if (medicion.globo.contraste < 4.5) {
    fallar(`el texto del globo queda en ${medicion.globo.contraste}:1`);
  }
  if (medicion.definicion && medicion.definicion.contraste < 4.5) {
    fallar(`la definición queda en ${medicion.definicion.contraste}:1`);
  }
}

await page.screenshot({ path: "tmp/globo-glosario.png" });
console.log(`\nURL: ${target}\nconsola: ${errores.length ? errores.slice(0, 2) : "sin errores"}`);
if (errores.length) fallar(`errores de consola: ${errores[0]}`);
console.log(
  fallas.length
    ? `FALLAS:\n - ${fallas.join("\n - ")}`
    : "OK: el globo del glosario es claro y legible"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
