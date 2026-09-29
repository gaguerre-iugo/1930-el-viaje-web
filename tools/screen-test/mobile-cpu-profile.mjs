// Perfil de CPU del arranque: atribuye el tiempo a archivos y funciones.
//
// Usa el Profiler de Chrome DevTools Protocol, así que ve el costo real de
// parsear/ejecutar cada script, de recalcular estilo y de paginar.
//
// Uso:
//   node mobile-cpu-profile.mjs
//   node mobile-cpu-profile.mjs --url http://127.0.0.1:5599/index.html
//   node mobile-cpu-profile.mjs --device pixel7-portrait --top 25

import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const URL_TARGET =
  argVal("--url") || "https://gaguerre-iugo.github.io/1930-el-viaje-web/index.html";
const DEVICE = argVal("--device") || "tablet-landscape-1067x480";
const TOP = Number(argVal("--top") || 18);
const THROTTLE = argVal("--throttle") || "";
const REDES = {
  "4g": { latency: 100, down: 4 * 1024 * 1024, up: 1 * 1024 * 1024 },
  "3g": { latency: 300, down: 1.6 * 1024 * 1024, up: 750 * 1024 },
  "wifi-lento": { latency: 40, down: 10 * 1024 * 1024, up: 5 * 1024 * 1024 },
};

const DEVICES = {
  "pixel7-portrait": {
    width: 412,
    height: 859,
    dpr: 2.625,
    ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36",
  },
  "tablet-landscape-1067x480": {
    width: 1067,
    height: 480,
    dpr: 1.5,
    ua: "Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
  },
};
const dev = DEVICES[DEVICE] || DEVICES["pixel7-portrait"];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: dev.width, height: dev.height },
  deviceScaleFactor: dev.dpr,
  isMobile: true,
  hasTouch: true,
  userAgent: dev.ua,
  locale: "es-UY",
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
if (THROTTLE && REDES[THROTTLE]) {
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: REDES[THROTTLE].latency,
    downloadThroughput: REDES[THROTTLE].down / 8,
    uploadThroughput: REDES[THROTTLE].up / 8,
  });
}

await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 200 }); // 200 µs
await cdp.send("Profiler.start");

const t0 = Date.now();
await page.goto(URL_TARGET, { waitUntil: "load", timeout: 90000 });
await page.waitForSelector("#reflow-pagination", { timeout: 60000 }).catch(() => {});
await page.waitForFunction(
  () => {
    const b = document.getElementById("reflow-total-pages");
    return b && (parseInt(b.textContent, 10) || 0) > 1;
  },
  { timeout: 60000 }
).catch(() => {});
await page.waitForTimeout(1500);
const wall = Date.now() - t0;

const { profile } = await cdp.send("Profiler.stop");

// Agregar tiempo propio por nodo
const nodes = new Map();
for (const n of profile.nodes) nodes.set(n.id, n);
const selfTime = new Map(); // id -> microsegundos
const total = profile.endTime - profile.startTime;
const samples = profile.samples || [];
const deltas = profile.timeDeltas || [];
for (let i = 0; i < samples.length; i++) {
  const id = samples[i];
  const dt = deltas[i] || 0;
  selfTime.set(id, (selfTime.get(id) || 0) + dt);
}

function label(node) {
  const cf = node.callFrame || {};
  const url = (cf.url || "").split("/").pop().split("?")[0];
  const fn = cf.functionName || "(anónima)";
  if (!url) return `${fn}  [${cf.url || "nativo/sin url"}]`;
  return `${fn}  —  ${url}:${cf.lineNumber + 1}`;
}

const agg = new Map();
for (const [id, us] of selfTime) {
  const node = nodes.get(id);
  if (!node) continue;
  const key = label(node);
  const cur = agg.get(key) || { us: 0, url: (node.callFrame?.url || "") };
  cur.us += us;
  agg.set(key, cur);
}

// Agrupar por archivo
const byFile = new Map();
for (const [id, us] of selfTime) {
  const node = nodes.get(id);
  if (!node) continue;
  const url = (node.callFrame?.url || "nativo/sin url").split("/").pop().split("?")[0] || "nativo/sin url";
  byFile.set(url, (byFile.get(url) || 0) + us);
}

const ms = (us) => (us / 1000).toFixed(0);
console.log(`objetivo: ${URL_TARGET}`);
console.log(`perfil:   ${DEVICE} · ventana perfilada: ${(total / 1000).toFixed(0)} ms · pared: ${wall} ms\n`);

console.log("TIEMPO PROPIO POR ARCHIVO (CPU, sin contar hijos)");
const files = [...byFile.entries()].sort((a, b) => b[1] - a[1]);
const fileTotal = files.reduce((a, x) => a + x[1], 0);
for (const [f, us] of files.slice(0, 14)) {
  const pct = ((us / fileTotal) * 100).toFixed(1);
  console.log(`  ${String(ms(us)).padStart(6)} ms  ${String(pct).padStart(5)}%  ${f}`);
}

console.log(`\nTOP ${TOP} FUNCIONES POR TIEMPO PROPIO`);
const fns = [...agg.entries()].sort((a, b) => b[1].us - a[1].us).slice(0, TOP);
for (const [k, v] of fns) {
  console.log(`  ${String(ms(v.us)).padStart(6)} ms  ${k}`);
}

// Categorías "de navegador"
const cats = ["(garbage collector)", "(program)", "(idle)", "(compiler)", "(root)"];
console.log("\nRESTO DEL TIEMPO");
for (const [k, v] of fns) if (cats.some((c) => k.startsWith(c))) console.log(`  ${ms(v.us)} ms  ${k}`);
for (const c of cats) {
  let sum = 0;
  for (const [k, v] of agg) if (k.startsWith(c)) sum += v.us;
  if (sum > 20000) console.log(`  ${String(ms(sum)).padStart(6)} ms  TOTAL ${c}`);
}

await browser.close();
