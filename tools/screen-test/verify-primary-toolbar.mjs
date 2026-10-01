// Verifica la barra inferior (revisión UX, punto 3 y acceso al glosario).
//
// Comprueba, en varios anchos: que Anterior y Siguiente sean la acción
// principal (más altas y más anchas que Índice y Herramientas, en color
// institucional), que su etiqueta nunca desaparezca, que el estado deshabilitado
// se distinga por opacidad y sin borde, que los íconos sean los SVG de EVA y que
// el glosario se abra desde la barra y ya no viva en el panel.
//
// Uso:
//   node verify-primary-toolbar.mjs
//   node verify-primary-toolbar.mjs --url http://127.0.0.1:5501/index.html
//
// Necesita el libro servido por HTTP (node tools/serve-local.js).
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(path.resolve(here, "..", ".."), "tmp");
const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const WIDTHS = [1920, 1366, 1024, 768, 620, 480, 400, 340];
const failures = [];
const fail = (message) => failures.push(message);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 30000 });
await page.waitForTimeout(2500);

/* ---------------------------------------------------------------- estado */
console.log("=== Estado deshabilitado en la primera página ===");
const disabled = await page.evaluate(() => {
  const style = getComputedStyle(document.getElementById("reflow-previous"));
  const rect = document.getElementById("reflow-previous").getBoundingClientRect();
  return {
    disabled: document.getElementById("reflow-previous").disabled,
    opacity: style.opacity,
    borderStyle: style.borderTopStyle,
    borderColor: style.borderTopColor,
    background: style.backgroundColor,
    height: Math.round(rect.height),
  };
});
console.log(`  Anterior: alto ${disabled.height}px · opacidad ${disabled.opacity} · borde ${disabled.borderStyle} ${disabled.borderColor}`);
if (!disabled.disabled) fail("en la primera página Anterior debería estar deshabilitado");
if (Math.abs(Number(disabled.opacity) - 0.4) > 0.02) {
  fail(`el estado deshabilitado debería estar al 40 % de opacidad y está en ${disabled.opacity}`);
}
if (disabled.borderStyle !== "none" && !/rgba?\(0, 0, 0, 0\)|transparent/.test(disabled.borderColor)) {
  fail(`el estado deshabilitado conserva borde (${disabled.borderStyle} ${disabled.borderColor})`);
}
if (disabled.height < 56) fail(`la flecha mide ${disabled.height}px de alto (mínimo 56)`);

/* --------------------------------------------------------------- anchos */
const medir = () =>
  page.evaluate(() => {
    const bar = document.getElementById("reflow-pagination");
    const ancho = (id) => {
      const element = document.getElementById(id);
      return element ? Math.round(element.getBoundingClientRect().width) : null;
    };
    const alto = (id) => {
      const element = document.getElementById(id);
      return element ? Math.round(element.getBoundingClientRect().height) : null;
    };
    const etiquetaVisible = (id) => {
      const label = document.querySelector(`#${id} .reflow-toolbar-label`);
      return Boolean(label && label.getClientRects().length);
    };
    const primary = document.getElementById("reflow-previous");
    const style = getComputedStyle(primary);
    const svg = primary.querySelector("svg");
    return {
      desborde: bar.scrollWidth - bar.clientWidth,
      columnas: getComputedStyle(bar).gridTemplateColumns.split(" ").length,
      anterior: { ancho: ancho("reflow-previous"), alto: alto("reflow-previous") },
      siguiente: { ancho: ancho("reflow-next"), alto: alto("reflow-next") },
      indice: { ancho: ancho("reflow-index"), alto: alto("reflow-index") },
      glosario: { ancho: ancho("reflow-glossary"), alto: alto("reflow-glossary") },
      herramientas: { ancho: ancho("reflow-tools"), alto: alto("reflow-tools") },
      etiquetas: {
        anterior: etiquetaVisible("reflow-previous"),
        siguiente: etiquetaVisible("reflow-next"),
      },
      fondo: style.backgroundColor,
      color: style.color,
      icono: svg ? Math.round(svg.getBoundingClientRect().width) : null,
      iconos: bar.querySelectorAll("svg.reflow-toolbar-svg").length,
      recortadas: [...bar.querySelectorAll(".reflow-toolbar-label")]
        .filter((label) => {
          const style = getComputedStyle(label);
          /* Las etiquetas que quedan sólo para lectores de pantalla se apartan
             con clip y miden 1 px: no cuentan como recorte visual. */
          if (style.position === "absolute" && label.getBoundingClientRect().width <= 2) {
            return false;
          }
          return label.getClientRects().length > 0;
        })
        .filter((label) => label.scrollWidth > label.clientWidth + 1)
        .map((label) => label.textContent.trim()),
    };
  });

console.log("\n=== Anchos ===");
for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(1400);
  const m = await medir();
  console.log(
    `  ${String(width).padStart(4)}px  desborde ${m.desborde}px · columnas ${m.columnas} · ` +
      `Anterior ${m.anterior.ancho}×${m.anterior.alto} · Índice ${m.indice.ancho} · ` +
      `Herramientas ${m.herramientas.ancho} · etiqueta ${m.etiquetas.anterior ? "sí" : "NO"} · ícono ${m.icono}px`
  );
  if (m.desborde > 1) fail(`a ${width}px la barra desborda ${m.desborde}px`);
  if (m.columnas !== 6) fail(`a ${width}px la barra tiene ${m.columnas} columnas (se esperan 6)`);
  if (m.anterior.alto < 44) fail(`a ${width}px Anterior mide ${m.anterior.alto}px de alto`);
  if (m.anterior.ancho <= m.indice.ancho) {
    fail(`a ${width}px Anterior (${m.anterior.ancho}) no es más ancho que Índice (${m.indice.ancho})`);
  }
  if (m.anterior.ancho <= m.herramientas.ancho) {
    fail(`a ${width}px Anterior (${m.anterior.ancho}) no es más ancho que Herramientas (${m.herramientas.ancho})`);
  }
  if (!m.etiquetas.anterior || !m.etiquetas.siguiente) {
    fail(`a ${width}px las flechas perdieron su etiqueta`);
  }
  if (m.iconos < 3) fail(`a ${width}px faltan íconos SVG (hay ${m.iconos})`);
  if (m.recortadas.length) {
    fail(`a ${width}px hay etiquetas recortadas: ${m.recortadas.join(", ")}`);
  }
}

const color = await medir();
console.log(`\nfondo de la acción principal: ${color.fondo} · texto ${color.color}`);
if (!/rgb\(0, 99, 93\)/.test(color.fondo)) {
  fail(`la acción principal no usa el institucional 600 (#00635D): ${color.fondo}`);
}
await page.setViewportSize({ width: 1366, height: 900 });
await page.waitForTimeout(1400);
await page.screenshot({ path: path.join(outDir, "barra-ancha.png") });
await page.setViewportSize({ width: 620, height: 900 });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(outDir, "barra-angosta.png") });
await page.setViewportSize({ width: 1366, height: 900 });
await page.waitForTimeout(1200);

/* ------------------------------------------------------------- glosario */
console.log("\n=== Glosario ===");
await page.setViewportSize({ width: 1366, height: 900 });
await page.waitForTimeout(1200);
await page.click("#reflow-glossary");
await page.waitForTimeout(1500);
const glossary = await page.evaluate(() => {
  const panel = document.querySelector(".reflow-glossary-panel");
  const button = document.getElementById("reflow-glossary");
  return {
    panelVisible: Boolean(panel && panel.getClientRects().length),
    expanded: button.getAttribute("aria-expanded"),
    filaEnElPanel: Boolean(document.getElementById("reflow-open-glossary")),
    etiqueta: (button.getAttribute("aria-label") || "").trim(),
  };
});
console.log(`  panel visible: ${glossary.panelVisible} · aria-expanded: ${glossary.expanded} · fila vieja en el panel: ${glossary.filaEnElPanel}`);
if (!glossary.panelVisible) fail("el botón Glosario de la barra no abrió el glosario");
if (glossary.expanded !== "true") fail("el botón Glosario no anuncia que el panel está abierto");
if (glossary.filaEnElPanel) fail("la fila vieja del glosario sigue en el panel de Herramientas");
if (glossary.etiqueta !== "Glosario") fail(`el botón del glosario se anuncia como "${glossary.etiqueta}"`);
await page.screenshot({ path: path.join(outDir, "barra-glosario.png") });

await page.keyboard.press("Escape");
await page.waitForTimeout(600);
const cerrado = await page.evaluate(
  () => document.getElementById("reflow-glossary").getAttribute("aria-expanded")
);
if (cerrado !== "false") fail("Escape no cerró el glosario abierto desde la barra");

await fs.mkdir(outDir, { recursive: true });
console.log(`\nURL: ${target}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 5) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 3).join(" | ")}`);
console.log(failures.length ? `FALLAS:\n - ${failures.join("\n - ")}` : "OK: la barra cumple el punto 3 y el glosario se abre desde ahí");
await browser.close();
process.exit(failures.length ? 1 : 0);
