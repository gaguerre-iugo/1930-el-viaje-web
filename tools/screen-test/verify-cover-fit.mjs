// Portada: sin franjas laterales, lo más grande posible y sin meterse bajo la
// barra inferior.
//
// Dos bugs reportados:
// 1. Dos columnas laterales del color de fondo. Causa: el CSS fija el ANCHO de
//    `.book-cover-layout` con `!important` (`min(100%, 57dvh, 40rem)`) y
//    `balanceCoverMargins()` sólo fijaba el ALTO. La caja quedaba más ancha que
//    la imagen (738/1078) y `object-fit: contain` dibujaba dos franjas del fondo
//    `#210f1c`.
// 2. La portada quedaba chica. Ahora usa también el margen vertical de la página
//    (se ajusta al alto real de #content, que termina donde empieza la barra) y
//    el arte desborda el alto de la columna hacia el padding (`overflow:
//    visible`), sin cambiar el paginado.
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
const GAP = 10;

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);

const browser = await chromium.launch();
const tamanos = [[1920, 1080], [1366, 768], [595, 711], [430, 932], [768, 1024], [2560, 700], [390, 844]];

for (const [w, h] of tamanos) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (error) => fallar(`error de página a ${w}x${h}: ${String(error).slice(0, 120)}`));
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(3200);

  const info = await page.evaluate(({ ratio, gap }) => {
    const layout = document.querySelector(".book-cover-layout");
    const section = document.querySelector(".book-cover-final");
    const content = document.getElementById("content");
    const barra = document.getElementById("reflow-pagination");
    const r = layout.getBoundingClientRect();
    const lw = r.width, lh = r.height;
    const imgW = Math.min(lw, lh * ratio);
    const imgH = imgW / ratio;
    const cs = getComputedStyle(content);
    const availableH = content.clientHeight;
    const availableW = content.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    const sectionR = section.getBoundingClientRect();
    return {
      barL: (lw - imgW) / 2,
      barT: (lh - imgH) / 2,
      heightLimited: availableH - 2 * gap <= availableW / ratio,
      fillH: lh / availableH,
      fillW: lw / availableW,
      top: r.top,
      bottom: r.bottom,
      vh: innerHeight,
      toolbarTop: barra.getBoundingClientRect().top,
      sectionH: sectionR.height,
      columnH: availableH - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0),
      covers: document.querySelectorAll(".book-cover-final").length
    };
  }, { ratio: RATIO, gap: GAP });

  const etiqueta = `${w}x${h}`;
  if (info.barL > 1 || info.barT > 1) {
    fallar(`${etiqueta}: franjas laterales de ${info.barL.toFixed(1)} px (ancho) / ${info.barT.toFixed(1)} px (alto)`);
  }
  if (info.covers !== 1) fallar(`${etiqueta}: se esperaba 1 portada y hay ${info.covers}`);
  if (info.top < -1 || info.bottom > info.vh + 1) {
    fallar(`${etiqueta}: la portada sale del viewport (arriba ${info.top.toFixed(0)}, abajo ${info.bottom.toFixed(0)} de ${info.vh})`);
  }
  if (info.bottom > info.toolbarTop + 1) {
    fallar(`${etiqueta}: la portada se mete bajo la barra (${(info.bottom - info.toolbarTop).toFixed(0)} px)`);
  }
  // La sección no debe crecer más que la columna (eso fragmentaría una página fantasma).
  if (info.sectionH > info.columnH + 1) {
    fallar(`${etiqueta}: la sección de portada crece ${(info.sectionH - info.columnH).toFixed(0)} px sobre la columna (página fantasma)`);
  }
  const lleno = info.heightLimited ? info.fillH : info.fillW;
  if (lleno < 0.95) fallar(`${etiqueta}: la portada sólo llena ${(lleno * 100).toFixed(0)} % del lado disponible`);

  console.log(
    `${etiqueta}: ${info.heightLimited ? "limitada por alto" : "limitada por ancho"} · llena ` +
    `${(lleno * 100).toFixed(0)} % · franjas ${info.barL.toFixed(1)}/${info.barT.toFixed(1)} px · ` +
    `aire con la barra ${(info.toolbarTop - info.bottom).toFixed(0)} px`
  );

  // Página fantasma: al pasar a la página 2 la portada tiene que quedar fuera de pantalla.
  await page.click("#reflow-next");
  await page.waitForTimeout(900);
  const p2 = await page.evaluate(() => {
    const layout = document.querySelector(".book-cover-layout");
    const r = layout.getBoundingClientRect();
    const status = document.getElementById("reflow-page-status");
    return { coverLeft: Math.round(r.left), right: Math.round(r.right), status: status ? status.textContent.trim().slice(0, 24) : null };
  });
  if (p2.right > 1) fallar(`${etiqueta}: la portada sigue visible en la página 2 (borde derecho ${p2.right})`);
  console.log(`${etiqueta}: página 2 -> ${p2.status} · portada fuera de pantalla (borde derecho ${p2.right})`);

  await page.close();
}

await browser.close();

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: la portada no tiene franjas, ocupa el margen y no toca la barra");
