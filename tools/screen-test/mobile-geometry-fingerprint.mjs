// Huella geométrica del lector: sirve para comparar antes/después de una
// optimización y probar que la paginación y las páginas ilustradas no cambiaron.
//
//   node mobile-geometry-fingerprint.mjs --out report-mobile/huella-antes.json
//   node mobile-geometry-fingerprint.mjs --url http://127.0.0.1:5599/index.html

import fs from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const URL_TARGET =
  argVal("--url") || "https://gagueriugo.github.io/1930-el-viaje-web/index.html".replace("gagueriugo", "gaguerre-iugo");
const OUT = argVal("--out") || "report-mobile/huella.json";
const DEVICE = argVal("--device") || "tablet-landscape-1067x480";

const DEVICES = {
  "pixel7-portrait": {
    width: 412,
    height: 859,
    dpr: 2.625,
    ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36",
  },
  "tablet-landscape-1067x480": {
    width: 1067,
    height: 480,
    dpr: 1.5,
    ua: "Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
  },
};
const dev = DEVICES[DEVICE] || DEVICES["tablet-landscape-1067x480"];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: dev.width, height: dev.height },
  deviceScaleFactor: dev.dpr,
  isMobile: true,
  hasTouch: true,
  userAgent: dev.ua,
  locale: "es-UY",
});
const page = await ctx.newPage();
await page.goto(URL_TARGET, { waitUntil: "load", timeout: 90000 });
await page.waitForFunction(
  () => {
    const b = document.getElementById("reflow-total-pages");
    return b && (parseInt(b.textContent, 10) || 0) > 1;
  },
  { timeout: 60000 }
);

// Esperar a que se asienten los pases de liquidación de ilustraciones.
await page.waitForTimeout(3500);

const dump = () =>
  page.evaluate(() => {
    const content = document.getElementById("content");
    const cs = getComputedStyle(content);
    const pitch = parseFloat(cs.columnWidth) + parseFloat(cs.columnGap);
    const contRect = content.getBoundingClientRect();
    const rel = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: Math.round(r.left - contRect.left + content.scrollLeft),
        top: Math.round(r.top - contRect.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    };
    const pageOf = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return Math.round((r.left - contRect.left + content.scrollLeft) / pitch);
    };

    const sections = [];
    document.querySelectorAll("#content section[data-section-id]").forEach((s) => {
      const id = s.getAttribute("data-section-id");
      const img = s.querySelector(".illustrated-page > img, .attic-illustrated-page > img, .book-cover-art img, .reflow-later-cover-art img");
      const copy = s.querySelector(".illustrated-copy, .attic-illustrated-copy, .book-cover-copy");
      const tag = s.getAttribute("data-section-type");
      if (!img && !copy) return;
      sections.push({
        id,
        tipo: tag,
        pagina: pageOf(img || copy),
        img: rel(img),
        copy: rel(copy),
        copyAlto: copy ? copy.style.height || null : null,
        overflow: s.querySelectorAll(".illustrated-overflow > *").length,
        belowCopy: s.querySelectorAll(".illustrated-below-copy > *").length,
      });
    });

    return {
      totalPaginas: parseInt(document.getElementById("reflow-total-pages").textContent, 10),
      anchoColumna: Math.round(parseFloat(cs.columnWidth)),
      altoColumna: content.clientHeight,
      scrollWidth: Math.round(content.scrollWidth),
      secciones: sections,
    };
  });

const data = await dump();
await fs.writeFile(
  OUT,
  JSON.stringify({ url: URL_TARGET, device: DEVICE, ...data }, null, 2)
);
console.log(`huella escrita en ${OUT}`);
console.log(
  `  páginas ${data.totalPaginas} · columna ${data.anchoColumna}x${data.altoColumna} · scrollWidth ${data.scrollWidth} · ${data.secciones.length} secciones ilustradas/portada`
);
await browser.close();
