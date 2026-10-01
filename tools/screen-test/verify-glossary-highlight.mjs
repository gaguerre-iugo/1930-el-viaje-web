// Verifica el resaltado del glosario (revisión UX, punto 1): encendido por
// defecto, subrayado punteado sutil, definición al tocar la palabra y
// preferencia del lector respetada y persistida.
//
// Uso:
//   node verify-glossary-highlight.mjs
//   node verify-glossary-highlight.mjs --url http://127.0.0.1:5501/index.html
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
const STORAGE_KEY = "adt-reflow-glossary-highlight:1930-libro-completo-v47";

const failures = [];
const fail = (message) => failures.push(message);
const browser = await chromium.launch();
const consoleErrors = [];

/* Cuenta las palabras del glosario que están realmente a la vista: el motor de
   reflow mantiene todo el libro en el DOM y pagina por columnas, así que las
   palabras de otras páginas no se ven aunque existan. */
const sondeo = () =>
  ({
    total: document.querySelectorAll("#content .glossary-term").length,
    visibles: [...document.querySelectorAll("#content .glossary-term")].filter((term) => {
      const rect = term.getBoundingClientRect();
      return rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth + 1;
    }).length,
  });

async function nuevaPagina() {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-next", { timeout: 30000 });
  /* La paginación sigue asentándose después del load: se espera a que el
     contador quede quieto dos lecturas seguidas. */
  let anterior = "";
  for (let intento = 0; intento < 24; intento += 1) {
    await page.waitForTimeout(500);
    const actual = await page.evaluate(
      () => document.getElementById("reflow-progress-long").textContent
    );
    if (actual === anterior) break;
    anterior = actual;
  }
  return { context, page };
}

async function buscandoVisibles(page, maximo = 40) {
  for (let paso = 0; paso <= maximo; paso += 1) {
    const estado = await page.evaluate(sondeo);
    if (estado.visibles > 0) return { ...estado, paso };
    await page.click("#reflow-next");
    await page.waitForTimeout(700);
  }
  return { total: 0, visibles: 0, paso: maximo };
}

const { context, page } = await nuevaPagina();
const encontrado = await buscandoVisibles(page);
console.log("=== Por defecto ===");
console.log(
  `  palabras a la vista sin tocar nada: ${encontrado.visibles} ` +
    `(en el DOM hay ${encontrado.total}, tras ${encontrado.paso} páginas)`
);
if (!encontrado.visibles) fail("el resaltado no viene encendido por defecto");

const estilo = await page.evaluate(() => {
  const term = [...document.querySelectorAll("#content .glossary-term")].find((candidato) => {
    const rect = candidato.getBoundingClientRect();
    return rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth + 1;
  });
  if (!term) return null;
  const style = getComputedStyle(term);
  return {
    estilo: style.textDecorationStyle,
    linea: style.textDecorationLine,
    color: style.textDecorationColor,
    grosor: style.textDecorationThickness,
    fondo: style.backgroundColor,
    palabra: term.textContent,
  };
});
console.log(`  estilo: ${JSON.stringify(estilo)}`);
if (!estilo) fail("no se encontró una palabra visible para medir el estilo");
if (estilo) {
  if (estilo.estilo !== "dotted") fail(`el subrayado no es punteado (${estilo.estilo})`);
  if (!/rgb\(0, 99, 93\)/.test(estilo.color)) {
    fail(`el subrayado no usa el institucional 600 (${estilo.color})`);
  }
  if (!/rgba\(0, 0, 0, 0\)|transparent/.test(estilo.fondo)) {
    fail(`el subrayado conserva fondo (${estilo.fondo})`);
  }
}
await page.screenshot({ path: path.join(outDir, "glosario-subrayado.png") });

/* ------------------------------------------- la definición se abre al tocar */
/* Se prueban varias páginas: si el diccionario del runtime no estuviera cargado
   para algún capítulo, el globo no abriría y hay que verlo acá. */
const primeraVisible = () =>
  page.evaluate(() => {
    const term = [...document.querySelectorAll("#content .glossary-term")].find((candidato) => {
      const rect = candidato.getBoundingClientRect();
      return rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth + 1;
    });
    if (!term) return null;
    term.scrollIntoView({ block: "center" });
    const rect = term.getBoundingClientRect();
    return { texto: term.textContent, clave: term.dataset.glossaryKey, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });

const globoAbierto = () =>
  page.evaluate(() => {
    const dialogo = [...document.querySelectorAll('[role="dialog"]')].find(
      (candidato) =>
        candidato.getClientRects().length &&
        /definition|definici/i.test(candidato.getAttribute("aria-label") || "")
    );
    return dialogo
      ? {
          etiqueta: dialogo.getAttribute("aria-label"),
          texto: dialogo.textContent.replace(/\s+/g, " ").trim().slice(0, 60),
        }
      : null;
  });

console.log("\n=== Definición al tocar la palabra ===");
let probadas = 0;
let abiertas = 0;
for (let intento = 0; intento < 12 && probadas < 3; intento += 1) {
  const palabra = await primeraVisible();
  if (palabra) {
    probadas += 1;
    await page.mouse.click(palabra.x, palabra.y);
    await page.waitForTimeout(1000);
    const globo = await globoAbierto();
    if (globo) {
      abiertas += 1;
      console.log(`  "${palabra.texto}" (${palabra.clave}) → ${globo.etiqueta} · ${globo.texto}`);
      if (probadas === 1) {
        await page.screenshot({ path: path.join(outDir, "glosario-globo.png") });
      }
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    } else {
      console.log(`  "${palabra.texto}" (${palabra.clave}) → no abrió`);
    }
  }
  await page.click("#reflow-next");
  await page.waitForTimeout(800);
}
console.log(`  abrieron ${abiertas} de ${probadas} palabras probadas en páginas distintas`);
if (abiertas < probadas || probadas === 0) {
  fail(`el globo con la definición no abrió en todas las palabras probadas (${abiertas}/${probadas})`);
}

/* --------------------------------------------------- el switch dice la verdad */
await page.click("#reflow-glossary");
await page.waitForTimeout(1500);
const estadoSwitch = await page.evaluate(() => {
  const control = document.querySelector(".reflow-glossary-panel [role='switch']");
  return control ? control.getAttribute("aria-checked") : null;
});
console.log(`\n=== Switch del panel ===\n  aria-checked con el subrayado encendido: ${estadoSwitch}`);
if (estadoSwitch !== "true") {
  fail(`el switch muestra "${estadoSwitch}" mientras las palabras están subrayadas`);
}

/* El lector lo apaga: se respeta, se limpia y se persiste. */
await page.click(".reflow-glossary-panel [role='switch']");
await page.waitForTimeout(1200);
const apagado = await page.evaluate(sondeo);
const guardado = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
console.log(
  `  al apagarlo: a la vista ${apagado.visibles} · en el DOM ${apagado.total} · preferencia "${guardado}"`
);
if (apagado.total !== 0) fail(`al apagar el switch quedaron ${apagado.total} palabras subrayadas`);
if (guardado !== "false") fail(`la preferencia del lector no se guardó (${guardado})`);

/* -------------------------------------------------------- persiste al recargar */
await page.reload({ waitUntil: "load" });
await page.waitForSelector("#reflow-next", { timeout: 30000 });
await page.waitForTimeout(3000);
const trasRecarga = await buscandoVisibles(page, 6);
console.log(
  `\n=== Recarga con la preferencia apagada ===\n  palabras a la vista: ${trasRecarga.visibles} (tras ${trasRecarga.paso} páginas)`
);
if (trasRecarga.visibles > 0) fail("con la preferencia apagada el resaltado volvió");
await context.close();

await fs.mkdir(outDir, { recursive: true });
console.log(`\nURL: ${target}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 5) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 3).join(" | ")}`);
console.log(
  failures.length
    ? `FALLAS:\n - ${failures.join("\n - ")}`
    : "OK: el resaltado del glosario cumple el punto 1"
);
await browser.close();
process.exit(failures.length ? 1 : 0);
