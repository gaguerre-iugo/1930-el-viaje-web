#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const book = 'C:/Users/germa/Desktop/1930-el-viaje-web-export-v48-full-book';
const out = 'C:/Users/germa/DeepSeek Bot/1930-kiosk';
const texts = JSON.parse(fs.readFileSync(path.join(book, 'content/i18n/es-UY/texts.json'), 'utf8'));
const map = {};
for (const [k, v] of Object.entries(texts)) {
  if (/^gl\d+$/.test(k)) map[String(v).trim().toLowerCase()] = k;
}
const g = JSON.parse(fs.readFileSync(path.join(out, 'kiosk-glossary.json'), 'utf8'));
let n = 0;
for (const [key, t] of Object.entries(g.terms)) {
  const id = map[String(key).toLowerCase()];
  if (id) { t.audioId = id; n += 1; }
}
fs.writeFileSync(path.join(out, 'kiosk-glossary.json'), JSON.stringify(g, null, 2), 'utf8');
console.log('terminos con audio:', n, 'de', Object.keys(g.terms).length);
