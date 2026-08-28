// Auditorías que se ejecutan DENTRO de la página (contexto del navegador).
// La función debe ser autocontenida: Playwright serializa su código fuente,
// así que todos los helpers viven dentro de ella.

export function auditPage(opts) {
  const T = opts.thresholds;
  const P = opts.physical;

  // ---- geometría física: mm por px CSS para este viewport ----
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  const diagPx = Math.sqrt(cssW * cssW + cssH * cssH);
  const diagMm = P.diagonalInches * 25.4;
  const mmPerCssPx = diagPx > 0 ? diagMm / diagPx : 0;
  const pxToMm = (px) => +(px * mmPerCssPx).toFixed(2);

  const rgb = (str) => {
    if (!str) return null;
    const m = str.match(/rgba?\(([^)]+)\)/i);
    if (!m) return null;
    // Soporta sintaxis por comas "rgb(24, 24, 24, .96)" y moderna "rgb(24 24 24 / 96%)".
    const body = m[1].includes("/") ? m[1].replace("/", " ") : m[1].replace(/,/g, " ");
    const nums = body.trim().split(/\s+/);
    const val = (s) => (s && s.endsWith("%") ? (parseFloat(s) / 100) * 255 : parseFloat(s));
    const alpha = (s) => (s && s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));
    const r = val(nums[0]);
    const g = val(nums[1]);
    const b = val(nums[2]);
    const a = nums.length > 3 ? alpha(nums[3]) : 1;
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b, a: Number.isNaN(a) ? 1 : a };
  };
  const relLum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const contrast = (fg, bg) => {
    const L1 = relLum(fg);
    const L2 = relLum(bg);
    const hi = Math.max(L1, L2);
    const lo = Math.min(L1, L2);
    return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
  };
  // Color de fondo efectivo subiendo por ancestros hasta hallar uno opaco.
  // Devuelve { uncertain:true } si algún ancestro usa gradiente/imagen de fondo,
  // translucidez o backdrop-filter: en esos casos el contraste real no puede
  // deducirse del DOM y se marca como incierto (revisión manual/pixel).
  const effectiveBg = (el) => {
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return { uncertain: true };
      if (cs.backdropFilter && cs.backdropFilter !== "none") return { uncertain: true };
      if ((cs.webkitBackdropFilter || "none") !== "none") return { uncertain: true };
      const c = rgb(cs.backgroundColor);
      if (c && c.a >= 0.999) return c;
      if (c && c.a > 0.01) return { uncertain: true }; // fondo translúcido
      node = node.parentElement;
    }
    const bodyBg = rgb(getComputedStyle(document.body).backgroundColor);
    if (bodyBg && bodyBg.a >= 0.999) return bodyBg;
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  // Excluye ayudantes ocultos (puente de QA, sr-only) y micro-elementos.
  const isDecoyHidden = (el) => {
    const id = el.id || "";
    if (/^adt-reflow-qa/i.test(id)) return true;
    if (el.hasAttribute("hidden")) return true;
    if (el.getAttribute("aria-hidden") === "true") return true;
    const cls = typeof el.className === "string" ? el.className : "";
    if (/\bsr-only\b|\bvisually-hidden\b/.test(cls)) return true;
    return false;
  };

  const isVisible = (el) => {
    if (isDecoyHidden(el)) return false;
    // Filtro barato por geometría primero: descarta lo que está fuera del
    // viewport o es diminuto SIN invocar getComputedStyle (costoso). El libro
    // mantiene todas las páginas en el DOM, así que esto evita medir miles de
    // elementos fuera de pantalla.
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return false;
    if (r.bottom < 0 || r.top > cssH || r.right < 0 || r.left > cssW) return false;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) === 0)
      return false;
    return true;
  };

  const INTERACTIVE_SEL = [
    "button",
    "a[href]",
    "input",
    "select",
    "textarea",
    "[role=button]",
    "[role=link]",
    "[role=checkbox]",
    "[role=radio]",
    "[role=tab]",
    "[tabindex]:not([tabindex='-1'])",
    "[draggable=true]",
    ".reflow-index-page-button",
    "[data-reflow-page-index]",
  ].join(",");

  const interactives = Array.from(document.querySelectorAll(INTERACTIVE_SEL)).filter(isVisible);

  // A native radio/checkbox is visually tiny, but its real hit target is the
  // <label> that wraps it (or points at it via `for`). WCAG target-size counts
  // that label, so measure it instead of the bare input to avoid false fails.
  const unionRect = (a, b) => {
    const x1 = Math.min(a.left, b.left);
    const y1 = Math.min(a.top, b.top);
    const x2 = Math.max(a.right, b.right);
    const y2 = Math.max(a.bottom, b.bottom);
    return { x: x1, y: y1, left: x1, top: y1, right: x2, bottom: y2, width: x2 - x1, height: y2 - y1 };
  };
  const effectiveRect = (el) => {
    let r = el.getBoundingClientRect();
    const type = (el.getAttribute("type") || "").toLowerCase();
    if (el.tagName.toLowerCase() === "input" && (type === "radio" || type === "checkbox")) {
      const labels = [];
      const wrap = el.closest("label");
      if (wrap) labels.push(wrap);
      if (el.labels) for (const l of el.labels) labels.push(l);
      for (const l of labels) {
        const lr = l.getBoundingClientRect();
        if (lr.width && lr.height) r = unionRect(r, lr);
      }
    }
    return r;
  };

  // ---- 1. Áreas táctiles ----
  const touchTargets = interactives.map((el) => {
    const r = effectiveRect(el);
    const label =
      el.getAttribute("aria-label") ||
      (el.textContent || "").trim().slice(0, 40) ||
      el.id ||
      el.className;
    const wMm = pxToMm(r.width);
    const hMm = pxToMm(r.height);
    const smallCss = Math.min(r.width, r.height) < T.touchTargetMinCssPx;
    const smallMm = Math.min(wMm, hMm) < T.touchTargetMinMm;
    return {
      label,
      id: el.id || null,
      tag: el.tagName.toLowerCase(),
      wCss: +r.width.toFixed(1),
      hCss: +r.height.toFixed(1),
      wMm,
      hMm,
      rect: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      failCss: smallCss,
      failMm: smallMm,
      pass: !(smallCss || smallMm),
    };
  });

  // ---- 2. Separación entre interactivos (gap mínimo al vecino) ----
  const rects = interactives.map((el) => el.getBoundingClientRect());
  const gapFor = (i) => {
    let min = Infinity;
    const a = rects[i];
    for (let j = 0; j < rects.length; j++) {
      if (i === j) continue;
      const b = rects[j];
      const dx = Math.max(0, Math.max(a.left - b.right, b.left - a.right));
      const dy = Math.max(0, Math.max(a.top - b.bottom, b.top - a.bottom));
      const overlap = dx === 0 && dy === 0;
      const d = overlap ? 0 : Math.hypot(dx, dy);
      if (d < min) min = d;
    }
    return min === Infinity ? null : +min.toFixed(1);
  };
  const spacing = interactives.map((el, i) => {
    const gap = gapFor(i);
    const gapMm = gap == null ? null : pxToMm(gap);
    return {
      label:
        el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 40) || el.id,
      gapCss: gap,
      gapMm,
      fail: gap != null && (gap < T.minSpacingCssPx || gapMm < T.minSpacingMm),
    };
  });

  // ---- 3. Contraste de texto ----
  const textEls = Array.from(
    document.querySelectorAll("p, h1, h2, h3, h4, li, span, button, a, label, td, th")
  )
    .filter(isVisible)
    .filter((el) => {
      const direct = Array.from(el.childNodes).some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1
      );
      return direct;
    })
    .slice(0, 400);
  const contrastFindings = [];
  let contrastUncertain = 0;
  textEls.forEach((el) => {
    const s = getComputedStyle(el);
    const fg = rgb(s.color);
    if (!fg) return;
    const bg = effectiveBg(el);
    if (bg.uncertain) {
      contrastUncertain++;
      return;
    }
    const ratio = contrast(fg, bg);
    const sizePx = parseFloat(s.fontSize);
    const bold = parseInt(s.fontWeight, 10) >= 700;
    const large = sizePx >= 24 || (bold && sizePx >= 18.66);
    const min = large ? T.contrastLargeText : T.contrastNormalText;
    if (ratio < min) {
      contrastFindings.push({
        text: (el.textContent || "").trim().slice(0, 50),
        ratio,
        required: min,
        fontPx: +sizePx.toFixed(1),
        large,
      });
    }
  });

  // ---- 4. Recortes horizontales dentro de la página visible ----
  // El lector usa paginación por columnas (páginas fuera de pantalla por
  // diseño), por lo que el scrollWidth del documento no es señal útil.
  // Medimos solo elementos VISIBLES que sobresalen del borde del viewport.
  const visibleEls = Array.from(
    document.querySelectorAll("#content *, #reflow-pagination *, [role=dialog] *")
  ).filter(isVisible);
  let maxBleed = 0;
  const bleeding = [];
  const seen = new Set();
  [...interactives, ...visibleEls].forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    const r = el.getBoundingClientRect();
    const over = Math.max(0, r.right - cssW, -r.left);
    if (over > maxBleed) maxBleed = over;
    if (over > 4) {
      bleeding.push({
        label: el.getAttribute("aria-label") || el.id || el.tagName.toLowerCase(),
        overflowPx: +over.toFixed(1),
      });
    }
  });
  const horizontalOverflow = +maxBleed.toFixed(1);

  // ---- 5. Zona segura (interactivos pegados al borde) ----
  const m = T.safeZonePx;
  const safeZoneViolations = interactives
    .map((el) => {
      const r = el.getBoundingClientRect();
      const near = r.left < m || r.top < m || cssW - r.right < m || cssH - r.bottom < m;
      return near
        ? {
            label: el.getAttribute("aria-label") || el.id || el.tagName,
            left: +r.left.toFixed(1),
            top: +r.top.toFixed(1),
            right: +(cssW - r.right).toFixed(1),
            bottom: +(cssH - r.bottom).toFixed(1),
          }
        : null;
    })
    .filter(Boolean);

  // ---- 6. QR ----
  const qrEls = Array.from(document.querySelectorAll("img, canvas, svg")).filter((el) => {
    const hay = (
      (el.getAttribute("alt") || "") +
      " " +
      (el.className || "") +
      " " +
      (el.id || "") +
      " " +
      (el.getAttribute("src") || "")
    ).toLowerCase();
    return hay.includes("qr");
  });
  const qr = qrEls.filter(isVisible).map((el) => {
    const r = el.getBoundingClientRect();
    const side = Math.min(r.width, r.height);
    return {
      side: +side.toFixed(1),
      sideMm: pxToMm(side),
      fail: side < T.qrMinCssPx,
    };
  });

  return {
    geometry: { cssW, cssH, mmPerCssPx: +mmPerCssPx.toFixed(4), dpr: window.devicePixelRatio },
    counts: {
      interactives: interactives.length,
      touchFailCss: touchTargets.filter((t) => t.failCss).length,
      touchFailMm: touchTargets.filter((t) => t.failMm).length,
      spacingFail: spacing.filter((s) => s.fail).length,
      contrastFail: contrastFindings.length,
      contrastUncertain,
      bleeding: bleeding.length,
      safeZone: safeZoneViolations.length,
      qr: qr.length,
      qrFail: qr.filter((q) => q.fail).length,
    },
    horizontalOverflow: +horizontalOverflow.toFixed(1),
    touchTargets: touchTargets.filter((t) => !t.pass),
    spacing: spacing.filter((s) => s.fail),
    contrast: contrastFindings,
    bleeding,
    safeZone: safeZoneViolations,
    qr,
  };
}
