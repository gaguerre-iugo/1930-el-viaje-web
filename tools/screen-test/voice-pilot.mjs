// Sonda de verificación del piloto de voces (Puck/Zephyr).
// - Levanta el servidor local y abre el lector.
// - Confirma que el selector de narrador expone Puck/Zephyr.
// - Valida por red que cada clip de pg009/pg010 resuelve a la URL exacta que
//   usa el runtime (./content/i18n/es-UY/ + voices/<key>/audio/<id>.mp3?v=...).
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function startServer() {
  const serverPath = path.join(repoRoot, "tools", "serve-local.js");
  for (let attempt = 0; attempt < 5; attempt++) {
    const port = 5710 + attempt;
    const proc = spawn(process.execPath, [serverPath], {
      cwd: repoRoot,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const ok = await new Promise((resolve) => {
      const to = setTimeout(() => resolve(false), 8000);
      proc.stdout.on("data", (d) => {
        if (String(d).includes("Servidor local")) { clearTimeout(to); resolve(true); }
      });
      proc.stderr.on("data", () => {});
      proc.on("exit", () => { clearTimeout(to); resolve(false); });
    });
    if (ok) return { proc, port };
    try { proc.kill(); } catch {}
  }
  throw new Error("no server");
}

const { proc, port } = await startServer();
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const report = { voiceButtons: [], defaultVoice: null, network: {}, missing: [] };

try {
  await page.goto(`${base}/index.html`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#reflow-pagination", { timeout: 20000 });
  await sleep(2500);

  report.defaultVoice = await page.evaluate(() => window.__adtReflowTtsVoice || null);

  // Fuerza la carga del catálogo por voz (como la 1a interacción de lectura).
  await page.evaluate(() => {
    if (typeof window.__adtReflowStartFromSettings === "function") {
      try { window.__adtReflowStartFromSettings(1); } catch {}
    }
  });
  await sleep(500);

  // Validación por red: para cada voz, audios.json + timecodes.json + clips.
  report.network = await page.evaluate(async () => {
    const out = {};
    const runtimeBase = "./content/i18n/es-UY/";
    for (const key of ["puck", "zephyr"]) {
      const root = runtimeBase + "voices/" + key + "/";
      const info = { audiosJson: 0, timecodesJson: 0, clips: {}, ct: {} };
      const aRes = await fetch(root + "audios.json");
      info.audiosJson = aRes.status;
      const tRes = await fetch(root + "timecodes.json");
      info.timecodesJson = tRes.status;
      let audios = {};
      try { audios = await aRes.json(); } catch {}
      info.audioCount = Object.keys(audios).length;
      const sample = ["pg009_n0002", "pg009_n0005", "pg010_n0015"];
      for (const id of sample) {
        const rel = audios[id];
        if (!rel) { info.clips[id] = "no-map"; continue; }
        // URL exacta que arma el runtime para prefijo voices/.
        const url = runtimeBase + rel;
        const r = await fetch(url, { method: "GET" });
        info.clips[id] = r.status;
        info.ct[id] = r.headers.get("content-type");
      }
      out[key] = info;
    }
    return out;
  });

  // Abre el panel de Configuración (ahí se inyecta el selector de narrador).
  const cfg = await page.$('button[aria-label="Configuración"]');
  if (cfg) { try { await cfg.click({ timeout: 2000 }); await sleep(900); } catch {} }
  await sleep(400);
  report.voiceButtons = await page.evaluate(() =>
    Array.prototype.slice.call(document.querySelectorAll('button[data-reflow-tts-voice]'))
      .map((b) => ({ voice: b.getAttribute("data-reflow-tts-voice"), label: (b.textContent || "").trim(), checked: b.getAttribute("aria-checked") }))
  );

  // Timing real por palabra desde el catálogo cargado (karaoke).
  report.timings = await page.evaluate(() => {
    const fn = window.__adtReflowTimingsForItem;
    if (typeof fn !== "function") return { available: false };
    const sample = ["pg009_n0002", "pg009_n0005", "pg010_n0015"];
    const out = { available: true };
    for (const id of sample) {
      const t = fn(id, []);
      out[id] = { words: t.length, first: t[0] || null, last: t[t.length - 1] || null };
    }
    return out;
  });
  await page.screenshot({ path: path.join(__dirname, "voice-pilot.png"), fullPage: false });
} finally {
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  try { proc.kill(); } catch {}
}
