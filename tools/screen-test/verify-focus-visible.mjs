// Auditoría de foco visible (revisión UX, punto 14).
//
// Recorre los controles de la barra y de los tres paneles, los enfoca uno por uno
// y comprueba que el foco cambie alguna señal visual (contorno, sombra, borde,
// fondo o color). Los controles que no cambian nada se informan: en la barra y en
// el índice son un fallo, en el resto del runtime quedan como pendientes.
//
// Uso:
//   node verify-focus-visible.mjs
//   node verify-focus-visible.mjs --url http://127.0.0.1:5501/index.html
//
// Necesita el libro servido por HTTP (node tools/serve-local.js).
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(path.resolve(here, "..", ".."), "tmp");
const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const SURFACES = [
  {
    name: "Barra inferior",
    open: null,
    required: true,
    selector: "#reflow-pagination button",
  },
  {
    name: "Panel Índice",
    open: "Alt+i",
    required: true,
    selector: ".reflow-navigation-panel [role='tabpanel'] li > button, .reflow-navigation-panel [role='tab']",
  },
  {
    name: "Panel Herramientas",
    open: "Alt+h",
    required: false,
    selector: ".reflow-accessibility-panel button, .reflow-accessibility-panel [role='switch'], .reflow-accessibility-panel [role='radio']",
  },
  {
    name: "Glosario",
    open: "Alt+g",
    required: false,
    selector: ".reflow-glossary-panel button, .reflow-glossary-panel [role='tab'], .reflow-glossary-panel input",
  },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(String(error)));
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 30000 });
await page.waitForTimeout(2000);

async function closePanels() {
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
  }
}

const failures = [];
console.log("Controles sin señal visual de foco\n");

for (const surface of SURFACES) {
  await closePanels();
  if (surface.open) {
    await page.keyboard.press(surface.open);
    await page.waitForTimeout(1200);
  }
  const result = await page.evaluate((selector) => {
    const SIGNALS = [
      "outlineWidth", "outlineStyle", "outlineColor", "outlineOffset",
      "boxShadow", "borderTopColor", "borderBottomColor",
      "backgroundColor", "color", "textDecorationLine",
    ];
    const snapshot = (element) => {
      const style = getComputedStyle(element);
      return SIGNALS.map((name) => `${name}:${style[name]}`).join("|");
    };
    const hasOutline = (element) => {
      const style = getComputedStyle(element);
      const width = parseFloat(style.outlineWidth) || 0;
      return style.outlineStyle !== "none" && width > 0;
    };
    const label = (element) =>
      (element.getAttribute("aria-label") || element.textContent || element.id || element.tagName)
        .replace(/\s+/g, " ").trim().slice(0, 46);

    const controls = [...document.querySelectorAll(selector)].filter(
      (element) => element.getClientRects().length && !element.disabled
    );
    const withoutSignal = [];
    const withoutOutline = [];
    const active = document.activeElement;
    for (const control of controls) {
      if (typeof control.focus !== "function") continue;
      control.blur();
      const before = snapshot(control);
      control.focus({ preventScroll: true });
      const after = snapshot(control);
      if (before === after) withoutSignal.push(label(control));
      if (!hasOutline(control)) withoutOutline.push(label(control));
    }
    if (active && typeof active.focus === "function") active.focus({ preventScroll: true });
    return { total: controls.length, withoutSignal, withoutOutline };
  }, surface.selector);

  console.log(`${surface.name}: ${result.total} controles`);
  if (!result.withoutSignal.length) {
    console.log("  todos cambian algo al recibir foco");
  } else {
    for (const item of result.withoutSignal) {
      console.log(`  ${surface.required ? "FALLA  " : "pendiente"} sin cambio visual: ${item}`);
    }
    if (surface.required) {
      failures.push(`${surface.name}: ${result.withoutSignal.length} controles sin cambio visual`);
    }
  }
  if (result.withoutOutline.length) {
    const sample = result.withoutOutline.slice(0, 6).join(" · ");
    console.log(`  ${surface.required ? "FALLA  " : "pendiente"} sin contorno: ${sample}`);
    if (surface.required) {
      failures.push(
        `${surface.name}: ${result.withoutOutline.length} controles enfocados sin contorno`
      );
    }
  } else {
    console.log("  todos muestran contorno al enfocarse");
  }
  if (surface.name === "Panel Índice") {
    await page.screenshot({ path: path.join(outDir, "foco-indice.png") });
  }
}

console.log("\nconsola:", consoleErrors.length ? consoleErrors.slice(0, 4) : "sin errores");
console.log(
  failures.length
    ? `FALLAS:\n - ${failures.join("\n - ")}`
    : "OK: la barra y el índice muestran el foco con teclado"
);
await browser.close();
process.exit(failures.length ? 1 : 0);
