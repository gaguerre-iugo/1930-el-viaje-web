// Perfilado del arranque del lector, por fases.
//
// Mide, en un perfil de dispositivo real y con caché fría:
//   - cuándo termina la red, y cuánto pesa cada tipo de recurso
//   - cuándo arranca y termina el runtime empaquetado (base.bundle.*)
//   - cuándo el motor crea la barra de navegación y termina la paginación
//   - cuándo el contenido se hace visible y la barra queda usable
//   - cuánto bloquea el hilo principal, y con qué tareas
//
// Uso:
//   node mobile-boot-profile.mjs
//   node mobile-boot-profile.mjs --url http://127.0.0.1:5599/index.html
//   node mobile-boot-profile.mjs --device pixel7-portrait

import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const URL_TARGET =
  argVal("--url") || "https://gaguerre-iugo.github.io/1930-el-viaje-web/index.html";
const DEVICE = argVal("--device") || "tablet-landscape-1067x480";
/* Perfil de red: --throttle 4g | 3g | wifi-lento (sin esto, sin límite). */
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

// Marcas dentro de la página, desde antes de que corra cualquier script.
await ctx.addInitScript(() => {
  window.__marks = [];
  window.__mark = (name) => window.__marks.push({ t: Math.round(performance.now()), name });

  window.__longTasks = [];
  try {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((e) =>
        window.__longTasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) })
      );
    }).observe({ entryTypes: ["longtask"] });
  } catch (_) {}

  window.__mark("init");

  const ready = () => {
    window.__mark("dom-ready");
    const de = document.documentElement;

    // Visibilidad del contenido
    const content = document.getElementById("content");
    if (content) {
      window.__mark("content encontrado: opacity " + getComputedStyle(content).opacity);
      new MutationObserver(() => {
        const op = getComputedStyle(content).opacity;
        if (parseFloat(op) > 0.5) window.__mark("content visible");
      }).observe(content, { attributes: true, attributeFilter: ["class", "style"] });
    }

    // Indicador de carga
    new MutationObserver(() => {
      if (!document.getElementById("reflow-loading")) window.__mark("indicador de carga retirado");
    }).observe(document.body, { childList: true, subtree: true });

    // Barra de navegación y paginación
    const iv = setInterval(() => {
      const bar = document.getElementById("reflow-pagination");
      if (bar && !window.__barSeen) {
        window.__barSeen = true;
        window.__mark("barra creada");
      }
      if (bar) {
        const cs = getComputedStyle(bar);
        if (!window.__barUsable && parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none") {
          window.__barUsable = true;
          window.__mark("barra usable");
        }
      }
      const total = document.getElementById("reflow-total-pages");
      if (total && !window.__paginated && (parseInt(total.textContent, 10) || 0) > 1) {
        window.__paginated = true;
        window.__mark("paginación terminada (" + total.textContent + " páginas)");
      }
      if (typeof window.__adtReflowSetDockMenu === "function" && !window.__dockSeen) {
        window.__dockSeen = true;
        window.__mark("runtime expone el dock");
      }
      if (window.__barUsable && window.__paginated) clearInterval(iv);
    }, 50);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
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

const data = await page.evaluate(() => {
  const res = performance.getEntriesByType("resource");
  const byType = {};
  let total = 0;
  for (const r of res) {
    const ext = (r.name.split("?")[0].split(".").pop() || "?").toLowerCase();
    const k = /^(jpg|jpeg|png|webp|gif|svg)$/.test(ext)
      ? "imagenes"
      : ext === "html"
      ? "html"
      : ext === "js"
      ? "js"
      : ext === "json"
      ? "json"
      : ext === "css"
      ? "css"
      : /woff2?|ttf/.test(ext)
      ? "fuentes"
      : "otros";
    byType[k] = byType[k] || { n: 0, bytes: 0, lastEnd: 0, firstStart: Infinity };
    byType[k].n++;
    byType[k].bytes += r.transferSize || r.encodedBodySize || 0;
    byType[k].lastEnd = Math.max(byType[k].lastEnd, Math.round(r.responseEnd));
    byType[k].firstStart = Math.min(byType[k].firstStart, Math.round(r.startTime));
    total += r.transferSize || r.encodedBodySize || 0;
  }
  const runtime = res.find((r) => /base\.bundle/.test(r.name));
  const nav = performance.getEntriesByType("navigation")[0];
  const lt = window.__longTasks || [];
  return {
    marks: window.__marks || [],
    byType,
    totalBytes: total,
    recursos: res.length,
    runtime: runtime
      ? {
          name: runtime.name.split("/").pop(),
          start: Math.round(runtime.startTime),
          end: Math.round(runtime.responseEnd),
          bytes: runtime.transferSize || runtime.encodedBodySize,
        }
      : null,
    nav: nav
      ? {
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
          load: Math.round(nav.loadEventEnd),
          domInteractivo: Math.round(nav.domInteractive),
        }
      : null,
    longTasks: {
      n: lt.length,
      total: Math.round(lt.reduce((a, x) => a + x.dur, 0)),
      peores: lt.sort((a, b) => b.dur - a.dur).slice(0, 8),
    },
    nodos: document.querySelectorAll("*").length,
    imagenes: document.querySelectorAll("img").length,
    imagenesSinLazy: Array.from(document.querySelectorAll("img")).filter((i) => i.loading !== "lazy").length,
  };
});

console.log(`objetivo: ${URL_TARGET}`);
console.log(`perfil:   ${DEVICE} (${dev.width}x${dev.height} @${dev.dpr}x)\n`);

console.log("FASES");
for (const m of data.marks) console.log(`  ${String(m.t).padStart(6)} ms  ${m.name}`);
console.log(`\n  (pared medida por el arnés: ${wall} ms · DOMContentLoaded ${data.nav.domContentLoaded} ms · load ${data.nav.load} ms)`);

console.log("\nRED");
console.log(
  `  ${data.recursos} pedidos · ${(data.totalBytes / 1048576).toFixed(2)} MB · ${data.nodos} nodos DOM · ${data.imagenes} imágenes (${data.imagenesSinLazy} sin lazy)`
);
for (const [k, v] of Object.entries(data.byType).sort((a, b) => b[1].bytes - a[1].bytes)) {
  console.log(
    `  ${k.padEnd(10)} ${String(v.n).padStart(4)} pedidos · ${(v.bytes / 1048576).toFixed(2).padStart(6)} MB · termina a los ${v.lastEnd} ms`
  );
}
if (data.runtime) {
  console.log(
    `  runtime     ${data.runtime.name} · empieza ${data.runtime.start} ms · termina ${data.runtime.end} ms (${(data.runtime.bytes / 1024).toFixed(0)} KB)`
  );
}

console.log("\nHILO PRINCIPAL");
console.log(`  ${data.longTasks.n} tareas largas · ${data.longTasks.total} ms de bloqueo acumulado`);
data.longTasks.peores.forEach((t) => console.log(`     ${String(t.start).padStart(6)} ms  +${t.dur} ms`));

await browser.close();
