import { chromium } from "playwright";

const UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36";

const URL_TARGET =
  process.argv[2] || "https://gaguerre-iugo.github.io/1930-el-viaje-web/index.html";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 412, height: 859 },
  deviceScaleFactor: 2.625,
  hasTouch: true,
  userAgent: UA,
  locale: "es-UY",
});
const page = await ctx.newPage();
const events = [];
page.on("console", (m) => events.push({ t: Date.now(), kind: "console." + m.type(), text: m.text().slice(0, 90) }));
page.on("pageerror", (e) => events.push({ t: Date.now(), kind: "pageerror", text: String(e.message).slice(0, 90) }));

const t0 = Date.now();
await page.goto(URL_TARGET, { waitUntil: "load", timeout: 60000 });

// Instrumentación dentro de la página: cuándo aparece cada pieza clave.
await page.evaluate(() => {
  window.__marks = [];
  const mark = (name, extra) => window.__marks.push({ t: Math.round(performance.now()), name, extra: extra || null });
  window.__mark = mark;

  const has = (fn) => {
    try {
      return fn();
    } catch (_) {
      return null;
    }
  };
  const labels = () =>
    Array.from(document.querySelectorAll("button"))
      .map((b) => b.getAttribute("aria-label"))
      .filter(Boolean);

  let last = {};
  const poll = () => {
    const state = {
      setDockMenu: typeof window.__adtReflowSetDockMenu === "function",
      getDockMenu: typeof window.__adtReflowGetDockMenu === "function",
      dockButtons: labels().filter((l) => /Menú principal|Main Menu|Configuración|Settings|Glosario|Glossary/i.test(l)).length,
      bar: !!document.querySelector("#reflow-pagination"),
      barPending: /pending/.test(String(document.querySelector("#reflow-pagination")?.className || "")),
      barOpacity: document.querySelector("#reflow-pagination")
        ? getComputedStyle(document.querySelector("#reflow-pagination")).opacity
        : null,
      contentOpacity: document.querySelector("#content")
        ? getComputedStyle(document.querySelector("#content")).opacity
        : null,
      totalPages: document.querySelector("#reflow-total-pages")?.textContent || null,
      bodyHidden: document.body.classList.contains("hidden"),
    };
    for (const k of Object.keys(state)) {
      if (last[k] !== state[k]) {
        mark(k, String(state[k]));
        last[k] = state[k];
      }
    }
  };
  poll();
  window.__pollTimer = setInterval(poll, 100);
});

// Esperar hasta 45 s a que la barra sea visible.
const deadline = Date.now() + 45000;
let visibleAt = null;
while (Date.now() < deadline) {
  const v = await page.evaluate(() => {
    const bar = document.querySelector("#reflow-pagination");
    if (!bar) return false;
    const cs = getComputedStyle(bar);
    return parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none";
  });
  if (v) {
    visibleAt = ((Date.now() - t0) / 1000).toFixed(1);
    break;
  }
  await page.waitForTimeout(200);
}

const result = await page.evaluate(() => {
  clearInterval(window.__pollTimer);
  const res = performance.getEntriesByType("resource");
  return {
    marks: window.__marks,
    lastResources: res
      .map((r) => ({ name: r.name.split("/").pop().slice(0, 60), end: Math.round(r.responseEnd), size: r.transferSize }))
      .sort((a, b) => b.end - a.end)
      .slice(0, 12),
    navigation: (function () {
      const n = performance.getEntriesByType("navigation")[0];
      return n
        ? {
            domContentLoaded: Math.round(n.domContentLoadedEventEnd),
            load: Math.round(n.loadEventEnd),
            duration: Math.round(n.duration),
          }
        : null;
    })(),
  };
});

console.log(`objetivo: ${URL_TARGET}`);
console.log(`barra navegable visible a los: ${visibleAt === null ? ">45 s (NUNCA)" : visibleAt + " s"}`);
console.log("\n-- hitos dentro de la página (ms desde el inicio de la navegación) --");
result.marks.forEach((m) => console.log(`   ${String(m.t).padStart(6)} ms  ${m.name.padEnd(16)} ${m.extra || ""}`));
console.log("\n-- navegación --");
console.log("   " + JSON.stringify(result.navigation));
console.log("\n-- últimos recursos en terminar --");
result.lastResources.forEach((r) => console.log(`   ${String(r.end).padStart(6)} ms  ${String(r.size).padStart(8)} B  ${r.name}`));
console.log("\n-- consola --");
events.slice(0, 25).forEach((e) => console.log(`   [+${((e.t - t0) / 1000).toFixed(1)}s] ${e.kind}: ${e.text}`));

await browser.close();
