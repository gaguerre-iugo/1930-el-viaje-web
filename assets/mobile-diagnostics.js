/**
 * Diagnóstico móvil para "1930 — El viaje".
 *
 * Se activa SOLO cuando la URL lleva `?diag=1` (por ejemplo
 * https://gaguerre-iugo.github.io/1930-el-viaje-web/index.html?diag=1).
 * Sin ese parámetro no se dibuja nada y el libro funciona igual que siempre.
 *
 * Resuelve el problema de "no puedo ver la consola de Chrome en el teléfono":
 * muestra en pantalla, sobre el propio libro, los errores de JavaScript, las
 * promesas rechazadas, los recursos que fallan (404) y las medidas reales del
 * viewport móvil (vh/dvh/svh, alto de la columna de lectura, reserva de barras).
 *
 * Pensado para sacarle una captura de pantalla al teléfono y enviarla.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  if (params.get("diag") !== "1") return;

  // ---------------------------------------------------------------------
  // 1. Captura de errores (lo antes posible: este archivo se carga antes que
  //    el motor del libro).
  // ---------------------------------------------------------------------
  var events = [];
  var MAX = 120;

  function push(kind, text) {
    var line = { t: new Date().toISOString().slice(11, 19), kind: kind, text: String(text).slice(0, 500) };
    events.push(line);
    if (events.length > MAX) events.shift();
    render();
  }

  window.addEventListener(
    "error",
    function (e) {
      if (e && e.target && e.target !== window && (e.target.src || e.target.href)) {
        var what = e.target.src || e.target.href;
        push("recurso", (e.target.tagName || "?") + " no cargó: " + what);
        return;
      }
      push("js", (e.message || "error") + " @" + (e.filename || "?").split("/").pop() + ":" + e.lineno + ":" + e.colno);
    },
    true
  );

  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    push("promesa", (r && (r.message || r.toString())) || "rechazo sin motivo");
  });

  ["error", "warn"].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      try {
        push("console." + level, Array.prototype.map.call(arguments, String).join(" "));
      } catch (_) {}
      return original.apply(console, arguments);
    };
  });

  // Respuestas HTTP fallidas (fetch y XHR).
  var nativeFetch = window.fetch;
  if (nativeFetch) {
    window.fetch = function () {
      var args = arguments;
      return nativeFetch.apply(this, args).then(function (res) {
        if (res && !res.ok) push("http", res.status + " " + res.url);
        return res;
      });
    };
  }
  var openNative = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.addEventListener("load", function () {
      if (this.status >= 400) push("http", this.status + " " + url);
    });
    return openNative.apply(this, arguments);
  };

  // ---------------------------------------------------------------------
  // 2. Medidas del viewport y del lector.
  // ---------------------------------------------------------------------
  function px(value) {
    var n = parseFloat(value);
    return isFinite(n) ? Math.round(n * 100) / 100 : null;
  }

  function probeUnit(unit) {
    var d = document.createElement("div");
    d.style.cssText = "position:absolute;top:-9999px;left:0;height:100" + unit + ";width:1px";
    document.body.appendChild(d);
    var h = Math.round(d.getBoundingClientRect().height);
    d.remove();
    return h;
  }

  function rect(sel) {
    var el = document.querySelector(sel);
    if (!el) return null;
    var r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return null;
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) };
  }

  // La barra de paginación se oculta a propósito mientras el motor prepara el
  // libro (clases `reflow-primary-toolbar-pending` / `-hidden`), desplazándose
  // fuera de pantalla. Hay que distinguir "oculta a propósito" de "fuera del
  // área visible por error".
  function barInfo() {
    var bar = document.querySelector("#reflow-pagination");
    if (!bar) return null;
    var r = bar.getBoundingClientRect();
    var cs = getComputedStyle(bar);
    var cls = String(bar.className || "");
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      h: Math.round(r.height),
      oculta: /pending|hidden/.test(cls),
      opacidad: cs.opacity,
      clases: cls,
    };
  }

  function snapshot() {
    var de = document.documentElement;
    var root = getComputedStyle(de);
    var content = document.querySelector("#content");
    var vv = window.visualViewport;
    var bar = barInfo();
    var tokenPageHeight = (function () {
      var d = document.createElement("div");
      d.style.cssText = "position:absolute;top:-9999px;height:var(--reflow-page-height)";
      document.body.appendChild(d);
      var h = d.getBoundingClientRect().height;
      d.remove();
      return Math.round(h);
    })();

    var body = null;
    var paragraphs = document.querySelectorAll("#content p");
    for (var i = 0; i < paragraphs.length; i++) {
      var r = paragraphs[i].getBoundingClientRect();
      if (r.width > 60 && r.left >= 0 && r.left < de.clientWidth) {
        body = paragraphs[i];
        break;
      }
    }
    var cs = body ? getComputedStyle(body) : null;
    var lineHeight = cs ? px(cs.lineHeight) : null;

    return {
      viewport: {
        ancho: window.innerWidth,
        alto: window.innerHeight,
        docAncho: de.clientWidth,
        docAlto: de.clientHeight,
        visual: vv ? Math.round(vv.width) + "x" + Math.round(vv.height) + " escala " + vv.scale : "sin visualViewport",
        dpr: window.devicePixelRatio,
        orientacion: window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
        pantalla: window.screen.width + "x" + window.screen.height,
        unidades: "vh=" + probeUnit("vh") + " dvh=" + probeUnit("dvh") + " svh=" + probeUnit("svh") + " lvh=" + probeUnit("lvh"),
      },
      lector: {
        tokenAltoPagina: root.getPropertyValue("--reflow-page-height").trim().replace(/\s+/g, " ") + " => " + tokenPageHeight + "px",
        navHeight: root.getPropertyValue("--nav-height").trim(),
        reservaBarras: root.getPropertyValue("--reflow-toolbar-reserve").trim(),
        contenido: content
          ? content.clientWidth + "x" + content.clientHeight + " (scroll " + content.scrollWidth + ")"
          : "sin #content",
        columnas: content
          ? "ancho " + getComputedStyle(content).columnWidth + " · hueco " + getComputedStyle(content).columnGap
          : "-",
        pagina:
          (document.querySelector("#reflow-current-page") || {}).textContent +
          " / " +
          (document.querySelector("#reflow-total-pages") || {}).textContent,
        desplazamiento: content ? Math.round(content.scrollLeft) + "px" : "-",
        barraInferior: bar
          ? "top " + bar.top + " · bottom " + bar.bottom + (bar.oculta ? " · OCULTA a propósito (" + bar.clases + ")" : " · visible")
          : "sin barra",
        fuenteRaiz: root.fontSize,
        textoCuerpo: cs ? px(cs.fontSize) + "px / interlineado " + lineHeight + "px" : "-",
        lineasVisibles:
          content && lineHeight ? Math.floor(content.clientHeight / lineHeight) : "-",
      },
    };
  }

  function alerts(s) {
    var out = [];
    var v = s.viewport;
    var l = s.lector;
    var altoColumna = parseInt((l.contenido.match(/x(\d+)/) || [])[1], 10);
    var reserva = 0;

    if (v.alto < 500) out.push("Viewport muy bajo (" + v.alto + "px): el libro queda con muy pocas líneas por página.");
    if (v.ancho > v.alto && v.alto < 500) out.push("Modo horizontal en un teléfono: revisar portada y páginas ilustradas.");

    var m = l.tokenAltoPagina.match(/=>\s*(\d+)px/);
    if (m) {
      var ph = parseInt(m[1], 10);
      if (ph > v.docAlto) out.push("La columna de lectura (" + ph + "px) es más alta que el área visible (" + v.docAlto + "px): se puede cortar la última línea.");
      if (ph < 200) out.push("La columna de lectura queda en " + ph + "px: apenas unas líneas por página.");
    }
    if (l.barraInferior && l.barraInferior.indexOf("OCULTA") === -1) {
      var bottom = parseInt((l.barraInferior.match(/bottom (-?\d+)/) || [])[1], 10);
      if (bottom > v.docAlto + 1)
        out.push("La barra de navegación termina en " + bottom + "px, por debajo del área visible (" + v.docAlto + "px).");
    }
    if (l.barraInferior && l.barraInferior.indexOf("OCULTA") !== -1)
      out.push("La barra de navegación sigue oculta: si no reaparece en unos segundos, no se pueden pasar páginas.");
    if (typeof l.lineasVisibles === "number" && l.lineasVisibles > 0 && l.lineasVisibles < 8)
      out.push("Solo " + l.lineasVisibles + " líneas visibles por página.");
    if (events.length) out.push(events.length + " evento(s) de error registrados (ver abajo).");
    return out;
  }

  // ---------------------------------------------------------------------
  // 3. Panel.
  // ---------------------------------------------------------------------
  var host, bodyEl, badge, alertsEl, dataEl, logEl;

  function el(tag, css, text) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text != null) e.textContent = text;
    return e;
  }

  function build() {
    host = el(
      "div",
      "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;pointer-events:none;" +
        "font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0b1020;"
    );
    var panel = el(
      "div",
      "pointer-events:auto;margin:6px;max-height:78vh;overflow:auto;background:#fffffff7;" +
        "border:2px solid #00635d;border-radius:10px;box-shadow:0 6px 22px #0006;padding:8px 10px;"
    );

    var head = el("div", "display:flex;align-items:center;gap:8px;flex-wrap:wrap");
    head.appendChild(el("strong", "font-size:13px", "Diagnóstico del libro"));
    badge = el(
      "span",
      "background:#00635d;color:#fff;border-radius:999px;padding:1px 8px;font-weight:700",
      "0 errores"
    );
    head.appendChild(badge);
    var copy = el(
      "button",
      "margin-left:auto;background:#00635d;color:#fff;border:0;border-radius:8px;padding:7px 11px;font-weight:700;font-size:12px",
      "Copiar informe"
    );
    copy.onclick = function () {
      var text = report();
      var done = function () {
        copy.textContent = "¡Copiado!";
        setTimeout(function () {
          copy.textContent = "Copiar informe";
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          window.prompt("Copiá el informe:", text);
        });
      } else {
        window.prompt("Copiá el informe:", text);
      }
    };
    head.appendChild(copy);
    var hide = el(
      "button",
      "background:#e5e7eb;color:#111;border:0;border-radius:8px;padding:7px 11px;font-weight:700;font-size:12px",
      "Ocultar"
    );
    hide.onclick = function () {
      panel.style.display = "none";
      var show = el(
        "button",
        "pointer-events:auto;position:fixed;right:8px;bottom:8px;z-index:2147483001;background:#00635d;color:#fff;" +
          "border:0;border-radius:999px;padding:10px 14px;font:700 12px system-ui",
        "Diagnóstico"
      );
      show.onclick = function () {
        panel.style.display = "";
        show.remove();
      };
      document.body.appendChild(show);
    };
    head.appendChild(hide);
    panel.appendChild(head);

    alertsEl = el("div", "margin:6px 0;font-weight:600");
    panel.appendChild(alertsEl);

    dataEl = el(
      "pre",
      "margin:6px 0;padding:6px 8px;background:#f1f2f4;border-radius:8px;white-space:pre-wrap;word-break:break-word;font-size:11px"
    );
    panel.appendChild(dataEl);

    logEl = el("div", "");
    panel.appendChild(logEl);

    host.appendChild(panel);
    document.body.appendChild(host);
  }

  function report() {
    var s = snapshot();
    var lines = [];
    lines.push("INFORME 1930 — El viaje (diagnóstico móvil)");
    lines.push("fecha: " + new Date().toISOString());
    lines.push("url: " + window.location.href);
    lines.push("userAgent: " + navigator.userAgent);
    lines.push("");
    lines.push("[viewport]");
    Object.keys(s.viewport).forEach(function (k) {
      lines.push("  " + k + ": " + s.viewport[k]);
    });
    lines.push("[lector]");
    Object.keys(s.lector).forEach(function (k) {
      lines.push("  " + k + ": " + s.lector[k]);
    });
    lines.push("");
    lines.push("[alertas]");
    var a = alerts(s);
    if (!a.length) lines.push("  ninguna");
    a.forEach(function (x) {
      lines.push("  - " + x);
    });
    lines.push("");
    lines.push("[eventos: " + events.length + "]");
    events.forEach(function (e) {
      lines.push("  " + e.t + " [" + e.kind + "] " + e.text);
    });
    return lines.join("\n");
  }

  var rafPending = false;
  function render() {
    if (!host || rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      var s = snapshot();
      var a = alerts(s);
      var errs = events.filter(function (e) {
        return e.kind !== "console.warn";
      }).length;
      badge.textContent = errs + (errs === 1 ? " error" : " errores");
      badge.style.background = errs ? "#b91c1c" : "#00635d";
      alertsEl.textContent = a.length ? "⚠ " + a.join("\n⚠ ") : "✓ Sin alertas de layout";
      alertsEl.style.whiteSpace = "pre-wrap";
      alertsEl.style.color = a.length ? "#7f1d1d" : "#065f46";
      dataEl.textContent =
        "viewport   " + s.viewport.ancho + "x" + s.viewport.alto + " · dpr " + s.viewport.dpr +
        " · " + s.viewport.orientacion + " · " + s.viewport.unidades + "\n" +
        "visual     " + s.viewport.visual + "\n" +
        "columna    " + s.lector.contenido + " · " + s.lector.columnas + "\n" +
        "alto pág.  " + s.lector.tokenAltoPagina + "\n" +
        "barras     nav " + s.lector.navHeight + " · reserva " + s.lector.reservaBarras + " · " + s.lector.barraInferior + "\n" +
        "página     " + s.lector.pagina + " · scroll " + s.lector.desplazamiento + "\n" +
        "texto      " + s.lector.textoCuerpo + " · " + s.lector.lineasVisibles + " líneas/página";
      logEl.textContent = "";
      events.slice(-25).forEach(function (e) {
        var row = el(
          "div",
          "border-top:1px solid #e5e7eb;padding:3px 0;font-size:11px;color:" +
            (e.kind === "console.warn" ? "#8a5b00" : "#7f1d1d"),
          e.t + " [" + e.kind + "] " + e.text
        );
        logEl.appendChild(row);
      });
    });
  }

  function start() {
    build();
    render();
    window.addEventListener("resize", render);
    window.addEventListener("orientationchange", render);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", render);
    // El motor del libro tarda en paginar: refrescamos unas cuantas veces.
    var ticks = 0;
    var timer = setInterval(function () {
      render();
      if (++ticks > 40) clearInterval(timer);
    }, 500);
  }

  window.__diagReport = report;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
