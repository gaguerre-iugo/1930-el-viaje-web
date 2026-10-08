// Verifica el contador por capítulo (revisión UX, punto 4).
//
// Unitario: llama a la función pura `chapterProgressAt` con bloques sintéticos
// (no depende del libro) y comprueba los textos, incluidos los bordes.
// Integración: con el libro real, contrasta el contador contra los bloques
// calculados desde el DOM, revisa la etiqueta accesible, el cambio de formato en
// pantalla angosta y la actualización después de una repaginación.
//
// Uso:
//   node verify-chapter-progress.mjs
//   node verify-chapter-progress.mjs --url http://127.0.0.1:5501/index.html
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

const failures = [];
const fail = (message) => failures.push(message);
const equal = (actual, expected, label) => {
  if (actual !== expected) {
    fail(`${label}: se esperaba ${JSON.stringify(expected)} y llegó ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ok  ${label} → ${JSON.stringify(actual)}`);
  }
};

/* El libro se repagina durante los primeros segundos (fuentes, imágenes) y el
   último bloque usa `state.total - 1`. La firma oscila (272/271) hasta
   estabilizarse, así que se espera a que se mantenga igual durante 4 s seguidos
   antes de comparar: dos cargas comparadas en fases distintas daban un falso
   off-by-one en el último bloque. */
const bloquesFirma = (target) =>
  target.evaluate(() => {
    const blocks = window.__adtReflowChapterProgress.blocks();
    return blocks.map((b) => `${b.key}:${b.startPage}-${b.endPage}`).join("|");
  });
const esperarAsentado = async (target) => {
  let anterior = null;
  let estables = 0;
  for (let intento = 0; intento < 60; intento += 1) {
    await target.waitForTimeout(500);
    const firma = await bloquesFirma(target);
    if (firma === anterior) {
      estables += 1;
      if (estables >= 8) return firma;
    } else {
      estables = 0;
      anterior = firma;
    }
  }
  return anterior;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(String(error)));

await page.goto(target, { waitUntil: "load" });

/* Regresión: durante el arranque el libro se repagina varias veces y las
   mediciones pueden volver cero. El contador nunca debe caer al formato global
   ("pág. 24 de 317") mientras existan bloques. */
const fallbacksDuringStartup = [];
for (let i = 0; i < 25; i += 1) {
  await page.waitForTimeout(100);
  const snapshot = await page.evaluate(() => {
    const api = window.__adtReflowChapterProgress;
    const long = document.getElementById("reflow-progress-long");
    if (!api || !long) return null;
    return { text: long.textContent, blocks: api.blocks().length };
  });
  if (snapshot && snapshot.blocks > 0 && /^pág\. \d+ de \d+$/.test(snapshot.text)) {
    fallbacksDuringStartup.push(`${(i + 1) * 100}ms: ${snapshot.text}`);
  }
}

await page.waitForSelector("#reflow-page-status", { timeout: 30000 });
await page.waitForTimeout(1500);

/* ---------------------------------------------------------------- unitario */
console.log("\n=== Unitario: chapterProgressAt con bloques sintéticos ===");
const synthetic = [
  { key: "antes", label: "Antes de empezar", spoken: "Antes de empezar", startPage: 0, endPage: 5, pages: 6 },
  { key: "chapter-1", label: "Cap. 1", spoken: "Capítulo 1", startPage: 6, endPage: 23, pages: 18 },
  { key: "chapter-2", label: "Cap. 2", spoken: "Capítulo 2", startPage: 24, endPage: 24, pages: 1 },
  { key: "sobre", label: "Sobre el libro", spoken: "Sobre el libro", startPage: 25, endPage: 27, pages: 3 },
];
const unit = await page.evaluate((blocks) => {
  const api = window.__adtReflowChapterProgress;
  if (!api || typeof api.at !== "function") return { missing: true };
  const at = api.at;
  return {
    missing: false,
    firstOfBook: at(blocks, 0),
    lastOfFront: at(blocks, 5),
    firstOfChapter: at(blocks, 6),
    middleOfChapter: at(blocks, 11),
    lastOfChapter: at(blocks, 23),
    singlePage: at(blocks, 24),
    lastOfBook: at(blocks, 27),
    outside: at(blocks, 99),
    empty: at([], 3),
  };
}, synthetic);

if (unit.missing) {
  fail("no está expuesto window.__adtReflowChapterProgress");
} else {
  equal(unit.firstOfBook.long, "Antes de empezar · pág. 1 de 6", "primera página del libro");
  equal(unit.lastOfFront.long, "Antes de empezar · pág. 6 de 6", "última de materia inicial");
  equal(unit.firstOfChapter.long, "Cap. 1 · pág. 1 de 18", "primera del capítulo 1");
  equal(unit.middleOfChapter.long, "Cap. 1 · pág. 6 de 18", "página intermedia del capítulo 1");
  equal(unit.middleOfChapter.short, "Cap. 1 · 6/18", "forma corta");
  equal(unit.middleOfChapter.minimal, "6/18", "forma mínima");
  equal(unit.middleOfChapter.spoken, "Capítulo 1, página 6 de 18", "forma accesible");
  equal(unit.lastOfChapter.long, "Cap. 1 · pág. 18 de 18", "última del capítulo 1");
  equal(unit.singlePage.long, "Cap. 2 · pág. 1 de 1", "bloque de una sola página");
  equal(unit.lastOfBook.long, "Sobre el libro · pág. 3 de 3", "última del libro");
  equal(unit.outside, null, "página fuera de todo bloque");
  equal(unit.empty, null, "lista de bloques vacía");
}

/* ------------------------------------------------------------ integración */
console.log("\n=== Integración: contador real del libro ===");
if (fallbacksDuringStartup.length) {
  console.log(`  contador en formato global durante el arranque: ${fallbacksDuringStartup.join(" · ")}`);
  fail(`el contador perdió el capítulo ${fallbacksDuringStartup.length} veces al arrancar`);
} else {
  console.log("  durante el arranque nunca perdió el capítulo");
}

/* Esperar a que la paginación se asiente antes de leer los bloques reales. */
await esperarAsentado(page);

const cobertura = await page.evaluate(() => {
  const api = window.__adtReflowChapterProgress;
  const blocks = api.blocks();
  const total = blocks.length ? blocks[blocks.length - 1].endPage + 1 : 0;
  const huecos = [];
  for (let index = 1; index < blocks.length; index += 1) {
    if (blocks[index].startPage !== blocks[index - 1].endPage + 1) {
      huecos.push(`${blocks[index - 1].key}→${blocks[index].key}`);
    }
  }
  let sinBloque = 0;
  for (let page = 0; page < total; page += 1) {
    if (!api.at(blocks, page)) sinBloque += 1;
  }
  return { total, huecos, sinBloque, arrancaEn: blocks.length ? blocks[0].startPage : null };
});
console.log(
  `  cobertura: ${cobertura.total} páginas · arranca en ${cobertura.arrancaEn} · ` +
    `huecos ${cobertura.huecos.length} · páginas sin bloque ${cobertura.sinBloque}`
);
if (cobertura.arrancaEn !== 0) fail(`los bloques no arrancan en la página 0 (arrancan en ${cobertura.arrancaEn})`);
if (cobertura.huecos.length) fail(`los bloques tienen huecos: ${cobertura.huecos.join(", ")}`);
if (cobertura.sinBloque) fail(`${cobertura.sinBloque} páginas no caen en ningún bloque`);

const real = await page.evaluate(() => {
  const toc = window.__adtReflowTocEntries || [];
  const status = document.getElementById("reflow-page-status");
  const long = document.getElementById("reflow-progress-long");
  const short = document.getElementById("reflow-progress-short");
  const api = window.__adtReflowChapterProgress;
  const blocks = api.blocks();
  return {
    tocLength: toc.length,
    tocGroups: toc.map((entry) => entry && entry.group).filter(Boolean),
    blocks: blocks.map((block) => ({
      key: block.key, label: block.label, start: block.startPage,
      end: block.endPage, pages: block.pages,
    })),
    text: long ? long.textContent : null,
    shortText: short ? short.textContent : null,
    ariaLabel: status ? status.getAttribute("aria-label") : null,
    longVisible: long ? long.getClientRects().length > 0 : false,
    shortVisible: short ? short.getClientRects().length > 0 : false,
  };
});

console.log(`  grupos en el índice: ${real.tocGroups.length} (${[...new Set(real.tocGroups)].join(", ")})`);
console.log("  bloques:");
for (const block of real.blocks) {
  console.log(`    ${block.label.padEnd(18)} páginas ${block.start}–${block.end} (${block.pages})`);
}

if (!real.tocGroups.length) {
  fail("el runtime no expone el campo `group` del índice: el contador cae al formato global");
}
if (real.blocks.length < 3) {
  fail(`se esperaban al menos 3 bloques y se armaron ${real.blocks.length}`);
}
const chapterBlocks = real.blocks.filter((block) => block.key.startsWith("chapter-"));
equal(chapterBlocks.length, 8, "capítulos numerados");
equal(chapterBlocks.map((block) => block.label).join(" "), "Cap. 1 Cap. 2 Cap. 3 Cap. 4 Cap. 5 Cap. 6 Cap. 7 Cap. 8", "numeración de capítulos");

// El texto visible tiene que coincidir con el bloque que contiene la página.
const expectedFirst = await page.evaluate(() => {
  const api = window.__adtReflowChapterProgress;
  const blocks = api.blocks();
  const info = api.at(blocks, 0);
  return info ? info.long : null;
});
equal(real.text, expectedFirst, "contador en la primera página");
if (real.ariaLabel && !/, página \d+ de \d+$/.test(real.ariaLabel)) {
  fail(`la etiqueta accesible no sigue el formato esperado: ${real.ariaLabel}`);
} else {
  console.log(`  ok  etiqueta accesible → ${JSON.stringify(real.ariaLabel)}`);
}
if (!real.longVisible) fail("en pantalla ancha debería verse la forma larga");
if (real.shortVisible) fail("en pantalla ancha la forma corta no debería verse");

// Navegar dentro del capítulo 1 y comprobar el avance.
await page.evaluate(() => {
  const next = document.getElementById("reflow-next");
  for (let i = 0; i < 4; i += 1) next.click();
});
await page.waitForTimeout(1200);
const afterNavigation = await page.evaluate(() => ({
  text: document.getElementById("reflow-progress-long").textContent,
  aria: document.getElementById("reflow-page-status").getAttribute("aria-label"),
}));
console.log(`  tras avanzar 4 páginas: ${afterNavigation.text}`);
if (!/· pág\. 5 de \d+$/.test(afterNavigation.text)) {
  fail(`el avance no se actualizó como se esperaba: ${afterNavigation.text}`);
}
if (!/, página 5 de \d+$/.test(afterNavigation.aria || "")) {
  fail(`la etiqueta accesible no acompañó el avance: ${afterNavigation.aria}`);
}

await page.screenshot({ path: path.join(outDir, "contador-capitulo.png") });

// Abrir y cerrar el panel de Herramientas no debe romper el contador.
await page.click("#reflow-tools");
await page.waitForTimeout(1500);
const conPanel = await page.evaluate(() => ({
  texto: document.getElementById("reflow-progress-long").textContent,
  bloques: window.__adtReflowChapterProgress.blocks().length,
}));
await page.keyboard.press("Escape");
await page.waitForTimeout(800);
const sinPanel = await page.evaluate(() => document.getElementById("reflow-progress-long").textContent);
console.log(`  con el panel abierto: ${conPanel.texto} · al cerrarlo: ${sinPanel}`);
if (/^pág\. \d+ de \d+$/.test(conPanel.texto)) {
  fail(`el contador perdió el capítulo al abrir el panel: ${conPanel.texto}`);
}
if (/^pág\. \d+ de \d+$/.test(sinPanel)) {
  fail(`el contador perdió el capítulo al cerrar el panel: ${sinPanel}`);
}

// Repaginación por tamaño de letra: el total del capítulo puede cambiar.
const beforeResize = await page.evaluate(() => document.getElementById("reflow-progress-long").textContent);
await page.click("#reflow-tools");
await page.waitForTimeout(1200);
const resized = await page.evaluate(() => {
  const button = document.querySelector('[data-reflow-font-size="large"]');
  if (!button) return null;
  button.click();
  return true;
});
await page.waitForTimeout(2500);
const afterResize = await page.evaluate(() => ({
  text: document.getElementById("reflow-progress-long").textContent,
  blocks: window.__adtReflowChapterProgress.blocks().map((block) => block.pages),
}));
if (resized) {
  console.log(`  antes de agrandar letra: ${beforeResize}`);
  console.log(`  después: ${afterResize.text} · páginas por bloque: ${afterResize.blocks.join(", ")}`);
  if (!/\d+ de \d+/.test(afterResize.text)) {
    fail(`el contador quedó mal tras repaginar: ${afterResize.text}`);
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const reset = await page.evaluate(() => {
    const button = document.querySelector('[data-reflow-font-size="normal"]');
    if (button) button.click();
    return Boolean(button);
  });
  if (reset) await page.waitForTimeout(2000);
} else {
  console.log("  (no se encontró el control de tamaño de letra; se omite la repaginación)");
}

// Pantallas angostas: forma corta y forma mínima, sin desbordes.
const anchoStatus = () =>
  page.evaluate(() => {
    const status = document.getElementById("reflow-page-status");
    const bar = document.getElementById("reflow-pagination");
    return {
      longVisible: document.getElementById("reflow-progress-long").getClientRects().length > 0,
      shortVisible: document.getElementById("reflow-progress-short").getClientRects().length > 0,
      minimalVisible: document.getElementById("reflow-progress-minimal").getClientRects().length > 0,
      longText: document.getElementById("reflow-progress-long").textContent,
      shortText: document.getElementById("reflow-progress-short").textContent,
      minimalText: document.getElementById("reflow-progress-minimal").textContent,
      desbordeInterno: Math.round(status.scrollWidth - status.clientWidth),
      barra: bar.scrollWidth - bar.clientWidth,
    };
  });

for (const [width, expected] of [
  [620, "short"],
  [340, "minimal"],
]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(2000);
  const state = await anchoStatus();
  console.log(
    `  a ${width} px: forma ${expected} · "${state.shortText}" / "${state.minimalText}" · ` +
      `desborde interno ${state.desbordeInterno}px · barra ${state.barra}px`
  );
  if (!state[`${expected}Visible`]) fail(`a ${width} px debería verse la forma ${expected}`);
  const otras = ["long", "short", "minimal"].filter((name) => name !== expected);
  for (const otra of otras) {
    if (state[`${otra}Visible`]) fail(`a ${width} px no debería verse la forma ${otra}`);
  }
  if (state.desbordeInterno > 1) {
    fail(`a ${width} px el contador desborda su celda: ${state.desbordeInterno}px`);
  }
  if (state.barra > 1) fail(`a ${width} px la barra desborda: ${state.barra}px`);
  await page.screenshot({ path: path.join(outDir, `contador-capitulo-${width}.png`) });
}

/* Regresión de caché: los navegadores guardan `content/toc.json` con caché
   inmutable (se pide con versión fija), así que un lector puede tener una copia
   sin el campo `group`. El contador tiene que armar los mismos bloques igual,
   porque el respaldo vive en reflow-book.js, que sí se versiona. */
const freshToc = JSON.parse(
  await fs.readFile(path.resolve(here, "..", "..", "content/toc.json"), "utf8")
);
const staleToc = freshToc.map((entry) => {
  const { group, ...rest } = entry;
  return rest;
});
const staleBrowser = await chromium.launch();
try {
  const stalePage = await staleBrowser.newPage({ viewport: { width: 1366, height: 900 } });
  await stalePage.route("**/content/toc.json*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(staleToc),
    })
  );
  await stalePage.goto(target, { waitUntil: "load" });
  await stalePage.waitForSelector("#reflow-page-status", { timeout: 30000 });
  await esperarAsentado(stalePage);
  const stale = await stalePage.evaluate(() => {
    const api = window.__adtReflowChapterProgress;
    const blocks = api.blocks();
    return {
      texto: document.getElementById("reflow-progress-long").textContent,
      gruposEnElIndice: api.toc().filter((entry) => entry && entry.group).length,
      rangos: blocks.map((block) => `${block.key}:${block.startPage}-${block.endPage}`),
    };
  });
  const esperados = real.blocks.map((block) => `${block.key}:${block.start}-${block.end}`);
  console.log(`\n=== Integración: toc.json cacheado sin grupos ===`);
  console.log(`  grupos en el índice: ${stale.gruposEnElIndice} · contador: ${stale.texto}`);
  console.log(`  bloques: ${stale.rangos.join(" · ")}`);
  if (stale.gruposEnElIndice !== 0) {
    fail("la simulación no logró quitar los grupos del índice");
  }
  if (/^pág\. \d+ de \d+$/.test(stale.texto)) {
    fail(`con el índice cacheado el contador perdió el capítulo: ${stale.texto}`);
  }
  if (stale.rangos.join("|") !== esperados.join("|")) {
    fail("los bloques con el índice cacheado no coinciden con los del índice agrupado");
  }
} finally {
  await staleBrowser.close();
}

console.log(`\nURL: ${target}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 6) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 3).join(" | ")}`);

await fs.mkdir(outDir, { recursive: true });
console.log(failures.length ? `FALLAS:\n - ${failures.join("\n - ")}` : "OK: el contador por capítulo cumple lo pedido");
await browser.close();
process.exit(failures.length ? 1 : 0);
