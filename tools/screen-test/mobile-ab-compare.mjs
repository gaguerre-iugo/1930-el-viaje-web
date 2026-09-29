// Compara el arranque ANTES y DESPUÉS de una optimización, con varias corridas
// por lado y los mismos ajustes de emulación.
//
//   node mobile-ab-compare.mjs --a http://127.0.0.1:5601/index.html --b http://127.0.0.1:5599/index.html --runs 3

import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const A = argVal("--a");
const B = argVal("--b");
const RUNS = Number(argVal("--runs") || 3);
const DEVICE = argVal("--device") || "tablet-landscape-1067x480";
/* Perfil de red opcional, para reproducir un teléfono con datos móviles:
   --throttle 4g  (4 Mbps de bajada, 100 ms de latencia)
   sin --throttle: red local sin límite. */
const THROTTLE = argVal("--throttle") || "";
const REDES = {
  "4g": { latency: 100, down: 4 * 1024 * 1024, up: 1 * 1024 * 1024 },
  "3g": { latency: 300, down: 1.6 * 1024 * 1024, up: 750 * 1024 },
  "wifi-lento": { latency: 40, down: 10 * 1024 * 1024, up: 5 * 1024 * 1024 },
};
if (!A || !B) {
  console.error("Hacen falta --a y --b");
  process.exit(1);
}

const DEVICES = {
  "pixel7-portrait": { width: 412, height: 859, dpr: 2.625, ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36" },
  "tablet-landscape-1067x480": { width: 1067, height: 480, dpr: 1.5, ua: "Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36" },
};
const dev = DEVICES[DEVICE];

const browser = await chromium.launch();

async function medir(url) {
  const ctx = await browser.newContext({
    viewport: { width: dev.width, height: dev.height },
    deviceScaleFactor: dev.dpr,
    isMobile: true,
    hasTouch: true,
    userAgent: dev.ua,
    locale: "es-UY",
  });
  const page = await ctx.newPage();
  if (THROTTLE && REDES[THROTTLE]) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: REDES[THROTTLE].latency,
      downloadThroughput: REDES[THROTTLE].down / 8,
      uploadThroughput: REDES[THROTTLE].up / 8,
    });
  }
  await ctx.addInitScript(() => {
    window.__lt = [];
    try {
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push({ s: Math.round(e.startTime), d: Math.round(e.duration) }))).observe({ entryTypes: ["longtask"] });
    } catch (_) {}
    window.__m = {};
    const ready = () => {
      const iv = setInterval(() => {
        const bar = document.getElementById("reflow-pagination");
        if (bar) {
          const cs = getComputedStyle(bar);
          if (!window.__m.bar && parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none") window.__m.bar = Math.round(performance.now());
        }
        const t = document.getElementById("reflow-total-pages");
        if (t && !window.__m.pag && (parseInt(t.textContent, 10) || 0) > 1) window.__m.pag = Math.round(performance.now());
        const c = document.getElementById("content");
        if (c && !window.__m.vis && parseFloat(getComputedStyle(c).opacity) > 0.5) window.__m.vis = Math.round(performance.now());
        if (window.__m.bar && window.__m.pag) clearInterval(iv);
      }, 50);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
    else ready();
  });
  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  await page.waitForFunction(() => {
    const t = document.getElementById("reflow-total-pages");
    return t && (parseInt(t.textContent, 10) || 0) > 1;
  }, { timeout: 60000 }).catch(() => {});
  await page.waitForFunction(() => {
    const b = document.getElementById("reflow-pagination");
    if (!b) return false;
    const cs = getComputedStyle(b);
    return parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none";
  }, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const out = await page.evaluate(() => {
    const lt = window.__lt || [];
    return {
      ...window.__m,
      bloqueo: Math.round(lt.reduce((a, x) => a + x.d, 0)),
      tareasLargas: lt.length,
      peor: lt.length ? Math.max(...lt.map((x) => x.d)) : 0,
      paginas: parseInt(document.getElementById("reflow-total-pages").textContent, 10),
    };
  });
  await ctx.close();
  return out;
}

const mediana = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2);
};

async function serie(label, url) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`  ${label} corrida ${i + 1}/${RUNS}... `);
    const r = await medir(url);
    console.log(`bloqueo ${r.bloqueo} ms · barra ${r.bar} ms`);
    runs.push(r);
  }
  return {
    label,
    bloqueo: mediana(runs.map((r) => r.bloqueo)),
    tareasLargas: mediana(runs.map((r) => r.tareasLargas)),
    peor: mediana(runs.map((r) => r.peor)),
    pag: mediana(runs.map((r) => r.pag)),
    bar: mediana(runs.map((r) => r.bar)),
    vis: mediana(runs.map((r) => r.vis)),
    paginas: runs[0].paginas,
  };
}

console.log(`A (antes): ${A}`);
console.log(`B (después): ${B}`);
console.log(`red: ${THROTTLE || "sin límite (local)"}\n`);
const a = await serie("A", A);
const b = await serie("B", B);

const fila = (t, x, y, unidad = "ms") => {
  const d = x ? Math.round(((y - x) / x) * 100) : 0;
  const flecha = d < 0 ? `${d}%` : `+${d}%`;
  console.log(`  ${t.padEnd(26)} ${String(x + " " + unidad).padStart(12)} → ${String(y + " " + unidad).padStart(12)}   ${flecha}`);
};
console.log("\nMEDIANAS");
fila("Bloqueo del hilo principal", a.bloqueo, b.bloqueo);
fila("Tareas largas", a.tareasLargas, b.tareasLargas, "");
fila("Peor tarea", a.peor, b.peor);
fila("Paginación terminada", a.pag, b.pag);
fila("Barra usable", a.bar, b.bar);
fila("Contenido visible", a.vis, b.vis);
console.log(`  páginas: antes ${a.paginas} · después ${b.paginas} ${a.paginas === b.paginas ? "(igual)" : "⚠ CAMBIÓ"}`);

await browser.close();
