// Verifica el tema claro de la barra y del reproductor de voz (revisión UX,
// punto 18): superficies claras, texto grey-900 y contraste ≥ 4,5:1 en todo lo
// que se lee. Los paneles del runtime se revisan aparte, en su propia etapa.
//
// Uso:
//   node verify-light-theme.mjs
//   node verify-light-theme.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
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

/* El reproductor vive oculto: se lo muestra para medir (manipulación de prueba). */
await page.evaluate(() => {
  const player = document.getElementById("reflow-tts-player");
  if (player) {
    player.hidden = false;
    player.setAttribute("aria-hidden", "false");
  }
});
await page.waitForTimeout(300);

const mediciones = await page.evaluate(() => {
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
    const claro = Math.max(a, b);
    const oscuro = Math.min(a, b);
    return (claro + 0.05) / (oscuro + 0.05);
  };
  /* Fondo efectivo: sube por los ancestros hasta encontrar uno opaco. */
  const fondoEfectivo = (elemento) => {
    let nodo = elemento;
    while (nodo && nodo !== document.documentElement) {
      const fondo = aRgb(getComputedStyle(nodo).backgroundColor);
      if (fondo.a > 0.9) return fondo;
      nodo = nodo.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const medir = (selector, etiqueta) => {
    const nodo = document.querySelector(selector);
    if (!nodo) return { etiqueta, falta: true };
    const estilo = getComputedStyle(nodo);
    const texto = aRgb(estilo.color);
    const fondo = fondoEfectivo(nodo);
    return {
      etiqueta,
      fondo: estilo.backgroundColor,
      color: estilo.color,
      luminanciaFondo: Number(luminancia(fondo).toFixed(3)),
      contraste: Number(contraste(texto, fondo).toFixed(2)),
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24),
    };
  };
  return {
    barra: medir("#reflow-pagination", "barra"),
    indice: medir("#reflow-index", "barra · Índice"),
    contador: medir("#reflow-page-status", "contador"),
    principal: medir("#reflow-next", "barra · Siguiente"),
    deshabilitado: medir("#reflow-previous", "barra · Anterior (deshabilitado en la tapa)"),
    reproductor: medir("#reflow-tts-player", "reproductor de voz"),
    botonReproductor: medir("#reflow-tts-toggle", "reproductor · Reproducir (deshabilitado sin sesión)"),
    foco: (() => {
      const boton = document.getElementById("reflow-next");
      boton.focus();
      return getComputedStyle(boton).outlineColor;
    })(),
  };
});

console.log("=== Tema claro: barra y reproductor (punto 18) ===");
/* Las superficies (contenedores) deben ser claras. Los botones de acento son la
   excepción: van rellenos de institucional-600 con texto blanco, así que lo que
   se exige ahí es el contraste, no la luminancia del fondo. */
const superficies = new Set(["barra", "reproductor de voz", "barra · Índice", "contador", "reproductor · Reproducir"]);
for (const [clave, valor] of Object.entries(mediciones)) {
  if (clave === "foco") {
    console.log(`  foco: ${valor}`);
    continue;
  }
  console.log(
    `  ${valor.etiqueta.padEnd(44)} fondo ${valor.fondo.padEnd(22)} texto ${valor.color.padEnd(22)} contraste ${valor.contraste}`
  );
  if (valor.falta) {
    fallar(`no se encontró ${valor.etiqueta}`);
    continue;
  }
  const esSuperficie = superficies.has(valor.etiqueta);
  if (esSuperficie && valor.luminanciaFondo < 0.5) {
    fallar(`${valor.etiqueta}: el fondo no es claro (luminancia ${valor.luminanciaFondo})`);
  }
  /* WCAG 1.4.3 exime a los controles inactivos del mínimo de contraste; se
     miden y se informan igual. */
  const inactivo = /deshabilitado|disabled/i.test(valor.etiqueta);
  if (!inactivo && valor.contraste < 4.5) {
    fallar(`${valor.etiqueta}: contraste ${valor.contraste} por debajo de 4,5:1`);
  }
}

/* El foco sobre superficie clara usa el institucional 600. */
if (!/rgb\(0, 99, 93\)/.test(mediciones.foco)) {
  fallar(`el anillo de foco no es el institucional 600 (${mediciones.foco})`);
}

await page.screenshot({ path: "tmp/tema-claro-barra.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

console.log(`\nURL: ${target}`);
console.log("consola:", errores.length ? errores.slice(0, 3) : "sin errores");
if (errores.length) fallar(`errores de consola: ${errores.slice(0, 2).join(" | ")}`);
console.log(
  fallas.length
    ? `FALLAS:\n - ${fallas.join("\n - ")}`
    : "OK: la barra y el reproductor están en claro y con contraste suficiente"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
