// Punto 18 · «medir contraste en cada estado», cuestionario incluido.
//
// El sondeo anterior fallaba por la consulta, no por la interfaz: tomaba las
// cuatro primeras opciones de `#content`, que pertenecen a OTRA pregunta (el
// libro repite los cuestionarios y el primero del DOM cae fuera del visor).
// Acá la muestra se acota al panel de la pregunta (`[data-quiz-id]`), que es el
// que tiene el control marcado.
//
// Mide, en cada estado, el texto de la opción contra su fondo efectivo, más la
// devolución, el botón, la marca ✓/× y el borde. El parser de color contempla
// oklch/oklab (el runtime de Tailwind v4 escribe colores así): leerlos como
// r/g/b da un contraste falso.
//
// Uso:
//   node verify-quiz-contrast.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";

const fallas = [];
const fail = (mensaje) => fallas.push(mensaje);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const erroresConsola = [];
page.on("pageerror", (error) => erroresConsola.push(String(error)));
page.on("console", (mensaje) => {
  if (mensaje.type() === "error") erroresConsola.push(mensaje.text());
});

/* --- Medición, con toda la lógica dentro de page.evaluate ----------------
   Sin plantillas de cadena anidadas: los helpers son funciones reales. */
const MEDIR = (PANEL) => {
  const parseColor = (valor) => {
    const texto = String(valor).trim();
    let m = texto.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      const partes = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return { r: partes[0] || 0, g: partes[1] || 0, b: partes[2] || 0, a: partes[3] === undefined ? 1 : partes[3] };
    }
    m = texto.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
      let h = m[1];
      if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
      const n = (i) => parseInt(h.slice(i, i + 2), 16);
      return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
    }
    const oklabRgb = (L, A, B, a) => {
      const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
      const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
      const s_ = L - 0.0894841775 * A - 1.291485548 * B;
      const l = l_ * l_ * l_;
      const mm = m_ * m_ * m_;
      const s = s_ * s_ * s_;
      const enc = (c) => {
        const x = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(1, x)) * 255);
      };
      return {
        r: enc(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s),
        g: enc(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s),
        b: enc(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s),
        a,
      };
    };
    m = texto.match(/^oklch\(([^)]+)\)$/i);
    if (m) {
      const partes = m[1].split(/[\s/]+/).filter(Boolean);
      const num = (v, escala) => (/%$/.test(v) ? (parseFloat(v) / 100) * escala : parseFloat(v));
      const L = num(partes[0], 1);
      const C = num(partes[1], 0.4);
      const H = parseFloat(partes[2]);
      const alfa = partes[3] === undefined ? 1 : num(partes[3], 1);
      const rad = ((isNaN(H) ? 0 : H) * Math.PI) / 180;
      return oklabRgb(L, C * Math.cos(rad), C * Math.sin(rad), alfa);
    }
    m = texto.match(/^oklab\(([^)]+)\)$/i);
    if (m) {
      const partes = m[1].split(/[\s/]+/).filter(Boolean);
      const num = (v, escala) => (/%$/.test(v) ? (parseFloat(v) / 100) * escala : parseFloat(v));
      const L = num(partes[0], 1);
      const A = num(partes[1], 0.4);
      const B = num(partes[2], 0.4);
      const alfa = partes[3] === undefined ? 1 : num(partes[3], 1);
      return oklabRgb(L, A, B, alfa);
    }
    return { r: 0, g: 0, b: 0, a: 1 };
  };

  const componer = (frente, fondo) => ({
    r: frente.r * frente.a + fondo.r * (1 - frente.a),
    g: frente.g * frente.a + fondo.g * (1 - frente.a),
    b: frente.b * frente.a + fondo.b * (1 - frente.a),
    a: 1,
  });

  const fondoEfectivo = (nodo) => {
    const capas = [];
    let actual = nodo;
    while (actual && actual.nodeType === 1) {
      const c = parseColor(getComputedStyle(actual).backgroundColor);
      if (c.a > 0) capas.push(c);
      if (c.a >= 0.999) break;
      actual = actual.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = capas.length - 1; i >= 0; i -= 1) base = componer(capas[i], base);
    return base;
  };

  const canal = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminancia = (c) => 0.2126 * canal(c.r) + 0.7152 * canal(c.g) + 0.0722 * canal(c.b);
  const contraste = (uno, otro) => {
    const a = luminancia(uno);
    const b = luminancia(otro);
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    return Number(ratio.toFixed(2));
  };

  const rgbTxt = (c) => "rgb(" + Math.round(c.r) + ", " + Math.round(c.g) + ", " + Math.round(c.b) + ")";
  const describir = (nodo) => {
    if (!nodo) return null;
    const estilo = getComputedStyle(nodo);
    const fondo = fondoEfectivo(nodo);
    const color = parseColor(estilo.color);
    return {
      color: rgbTxt(componer(color, fondo)),
      colorDeclarado: estilo.color,
      fondo: rgbTxt(fondo),
      contraste: contraste(componer(color, fondo), fondo),
      size: parseFloat(estilo.fontSize) || 0,
      peso: estilo.fontWeight,
    };
  };

  const panel = document.querySelector('[data-quiz-id="' + PANEL + '"]');
  if (!panel) return { error: "panel no encontrado" };

  const opciones = [...panel.querySelectorAll(".quiz-option")].map((fila, indice) => {
    const texto = fila.querySelector(".quiz-option-text");
    const estiloFila = getComputedStyle(fila);
    const fondoFila = fondoEfectivo(fila);
    const borde = parseColor(estiloFila.borderTopColor);
    const marca = fila.querySelector(".quiz-result-mark");
    return {
      n: indice,
      texto: (texto && texto.textContent ? texto.textContent : "").replace(/\s+/g, " ").trim().slice(0, 40),
      clases: (fila.className || "").toString(),
      correcta: fila.dataset.correct === "true",
      textoMedido: describir(texto),
      borde: {
        color: rgbTxt(componer(borde, fondoFila)),
        fondo: rgbTxt(fondoFila),
        contraste: contraste(componer(borde, fondoFila), fondoFila),
      },
      marca: marca ? describir(marca) : null,
    };
  });

  const feedback = panel.querySelector(".quiz-feedback");
  const submit = panel.querySelector(".quiz-submit");
  return {
    panel,
    opciones,
    feedback: feedback && (feedback.textContent || "").trim()
      ? Object.assign({ clases: (feedback.className || "").toString() }, describir(feedback))
      : null,
    submit: submit ? Object.assign({ disabled: submit.disabled }, describir(submit)) : null,
  };
};

/* Deja la sección del cuestionario en la página visible del paginado. */
const esperarEnPagina = async (SECCION) => {
  for (let intento = 0; intento < 10; intento += 1) {
    const listo = await page.evaluate((SECCION) => {
      const seccion = document.querySelector('[data-section-id="' + SECCION + '"]');
      if (!seccion) return true;
      const content = document.getElementById("content");
      if (!content) return false;
      const visorLeft = content.getBoundingClientRect().left;
      const ancho = content.clientWidth;
      const caja = seccion.getBoundingClientRect();
      const actual = Math.round(content.scrollLeft / ancho);
      const objetivo = Math.floor((content.scrollLeft + (caja.left - visorLeft)) / ancho);
      if (objetivo !== actual) {
        const boton = document.getElementById(objetivo > actual ? "reflow-next" : "reflow-previous");
        if (boton) boton.click();
        return false;
      }
      const desvio = caja.left - visorLeft;
      if (Math.abs(desvio) > 24) {
        content.scrollLeft += desvio;
        return false;
      }
      return true;
    }, SECCION);
    if (listo) return true;
    await page.waitForTimeout(600);
  }
  return false;
};

/* Marca la primera opción correcta o incorrecta y envía. */
const responder = async (PANEL, correcta) => {
  return page.evaluate(
    ({ PANEL, correcta }) => {
      const panel = document.querySelector('[data-quiz-id="' + PANEL + '"]');
      if (!panel) return { ok: false, motivo: "sin panel" };
      const opciones = [...panel.querySelectorAll(".quiz-option")];
      const elegida = opciones.find((o) => (o.dataset.correct === "true") === correcta);
      if (!elegida) return { ok: false, motivo: "sin opción " + (correcta ? "correcta" : "incorrecta") };
      const input = elegida.querySelector('input[type="radio"]');
      if (input) input.click();
      else elegida.click();
      const enviar = panel.querySelector(".quiz-submit");
      if (!enviar) return { ok: false, motivo: "sin botón Enviar" };
      if (enviar.disabled) {
        enviar.disabled = false;
        enviar.dispatchEvent(new Event("input", { bubbles: true }));
      }
      enviar.click();
      return { ok: true };
    },
    { PANEL, correcta }
  );
};

const esperarDataset = async (PANEL) => {
  for (let i = 0; i < 20; i += 1) {
    const listo = await page.evaluate(
      (PANEL) => {
        const panel = document.querySelector('[data-quiz-id="' + PANEL + '"]');
        if (!panel) return false;
        const conClave = [...panel.querySelectorAll(".quiz-option")].some((o) => o.dataset.correct !== undefined);
        return conClave;
      },
      PANEL
    );
    if (listo) return true;
    await page.waitForTimeout(200);
  }
  return false;
};

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(2500);

const secciones = await page.evaluate(() =>
  [...document.querySelectorAll('[data-section-type="quiz_sequence"]')].map((s) => s.dataset.sectionId)
);

const resumen = [];
for (const seccion of secciones) {
  const enPagina = await esperarEnPagina(seccion);
  const panelId = await page.evaluate(
    (seccion) => {
      const s = document.querySelector('[data-section-id="' + seccion + '"]');
      const p = s && s.querySelector(".quiz-panel");
      return p ? p.dataset.quizId : null;
    },
    seccion
  );
  if (!panelId) {
    fail(seccion + ": sin panel de cuestionario");
    continue;
  }
  await esperarDataset(panelId);
  console.log("\n=== " + seccion + " · panel " + panelId + (enPagina ? "" : " (no se pudo centrar)") + " ===");

  const normal = await page.evaluate(MEDIR, panelId);
  await responder(panelId, false);
  await page.waitForTimeout(1400);
  const conIncorrecta = await page.evaluate(MEDIR, panelId);
  await responder(panelId, true);
  await page.waitForTimeout(1400);
  const conCorrecta = await page.evaluate(MEDIR, panelId);

  if (normal.error) {
    fail(seccion + ": " + normal.error);
    continue;
  }

  const estados = { normal, conIncorrecta, conCorrecta };
  for (const [nombre, datos] of Object.entries(estados)) {
    const marca = datos === normal ? "  " : "→ ";
    console.log(marca + nombre + ":");
    for (const o of datos.opciones) {
      const t = o.textoMedido;
      const etiqueta = o.clases.replace(/\s+/g, " ").trim() || "(sin estado)";
      console.log(
        "    " + nombre + " opción " + o.n + " [" + etiqueta + "] texto " + t.contraste +
          ":1 · " + t.color + " sobre " + t.fondo + " · borde " + o.borde.contraste + ":1" +
          (o.marca ? " · marca " + o.marca.contraste + ":1" : "") + " · «" + o.texto + "»"
      );
    }
    if (datos.feedback) {
      console.log(
        "    " + nombre + " devolución " + datos.feedback.clases + " " + datos.feedback.contraste +
          ":1 · " + datos.feedback.color + " sobre " + datos.feedback.fondo
      );
    }
    const s = datos.submit;
    if (s) console.log("    " + nombre + " botón " + s.contraste + ":1 · " + s.color + " sobre " + s.fondo + " · disabled " + s.disabled);
  }

  /* Criterios: el texto de las opciones y de la devolución es texto normal
     (menos de 18,66 px, o menos de 18,66 px en negrita): 4,5:1. La marca ✓/× es
     un gráfico: 3:1. */
  const revisar = (etiqueta, nodo, tipo) => {
    const minimo = tipo === "grafico" ? 3 : 4.5;
    if (!nodo) return;
    if (nodo.contraste < minimo) {
      fail(seccion + " " + etiqueta + ": contraste " + nodo.contraste + ":1 (mínimo " + minimo + ") · " + nodo.color + " sobre " + nodo.fondo);
    }
  };
  for (const o of normal.opciones) revisar("normal opción " + o.n, o.textoMedido, "texto");
  for (const o of conIncorrecta.opciones) revisar("incorrecta opción " + o.n, o.textoMedido, "texto");
  for (const o of conCorrecta.opciones) revisar("correcta opción " + o.n, o.textoMedido, "texto");
  if (conIncorrecta.feedback) revisar("devolución incorrecta", conIncorrecta.feedback, "texto");
  if (conCorrecta.feedback) revisar("devolución correcta", conCorrecta.feedback, "texto");
  for (const datos of [normal, conIncorrecta, conCorrecta]) {
    for (const o of datos.opciones) if (o.marca) revisar("marca ✓/×", o.marca, "grafico");
  }

  /* Informe de bordes: son gráficos; 3:1 es el mínimo de WCAG 1.4.11, pero un
     borde decorativo puede quedar por debajo. Se informan, no fallan. */
  const bordeBajo = [];
  for (const datos of Object.values(estados)) {
    for (const o of datos.opciones) if (o.borde.contraste < 3) bordeBajo.push(o.n + ":" + o.borde.contraste + ":1");
  }
  if (bordeBajo.length) console.log("    (bordes por debajo de 3:1: " + [...new Set(bordeBajo)].join(", ") + ")");

  resumen.push({
    seccion,
    normal: normal.opciones.map((o) => o.textoMedido.contraste),
    incorrecta: conIncorrecta.feedback ? conIncorrecta.feedback.contraste : null,
    correcta: conCorrecta.feedback ? conCorrecta.feedback.contraste : null,
  });
}

console.log("\nconsola: " + (erroresConsola.length ? erroresConsola.slice(0, 3).join(" | ") : "sin errores"));
if (erroresConsola.length) fail("errores de consola: " + erroresConsola.slice(0, 3).join(" | "));
console.log(fallas.length ? "\nFALLAS (" + fallas.length + "):\n - " + fallas.join("\n - ") : "\nOK: el texto de las opciones y las devoluciones cumple el contraste en todos los estados");
await browser.close();
process.exit(fallas.length ? 1 : 0);
