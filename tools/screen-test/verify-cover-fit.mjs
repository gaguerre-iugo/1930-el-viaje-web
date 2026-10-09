// Portada: sin franjas laterales y lo más grande posible.
//
// Bug reportado: la portada mostraba dos columnas laterales del color de fondo.
// Causa: el CSS fija el ANCHO de `.book-cover-layout` con `!important`
// (`min(100%, 57dvh, 40rem)`) y `balanceCoverMargins()` sólo fijaba el ALTO. La
// caja quedaba más ancha que la imagen (738/1078) y `object-fit: contain`
// dibujaba dos franjas del fondo `#210f1c`. El arreglo hace que ancho y alto
// viajen juntos desde el script (con `!important`) y achica el margen para que
// la portada ocupe lo máximo posible.
//
// Uso:
//   node verify-cover-fit.mjs
//   node verify-cover-fit.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const RATIO = 738 / 1078;

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);

const browser = await chromium.launch();
const anchos = [[1920, 1080], [1366, 768], [595, 711], [430, 932], [768, 1024], [2560, 700], [390, 844]];

for (const [w, h] of anchos) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (error) => fallar(`error de página a ${w}x${h}: ${String(error).slice(0, 120)}`));
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(3200);

  const info = await page.evaluate((ratio) => {
    const layout = document.querySelector(".book-cover-layout");
    const content = document.getElementById("content");
    const r = layout.getBoundingClientRect();
    const lw = r.width, lh = r.height;
    const imgW = Math.min(lw, lh * ratio);
    const imgH = imgW / ratio;
    const cs = getComputedStyle(content);
    const columnH = content.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
    const horizontalRoom = content.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    return {
      barL: (lw - imgW) / 2,
      barT: (lh - imgH) / 2,
      heightLimited: columnH - 2 * (Math.min(12, Math.max(4, columnH * 0.015))) <= horizontalRoom / ratio,
      fillH: lh / columnH,
      fillW: lw / horizontalRoom,
      covers: document.querySelectorAll(".book-cover-final").length,
      overflow: lh - columnH
    };
  }, RATIO);

  const etiqueta = `${w}x${h}`;
  if (info.barL > 1 || info.barT > 1) {
    fallar(`${etiqueta}: franjas laterales de ${info.barL.toFixed(1)} px (ancho) / ${info.barT.toFixed(1)} px (alto)`);
  }
  if (info.covers !== 1) fallar(`${etiqueta}: se esperaba 1 portada y hay ${info.covers}`);
  if (info.overflow > 1) fallar(`${etiqueta}: la portada desborda la columna ${info.overflow.toFixed(1)} px (página fantasma)`);
  // En el lado que limita (alto o ancho) tiene que quedar casi al ras.
  const lleno = info.heightLimited ? info.fillH : info.fillW;
  if (lleno < 0.9) fallar(`${etiqueta}: la portada sólo llena ${(lleno * 100).toFixed(0)} % del lado disponible`);
  console.log(
    `${etiqueta}: ${info.heightLimited ? "limitada por alto" : "limitada por ancho"} · llena ` +
    `${(lleno * 100).toFixed(0)} % · franjas ${info.barL.toFixed(1)}/${info.barT.toFixed(1)} px`
  );
  await page.close();
}

await browser.close();

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: la portada no tiene franjas laterales y ocupa lo máximo disponible");
