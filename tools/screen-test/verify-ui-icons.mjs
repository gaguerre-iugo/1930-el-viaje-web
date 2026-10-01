// Verifica que la interfaz use los íconos SVG del set de EVA (revisión UX,
// punto 19): barra, reproductor de voz y encabezados de panel, todos a 24 px y
// sin caracteres de texto en el marcado.
//
// Uso:
//   node verify-ui-icons.mjs
//   node verify-ui-icons.mjs --url http://127.0.0.1:5501/index.html
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
await page.waitForTimeout(3500);

/* --------------------------------------------------- barra y reproductor */
/* El reproductor de voz vive oculto hasta que hay sesión de lectura: para medir
   sus íconos se lo muestra (es una manipulación de la prueba). */
await page.evaluate(() => {
  const player = document.getElementById("reflow-tts-player");
  if (!player) return;
  player.hidden = false;
  player.setAttribute("aria-hidden", "false");
});
await page.waitForTimeout(250);

const controles = await page.evaluate(() => {
  const medir = (selector, etiqueta) => {
    const boton = document.querySelector(selector);
    if (!boton) return { etiqueta, falta: true };
    const svg = boton.querySelector("svg");
    const caja = svg ? svg.getBoundingClientRect() : null;
    /* El reproductor vive oculto hasta que hay sesión de lectura, así que su
       caja mide cero: para esos controles vale el tamaño calculado, que el CSS
       resuelve igual. */
    const calculado = svg ? getComputedStyle(svg) : null;
    const texto = (boton.textContent || "").replace(/\s+/g, " ").trim();
    return {
      etiqueta,
      tieneSvg: Boolean(svg),
      ancho: caja ? Math.round(caja.width) : 0,
      alto: caja ? Math.round(caja.height) : 0,
      anchoCalculado: calculado ? Math.round(parseFloat(calculado.width)) : 0,
      altoCalculado: calculado ? Math.round(parseFloat(calculado.height)) : 0,
      texto,
      glifos: (texto.match(/[☰⚙⏮▶⏭■×←❚]/gu) || []).join(""),
    };
  };
  return [
    medir("#reflow-index", "barra · Índice"),
    medir("#reflow-tools", "barra · Herramientas"),
    medir("#reflow-previous", "barra · Anterior"),
    medir("#reflow-next", "barra · Siguiente"),
    medir("#reflow-tts-previous", "voz · Anterior"),
    medir("#reflow-tts-toggle", "voz · Reproducir"),
    medir("#reflow-tts-next", "voz · Siguiente"),
    medir("#reflow-tts-settings", "voz · Voz y velocidad"),
    medir("#reflow-tts-stop", "voz · Detener"),
  ];
});

console.log("=== Barra y reproductor ===");
for (const control of controles) {
  console.log(
    `  ${control.etiqueta.padEnd(22)} ${control.falta ? "FALTA" : control.tieneSvg ? `${control.ancho || control.anchoCalculado}×${control.alto || control.altoCalculado} px` : "sin SVG"} · «${control.texto || ""}»`
  );
  if (control.falta) {
    fallar(`no está el control ${control.etiqueta}`);
    continue;
  }
  if (!control.tieneSvg) {
    fallar(`${control.etiqueta} no usa un ícono SVG`);
    continue;
  }
  const lado = control.ancho || control.anchoCalculado;
  const alto = control.alto || control.altoCalculado;
  if (lado !== 24 || alto !== 24) {
    fallar(`${control.etiqueta} mide ${lado}×${alto} y debería 24×24`);
  }
  if (control.glifos) fallar(`${control.etiqueta} todavía muestra el carácter ${control.glifos}`);
}

/* --------------------------------------- el reproductor cambia a pausa */
const cambio = await page.evaluate(() => {
  const rutas = window.__adtReflowIconPaths || {};
  const boton = document.querySelector("#reflow-tts-toggle");
  const trazado = boton && boton.querySelector("svg path");
  return {
    tienePlay: Boolean(rutas.play),
    tienePausa: Boolean(rutas.pause),
    distintas: Boolean(rutas.play) && rutas.play !== rutas.pause,
    iconoActual: trazado ? trazado.getAttribute("d").slice(0, 24) : null,
    coincideConPlay: Boolean(rutas.play && trazado && trazado.getAttribute("d") === rutas.play),
  };
});
console.log("\n=== Cambio reproducir → pausa ===");
console.log(`  ${JSON.stringify(cambio)}`);
if (!cambio.tienePlay || !cambio.tienePausa) fallar("faltan los trazados de reproducir o pausa");
if (!cambio.distintas) fallar("el trazado de pausa es igual al de reproducir");
if (!cambio.coincideConPlay) fallar("el botón arranca con un ícono distinto de reproducir");

/* ------------------------------------------------- encabezados de panel */
await page.click("#reflow-tools");
await page.waitForTimeout(1500);
const panel = await page.evaluate(() => {
  const cerrar = document.querySelector(".reflow-panel-close");
  const svg = cerrar && cerrar.querySelector("svg");
  const caja = svg ? svg.getBoundingClientRect() : null;
  return {
    tieneSvg: Boolean(svg),
    ancho: caja ? Math.round(caja.width) : 0,
    alto: caja ? Math.round(caja.height) : 0,
    texto: cerrar ? cerrar.textContent.replace(/\s+/g, " ").trim() : "",
  };
});
console.log(`\n=== Encabezado de panel ===\n  cerrar: ${JSON.stringify(panel)}`);
if (!panel.tieneSvg) fallar("el botón de cerrar del panel no usa SVG");
if (panel.tieneSvg && (panel.ancho !== 24 || panel.alto !== 24)) {
  fallar(`el ícono de cerrar mide ${panel.ancho}×${panel.alto} y debería 24×24`);
}
await page.screenshot({ path: "tmp/iconos-interfaz.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
await page.screenshot({ path: "tmp/iconos-barra.png" });

console.log(`\nURL: ${target}`);
console.log("consola:", errores.length ? errores.slice(0, 3) : "sin errores");
if (errores.length) fallar(`errores de consola: ${errores.slice(0, 2).join(" | ")}`);
console.log(
  fallas.length
    ? `FALLAS:\n - ${fallas.join("\n - ")}`
    : "OK: la interfaz usa los íconos SVG del set de EVA"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
