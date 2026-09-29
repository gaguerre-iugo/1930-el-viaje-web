// Compara el peso de un MISMO conjunto de imágenes entre dos versiones del
// libro, sumando tamaños de archivo (determinista; no depende de cuánto tarde
// cada corrida en pedirlas).
//
//   node _image_set_compare.mjs --after http://127.0.0.1:5599/index.html --before http://127.0.0.1:5601/index.html --runs 3

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};
const AFTER = argVal("--after");
const BEFORE = argVal("--before");
const RUNS = Number(argVal("--runs") || 3);
const AFTER_ROOT = argVal("--after-root") || process.cwd();
const BEFORE_ROOT = argVal("--before-root");

const browser = await chromium.launch();

async function imageSet(url) {
  const ctx = await browser.newContext({
    viewport: { width: 1067, height: 480 },
    deviceScaleFactor: 1.5,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    locale: "es-UY",
  });
  const page = await ctx.newPage();
  const names = new Set();
  const all = new Set();
  page.on("response", (r) => {
    const clean = r.url().split("?")[0];
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(clean)) {
      const name = clean.split("/").pop();
      all.add(name);
      if (!usable) names.add(name);
    }
  });
  let usable = false;
  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  await page.waitForSelector("#reflow-pagination", { timeout: 45000 }).catch(() => {});
  // Momento en que el libro queda usable: la barra recibe toques.
  await page
    .waitForFunction(
      () => {
        const bar = document.getElementById("reflow-pagination");
        if (!bar) return false;
        const cs = getComputedStyle(bar);
        return parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none";
      },
      { timeout: 60000 }
    )
    .catch(() => {});
  usable = true;
  await page.waitForTimeout(1500);
  await ctx.close();
  return { atUsable: names, eventual: all };
}

function sizeOnDisk(root, name) {
  for (const candidate of [name, name.replace(/\.webp$/, ".jpg"), name.replace(/\.webp$/, ".png")]) {
    const file = path.join(root, "images", candidate);
    if (fs.existsSync(file)) return { file: candidate, size: fs.statSync(file).size };
  }
  return null;
}

const union = new Set();
const unionUsable = new Set();
for (let i = 0; i < RUNS; i++) {
  process.stdout.write(`  ${AFTER} corrida ${i + 1}/${RUNS}... `);
  const set = await imageSet(AFTER);
  set.eventual.forEach((n) => union.add(n));
  set.atUsable.forEach((n) => unionUsable.add(n));
  console.log(`${set.atUsable.size} hasta usable · ${set.eventual.size} en total (unión ${union.size})`);
}

function totalsFor(set) {
  let afterTotal = 0;
  let beforeTotal = 0;
  for (const name of set) {
    const after = sizeOnDisk(AFTER_ROOT, name);
    const before = BEFORE_ROOT ? sizeOnDisk(BEFORE_ROOT, name) : null;
    if (after) afterTotal += after.size;
    if (before) beforeTotal += before.size;
  }
  return { afterTotal, beforeTotal };
}

const eventual = totalsFor(union);
const hastaUsable = totalsFor(unionUsable);

let afterTotal = eventual.afterTotal;
let beforeTotal = eventual.beforeTotal;
const rows = [];
for (const name of union) {
  const after = sizeOnDisk(AFTER_ROOT, name);
  const before = BEFORE_ROOT ? sizeOnDisk(BEFORE_ROOT, name) : null;
  rows.push({ name, after, before });
}
rows.sort((a, b) => (b.before?.size || b.after?.size || 0) - (a.before?.size || a.after?.size || 0));

console.log(`\nimágenes que el arranque pide (unión de ${RUNS} corridas): ${union.size}`);
for (const row of rows.slice(0, 10)) {
  const b = row.before ? `${(row.before.size / 1024).toFixed(0)}K` : "?";
  const a = row.after ? `${(row.after.size / 1024).toFixed(0)}K` : "?";
  console.log(`   ${b.padStart(6)} → ${a.padStart(6)}  ${row.name}`);
}
const pct = (x) => `${((1 - x.afterTotal / x.beforeTotal) * 100).toFixed(1)}% menos`;
console.log(
  `\n  HASTA QUE EL LIBRO ES USABLE (${unionUsable.size} imágenes): ${(hastaUsable.beforeTotal / 1048576).toFixed(2)} MB → ${(hastaUsable.afterTotal / 1048576).toFixed(2)} MB  (${pct(hastaUsable)})`
);
console.log(
  `  TODO lo que el arranque llega a pedir (${union.size} imágenes): ${(beforeTotal / 1048576).toFixed(2)} MB → ${(afterTotal / 1048576).toFixed(2)} MB  (${pct(eventual)})`
);

await browser.close();
