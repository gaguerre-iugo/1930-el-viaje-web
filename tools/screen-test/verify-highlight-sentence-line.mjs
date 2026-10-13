// Resaltado por oración: una sola línea de subrayado (igual que por palabra).
//
// Antes el modo oración usaba `text-decoration-style: double` y se veía como dos
// líneas debajo del texto. Ahora comparte el subrayado simple del modo palabra.
// El test NO se conforma con leer la declaración CSS: pinta una oración real,
// toma el rectángulo del resaltado y CUENTA las bandas oscuras debajo del texto
// en los píxeles. Una línea = una banda; el bug viejo = dos.
//
// Uso:
//   node verify-highlight-sentence-line.mjs
//   node verify-highlight-sentence-line.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const argVal = (b) => { const i = args.indexOf(b); return i >= 0 ? args[i + 1] : undefined; };
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";

const fallas = [];
const fallar = (m) => fallas.push(m);

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => fallar("error de página: " + String(e).slice(0, 160)));

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Enciende la lectura en voz alta: sin ella el resaltado no se pinta. */
await page.click("#reflow-tools");
await page.waitForTimeout(800);
const interruptor = await page.$(".reflow-setting-read-aloud [role='switch']");
if (!interruptor) fallar("no se encontró el interruptor de lectura en voz alta");
else { await interruptor.click(); await page.waitForTimeout(1200); }
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

/* Una sola hoja de reflow.css y la versión vigente: una copia vieja ganaba y
   volvía el subrayado doble. */
const hojas = await page.evaluate(() => Array.from(document.styleSheets)
  .map((s) => s.href).filter((h) => h && /reflow\.css/.test(h)));
if (hojas.length !== 1) fallar(`debe haber una sola hoja reflow.css y hay ${hojas.length}: ${hojas.join(", ")}`);
const versionEsperada = await page.evaluate(() => {
  const l = document.querySelector('link[href*="reflow.css"]');
  return l ? l.getAttribute("href") : null;
});
if (hojas.length === 1 && versionEsperada && !hojas[0].endsWith(versionEsperada.replace(/^\.\//, ""))) {
  fallar(`la hoja cargada no es la declarada: ${hojas[0]} vs ${versionEsperada}`);
}

/* La regla del modo oración tiene que declarar subrayado simple. */
const reglas = await page.evaluate(() => {
  const salida = {};
  Array.from(document.styleSheets).forEach((hoja) => {
    let lista;
    try { lista = hoja.cssRules; } catch (e) { return; }
    if (!lista) return;
    Array.from(lista).forEach((r) => {
      const sel = r.selectorText || "";
      if (!/::highlight\(adt-tts-active\)/.test(sel)) return;
      if (/sentence/.test(sel)) salida.sentence = r.style.cssText;
      if (/\bword\b/.test(sel)) salida.word = r.style.cssText;
    });
  });
  return salida;
});
/* El `cssText` pliega las propiedades en la forma corta y omite el estilo
   cuando es el inicial (solid), así que «sin declarar» significa solid. */
const estiloDe = (texto) => (String(texto).match(/text-decoration-style:\s*([a-z]+)/) || [])[1] || "solid";
const grosorDe = (texto) => (String(texto).match(/text-decoration-thickness:\s*([\d.]+px)/) || [])[1] || "";
const offsetDe = (texto) => (String(texto).match(/text-underline-offset:\s*([\d.]+em)/) || [])[1] || "";
console.log("regla sentence:", reglas.sentence);
console.log("regla word:    ", reglas.word);
if (estiloDe(reglas.sentence) !== "solid") fallar(`el modo oración declara «${estiloDe(reglas.sentence)}» y debe ser «solid»`);
if (grosorDe(reglas.sentence) !== grosorDe(reglas.word)) fallar("el grosor del subrayado difiere entre oración y palabra");
if (offsetDe(reglas.sentence) !== offsetDe(reglas.word)) fallar("el desplazamiento del subrayado difiere entre oración y palabra");

/* Mide los píxeles: bandas oscuras debajo del texto, en cada modo. */
const medirBanda = async (modo) => {
  await page.evaluate((m) => window.__adtReflowSetWordHighlight && window.__adtReflowSetWordHighlight(m === "word"), modo);
  await page.waitForFunction((m) => document.body.dataset.reflowHighlightMode === m, modo, { timeout: 8000 }).catch(() => {});
  const indice = await page.evaluate(() => {
    const items = (window.__adtReflowAudio && window.__adtReflowAudio.items) || [];
    const i = items.findIndex((it) => it.el && it.el.closest('[data-section-id="pg019_sec001"]') &&
      it.el.tagName && it.el.tagName.toLowerCase() === "p");
    if (i < 0) return -1;
    const content = document.getElementById("content");
    const el = items[i].el;
    const left = el.getBoundingClientRect().left - content.getBoundingClientRect().left + content.scrollLeft;
    window.__adtReflowGoToVisualPage(Math.max(1, Math.round(left / content.clientWidth) + 1));
    return i;
  });
  await page.waitForTimeout(800);
  await page.evaluate((i) => window.__adtReflowAudio.playAtIndex(i), indice);
  await page.waitForTimeout(1100);
  await page.evaluate(() => window.__adtReflowAudio.pause && window.__adtReflowAudio.pause());
  await page.waitForTimeout(600);

  const caja = await page.evaluate(() => {
    const h = CSS.highlights.get("adt-tts-active");
    if (!h || !h.size) return null;
    const c = h.values().next().value.getBoundingClientRect();
    return { x: c.left, y: c.top, ancho: c.width, alto: c.height };
  });
  if (!caja) { fallar(`no se pudo pintar el resaltado en modo ${modo}`); return null; }

  /* Recorte: el texto y 26 px por debajo, donde vive el subrayado. */
  const recorte = {
    x: Math.max(0, Math.floor(caja.x) - 2),
    y: Math.max(0, Math.floor(caja.y) - 4),
    width: Math.ceil(caja.ancho) + 4,
    height: Math.ceil(caja.alto) + 30
  };
  const buffer = await page.screenshot({ clip: recorte });
  const bandas = await page.evaluate(async (dataUrl) => {    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
    const lienzo = document.createElement("canvas");
    lienzo.width = img.width; lienzo.height = img.height;
    const ctx = lienzo.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, img.width, img.height);
    const oscuro = (x, y) => {
      const p = (y * img.width + x) * 4;
      return data[p] < 90 && data[p + 1] < 90 && data[p + 2] < 90;
    };
    const cobertura = [];
    for (let y = 0; y < img.height; y += 1) {
      let cuenta = 0;
      for (let x = 0; x < img.width; x += 1) if (oscuro(x, y)) cuenta += 1;
      cobertura.push(cuenta / img.width);
    }
    /* El subrayado cubre casi todo el ancho (≈0,9); las filas de texto, mucho
       menos. Una línea = una banda de filas con cobertura alta. El bug viejo
       (`double`) daba dos bandas separadas por un claro. */
    const alto = cobertura.map((v) => v >= 0.7);
    let n = 0;
    for (let i = 0; i < alto.length; i += 1) if (alto[i] && !alto[i - 1]) n += 1;
    return n;
  }, "data:image/png;base64," + buffer.toString("base64"));

  console.log(`modo ${modo}: bandas oscuras debajo del texto = ${bandas}`);
  return bandas;
};

const bandasOracion = await medirBanda("sentence");
const bandasPalabra = await medirBanda("word");
if (bandasOracion !== 1) fallar(`el modo oración dibuja ${bandasOracion} línea(s) y debe dibujar 1`);
if (bandasPalabra !== 1) fallar(`el modo palabra dibuja ${bandasPalabra} línea(s) y debe dibujar 1`);

await browser.close();

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: el resaltado por oración dibuja una sola línea, igual que el de palabra");
