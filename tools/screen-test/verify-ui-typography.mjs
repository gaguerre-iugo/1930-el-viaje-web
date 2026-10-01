// Verifica la jerarquía tipográfica de la interfaz (revisión UX, punto 24):
// cuatro niveles (N1 20 / N2 16 / N3 16 / N4 15), íconos de 24 px y negrita
// sólo en N1, N2 y la acción principal de la barra.
//
// Uso:
//   node verify-ui-typography.mjs
//   node verify-ui-typography.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const failures = [];
const fail = (message) => failures.push(message);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(String(error)));
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 30000 });
await page.waitForTimeout(4000);

const medir = () =>
  page.evaluate(() => {
    const nivel = (elemento) => {
      if (!elemento) return null;
      const estilo = getComputedStyle(elemento);
      return {
        px: Math.round(parseFloat(estilo.fontSize) * 10) / 10,
        peso: Number(estilo.fontWeight),
        texto: (elemento.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
      };
    };
    const icono = (elemento) => {
      const svg = elemento && elemento.querySelector("svg, img");
      if (!svg) return null;
      const caja = svg.getBoundingClientRect();
      return { ancho: Math.round(caja.width), alto: Math.round(caja.height) };
    };
    const barra = document.getElementById("reflow-pagination");
    const indice = barra.querySelector("#reflow-index");
    const principal = barra.querySelector("#reflow-next");
    const panel = document.querySelector(".reflow-accessibility-panel");
    return {
      barraSecundaria: nivel(indice.querySelector(".reflow-toolbar-label")),
      barraPrincipal: nivel(principal.querySelector(".reflow-toolbar-label")),
      contador: nivel(document.getElementById("reflow-page-status")),
      iconoBarra: icono(principal) || icono(indice),
      iconoPanel: panel ? icono(panel.querySelector(".reflow-panel-control-header")) ||
        icono(panel) : null,
    };
  });

await page.click("#reflow-tools");
await page.waitForTimeout(1500);
const panel = await page.evaluate(() => {
  const medirNodo = (elemento) => {
    if (!elemento) return null;
    const estilo = getComputedStyle(elemento);
    return {
      px: Math.round(parseFloat(estilo.fontSize) * 10) / 10,
      peso: Number(estilo.fontWeight),
      texto: (elemento.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
    };
  };
  const raiz = document.querySelector(".reflow-accessibility-panel");
  const titulo = raiz.querySelector(".reflow-panel-control-header :is(h1,h2,h3,h4)");
  const bloque = raiz.querySelector(".reflow-settings-block-title");
  const fila = raiz.querySelector(".reflow-setting-row button, .reflow-setting-row [role='radio']");
  /* Elementos en negrita dentro del panel: sólo los títulos pueden estarlo. */
  const negritas = [...raiz.querySelectorAll("*")]
    .filter((elemento) => {
      const estilo = getComputedStyle(elemento);
      if (Number(estilo.fontWeight) < 700) return false;
      if (!elemento.getClientRects().length) return false;
      if (!(elemento.textContent || "").trim()) return false;
      /* Sólo el nodo más interno que aporta el texto. */
      return ![...elemento.children].some((hijo) =>
        (hijo.textContent || "").trim() === (elemento.textContent || "").trim()
      );
    })
    .map((elemento) => ({
      clase: (elemento.className || "").toString().slice(0, 40),
      texto: (elemento.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30),
    }));
  return { titulo: medirNodo(titulo), bloque: medirNodo(bloque), fila: medirNodo(fila), negritas };
});

const barra = await medir();
console.log("=== Barra ===");
for (const [nombre, valor] of Object.entries(barra)) {
  console.log(`  ${nombre}: ${JSON.stringify(valor)}`);
}
console.log("=== Panel ===");
for (const [nombre, valor] of Object.entries(panel)) {
  if (nombre === "negritas") continue;
  console.log(`  ${nombre}: ${JSON.stringify(valor)}`);
}
console.log("=== Negritas dentro del panel ===");
for (const negrita of panel.negritas.slice(0, 12)) {
  console.log(`  ${negrita.peso ?? ""} ${negrita.clase} → «${negrita.texto}»`);
}

/* --------------------------------------------------------------- controles */
/* Escala del documento (punto 24): N1 20/700 · N2 17/700 · N3 17/400 · N4 15/400. */
const esperado = [
  ["barra secundaria (N3)", barra.barraSecundaria, 17, 400],
  ["barra principal (N3 + negrita)", barra.barraPrincipal, 17, 700],
  ["contador (N4)", barra.contador, 15, 400],
  ["título de panel (N1)", panel.titulo, 20, 700],
  ["título de bloque (N2)", panel.bloque, 17, 700],
];
for (const [nombre, valor, px, peso] of esperado) {
  if (!valor) {
    fail(`${nombre}: no se encontró el elemento`);
    continue;
  }
  if (Math.abs(valor.px - px) > 0.6) fail(`${nombre}: ${valor.px} px (se esperaban ${px})`);
  if (valor.peso !== peso) fail(`${nombre}: peso ${valor.peso} (se esperaba ${peso})`);
}

/* Las negritas del panel deben ser títulos. La excepción son los chips de tecla
   («Alt+A»), donde la negrita es parte del símbolo. */
const sospechosas = panel.negritas.filter(
  (negrita) =>
    !/title|heading|h4|h3|h2|h1/i.test(negrita.clase) &&
    !/^(Alt|Esc|Ctrl|Shift|Tab|Enter)\b/.test(negrita.texto)
);
if (sospechosas.length) {
  fail(
    `hay texto en negrita fuera de los títulos: ${sospechosas
      .slice(0, 3)
      .map((negrita) => `«${negrita.texto}»`)
      .join(", ")}`
  );
}

for (const [nombre, valor] of [["barra", barra.iconoBarra], ["panel", barra.iconoPanel]]) {
  if (!valor) {
    /* El panel de Herramientas no tiene íconos: sus controles son texto. */
    console.log(`  (el ${nombre} no tiene íconos que medir)`);
    continue;
  }
  if (valor.ancho !== 24 || valor.alto !== 24) {
    fail(`ícono de ${nombre}: ${valor.ancho}×${valor.alto} (se esperaban 24×24)`);
  }
}

await page.screenshot({ path: "tmp/tipografia-panel.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

console.log(`\nURL: ${target}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 3) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 2).join(" | ")}`);
console.log(
  failures.length
    ? `FALLAS:\n - ${failures.join("\n - ")}`
    : "OK: la jerarquía tipográfica de la interfaz se cumple"
);
await browser.close();
process.exit(failures.length ? 1 : 0);
