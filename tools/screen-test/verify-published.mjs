import crypto from "node:crypto";
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = "https://gaguerre-iugo.github.io/1930-el-viaje-web/";
const files = [
  "index.html",
  "content/reflow.css",
  "content/viewport-layout.css",
  "content/tailwind_output.css",
  "assets/reflow-book.js",
  "assets/quiz-sequence.js",
  "content/pages.json",
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: "load" });
const remote = await page.evaluate(async (list) => {
  const out = {};
  for (const f of list) {
    const res = await fetch(f, { cache: "no-store" });
    const text = await res.text();
    out[f] = { status: res.status, len: text.length };
    // hash en el navegador para no depender del transporte. Los .json se
    // comparan como JSON canónico: GitHub Pages los sirve minificados.
    const canonical = f.endsWith(".json")
      ? JSON.stringify(JSON.parse(text))
      : text.replace(/\r\n/g, "\n");
    const buf = new TextEncoder().encode(canonical);
    const digest = await crypto.subtle.digest("SHA-256", buf);
    out[f].sha = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return out;
}, files);
await browser.close();

console.log("archivo".padEnd(30), "estado", "tamaño remoto", "¿igual al local?");
for (const f of files) {
  const localPath = "..\\..\\" + f.replace(/\//g, "\\");
  let localSha = null;
  let localLen = null;
  try {
    const buf = fs.readFileSync(localPath);
    // Git en Windows puede tener los archivos con CRLF aunque el repositorio
    // guarde LF: normalizamos antes de comparar.
    let norm = Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
    // GitHub Pages sirve los .json minificados: comparamos el JSON canónico,
    // no los bytes (el formato no cambia el comportamiento del lector).
    if (f.endsWith(".json")) {
      norm = Buffer.from(JSON.stringify(JSON.parse(norm.toString("utf8"))), "utf8");
    }
    localLen = norm.length;
    localSha = crypto.createHash("sha256").update(norm).digest("hex");
  } catch (e) {
    localSha = "no existe";
  }
  const r = remote[f];
  const same = localSha === r.sha ? "SÍ" : "NO";
  console.log(
    f.padEnd(30),
    String(r.status).padEnd(6),
    String(r.len).padEnd(14),
    same,
    same === "NO" ? `(local ${localLen} bytes)` : ""
  );
}
