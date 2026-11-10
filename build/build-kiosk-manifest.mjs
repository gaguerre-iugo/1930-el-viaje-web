#!/usr/bin/env node
/**
 * Genera el manifiesto del kiosco: por página visual, sección y audios.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const book = path.resolve(process.argv[2] || '.');
const out = path.resolve(process.argv[3] || 'C:/Users/germa/DeepSeek Bot/1930-kiosk');
const VOICE = 'valentina';
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

const audios = await fetch(`${base}/content/i18n/es-UY/voices/${VOICE}/audios.json`).then(r => r.json());
const toc = await fetch(`${base}/content/toc.json`).then(r => r.json()).catch(() => []);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(base + '/index.html', { waitUntil: 'load', timeout: 180000 }).catch(() => {});
await page.waitForFunction(() => {
  const c = document.querySelector('#content');
  const b = document.querySelector('#reflow-pagination');
  return c && b && getComputedStyle(c).opacity !== '0';
}, { timeout: 180000 }).catch(() => {});
await page.waitForTimeout(6000);
await page.evaluate(() => {
  ['#reflow-pagination', '#reflow-tts-player', '#reflow-loading', '#interface-container', '#nav-container'].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => { el.style.display = 'none'; });
  });
});
const info = await page.evaluate(() => {
  const c = document.getElementById('content');
  return { total: Math.max(1, Math.round(c.scrollWidth / c.clientWidth)) };
});
const pages = [];
for (let i = 0; i < info.total; i += 1) {
  const data = await page.evaluate((audioMap) => {
    const c = document.getElementById('content');
    const cr = c.getBoundingClientRect();
    let sectionId = null;
    const ids = [];
    c.querySelectorAll('[data-id]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.bottom < cr.top || r.top > cr.bottom || r.right < cr.left || r.left > cr.right) return;
      if (!sectionId) {
        const sec = el.closest ? el.closest('section[data-section-id]') : null;
        if (sec) sectionId = sec.getAttribute('data-section-id');
      }
      const id = el.getAttribute('data-id');
      if (id && audioMap[id] && ids.indexOf(id) < 0) ids.push(id);
    });
    return { sectionId, ids };
  }, audios);
  pages.push({
    img: 'pages/' + String(i + 1).padStart(3, '0') + '.png',
    sectionId: data.sectionId,
    audio: data.ids.map((id) => `content/i18n/es-UY/${audios[id]}`),
  });
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${info.total}`);
  if (i < info.total - 1) {
    const before = await page.evaluate(() => document.getElementById('content').scrollLeft);
    await page.evaluate(() => { const b = document.getElementById('reflow-next'); if (b) b.click(); });
    await page.waitForFunction((prev) => Math.abs(document.getElementById('content').scrollLeft - prev) > 10, before, { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(120);
  }
}

const firstPageFor = {};
pages.forEach((p, i) => { if (p.sectionId && firstPageFor[p.sectionId] === undefined) firstPageFor[p.sectionId] = i + 1; });
const index = (Array.isArray(toc) ? toc : []).map((t) => ({
  title: t.title || '',
  level: Number(t.level) || 1,
  page: firstPageFor[t.section_id] || null,
}));
fs.writeFileSync(path.join(out, 'kiosk-manifest.json'), JSON.stringify({ voice: VOICE, total: pages.length, pages, index }, null, 2), 'utf8');
console.log(`manifest: ${pages.length} paginas · ${index.filter(x => x.page).length}/${index.length} entradas del indice`);
await browser.close();
server.close();
