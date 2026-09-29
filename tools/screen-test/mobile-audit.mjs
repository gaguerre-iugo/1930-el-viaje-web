// Auditoría de Chrome en Android para "1930 — El viaje".
//
// Emula teléfonos/tablets Android con Chrome (viewport móvil real: isMobile +
// touch + DPR) y audita el lector publicado o local:
//   - errores de consola / pageerror / fallos de red (404, ERR_*)
//   - geometría: recortes, scroll, barras fijas, solapamientos
//   - unidades de viewport (dvh/svh/lvh/vh) y su valor real
//   - fuentes (Atkinson / FontAwesome) e imágenes rotas
//   - objetivos táctiles < 44 px
//
// Uso:
//   node mobile-audit.mjs                       (sitio publicado en GitHub Pages)
//   node mobile-audit.mjs --url http://127.0.0.1:5599/index.html
//   node mobile-audit.mjs --pages 4             (menos muestreo = más rápido)

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "report-mobile");

const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const URL_TARGET =
  argVal("--url") || "https://gaguerre-iugo.github.io/1930-el-viaje-web/index.html";
const only = argVal("--device");
const maxPages = argVal("--pages") ? Number(argVal("--pages")) : Infinity;

// Alto aproximado del chrome del navegador (barra de direcciones) en Android.
// Chrome reporta 100dvh con las barras retraídas; lo visible es menor.
const CHROME_UI_PORTRAIT = 56;
const CHROME_UI_LANDSCAPE = 48;

const DEVICES = [
  { name: "pixel7-portrait", width: 412, height: 915, dpr: 2.625, ui: CHROME_UI_PORTRAIT,
    ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36" },
  { name: "galaxy-s5-portrait", width: 360, height: 640, dpr: 3, ui: CHROME_UI_PORTRAIT,
    ua: "Mozilla/5.0 (Linux; Android 11; SM-G900F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36" },
  { name: "pixel7-landscape", width: 915, height: 412, dpr: 2.625, ui: CHROME_UI_LANDSCAPE,
    ua: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36" },
  { name: "galaxy-tab-portrait", width: 800, height: 1280, dpr: 2, ui: CHROME_UI_PORTRAIT,
    ua: "Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36" },
];

const SAMPLE_FRACTIONS = [0, 0.05, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 0.99];

// ---------------------------------------------------------------------------
// Diagnóstico que corre dentro de la página.
// ---------------------------------------------------------------------------
function diagnose(input) {
  const { simulatedVisibleHeight, innerWidthPx } = input;
  const out = {};

  // IMPORTANTE: en Chromium con `isMobile: true` y DPR != 1, Playwright
  // reporta un `window.innerWidth/innerHeight` ficticio (pantalla x4) y
  // posiciona los `position: fixed` contra esa caja inexistente. Por eso la
  // auditoría corre con `isMobile: false` + `hasTouch` (que sí reproduce el
  // viewport móvil real: mismo ancho CSS y mismo layout) y mide contra
  // `documentElement`, que es el valor fiable.
  const VW = document.documentElement.clientWidth || window.innerWidth;
  const VH = document.documentElement.clientHeight || window.innerHeight;

  void innerWidthPx;
  out.viewportPx = { w: VW, h: VH };

  const px = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x), y: Math.round(r.y),
      w: Math.round(r.width), h: Math.round(r.height),
      top: Math.round(r.top), bottom: Math.round(r.bottom),
      right: Math.round(r.right),
      visible: r.width > 0 && r.height > 0,
    };
  };

  // --- viewport ---
  const probe = (unit) => {
    const d = document.createElement("div");
    d.style.cssText = `position:absolute;top:-9999px;left:0;height:100${unit};width:1px`;
    document.body.appendChild(d);
    const h = d.getBoundingClientRect().height;
    d.remove();
    return Math.round(h);
  };
  out.viewport = {
    innerWidth: VW,
    innerHeight: VH,
    rawInnerWidth: window.innerWidth,
    rawInnerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    visualViewportHeight: window.visualViewport
      ? Math.round(window.visualViewport.height) : null,
    visualViewportScale: window.visualViewport ? window.visualViewport.scale : null,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    h100vh: probe("vh"),
    h100dvh: probe("dvh"),
    h100svh: probe("svh"),
    h100lvh: probe("lvh"),
    simulatedVisibleHeight,
    simulatedTopCut: null,
  };

  const root = getComputedStyle(document.documentElement);
  out.tokens = {
    reflowPageHeight: root.getPropertyValue("--reflow-page-height").trim(),
    navHeight: root.getPropertyValue("--nav-height").trim(),
    reflowToolbarReserve: root.getPropertyValue("--reflow-toolbar-reserve").trim(),
    reflowControlsHeight: root.getPropertyValue("--reflow-controls-height").trim(),
    reflowGutter: root.getPropertyValue("--reflow-gutter").trim(),
  };
  out.tokensPageHeightPx = px(
    (() => {
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;top:-9999px;height:var(--reflow-page-height)";
      document.body.appendChild(d);
      const h = d.getBoundingClientRect().height;
      d.remove();
      return h;
    })()
  );

  // --- documento / scroll ---
  const se = document.scrollingElement || document.documentElement;
  out.document = {
    scrollingElement: se === document.documentElement ? "html" : "body",
    scrollHeight: Math.round(se.scrollHeight),
    clientHeight: Math.round(se.clientHeight),
    scrollWidth: Math.round(se.scrollWidth),
    clientWidth: Math.round(se.clientWidth),
    horizontalOverflow: Math.round(se.scrollWidth - VW),
    verticalOverflow: Math.round(se.scrollHeight - VH),
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
    bodyHeight: Math.round(document.body.getBoundingClientRect().height),
    bodyMinHeight: getComputedStyle(document.body).minHeight,
  };

  // --- contenedor del libro ---
  const content = document.querySelector("#content");
  out.content = content
    ? {
        ...rect(content),
        clientHeight: content.clientHeight,
        scrollHeight: content.scrollHeight,
        clientWidth: content.clientWidth,
        scrollWidth: content.scrollWidth,
        columnCount: getComputedStyle(content).columnCount,
        columnWidth: getComputedStyle(content).columnWidth,
        columnGap: getComputedStyle(content).columnGap,
        columnFill: getComputedStyle(content).columnFill,
        overflowX: getComputedStyle(content).overflowX,
        scrollBehavior: getComputedStyle(content).scrollBehavior,
        opacity: getComputedStyle(content).opacity,
        columnsClippedBelow:
          content.scrollHeight > content.clientHeight
            ? Math.round(content.scrollHeight - content.clientHeight)
            : 0,
      }
    : null;

  // --- barras / chrome del lector ---
  const pick = (sel) => rect(document.querySelector(sel));
  out.chrome = {
    pagination: pick("#reflow-pagination"),
    previous: pick("#reflow-previous"),
    next: pick("#reflow-next"),
    index: pick("#reflow-index"),
    tools: pick("#reflow-tools"),
    ttsPlayer: pick("#reflow-tts-player"),
    navContainer: pick("#nav-container"),
    navBar: pick("#reflow-primary-toolbar"),
    interfaceContainer: pick("#interface-container"),
    progress: pick("#reflow-progress"),
    pageCounter: (() => {
      const el = document.querySelector("#reflow-current-page");
      const tot = document.querySelector("#reflow-total-pages");
      return el ? { current: el.textContent.trim(), total: tot ? tot.textContent.trim() : null, ...rect(el) } : null;
    })(),
  };

  // Estado real de la barra de navegación: el lector la mantiene en
  // `reflow-primary-toolbar-pending` (opacity 0 + pointer-events none) hasta
  // que el runtime del libro monta su dock. Mientras tanto NO se puede pasar
  // de página con el dedo.
  out.toolbar = (() => {
    const bar = document.querySelector("#reflow-pagination");
    if (!bar) return null;
    const cs = getComputedStyle(bar);
    return {
      clases: String(bar.className || ""),
      opacity: cs.opacity,
      pointerEvents: cs.pointerEvents,
      ariaBusy: bar.getAttribute("aria-busy"),
      usable: parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none",
    };
  })();

  // Elementos fijos: ¿fuera del área visible real?
  const fixedEls = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) return;
    fixedEls.push({
      id: el.id || null,
      cls: (el.className && String(el.className).slice(0, 60)) || null,
      position: cs.position,
      ...rect(el),
      belowVisibleFold: r.bottom > simulatedVisibleHeight + 1,
      hiddenPx: Math.round(Math.max(0, r.bottom - simulatedVisibleHeight)),
      zIndex: cs.zIndex,
    });
  });
  out.fixedElements = fixedEls
    .sort((a, b) => b.hiddenPx - a.hiddenPx)
    .slice(0, 12);

  // --- solapamiento entre chrome fijo y texto del libro ---
  const overlaps = [];
  const chromeEls = ["#reflow-pagination", "#reflow-tts-player", "#nav-container"];
  const textContainers = document.querySelectorAll(
    "#content p, #content h1, #content h2, #content h3, #content li, #content .quiz-option"
  );
  const visibleText = [];
  textContainers.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    if (r.right < 0 || r.left > VW) return;
    if (r.bottom < 0 || r.top > VH) return;
    visibleText.push({ el, r });
  });
  for (const sel of chromeEls) {
    const c = document.querySelector(sel);
    if (!c) continue;
    const cr = c.getBoundingClientRect();
    if (cr.width < 4 || cr.height < 4) continue;
    const hits = visibleText.filter(
      ({ r }) => r.left < cr.right && r.right > cr.left && r.top < cr.bottom && r.bottom > cr.top
    );
    if (hits.length) {
      overlaps.push({
        chrome: sel,
        chromeRect: rect(c),
        hits: hits.length,
        sample: (hits[0].el.textContent || "").trim().slice(0, 70),
      });
    }
  }
  out.overlaps = overlaps;

  // Texto que se sale por abajo del área visible (posible recorte real).
  const clipped = visibleText
    .filter(({ r }) => r.bottom > simulatedVisibleHeight + 1)
    .map(({ el, r }) => ({
      tag: el.tagName,
      text: (el.textContent || "").trim().slice(0, 60),
      bottom: Math.round(r.bottom),
      overflowPx: Math.round(r.bottom - simulatedVisibleHeight),
    }))
    .sort((a, b) => b.overflowPx - a.overflowPx);
  out.textBelowVisibleFold = clipped.slice(0, 8);
  out.textBelowVisibleFoldCount = clipped.length;

  // Elementos más anchos que el viewport (desborde horizontal visible).
  // OJO: el lector pagina con multicolumna horizontal, así que la mayoría de
  // los elementos "anchos" son páginas que están a la derecha, fuera de la
  // vista. Solo cuenta lo que CRUZA el borde derecho o el izquierdo.
  const wide = [];
  document.querySelectorAll("#content *, #interface-container *, #nav-container *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    if (r.bottom < 0 || r.top > VH) return;
    const cruzaDerecha = r.left < VW - 2 && r.right > VW + 2;
    const cruzaIzquierda = r.left < -2 && r.right > 2;
    if (!cruzaDerecha && !cruzaIzquierda) return;
    wide.push({
      tag: el.tagName,
      id: el.id || null,
      cls: (el.className && String(el.className).slice(0, 50)) || null,
      w: Math.round(r.width),
      left: Math.round(r.left),
      right: Math.round(r.right),
      overflowRight: Math.round(r.right - VW),
      overflowLeft: Math.round(-r.left),
    });
  });
  out.wideElements = wide.sort((a, b) => b.overflowRight - a.overflowRight).slice(0, 8);

  // --- tipografía ---
  const p = Array.from(document.querySelectorAll("#content p")).find(
    (el) => el.getBoundingClientRect().width > 40
  );
  const cs = p ? getComputedStyle(p) : null;
  out.typography = p
    ? {
        fontFamily: cs.fontFamily,
        fontSizePx: Math.round(parseFloat(cs.fontSize) * 100) / 100,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        lineChars: Math.round(p.getBoundingClientRect().width / (parseFloat(cs.fontSize) * 0.5)),
        measuredWidth: Math.round(p.getBoundingClientRect().width),
      }
    : null;

  out.fonts = {
    atkinsonLoaded: document.fonts.check('700 16px "Atkinson Hyperlegible"'),
    atkinsonFaces: Array.from(document.fonts).filter((f) => /Atkinson/i.test(f.family)).map((f) => `${f.family} ${f.weight} ${f.status}`),
    fontAwesomeLoaded: document.fonts.check('900 16px "Font Awesome 6 Free"'),
    faces: Array.from(document.fonts).map((f) => `${f.family}|${f.weight}|${f.status}`).slice(0, 20),
    atkinsonClass: document.documentElement.className,
  };

  // --- imágenes ---
  const imgs = [];
  document.querySelectorAll("img").forEach((im) => {
    const r = im.getBoundingClientRect();
    if (r.width < 4 && r.height < 4) return;
    const broken = im.complete && im.naturalWidth === 0;
    const fit = getComputedStyle(im).objectFit;
    const boxRatio = r.width / r.height;
    const natRatio =
      im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : null;
    // Con `object-fit: contain` la caja puede tener otra proporción sin que la
    // imagen se deforme: se dibuja centrada y más chica. Solo hay deformación
    // real cuando NO hay `contain`/`cover` y la proporción de la caja difiere.
    const contained = fit === "contain" || fit === "cover";
    const distorted = natRatio && !contained ? Math.abs(boxRatio - natRatio) > 0.06 : false;
    // Tamaño realmente pintado cuando la imagen va "contain".
    let painted = null;
    if (natRatio && fit === "contain") {
      const s = Math.min(r.width / im.naturalWidth, r.height / im.naturalHeight);
      painted = `${Math.round(im.naturalWidth * s)}x${Math.round(im.naturalHeight * s)}`;
    }
    imgs.push({
      src: (im.currentSrc || im.src || "").split("/").pop(),
      natural: `${im.naturalWidth}x${im.naturalHeight}`,
      rendered: `${Math.round(r.width)}x${Math.round(r.height)}`,
      objectFit: fit,
      painted,
      broken,
      distorted,
      letterbox: Boolean(natRatio && contained && Math.abs(boxRatio - natRatio) > 0.06),
      belowFold: r.bottom > simulatedVisibleHeight + 1,
    });
  });
  out.images = imgs.slice(0, 10);
  out.brokenImages = imgs.filter((i) => i.broken).map((i) => i.src);
  out.distortedImages = imgs.filter((i) => i.distorted).map((i) => `${i.src} ${i.natural}->${i.rendered}`);
  out.letterboxedImages = imgs
    .filter((i) => i.letterbox)
    .map((i) => `${i.src} caja ${i.rendered} · pintada ${i.painted} (natural ${i.natural})`);

  // --- objetivos táctiles ---
  // Se mide el ÁREA TÁCTIL EFECTIVA (el <label> que envuelve al control, o el
  // propio elemento), como manda WCAG 2.5.5. Medir el <input type="radio">
  // desnudo da falsos positivos: en este libro los radios de los cuestionarios
  // van dentro de un <label> grande que es el que recibe el toque.
  const small = [];
  const seen = new Set();
  document.querySelectorAll(
    'button, a[href], [role="button"], [role="switch"], [role="radio"], [role="tab"], input, select, textarea, label'
  ).forEach((el) => {
    const target = el.closest("label") || el;
    const r = target.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const cs2 = getComputedStyle(target);
    if (cs2.visibility === "hidden" || cs2.display === "none" || parseFloat(cs2.opacity) === 0) return;
    if (r.right < 0 || r.left > VW || r.bottom < 0 || r.top > VH) return;
    const label = (el.getAttribute("aria-label") || target.textContent || el.id || el.tagName)
      .trim().replace(/\s+/g, " ").slice(0, 40);
    const key = `${label}|${Math.round(r.width)}x${Math.round(r.height)}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (r.height < 44 || r.width < 44) {
      small.push({
        label,
        id: el.id || null,
        tag: el.tagName,
        efectivo: target.tagName,
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  });
  out.smallTouchTargets = small.slice(0, 15);
  out.smallTouchTargetsCount = small.length;

  // --- señales de "no se ve bien" ---
  const signals = [];
  // `#content` es una tira multicolumna horizontal por diseño (una columna por
  // página), así que su `scrollWidth` enorme NO es un desborde: se informa
  // aparte, no como problema.
  if (out.document.horizontalOverflow > 2 && !out.content)
    signals.push(`desborde horizontal de ${out.document.horizontalOverflow}px en el documento`);
  if (out.content && out.content.visible && out.content.w > VW + 2)
    signals.push(`#content mide ${out.content.w}px y el viewport ${VW}px`);
  if (out.tokensPageHeightPx && out.tokensPageHeightPx > simulatedVisibleHeight + 1)
    signals.push(
      `--reflow-page-height = ${out.tokensPageHeightPx}px > alto visible real (~${simulatedVisibleHeight}px): la última línea queda bajo el chrome del navegador`
    );
  if (out.chrome.pagination && out.chrome.pagination.belowVisibleFold)
    signals.push("la barra de paginación queda por debajo del área visible");
  if (out.textBelowVisibleFoldCount)
    signals.push(`${out.textBelowVisibleFoldCount} bloques de texto visibles terminan bajo el borde inferior visible`);
  if (out.smallTouchTargetsCount)
    signals.push(`${out.smallTouchTargetsCount} objetivos táctiles efectivos < 44px`);
  if (out.brokenImages.length) signals.push(`${out.brokenImages.length} imágenes rotas`);
  if (out.distortedImages.length) signals.push(`${out.distortedImages.length} imágenes deformadas`);
  if (out.letterboxedImages && out.letterboxedImages.length)
    signals.push(`${out.letterboxedImages.length} imágenes con caja desproporcionada (contain: se ven más chicas de lo que podrían)`);
  if (out.overlaps.length)
    signals.push(`chrome fijo solapando texto: ${out.overlaps.map((o) => o.chrome).join(", ")}`);
  if (out.toolbar && !out.toolbar.usable)
    signals.push(`la barra de navegación NO es usable (opacity ${out.toolbar.opacity}, pointer-events ${out.toolbar.pointerEvents}): no se puede pasar de página con el dedo`);
  out.signals = signals;

  return out;
}

// ---------------------------------------------------------------------------
// Navegación (mismo protocolo que el harness de pantallas grandes).
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForReader(page) {
  await page.waitForSelector("#reflow-pagination", { timeout: 30000 });
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector("#reflow-pagination");
        return p && !p.classList.contains("reflow-primary-toolbar-pending");
      },
      { timeout: 20000 }
    )
    .catch(() => {});
  await sleep(700);
}

const readTotal = (page) =>
  page.evaluate(() => {
    const el = document.querySelector("#reflow-total-pages");
    return el ? parseInt(el.textContent, 10) || 1 : 1;
  });

// Cuánto tarda el lector en ser realmente usable: contenido visible y, sobre
// todo, barra de navegación con opacidad y toques activos. Es la métrica que
// decide si en un teléfono el libro "se ve bien" o parece colgado. Ambas se
// miden desde el inicio de la navegación (t0) para que sean comparables.
async function waitForContentVisible(page, timeoutMs, t0) {
  try {
    await page.waitForFunction(
      () => {
        const c = document.querySelector("#content");
        return c && parseFloat(getComputedStyle(c).opacity) > 0.5;
      },
      { timeout: timeoutMs }
    );
    return Date.now() - t0;
  } catch {
    return null;
  }
}

async function waitForUsableToolbar(page, timeoutMs, t0) {
  try {
    await page.waitForFunction(
      () => {
        const bar = document.querySelector("#reflow-pagination");
        if (!bar) return false;
        const cs = getComputedStyle(bar);
        return parseFloat(cs.opacity) > 0.5 && cs.pointerEvents !== "none";
      },
      { timeout: timeoutMs }
    );
    return Date.now() - t0;
  } catch {
    return null;
  }
}
const readIndex = (page) =>
  page.evaluate(() => {
    const el = document.querySelector("#reflow-current-page");
    return el ? (parseInt(el.textContent, 10) || 1) - 1 : 0;
  });

async function goToIndex(page, target) {
  return page.evaluate(async (target) => {
    const idx = () => {
      const el = document.querySelector("#reflow-current-page");
      return el ? (parseInt(el.textContent, 10) || 1) - 1 : 0;
    };
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let prev = null;
    let guard = 0;
    while (guard++ < 400) {
      const cur = idx();
      if (cur === target) return true;
      if (prev !== null && Math.sign(prev - target) !== Math.sign(cur - target)) return false;
      const b = document.querySelector(cur < target ? "#reflow-next" : "#reflow-previous");
      if (!b) return false;
      b.click();
      await wait(70);
      if (idx() === cur) return false;
      prev = cur;
    }
    return idx() === target;
  }, target);
}

async function jumpTo(page, target) {
  try {
    await page.evaluate(() => {
      const b = document.querySelector("#reflow-index");
      if (b && b.getAttribute("aria-expanded") !== "true") b.click();
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('[role="tab"]')).find((t) =>
        /p[aá]ginas/i.test(t.textContent || "")
      );
      if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
    });
    await page.waitForTimeout(200);
    const clicked = await page.evaluate((idx) => {
      const btn = document.querySelector(`button[data-reflow-page-index="${idx}"]`);
      if (!btn) return false;
      btn.click();
      return true;
    }, target);
    if (!clicked) {
      await page.keyboard.press("Escape").catch(() => {});
      return await goToIndex(page, target);
    }
    await page.waitForFunction(
      (t) => {
        const el = document.querySelector("#reflow-current-page");
        return el && (parseInt(el.textContent, 10) || 1) - 1 === t;
      },
      target,
      { timeout: 5000 }
    ).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(150);
    return (await readIndex(page)) === target;
  } catch {
    return await goToIndex(page, target);
  }
}

// ---------------------------------------------------------------------------
// Estado compacto del lector para comparar antes/después de un resize.
const snapshot = (page) =>
  page.evaluate(() => {
    const de = document.documentElement;
    const c = document.querySelector("#content");
    const pag = document.querySelector("#reflow-pagination");
    const cur = document.querySelector("#reflow-current-page");
    const probe = (unit) => {
      const d = document.createElement("div");
      d.style.cssText = `position:absolute;top:-9999px;height:100${unit};width:1px`;
      document.body.appendChild(d);
      const h = d.getBoundingClientRect().height;
      d.remove();
      return Math.round(h);
    };
    return {
      page: cur ? parseInt(cur.textContent, 10) || 1 : null,
      columnHeight: c ? c.clientHeight : null,
      scrollLeft: c ? Math.round(c.scrollLeft) : null,
      columnWidth: c ? c.clientWidth : null,
      dvh: probe("dvh"),
      svh: probe("svh"),
      svhToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--reflow-page-height")
        .replace(/\s+/g, " ")
        .trim(),
      vh: probe("vh"),
      viewportH: de.clientHeight,
      paginationTop: pag ? Math.round(pag.getBoundingClientRect().top) : null,
      paginationBottom: pag ? Math.round(pag.getBoundingClientRect().bottom) : null,
      visible: de.clientHeight,
    };
  });

async function runDevice(browser, dev) {
  // El viewport del contexto representa el área VISIBLE en el teléfono (con la
  // barra de direcciones de Chrome desplegada). La retracción de esa barra se
  // simula luego con setViewportSize, que es exactamente lo que hace Chrome
  // Android al hacer scroll.
  const visibleHeight = dev.height - dev.ui;
  const context = await browser.newContext({
    viewport: { width: dev.width, height: visibleHeight },
    deviceScaleFactor: dev.dpr,
    isMobile: false,
    hasTouch: true,
    userAgent: dev.ua,
    locale: "es-UY",
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  const failedRequests = [];
  const badResponses = [];
  page.on("console", (m) => {
    const t = m.type();
    const text = `${t}: ${m.text()}`;
    if (t === "error") consoleErrors.push(text);
    else if (t === "warning") consoleWarnings.push(text);
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) =>
    failedRequests.push(`${r.url().split("/").pop()} :: ${r.failure()?.errorText}`)
  );
  page.on("response", (r) => {
    if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url().split("/").pop()}`);
  });

  const started = Date.now();
  await page.goto(URL_TARGET, { waitUntil: "load", timeout: 60000 });
  const contentVisibleMs = await waitForContentVisible(page, 45000, started);
  const toolbarReadyMs = await waitForUsableToolbar(page, 60000, started);
  await waitForReader(page);
  const loadMs = Date.now() - started;

  const simulatedVisibleHeight = visibleHeight;

  const deployed = await page.evaluate(() => ({
    reflowJs: document.querySelector('script[src*="reflow-book"]')?.getAttribute("src") || null,
    css: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) =>
      l.getAttribute("href")
    ),
    config: document.querySelector("#reflow-config") ? true : null,
  }));

  const total = await readTotal(page);
  const targets = [
    ...new Set(
      SAMPLE_FRACTIONS.map((f) => Math.round(f * (total - 1))).filter((n) => n >= 0 && n < total)
    ),
  ]
    .sort((a, b) => a - b)
    .slice(0, maxPages === Infinity ? undefined : maxPages);

  const shots = [];
  for (const idx of targets) {
    await jumpTo(page, idx);
    const current = await readIndex(page);
    const name = `page-${String(current + 1).padStart(3, "0")}`;
    await page.screenshot({ path: path.join(outDir, `${dev.name}__${name}.png`) }).catch(() => {});
    const diag = await page.evaluate(diagnose, { simulatedVisibleHeight, innerWidthPx: dev.width });
    diag.name = name;
    diag.targetIndex = idx;
    diag.currentPage = current + 1;
    shots.push(diag);
  }

  // ---- Prueba de la barra de direcciones de Chrome Android -------------
  // Chrome Android retrae su barra al hacer scroll: el viewport CRECE. Si el
  // lector deriva su altura de `dvh` (y no de `svh`), la columna cambia de
  // alto, el libro se re-pagina y el lector puede saltar de página o recortar.
  await jumpTo(page, Math.round((total - 1) * 0.3));
  const resize = { before: null, expanded: null, back: null };
  try {
    resize.before = await snapshot(page);
    await page.setViewportSize({ width: dev.width, height: dev.height });
    await page.waitForTimeout(1200);
    resize.expanded = await snapshot(page);
    await page.screenshot({ path: path.join(outDir, `${dev.name}__resize-expanded.png`) }).catch(() => {});
    await page.setViewportSize({ width: dev.width, height: visibleHeight });
    await page.waitForTimeout(1200);
    resize.back = await snapshot(page);
  } catch (e) {
    resize.error = String(e).slice(0, 160);
  }

  // Estados de interfaz en la portada.
  await jumpTo(page, 0);
  const panels = [];
  for (const [id, sel] of [
    ["panel-index", "#reflow-index"],
    ["panel-tools", "#reflow-tools"],
  ]) {
    try {
      await page.click(sel);
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, `${dev.name}__${id}.png`) }).catch(() => {});
      const diag = await page.evaluate(diagnose, { simulatedVisibleHeight, innerWidthPx: dev.width });
      diag.name = id;
      panels.push(diag);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    } catch {}
  }

  await context.close();
  return {
    device: dev,
    simulatedVisibleHeight,
    visibleHeight,
    loadMs,
    contentVisibleMs,
    toolbarReadyMs,
    totalPages: total,
    deployed,
    shots: [...shots, ...panels],
    resize,
    consoleErrors,
    consoleWarnings,
    failedRequests,
    badResponses,
  };
}

// ---------------------------------------------------------------------------
function renderSummary(results) {
  const lines = [];
  for (const r of results) {
    const d = r.device;
    lines.push(`\n${"=".repeat(78)}`);
    lines.push(`▶ ${d.name}  ${d.width}×${d.height} @${d.dpr}x  ·  alto visible simulado ~${r.simulatedVisibleHeight}px`);
    lines.push(`  carga: ${r.loadMs} ms · páginas del lector: ${r.totalPages}`);
    lines.push(
      `  USABILIDAD: contenido visible a los ${r.contentVisibleMs === null ? ">45 s (NUNCA)" : r.contentVisibleMs + " ms"}` +
        ` · barra de navegación usable a los ${r.toolbarReadyMs === null ? ">60 s (NUNCA)" : r.toolbarReadyMs + " ms"}`
    );
    lines.push(`  reflow.js: ${r.deployed.reflowJs}`);
    lines.push(
      `  errores consola: ${r.consoleErrors.length} · warnings: ${r.consoleWarnings.length} · req. fallidas: ${r.failedRequests.length} · HTTP>=400: ${r.badResponses.length}`
    );
    if (r.consoleErrors.length) {
      lines.push("  ── ERRORES DE CONSOLA ──");
      [...new Set(r.consoleErrors)].slice(0, 12).forEach((e) => lines.push(`     ${e.slice(0, 200)}`));
    }
    if (r.failedRequests.length) {
      lines.push("  ── REQUESTS FALLIDAS ──");
      [...new Set(r.failedRequests)].slice(0, 12).forEach((e) => lines.push(`     ${e.slice(0, 200)}`));
    }
    if (r.badResponses.length) {
      lines.push("  ── HTTP >= 400 ──");
      [...new Set(r.badResponses)].slice(0, 15).forEach((e) => lines.push(`     ${e}`));
    }

    const first = r.shots[0];
    if (first) {
      lines.push(
        `  viewport medido: inner ${first.viewport.innerWidth}×${first.viewport.innerHeight} · vh=${first.viewport.h100vh} dvh=${first.viewport.h100dvh} svh=${first.viewport.h100svh} lvh=${first.viewport.h100lvh}`
      );
      lines.push(
        `  --reflow-page-height: "${first.tokens.reflowPageHeight}" => ${first.tokensPageHeightPx}px · --nav-height="${first.tokens.navHeight}"`
      );
      lines.push(
        `  documento: scrollH=${first.document.scrollHeight} clientH=${first.document.clientHeight} desbordeH=${first.document.horizontalOverflow}px htmlOverflow=${first.document.htmlOverflow} bodyOverflow=${first.document.bodyOverflow} bodyMinH=${first.document.bodyMinHeight}`
      );
    }

    if (r.resize && r.resize.before) {
      const b = r.resize.before, e = r.resize.expanded, k = r.resize.back;
      lines.push(
        `  ── barra de direcciones (view visible ${b.visible}px → retraída ${e ? e.visible : "?"}px) ──`
      );
      lines.push(
        `     antes:    pág ${b.page} · columna ${b.columnHeight}px · scrollLeft ${b.scrollLeft} · svh=${b.svh} dvh=${b.dvh}`
      );
      if (e)
        lines.push(
          `     retraída: pág ${e.page} · columna ${e.columnHeight}px · scrollLeft ${e.scrollLeft} · svh=${e.svh} dvh=${e.dvh}`
        );
      if (k)
        lines.push(
          `     vuelta:   pág ${k.page} · columna ${k.columnHeight}px · scrollLeft ${k.scrollLeft}`
        );
      if (e && k) {
        const establePorSvh = /100svh/.test(b.svhToken || "");
        if (establePorSvh) {
          lines.push(
            `     nota: el lector usa 100svh, estable frente a la barra de direcciones. La emulación no puede` +
              ` distinguir svh de dvh (ambos valen ${b.svh}px acá), así que este cambio de columna NO ocurre en un teléfono real`
          );
        } else {
          if (e.columnHeight !== b.columnHeight)
            lines.push(
              `     ⚠ la columna CAMBIA de alto (${b.columnHeight} → ${e.columnHeight}px): el libro se re-pagina al retraerse la barra`
            );
          if (e.page !== b.page || k.page !== b.page)
            lines.push(
              `     ⚠ el lector SALTA de página (${b.page} → ${e.page} → ${k.page})`
            );
          if (e.scrollLeft !== b.scrollLeft || k.scrollLeft !== b.scrollLeft)
            lines.push(
              `     ⚠ el desplazamiento horizontal cambia (${b.scrollLeft} → ${e.scrollLeft} → ${k.scrollLeft}px)`
            );
        }
      }
    }

    lines.push(`  ── por vista ──`);
    for (const s of r.shots) {
      lines.push(`   · ${s.name.padEnd(12)} pág ${s.currentPage}`);
      if (s.signals.length) s.signals.forEach((sig) => lines.push(`       ⚠ ${sig}`));
      else lines.push("       ok (sin señales)");
      if (s.textBelowVisibleFold.length) {
        lines.push(
          `       recortes: ${s.textBelowVisibleFold.map((x) => `"${x.text.slice(0, 24)}…" +${x.overflowPx}px`).join(" | ")}`
        );
      }
      if (s.wideElements.length) {
        lines.push(
          `       anchos: ${s.wideElements.map((x) => `${x.tag}${x.id ? "#" + x.id : ""} ${x.w}px (+${x.overflowRight})`).join(" | ")}`
        );
      }
      if (s.fonts && !s.fonts.atkinsonLoaded) lines.push("       ⚠ Atkinson Hyperlegible NO cargada");
      if (s.images.length && s.brokenImages.length) lines.push(`       ⚠ imágenes rotas: ${s.brokenImages.join(", ")}`);
      if (s.letterboxedImages && s.letterboxedImages.length)
        lines.push(`       imágenes encogidas (contain): ${s.letterboxedImages.slice(0, 5).join(" | ")}`);
      if (s.smallTouchTargets && s.smallTouchTargets.length)
        lines.push(
          `       táctiles chicos: ${s.smallTouchTargets
            .slice(0, 8)
            .map((t) => `${t.efectivo} ${t.w}x${t.h}px "${t.label}"`)
            .join(" | ")}`
        );
    }
  }
  return lines.join("\n");
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  console.log(`Objetivo: ${URL_TARGET}`);
  const browser = await chromium.launch();
  const devices = only ? DEVICES.filter((d) => d.name === only) : DEVICES;
  const results = [];
  try {
    for (const dev of devices) {
      process.stdout.write(`\n▶ Auditando ${dev.name}...`);
      const r = await runDevice(browser, dev);
      results.push(r);
      process.stdout.write(" listo");
    }
  } finally {
    await browser.close();
  }

  const summary = renderSummary(results);
  console.log(summary);
  await fs.writeFile(path.join(outDir, "mobile-summary.json"), JSON.stringify(results, null, 2));
  await fs.writeFile(path.join(outDir, "mobile-summary.txt"), summary);
  console.log(`\n✔ Datos: ${path.join(outDir, "mobile-summary.json")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
