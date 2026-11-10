#!/usr/bin/env node
/**
 * Pre-renderiza el libro a imágenes por página y genera un visor kiosco.
 * No modifica el libro: sirve la copia y escribe en 1930-kiosk/pages.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const book = path.resolve(process.argv[2] || '.');
const out = path.resolve(process.argv[3] || 'C:/Users/germa/DeepSeek Bot/1930-kiosk');
const W = 1920, H = 1080;
const { chromium } = require('C:/Users/germa/Desktop/1930-el-viaje-web-export-v48-full-book/tools/screen-test/node_modules/playwright');

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  let abs = path.resolve(book, '.' + p);
  if (!abs.startsWith(book)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) abs = path.join(abs, 'index.html');
  if (!fs.existsSync(abs)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(abs).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(base + '/index.html', { waitUntil: 'load', timeout: 180000 }).catch(() => {});
await page.waitForFunction(() => {
  const c = document.querySelector('#content');
  const b = document.querySelector('#reflow-pagination');
  return c && b && getComputedStyle(c).opacity !== '0';
}, { timeout: 180000 }).catch(() => {});
await page.waitForTimeout(6000);
await page.evaluate(() => {
  ['#reflow-pagination', '#reflow-tts-player', '#reflow-loading', '.reflow-skip-link', '#interface-container', '#nav-container'].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => { el.style.display = 'none'; });
  });
});
await page.waitForTimeout(500);

const info = await page.evaluate(() => {
  const c = document.getElementById('content');
  const r = c.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height, pageWidth: c.clientWidth, total: Math.max(1, Math.round(c.scrollWidth / c.clientWidth)) };
});
fs.mkdirSync(path.join(out, 'pages'), { recursive: true });
for (const f of fs.readdirSync(path.join(out, 'pages'))) fs.unlinkSync(path.join(out, 'pages', f));

const total = info.total;
console.log(`total de paginas: ${total} (pageWidth ${info.pageWidth}, content ${Math.round(info.width)}x${Math.round(info.height)})`);
const clip = { x: Math.max(0, Math.round(info.left)), y: Math.max(0, Math.round(info.top)), width: Math.min(W, Math.round(info.width)), height: Math.min(H, Math.round(info.height)) };
const names = [];
let lastScroll = -1;
for (let i = 0; i < total; i += 1) {
  const name = String(i + 1).padStart(3, '0') + '.png';
  await page.screenshot({ path: path.join(out, 'pages', name), clip });
  names.push('pages/' + name);
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${total}`);
  if (i < total - 1) {
    const before = await page.evaluate(() => document.getElementById('content').scrollLeft);
    await page.evaluate(() => { const b = document.getElementById('reflow-next'); if (b) b.click(); });
    await page.waitForFunction((prev) => {
      const c = document.getElementById('content');
      return Math.abs(c.scrollLeft - prev) > 10;
    }, before, { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(160);
    const after = await page.evaluate(() => document.getElementById('content').scrollLeft);
    if (Math.abs(after - before) <= 10) {
      console.log(`  avance detenido en la pagina ${i + 1}`);
      break;
    }
    lastScroll = after;
  }
}

const html = `<!DOCTYPE html>
<html lang="es-UY"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>1930: El viaje — kiosco</title>
<style>
html,body{margin:0;height:100%;background:#000;overflow:hidden}
#stage{position:absolute;inset:0 0 64px;display:flex;align-items:center;justify-content:center}
#page{max-width:100%;max-height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none}
#bar{position:fixed;left:0;right:0;bottom:0;height:64px;display:flex;gap:1rem;align-items:center;justify-content:center;background:#111;color:#fff;font-family:system-ui,sans-serif;font-size:16px}
button{font-size:24px;width:64px;height:44px;border-radius:8px;border:0;background:#00635d;color:#fff}
button:disabled{opacity:.35}
#count{min-width:180px;text-align:center}
</style></head><body>
<div id="stage"><img id="page" alt="Página del libro"></div>
<div id="bar"><button id="prev" aria-label="Página anterior">‹</button><span id="count"></span><button id="next" aria-label="Página siguiente">›</button></div>
<script>
const pages = ${JSON.stringify(names)};
let i = 0;
const img = document.getElementById('page'), count = document.getElementById('count');
function show(n){
  i = Math.max(0, Math.min(pages.length - 1, n));
  img.src = pages[i];
  count.textContent = 'Página ' + (i + 1) + ' de ' + pages.length;
  document.getElementById('prev').disabled = i === 0;
  document.getElementById('next').disabled = i === pages.length - 1;
  document.title = '1930: El viaje — ' + (i + 1) + '/' + pages.length;
  if (pages[i + 1]) { const pre = new Image(); pre.src = pages[i + 1]; }
}
document.getElementById('prev').onclick = () => show(i - 1);
document.getElementById('next').onclick = () => show(i + 1);
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); show(i + 1); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); show(i - 1); }
});
const start = Math.max(0, Math.min(pages.length - 1, (Number(new URLSearchParams(location.search).get('p')) || 1) - 1));
show(start);
</script></body></html>`;
fs.writeFileSync(path.join(out, 'kiosk.html'), html, 'utf8');
fs.writeFileSync(path.join(out, 'kiosk-pages.json'), JSON.stringify({ total, width: W, height: H, pages: names }, null, 2), 'utf8');
console.log(`visor: ${path.join(out, 'kiosk.html')}`);

await browser.close();
server.close();
