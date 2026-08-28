// Harness de testeo para pantallas interactivas grandes (65", 16:9).
// Levanta el servidor local, recorre páginas y estados clave del lector en
// varios viewports 16:9, y genera screenshots + un reporte de:
//   áreas táctiles, separación, contraste, overflow, zona segura y QR.
//
// Uso:
//   node tools/screen-test/run.mjs            (todos los viewports)
//   node tools/screen-test/run.mjs --viewport fhd-1920x1080-dpr1
//   node tools/screen-test/run.mjs --pages 4  (limita el muestreo de páginas)

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import {
  SERVER,
  VIEWPORTS,
  USER_AGENT,
  PHYSICAL,
  THRESHOLDS,
  PAGE_SAMPLE_FRACTIONS,
} from "./config.mjs";
import { auditPage } from "./audits.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const outDir = path.join(__dirname, "report");

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const onlyViewport = argVal("--viewport");
const maxPages = argVal("--pages") ? Number(argVal("--pages")) : Infinity;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function startServer() {
  const serverPath = path.join(repoRoot, "tools", "serve-local.js");
  let lastErr = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const port = SERVER.port + attempt;
    const proc = spawn(process.execPath, [serverPath], {
      cwd: repoRoot,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const started = await new Promise((resolve) => {
      const to = setTimeout(() => resolve(false), 8000);
      proc.stdout.on("data", (d) => {
        if (String(d).includes("Servidor local")) {
          clearTimeout(to);
          resolve(true);
        }
      });
      proc.stderr.on("data", (d) => {
        lastErr = String(d);
        if (/EADDRINUSE|address already in use/i.test(lastErr)) {
          clearTimeout(to);
          resolve(false);
        }
      });
      proc.on("error", (e) => {
        lastErr = String(e);
        clearTimeout(to);
        resolve(false);
      });
    });
    if (started) {
      SERVER.port = port;
      return proc;
    }
    proc.kill();
    console.warn(`  puerto ${port} no disponible, probando el siguiente...`);
  }
  throw new Error(`No se pudo iniciar el servidor. Último error: ${lastErr}`);
}

async function waitForReader(page) {
  await page.waitForSelector("#reflow-pagination", { timeout: 20000 });
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector("#reflow-pagination");
        return p && !p.classList.contains("reflow-primary-toolbar-pending");
      },
      { timeout: 20000 }
    )
    .catch(() => {});
  await sleep(600);
}

const readTotal = (page) =>
  page.evaluate(() => {
    const el = document.querySelector("#reflow-total-pages");
    return el ? parseInt(el.textContent, 10) || 1 : 1;
  });
const readIndex = (page) =>
  page.evaluate(() => {
    const el = document.querySelector("#reflow-current-page");
    return el ? (parseInt(el.textContent, 10) || 1) - 1 : 0;
  });

// Salto directo a una página (índice 0-based): abre el Índice, activa la
// pestaña "Páginas" y pulsa el botón de la página, que llama a goToPage()
// directamente (O(1) en vez de recorrer página por página). Devuelve true si
// aterrizó exactamente.
async function jumpTo(page, target) {
  try {
    await page.evaluate(() => {
      const b = document.querySelector("#reflow-index");
      if (b && b.getAttribute("aria-expanded") !== "true") b.click();
    });
    await page.waitForTimeout(150);
    // Activar la pestaña "Páginas" si existe.
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('[role="tab"]')).find((t) =>
        /p[aá]ginas/i.test(t.textContent || "")
      );
      if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
    });
    await page.waitForTimeout(150);
    const clicked = await page.evaluate((idx) => {
      const btn = document.querySelector(`button[data-reflow-page-index="${idx}"]`);
      if (!btn) return false;
      btn.click();
      return true;
    }, target);
    if (!clicked) {
      await page.keyboard.press("Escape").catch(() => {});
      return await goToIndex(page, target);
    }
    await page.waitForFunction(
      (t) => {
        const el = document.querySelector("#reflow-current-page");
        return el && (parseInt(el.textContent, 10) || 1) - 1 === t;
      },
      target,
      { timeout: 4000 }
    ).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(120);
    return (await readIndex(page)) === target;
  } catch {
    return await goToIndex(page, target);
  }
}

// Navega hacia una página (índice 0-based) paso a paso. Todo el bucle corre
// página (un solo round-trip) para evitar el coste de múltiples evaluate por
// paso. Tolera saltos aceptando la posición más cercana en lugar de oscilar.
async function goToIndex(page, target) {
  return page.evaluate(async (target) => {
    const idx = () => {
      const el = document.querySelector("#reflow-current-page");
      return el ? (parseInt(el.textContent, 10) || 1) - 1 : 0;
    };
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let prev = null;
    let guard = 0;
    while (guard++ < 400) {
      const cur = idx();
      if (cur === target) return true;
      if (prev !== null && Math.sign(prev - target) !== Math.sign(cur - target)) return false;
      const b = document.querySelector(cur < target ? "#reflow-next" : "#reflow-previous");
      if (!b) return false;
      b.click();
      await wait(70);
      if (idx() === cur) return false; // no avanzó
      prev = cur;
    }
    return idx() === target;
  }, target);
}

async function capture(page, vp, name) {
  const file = `${vp.name}__${name}.png`;
  await page.screenshot({ path: path.join(outDir, file), fullPage: false }).catch(() => {});
  const audit = await page.evaluate(auditPage, {
    thresholds: THRESHOLDS,
    physical: PHYSICAL,
  });
  return { name, screenshot: file, audit };
}

async function openPanelStates(page, vp) {
  const states = [];

  // Índice
  try {
    await page.click("#reflow-index");
    await page.waitForTimeout(500);
    states.push(await capture(page, vp, "panel-index"));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  } catch {}

  // Herramientas
  try {
    await page.click("#reflow-tools");
    await page.waitForTimeout(500);
    states.push(await capture(page, vp, "panel-tools"));

    // Glosario (desde Herramientas)
    try {
      const g = await page.waitForSelector("#reflow-open-glossary", { timeout: 2000 });
      await g.click();
      await page.waitForTimeout(500);
      states.push(await capture(page, vp, "panel-glossary"));
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    } catch {}

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  } catch {}

  // Reproductor TTS (activar lectura en voz alta si hay control disponible)
  try {
    await page.click("#reflow-tools");
    await page.waitForTimeout(400);
    const toggle = await page.$(
      'button[aria-label*="lectura en voz alta"]'
    );
    if (toggle) {
      await toggle.click();
      await page.waitForTimeout(500);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      const player = await page.$("#reflow-tts-player");
      const visible = player ? await player.isVisible() : false;
      if (visible) states.push(await capture(page, vp, "panel-tts"));
    } else {
      await page.keyboard.press("Escape");
    }
  } catch {}

  return states;
}

async function runViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    hasTouch: true,
    isMobile: false,
    userAgent: USER_AGENT,
    locale: "es-UY",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  const url = `http://${SERVER.host}:${SERVER.port}/index.html`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await waitForReader(page);

  const total = await readTotal(page);
  const targets = [
    ...new Set(
      PAGE_SAMPLE_FRACTIONS.map((f) => Math.round(f * (total - 1))).filter(
        (n) => n >= 0 && n < total
      )
    ),
  ]
    .sort((a, b) => a - b)
    .slice(0, maxPages === Infinity ? undefined : maxPages);

  const pages = [];
  for (const idx of targets) {
    const ok = await jumpTo(page, idx);
    const current = await readIndex(page);
    const shot = await capture(page, vp, `page-${String(current + 1).padStart(3, "0")}`);
    shot.targetIndex = idx;
    shot.currentPage = current + 1;
    shot.exact = ok;
    pages.push(shot);
  }

  // Volver al inicio para capturar estados de panel en un contexto estable.
  await jumpTo(page, 0);
  const panels = await openPanelStates(page, vp);

  await context.close();

  return { viewport: vp, total, pages, panels, consoleErrors };
}

function summarize(result) {
  const all = [...result.pages, ...result.panels];
  const acc = {
    touchFailCss: 0,
    touchFailMm: 0,
    spacingFail: 0,
    contrastFail: 0,
    bleeding: 0,
    safeZone: 0,
    overflow: 0,
    qrFail: 0,
  };
  for (const s of all) {
    const c = s.audit.counts;
    acc.touchFailCss += c.touchFailCss;
    acc.touchFailMm += c.touchFailMm;
    acc.spacingFail += c.spacingFail;
    acc.contrastFail += c.contrastFail;
    acc.bleeding += c.bleeding;
    acc.safeZone += c.safeZone;
    acc.qrFail += c.qrFail;
    if (s.audit.horizontalOverflow > 2) acc.overflow += 1;
  }
  return acc;
}

function renderHtml(results) {
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const sections = results
    .map((r) => {
      const sum = summarize(r);
      const rows = [...r.pages, ...r.panels]
        .map((s) => {
          const c = s.audit.counts;
          const g = s.audit.geometry;
          return `<tr>
            <td>${esc(s.name)}</td>
            <td><a href="${esc(s.screenshot)}" target="_blank">ver</a></td>
            <td>${c.interactives}</td>
            <td class="${c.touchFailCss ? "bad" : "ok"}">${c.touchFailCss}</td>
            <td class="${c.touchFailMm ? "bad" : "ok"}">${c.touchFailMm}</td>
            <td class="${c.spacingFail ? "bad" : "ok"}">${c.spacingFail}</td>
            <td class="${c.contrastFail ? "bad" : "ok"}">${c.contrastFail}</td>
            <td class="${s.audit.horizontalOverflow > 2 ? "bad" : "ok"}">${s.audit.horizontalOverflow}</td>
            <td class="${c.safeZone ? "warn" : "ok"}">${c.safeZone}</td>
            <td>${c.qr}${c.qrFail ? ` (${c.qrFail}✗)` : ""}</td>
            <td>${g.mmPerCssPx} mm/px</td>
          </tr>`;
        })
        .join("\n");
      return `<section>
        <h2>${esc(r.viewport.name)} — ${r.viewport.width}×${r.viewport.height} @${r.viewport.dpr}x · ${r.total} páginas</h2>
        <p class="sum">Áreas táctiles &lt;44px: <b>${sum.touchFailCss}</b> · &lt;${THRESHOLDS.touchTargetMinMm}mm: <b>${sum.touchFailMm}</b> · separación baja: <b>${sum.spacingFail}</b> · contraste bajo: <b>${sum.contrastFail}</b> · overflow: <b>${sum.overflow}</b> · zona segura: <b>${sum.safeZone}</b> · QR fuera de umbral: <b>${sum.qrFail}</b></p>
        <table>
          <thead><tr><th>Vista</th><th>Shot</th><th>Interact.</th><th>Táctil&lt;44px</th><th>Táctil&lt;mm</th><th>Separac.</th><th>Contraste</th><th>Overflow px</th><th>Zona seg.</th><th>QR</th><th>Densidad</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${r.consoleErrors.length ? `<details><summary>Errores de consola (${r.consoleErrors.length})</summary><pre>${esc(r.consoleErrors.slice(0, 20).join("\n"))}</pre></details>` : ""}
      </section>`;
    })
    .join("\n");

  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Reporte pantalla interactiva 65"</title>
<style>
  body{font:15px/1.5 system-ui,sans-serif;margin:2rem;color:#111}
  h1{margin-bottom:.2rem}
  section{margin:2rem 0;border-top:2px solid #ddd;padding-top:1rem}
  table{border-collapse:collapse;width:100%;font-size:13px}
  th,td{border:1px solid #ccc;padding:.35rem .5rem;text-align:center}
  th{background:#f3f4f6}
  td:first-child{text-align:left}
  .bad{background:#fdecec;color:#a00;font-weight:700}
  .warn{background:#fff6e5;color:#8a5b00}
  .ok{color:#0a0}
  .sum{background:#f8fafc;padding:.5rem .75rem;border-radius:.5rem}
  pre{background:#0b1020;color:#e5e7eb;padding:.75rem;overflow:auto;font-size:12px}
</style></head><body>
<h1>Testeo en pantalla interactiva de 65" (16:9)</h1>
<p>Generado ${new Date().toISOString()} · umbrales: táctil ≥ ${THRESHOLDS.touchTargetMinCssPx}px CSS / ${THRESHOLDS.touchTargetMinMm}mm físicos · contraste normal ≥ ${THRESHOLDS.contrastNormalText} · zona segura ${THRESHOLDS.safeZonePx}px.</p>
${sections}
</body></html>`;
}

async function main() {
  console.log(`Iniciando servidor local (puerto ${SERVER.port})...`);
  const server = await startServer();
  console.log(`Servidor en http://${SERVER.host}:${SERVER.port}/`);

  // Solo se limpia el reporte una vez que el servidor arrancó bien, para no
  // destruir resultados previos ante un fallo de arranque.
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
    const viewports = onlyViewport
      ? VIEWPORTS.filter((v) => v.name === onlyViewport)
      : VIEWPORTS;
    if (!viewports.length) throw new Error(`Viewport desconocido: ${onlyViewport}`);

    const results = [];
    for (const vp of viewports) {
      console.log(`\n▶ Viewport ${vp.name} (${vp.width}×${vp.height} @${vp.dpr}x)...`);
      const r = await runViewport(browser, vp);
      const sum = summarize(r);
      console.log(
        `  táctil<44px=${sum.touchFailCss} táctil<mm=${sum.touchFailMm} separación=${sum.spacingFail} contraste=${sum.contrastFail} overflow=${sum.overflow} zonaSegura=${sum.safeZone} qrFail=${sum.qrFail}`
      );
      results.push(r);
    }

    await fs.writeFile(
      path.join(outDir, "summary.json"),
      JSON.stringify(results, null, 2)
    );
    await fs.writeFile(path.join(outDir, "index.html"), renderHtml(results));
    console.log(`\n✔ Reporte: ${path.join(outDir, "index.html")}`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
