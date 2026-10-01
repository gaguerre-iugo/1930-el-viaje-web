// Verifica los íconos de interfaz generados para la revisión UX.
//
// Unitario: rasteriza la flecha SVG y la compara contra el export de EVA
// (fixtures/eva-arrow-right-100.png): caja contenedora y solapamiento de
// siluetas (IoU). Si el SVG se aparta del original, falla.
// Visual: deja una tira con el glosario, las dos flechas y el tamaño real.
//
// Uso:
//   node verify-icons.mjs
//
// No necesita servidor: rasteriza los SVG en un lienzo del navegador.
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");
const outDir = path.join(repoRoot, "tmp");
const failures = [];

const arrowSvg = await fs.readFile(path.join(repoRoot, "assets/icons/eva-arrow-right.svg"), "utf8");
const arrowLeftSvg = await fs.readFile(path.join(repoRoot, "assets/icons/eva-arrow-left.svg"), "utf8");
const glossarySvg = await fs.readFile(path.join(repoRoot, "assets/icons/glossary-book.svg"), "utf8");
const referencePng = await fs.readFile(
  path.join(here, "fixtures/eva-arrow-right-100.png")
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 260 } });
await page.setContent(
  `<html><body style="margin:0;background:#008078;display:flex;gap:16px;align-items:center;padding:16px;color:#fff;font-family:sans-serif">
     <div style="text-align:center"><div>${glossarySvg}</div><small>glosario</small></div>
     <div style="text-align:center"><div>${arrowLeftSvg}</div><small>anterior</small></div>
     <div style="text-align:center"><div>${arrowSvg}</div><small>siguiente</small></div>
     <div style="text-align:center"><div style="transform:scale(2);transform-origin:center">${glossarySvg}</div><small>48 px</small></div>
   </body></html>`
);
await page.waitForTimeout(300);
await fs.mkdir(outDir, { recursive: true });
await page.screenshot({ path: path.join(outDir, "iconos-eva.png") });

const comparison = await page.evaluate(
  async ({ svg, pngBase64 }) => {
    const SIZE = 100;
    const maskFrom = (draw) => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const context = canvas.getContext("2d");
      draw(context);
      const data = context.getImageData(0, 0, SIZE, SIZE).data;
      const mask = new Uint8Array(SIZE * SIZE);
      for (let i = 0; i < mask.length; i += 1) {
        mask[i] = data[i * 4 + 3] > 128 ? 1 : 0;
      }
      return mask;
    };
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    const svgImage = await loadImage(
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)))
    );
    const pngImage = await loadImage("data:image/png;base64," + pngBase64);
    const svgMask = maskFrom((context) => context.drawImage(svgImage, 0, 0, SIZE, SIZE));
    const pngMask = maskFrom((context) => context.drawImage(pngImage, 0, 0, SIZE, SIZE));

    const bounds = (mask) => {
      let minX = SIZE, minY = SIZE, maxX = -1, maxY = -1;
      for (let y = 0; y < SIZE; y += 1) {
        for (let x = 0; x < SIZE; x += 1) {
          if (!mask[y * SIZE + x]) continue;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      return { minX, minY, maxX, maxY };
    };
    let intersection = 0, union = 0, onlySvg = 0, onlyPng = 0;
    const rows = [];
    for (let y = 0; y < SIZE; y += 1) {
      let row = "";
      for (let x = 0; x < SIZE; x += 1) {
        const a = svgMask[y * SIZE + x], b = pngMask[y * SIZE + x];
        if (a && b) intersection += 1;
        if (a || b) union += 1;
        if (a && !b) onlySvg += 1;
        if (!a && b) onlyPng += 1;
        row += a && b ? "█" : a ? "S" : b ? "E" : "·";
      }
      rows.push(row);
    }
    return {
      svgBounds: bounds(svgMask),
      pngBounds: bounds(pngMask),
      iou: intersection / union,
      onlySvg,
      onlyPng,
      rows,
      svgPixels: svgMask.reduce((total, value) => total + value, 0),
      pngPixels: pngMask.reduce((total, value) => total + value, 0),
    };
  },
  { svg: arrowSvg, pngBase64: referencePng.toString("base64") }
);

// La flecha izquierda tiene que ser el espejo exacto de la derecha.
const mirror = await page.evaluate(
  async ({ right, left }) => {
    const SIZE = 100;
    const load = (svg) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
      });
    const mask = async (svg, flip) => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const context = canvas.getContext("2d");
      if (flip) {
        context.translate(SIZE, 0);
        context.scale(-1, 1);
      }
      context.drawImage(await load(svg), 0, 0, SIZE, SIZE);
      const data = context.getImageData(0, 0, SIZE, SIZE).data;
      const result = new Uint8Array(SIZE * SIZE);
      for (let i = 0; i < result.length; i += 1) result[i] = data[i * 4 + 3] > 128 ? 1 : 0;
      return result;
    };
    const rightMask = await mask(right, false);
    const leftMask = await mask(left, true);
    let intersection = 0, union = 0;
    for (let i = 0; i < rightMask.length; i += 1) {
      if (rightMask[i] && leftMask[i]) intersection += 1;
      if (rightMask[i] || leftMask[i]) union += 1;
    }
    return { iou: intersection / union };
  },
  { right: arrowSvg, left: arrowLeftSvg }
);

await browser.close();

console.log("=== Flecha SVG vs export de EVA (100 px) ===");
console.log(`  caja EVA:  x ${comparison.pngBounds.minX}-${comparison.pngBounds.maxX}, y ${comparison.pngBounds.minY}-${comparison.pngBounds.maxY}`);
console.log(`  caja SVG:  x ${comparison.svgBounds.minX}-${comparison.svgBounds.maxX}, y ${comparison.svgBounds.minY}-${comparison.svgBounds.maxY}`);
console.log(`  solapamiento (IoU): ${(comparison.iou * 100).toFixed(1)}%  ·  sólo SVG ${comparison.onlySvg} px  ·  sólo EVA ${comparison.onlyPng} px`);
console.log(`  área: SVG ${comparison.svgPixels} px vs EVA ${comparison.pngPixels} px`);

const boxDelta = (a, b) => Math.max(Math.abs(a - b));
const deltaX = Math.max(boxDelta(comparison.svgBounds.minX, comparison.pngBounds.minX),
  boxDelta(comparison.svgBounds.maxX, comparison.pngBounds.maxX));
const deltaY = Math.max(boxDelta(comparison.svgBounds.minY, comparison.pngBounds.minY),
  boxDelta(comparison.svgBounds.maxY, comparison.pngBounds.maxY));
if (process.argv.includes("--ascii")) {
  console.log("\n█ = coincide · S = sólo SVG · E = sólo EVA");
  comparison.rows.forEach((row, index) => {
    if (index % 2 === 0) console.log(`  ${row.replace(/·/g, " ")}`);
  });
}

// El de referencia es un raster exportado: su antialias engorda la silueta, así
// que el solapamiento puro no llega al 100 % ni con la misma geometría. Se
// exigen entonces tres cosas: caja, área y un piso razonable de solapamiento.
const areaRatio = comparison.svgPixels / comparison.pngPixels;
console.log(`  relación de área: ${(areaRatio * 100).toFixed(1)}%`);
if (deltaX > 2 || deltaY > 2) {
  failures.push(`la caja se aparta ${Math.max(deltaX, deltaY)} px del original de EVA (tolerancia 2)`);
}
if (Math.abs(areaRatio - 1) > 0.05) {
  failures.push(`el área se aparta ${((areaRatio - 1) * 100).toFixed(1)}% de la de EVA (tolerancia 5%)`);
}
if (comparison.iou < 0.85) {
  failures.push(`el solapamiento es ${(comparison.iou * 100).toFixed(1)}% (mínimo 85%)`);
}

// La flecha izquierda tiene que ser el espejo exacto de la derecha.
console.log(`  espejo (izquierda reflejada vs derecha): ${(mirror.iou * 100).toFixed(1)}%`);
if (mirror.iou < 0.98) {
  failures.push(`la flecha izquierda no es el espejo de la derecha (${(mirror.iou * 100).toFixed(1)}%)`);
}
console.log(`\ntira de íconos -> ${path.join(outDir, "iconos-eva.png")}`);
console.log(failures.length ? `FALLAS:\n - ${failures.join("\n - ")}` : "OK: la flecha reproduce el ícono de EVA");
process.exit(failures.length ? 1 : 0);
