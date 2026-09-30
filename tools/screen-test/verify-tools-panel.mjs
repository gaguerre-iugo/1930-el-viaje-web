// Verifica las reglas del panel de Configuración (menú Herramientas) y de los
// atajos de teclado:
//
//   1. Tres bloques con título y en orden: Leer, Escuchar y Pantalla.
//   2. Resaltado, Voz, Velocidad y Reproducción automática sólo se ven con
//      "Activar lectura en voz alta" encendido, y la Reproducción automática
//      queda inmediatamente debajo del interruptor.
//   3. Con la voz apagada el panel entra completo en la pantalla, sin scroll.
//   4. Los atajos son Alt+I (índice), Alt+H (Herramientas), Alt+G (glosario) y
//      Alt+A (esta ayuda); ninguna letra suelta dispara nada (WCAG 2.1.4).
//
// Uso:
//   node verify-tools-panel.mjs
//   node verify-tools-panel.mjs --url http://127.0.0.1:5611/index.html
//   node verify-tools-panel.mjs --viewport 1920x1080
//
// Necesita el libro servido por HTTP (por ejemplo `node tools/serve-local.js`).
// Devuelve 0 si todo se cumple y 1 si algo falla; deja capturas en ../../tmp/.
import path from "node:path";
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
const [viewWidth, viewHeight] = (argVal("--viewport") || "1366x900")
  .split("x")
  .map(Number);

const DEPENDENT = [
  ["Resaltado", ".reflow-setting-highlight"],
  ["Voz del narrador", "#reflow-tts-voice-setting"],
  ["Velocidad", "#reflow-tts-speed-setting"],
  ["Reproducción automática", ".reflow-setting-autoplay"],
];
const ALWAYS = [
  ["Glosario", "#reflow-open-glossary"],
  ["Tamaño de letra", ".reflow-font-settings-options"],
  ["Lectura fácil", ".reflow-setting-easy-read"],
  ["Descripción de imágenes", ".reflow-setting-describe-images"],
  ["Activar lectura en voz alta", ".reflow-setting-read-aloud"],
  ["Reducir movimiento", ".reflow-reduce-motion-setting"],
  ["Ocultar menús automáticamente", ".reflow-settings-preferences-continuation .reflow-setting-row"],
];
const BLOCKS = ["leer", "escuchar", "pantalla"];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: viewWidth || 1366, height: viewHeight || 900 },
});
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(String(error)));

const failures = [];
const fail = (message) => failures.push(message);

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-tools", { timeout: 30000 });
await page.waitForTimeout(1200);

const panelIsOpen = () =>
  page.evaluate(() => {
    const panel = document.querySelector(".reflow-accessibility-panel");
    return Boolean(panel && panel.getClientRects().length);
  });

async function openPanel() {
  if (!(await panelIsOpen())) {
    await page.click("#reflow-tools");
    await page.waitForTimeout(1000);
  }
  await page.waitForSelector(".reflow-setting-read-aloud [role='switch']", {
    timeout: 15000,
  });
  await page.waitForTimeout(500);
}

async function closePanels() {
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  }
}

async function readAloudIsOn() {
  const control = await page.$(".reflow-setting-read-aloud [role='switch']");
  return control ? (await control.getAttribute("aria-checked")) === "true" : null;
}

async function setReadAloud(wanted) {
  await openPanel();
  if ((await readAloudIsOn()) !== wanted) {
    await page.click(".reflow-setting-read-aloud [role='switch']");
    await page.waitForTimeout(2000);
  }
  await openPanel();
  return readAloudIsOn();
}

/* Orden visual real: las secciones aplanadas (display:contents) no tienen caja
   propia, así que hay que bajar a sus hijos para reconstruir la secuencia. */
const panelState = () =>
  page.evaluate(
    ({ dependent, always }) => {
      const root = document.querySelector(".reflow-settings-organized");
      const flatten = (element) =>
        [...element.children].flatMap((child) =>
          getComputedStyle(child).display === "contents" ? flatten(child) : [child]
        );
      const visible = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return "AUSENTE";
        const style = getComputedStyle(element);
        return element.getClientRects().length > 0 && style.display !== "none" && !element.hidden
          ? "visible"
          : "oculto";
      };
      const GENERIC_CLASSES = new Set([
        "reflow-setting-row",
        "reflow-setting-tts-only",
        "reflow-setting-tts-hidden",
        "reflow-setting-disabled",
      ]);
      const identity = (element) => {
        const block = element.getAttribute("data-reflow-block-title");
        if (block) return block;
        if (element.id) return element.id;
        const classes = (element.className.toString().match(/reflow-[a-z-]+/g) || [])
          .filter((name) => !GENERIC_CLASSES.has(name));
        if (classes.length) return classes[0];
        return (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
      };
      const rows = flatten(root)
        .filter((element) => element.getClientRects().length)
        .map((element) => ({
          key: identity(element),
          block: element.getAttribute("data-reflow-block-title") || null,
          top: Math.round(element.getBoundingClientRect().top),
        }))
        .sort((a, b) => a.top - b.top);
      const panel = document.querySelector(".reflow-accessibility-panel");
      const scroll = [];
      for (let element = panel; element; element = element.parentElement) {
        const style = getComputedStyle(element);
        if (/(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1) {
          scroll.push({
            overflow: element.scrollHeight - element.clientHeight,
            id: element.id || element.className.toString().slice(0, 40),
          });
        }
      }
      return {
        dependent: dependent.map(([label, selector]) => [label, visible(selector)]),
        always: always.map(([label, selector]) => [label, visible(selector)]),
        order: rows.map((row) => row.key),
        panelBottom: Math.round(panel.getBoundingClientRect().bottom),
        viewport: innerHeight,
        scroll,
      };
    },
    { dependent: DEPENDENT, always: ALWAYS }
  );

// 1) Voz apagada: filas ocultas, bloques en orden y panel sin scroll.
if (await setReadAloud(false)) fail("no se pudo apagar la lectura en voz alta");
const off = await panelState();
console.log(`\n=== VOZ APAGADA ===`);
console.log(`panel: termina en ${off.panelBottom} de ${off.viewport} · scroll: ${off.scroll.length ? JSON.stringify(off.scroll) : "ninguno"}`);
console.log(`orden: ${off.order.join(" → ")}`);
off.dependent.forEach(([label, state]) => console.log(`  [con voz]  ${label}: ${state}`));
off.always.forEach(([label, state]) => console.log(`  [siempre]  ${label}: ${state}`));
await page.screenshot({ path: path.join(outDir, "panel-bloques.png") });

off.dependent.forEach(([label, state]) => {
  if (state !== "oculto") fail(`voz apagada: "${label}" debería estar oculto y está ${state}`);
});
off.always.forEach(([label, state]) => {
  if (state !== "visible") fail(`"${label}" debería verse siempre y está ${state}`);
});
if (off.scroll.length) {
  fail(`el panel hace scroll con la voz apagada: ${JSON.stringify(off.scroll)}`);
}
if (off.panelBottom > off.viewport) {
  fail(`el panel se pasa del alto de la pantalla (${off.panelBottom} > ${off.viewport})`);
}
const blockOrder = off.order.filter((entry) => BLOCKS.includes(entry));
if (blockOrder.join("|") !== BLOCKS.join("|")) {
  fail(`los bloques no están en orden: ${blockOrder.join(" → ")} (esperado ${BLOCKS.join(" → ")})`);
}

// 2) Voz encendida: las cuatro filas visibles y la reproducción automática
//    inmediatamente debajo del interruptor.
if (!(await setReadAloud(true))) fail("no se pudo encender la lectura en voz alta");
const on = await panelState();
console.log(`\n=== VOZ ENCENDIDA ===`);
console.log(`orden del bloque Escuchar: ${on.order.join(" → ")}`);
on.dependent.forEach(([label, state]) => console.log(`  [con voz]  ${label}: ${state}`));
await page.screenshot({ path: path.join(outDir, "panel-tts-encendida.png") });
on.dependent.forEach(([label, state]) => {
  if (state !== "visible") fail(`voz encendida: "${label}" debería verse y está ${state}`);
});
const escuchar = on.order.indexOf("escuchar");
const switchIndex = on.order.indexOf("reflow-setting-read-aloud");
const nextAfterSwitch = switchIndex >= 0 ? on.order[switchIndex + 1] : null;
if (escuchar < 0 || switchIndex < 0) {
  fail("no se encontraron el bloque Escuchar o el interruptor de lectura en voz alta");
} else if (nextAfterSwitch !== "reflow-setting-autoplay") {
  fail(`la Reproducción automática no queda debajo del interruptor (siguiente: ${nextAfterSwitch})`);
}

// 3) Atajos.
console.log(`\n=== ATAJOS ===`);
const shortcutCases = [
  { keys: "x", expect: "nada" },
  { keys: "a", expect: "nada" },
  { keys: "g", expect: "nada" },
  { keys: "i", expect: "nada" },
  { keys: "Alt+g", expect: "glosario" },
  { keys: "Alt+h", expect: "herramientas" },
  { keys: "Alt+i", expect: "índice" },
  { keys: "Alt+a", expect: "ayuda" },
];
for (const testCase of shortcutCases) {
  await closePanels();
  await page.keyboard.press(testCase.keys);
  await page.waitForTimeout(700);
  const state = await page.evaluate(() => {
    const help = document.getElementById("reflow-shortcuts-help");
    const panels = [...document.querySelectorAll(".reflow-reader-panel")]
      .filter((element) => element.getClientRects().length)
      .map((element) => element.className.toString());
    return {
      help: Boolean(help && !help.hidden && help.getClientRects().length),
      glossary: panels.some((name) => /glossary-panel/.test(name)),
      navigation: panels.some((name) => /navigation-panel/.test(name)),
      tools: panels.some((name) => /accessibility-panel/.test(name)),
    };
  });
  const opened =
    (state.glossary && "glosario") ||
    (state.navigation && "índice") ||
    (state.tools && "herramientas") ||
    (state.help && "ayuda") ||
    "nada";
  console.log(`  ${testCase.keys.padEnd(7)} → ${opened}`);
  const expected = testCase.expect;
  const matches =
    (expected === "nada" && opened === "nada") ||
    (expected !== "nada" && opened !== "nada");
  if (!matches) fail(`atajo "${testCase.keys}": abrió ${opened}, se esperaba ${expected}`);
}

const helpDialog = await page.evaluate(() => {
  const help = document.getElementById("reflow-shortcuts-help");
  if (!help || help.hidden) return null;
  return {
    role: help.getAttribute("role"),
    modal: help.getAttribute("aria-modal"),
    combos: [...help.querySelectorAll(".reflow-shortcuts-row kbd")].map((kbd) =>
      kbd.textContent.trim()
    ),
    note: Boolean(help.querySelector(".reflow-shortcuts-note")),
    focused: document.activeElement ? document.activeElement.id : "",
  };
});
console.log(`\nayuda: ${JSON.stringify(helpDialog)}`);
const EXPECTED_COMBOS = ["Alt+I", "Alt+H", "Alt+G", "Alt+A", "Esc"];
if (!helpDialog) fail("Alt+A no abrió la ayuda de atajos");
else {
  if (helpDialog.role !== "dialog" || helpDialog.modal !== "true") {
    fail("la ayuda no se anuncia como diálogo modal");
  }
  if (helpDialog.combos.join("|") !== EXPECTED_COMBOS.join("|")) {
    fail(`la ayuda lista ${helpDialog.combos.join(", ")} (esperado ${EXPECTED_COMBOS.join(", ")})`);
  }
  if (helpDialog.note) fail("la ayuda todavía muestra la nota sobre la tecla Alt");
  if (helpDialog.focused !== "reflow-shortcuts-close") {
    fail(`al abrir la ayuda el foco quedó en "${helpDialog.focused}"`);
  }
}
await page.screenshot({ path: path.join(outDir, "ayuda-atajos.png") });

// Esc cierra la ayuda.
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
const helpClosed = await page.evaluate(() => {
  const help = document.getElementById("reflow-shortcuts-help");
  return Boolean(help && help.hidden);
});
if (!helpClosed) fail("Esc no cerró la ayuda de atajos");

console.log(`\nURL: ${target}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 5) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 3).join(" | ")}`);
console.log(failures.length ? `FALLAS:\n - ${failures.join("\n - ")}` : "OK: el panel y los atajos cumplen las reglas");

await browser.close();
process.exit(failures.length ? 1 : 0);
