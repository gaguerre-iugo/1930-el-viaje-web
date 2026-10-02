// Mide el contraste de los estados de un cuestionario (revisión UX, punto 18:
// "medir contraste en cada estado", cuestionarios incluidos).
//
// Abre el índice, salta a la primera actividad y mide pregunta, opciones y
// devolución. Lee oklch/oklab por su luminosidad, como el resto de las pruebas.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errores = [];
page.on("pageerror", (error) => errores.push(String(error)));
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Ir a una actividad desde el índice. */
await page.click("#reflow-index");
await page.waitForTimeout(1800);
const salto = await page.evaluate(() => {
  const botones = [...document.querySelectorAll(".reflow-reader-panel li > button")];
  const actividad = botones.find((nodo) => /actividad/i.test(nodo.textContent || ""));
  if (!actividad) return false;
  actividad.click();
  return true;
});
console.log(`salto a una actividad desde el índice: ${salto ? "sí" : "no"}`);
await page.waitForTimeout(2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);

const medicion = await page.evaluate(() => {
  const color = (valor) => {
    const texto = String(valor);
    const perceptual = texto.match(/^ok(?:lch|lab)\(\s*([\d.]+)/);
    if (perceptual) {
      const luz = Math.max(0, Math.min(1, Number(perceptual[1])));
      const gris = Math.round(luz * 255);
      const alfa = texto.match(/\/\s*([\d.]+)\s*\)/);
      return { r: gris, g: gris, b: gris, a: alfa ? Number(alfa[1]) : 1 };
    }
    const n = (texto.match(/[\d.]+/g) || []).map(Number);
    return { r: n[0] || 0, g: n[1] || 0, b: n[2] || 0, a: n.length > 3 ? n[3] : 1 };
  };
  const luminancia = ({ r, g, b }) => {
    const canal = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  };
  const contraste = (uno, otro) => {
    const a = luminancia(uno);
    const b = luminancia(otro);
    return Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2));
  };
  const fondoEfectivo = (nodo) => {
    let actual = nodo;
    while (actual && actual !== document.documentElement) {
      const fondo = color(getComputedStyle(actual).backgroundColor);
      if (fondo.a > 0.4) return fondo;
      actual = actual.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const medir = (nodo, etiqueta) => {
    if (!nodo) return { etiqueta, falta: true };
    const estilo = getComputedStyle(nodo);
    const fondo = fondoEfectivo(nodo);
    return {
      etiqueta,
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
      color: estilo.color,
      fondo: `rgb(${fondo.r}, ${fondo.g}, ${fondo.b})`,
      luminanciaFondo: Number(luminancia(fondo).toFixed(3)),
      contraste: contraste(color(estilo.color), fondo),
      tamano: estilo.fontSize,
    };
  };

  /* Elementos del cuestionario, por selector y por texto. */
  const kicker = document.querySelector('[class*="quiz-dimension"], [class*="quiz-kicker"]');
  const enunciado = [...document.querySelectorAll("p, h2, h3")].find((nodo) =>
    /pregunta\s*\d+\s*de/i.test(nodo.textContent || "")
  );
  const opciones = [...document.querySelectorAll("button, label")].filter((nodo) =>
    /^[a-d][).]\s/i.test((nodo.textContent || "").trim())
  );
  const devolucion = document.querySelector('[class*="quiz-feedback"], [class*="quiz-exp"]');
  return {
    hayCuestionario: Boolean(enunciado || opciones.length),
    kicker: medir(kicker, "kicker"),
    enunciado: medir(enunciado, "enunciado"),
    opcion: medir(opciones[0], "opción 1"),
    opcion2: medir(opciones[1], "opción 2"),
    devolucion: medir(devolucion, "devolución"),
    cantidadOpciones: opciones.length,
  };
});

console.log("=== Estados del cuestionario (punto 18) ===");
console.log(JSON.stringify(medicion, null, 1).slice(0, 2000));
if (!medicion.hayCuestionario) console.log("no se llegó a un cuestionario");
console.log(`\nconsola: ${errores.length ? errores.slice(0, 2) : "sin errores"}`);
await browser.close();
