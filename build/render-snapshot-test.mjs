#!/usr/bin/env node
/**
 * Prueba de tres paginas: extrae el contenido de una pagina visual como HTML
 * en dos variantes (posicionado y flujo) para medir en el dispositivo.
 * No modifica el libro: sirve la copia y escribe en <out>/medicion.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const book = path.resolve(process.argv[2] || '.');
const out = path.resolve(process.argv[3] || 'C:/Users/germa/DeepSeek Bot/1930-kiosk');
const TARGETS = (process.argv[4] || '9,13,29').split(',').map(Number).filter(Boolean);
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
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`${base}/index.html`, { waitUntil: 'load', timeout: 180000 }).catch(() => {});
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
const total = info.total;
const origin = { left: Math.round(info.left), top: Math.round(info.top) };
console.log(`total ${total} | area ${Math.round(info.width)}x${Math.round(info.height)} | origen ${origin.left},${origin.top}`);

fs.mkdirSync(path.join(out, 'medicion'), { recursive: true });

const manifest = JSON.parse(fs.readFileSync(path.join(out, 'kiosk-manifest.json'), 'utf8'));

// posiciona la pagina navegando de a una y verificando el scroll real (no acumula ciegos)
async function setPage(n) {
  const goal = n - 1;
  const leer = () => page.evaluate(() => {
    const c = document.getElementById('content');
    return Math.round(c.scrollLeft / c.clientWidth);
  });
  let guard = 0;
  while (guard < 400) {
    const cur = await leer();
    if (cur === goal) break;
    const sel = cur < goal ? '#reflow-next' : '#reflow-previous';
    await page.evaluate((s) => { const b = document.querySelector(s); if (b) b.click(); }, sel);
    await page.waitForTimeout(170);
    guard += 1;
  }
  await page.waitForTimeout(450);
  const estado = await page.evaluate(() => {
    const c = document.getElementById('content');
    const idx = Math.round(c.scrollLeft / c.clientWidth);
    const cr = c.getBoundingClientRect();
    const punto = document.elementFromPoint(cr.left + cr.width / 2, cr.top + cr.height / 2);
    const sec = punto && punto.closest ? punto.closest('section[data-section-id]') : null;
    return { idx: idx + 1, sectionId: sec ? sec.getAttribute('data-section-id') : null };
  });
  const esperado = manifest.pages[n - 1] ? manifest.pages[n - 1].sectionId : null;
  const ok = estado.idx === n && (!esperado || !estado.sectionId || esperado === estado.sectionId);
  console.log(`  pagina ${n}: scroll=${estado.idx} visible=${estado.sectionId} manifiesto=${esperado} ${ok ? 'OK' : 'REVISAR'}`);
  return { ...estado, esperado, ok };
}

const EXTRACT = (esperada) => {
  const c = document.getElementById('content');
  const cr = c.getBoundingClientRect();
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);
  const marca = new Set();
  const bloques = [];

  const dentro = (r) => !(r.right <= cr.left + 1 || r.left >= cr.right - 1 || r.bottom <= cr.top + 1 || r.top >= cr.bottom - 1);

  const cand = c.querySelectorAll('p,h1,h2,h3,h4,h5,li,label,blockquote,figcaption,img,svg,table,dt,dd');
  cand.forEach((el) => {
    if (skip.has(el.tagName)) return;
    // saltear si un ancestro ya fue tomado
    let a = el.parentElement, dup = false;
    while (a && a !== c) { if (marca.has(a)) { dup = true; break; } a = a.parentElement; }
    if (dup) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (!dentro(r)) return;
    // quedarse solo con la sección que corresponde a la página: en la misma
    // posición el motor deja montada la sección siguiente y el texto se superpone
    const secEl = el.closest('section[data-section-id]');
    const esImagen = el.tagName === 'IMG';
    if (esperada && secEl && secEl.getAttribute('data-section-id') !== esperada && !esImagen) return;
    // descartar capas ocultas (TTS, resaltado, duplicados accesibles)
    const csPrev = getComputedStyle(el);
    if (csPrev.visibility === 'hidden' || parseFloat(csPrev.opacity) === 0) return;
    if (el.closest('[aria-hidden="true"]') && el.tagName !== 'IMG') return;
    if (el.closest('.sr-only,.visually-hidden,.reflow-tts-highlight,.reflow-sentence-overlay')) return;
    if (csPrev.clip === 'rect(0px, 0px, 0px, 0px)' || csPrev.clipPath === 'inset(50%)') return;
    marca.add(el);
    const tag = el.tagName.toLowerCase();
    const base = { tag, x: Math.round(r.left - cr.left), y: Math.round(r.top - cr.top), w: Math.round(r.width), h: Math.round(r.height) };
    if (tag === 'img' || tag === 'svg' || tag === 'table') {
      if (tag === 'img') {
        const crudo = el.currentSrc || el.src || '';
        let rel = crudo;
        try { rel = new URL(crudo, location.href).pathname.replace(/^\//, ''); } catch (e) {}
        bloques.push({ ...base, tipo: 'img', src: rel, fit: getComputedStyle(el).objectFit });
      } else {
        bloques.push({ ...base, tipo: 'html', html: el.outerHTML.slice(0, 20000) });
      }
      return;
    }
    const cs = getComputedStyle(el);
    const texto = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!texto) return;
    bloques.push({
      ...base,
      tipo: 'texto',
      texto,
      estilo: {
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        textAlign: cs.textAlign,
        textIndent: cs.textIndent,
        hyphens: cs.hyphens,
        textTransform: cs.textTransform,
      },
    });
  });
  bloques.sort((a, b) => (a.y - b.y) || (a.x - b.x));
  return { bloques, area: { w: Math.round(cr.width), h: Math.round(cr.height) } };
};

const estiloCss = (e) => [
  `font-family:${e.fontFamily}`,
  `font-size:${e.fontSize}`,
  `font-weight:${e.fontWeight}`,
  `font-style:${e.fontStyle}`,
  `line-height:${e.lineHeight}`,
  `letter-spacing:${e.letterSpacing}`,
  `color:${e.color}`,
  `text-align:${e.textAlign}`,
  `text-indent:${e.textIndent}`,
  `hyphens:${e.hyphens}`,
  `text-transform:${e.textTransform}`,
].join(';');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const indice = [];
for (const t of TARGETS) {
  const control = await setPage(t);
  const { bloques, area } = await page.evaluate(EXTRACT, control.esperado);
  const n = String(t).padStart(3, '0');

  // variante posicionada: cada bloque en su coordenada exacta
  const pos = bloques.map((b) => {
    if (b.tipo === 'img') {
      return `<img src="${b.src}" style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;object-fit:${b.fit || 'cover'}">`;
    }
    if (b.tipo === 'html') {
      return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">${b.html}</div>`;
    }
    return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;${estiloCss(b.estilo)}">${esc(b.texto)}</div>`;
  }).join('\n');

  // variante flujo: mismos bloques, en orden, sin coordenadas
  const flu = bloques.map((b) => {
    if (b.tipo === 'img') {
      return `<img src="${b.src}" style="display:block;width:${b.w}px;height:${b.h}px;object-fit:${b.fit || 'cover'};margin:0 auto">`;
    }
    if (b.tipo === 'html') {
      return `<div style="width:${b.w}px">${b.html}</div>`;
    }
    return `<p style="width:${b.w}px;margin:0 0 ${Math.max(0, Math.round(b.estilo.lineHeight ? parseFloat(b.estilo.lineHeight) * 0.35 : 8))}px;${estiloCss(b.estilo)}">${esc(b.texto)}</p>`;
  }).join('\n');

  const cab = `<div class="pg" style="position:relative;width:${W}px;height:1000px;overflow:hidden;background:#fff">`;
  fs.writeFileSync(path.join(out, 'medicion', `p${n}-pos.html`), cab + '\n' + pos + '\n</div>', 'utf8');
  fs.writeFileSync(path.join(out, 'medicion', `p${n}-flujo.html`), `<div class="pg" style="width:${W}px;height:1000px;overflow:hidden;background:#fff;padding:40px 240px;box-sizing:border-box">\n` + flu + '\n</div>', 'utf8');

  const pesoPos = fs.statSync(path.join(out, 'medicion', `p${n}-pos.html`)).size;
  const pesoFlu = fs.statSync(path.join(out, 'medicion', `p${n}-flujo.html`)).size;
  console.log(`pagina ${t}: ${bloques.length} bloques | pos ${(pesoPos / 1024).toFixed(0)} KB | flujo ${(pesoFlu / 1024).toFixed(0)} KB`);
  indice.push({ pagina: t, imagen: `pages/${n}.webp`, pos: `medicion/p${n}-pos.html`, flujo: `medicion/p${n}-flujo.html`, pesoImagen: fs.statSync(path.join(out, 'pages', `${n}.webp`)).size, pesoPos, pesoFlu });
}

fs.writeFileSync(path.join(out, 'medicion', 'indice.json'), JSON.stringify(indice, null, 2), 'utf8');
await browser.close();
server.close();
