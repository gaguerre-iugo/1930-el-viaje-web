// Mide los estados de las opciones de un cuestionario (revisión UX, punto 18:
// "medir contraste en cada estado").
//
// Toda la lógica va dentro de page.evaluate como funciones reales, sin plantillas
// de cadena: así no hay interpolación que escape mal.
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
await page.evaluate(() => {
  const botones = Array.from(document.querySelectorAll(".reflow-reader-panel li > button"));
  const actividad = botones.find((nodo) => /actividad/i.test(nodo.textContent || ""));
  if (actividad) actividad.click();
});
await page.waitForTimeout(2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);

/** Mide los controles del cuestionario en su estado actual. */
const medir = () =>
  page.evaluate(() => {
    const color = (valor) => {
      const texto = String(valor);
      if (/^ok(?:lch|lab)\(/.test(texto)) {
        const numeros = (texto.match(/[\d.]+/g) || []).map(Number);
        const luz = Math.max(0, Math.min(1, numeros[0] || 0));
        const gris = Math.round(luz * 255);
        const alfa = /\/\s*([\d.]+)\s*\)/.exec(texto);
        return { r: gris, g: gris, b: gris, a: alfa ? Number(alfa[1]) : 1 };
      }
      const n = (texto.match(/[\d.]+/g) || []).map(Number);
      return { r: n[0] || 0, g: n[1] || 0, b: n[2] || 0, a: n.length > 3 ? n[3] : 1 };
    };
    const luminancia = (c) => {
      const canal = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * canal(c.r) + 0.7152 * canal(c.g) + 0.0722 * canal(c.b);
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
    const describir = (nodo) => {
      const estilo = getComputedStyle(nodo);
      const fondo = fondoEfectivo(nodo);
      return {
        etiqueta:
          "<" + nodo.tagName.toLowerCase() + " " + (nodo.className || "").toString().slice(0, 46) + ">",
        texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34),
        color: estilo.color,
        fondo: "rgb(" + fondo.r + ", " + fondo.g + ", " + fondo.b + ")",
        contraste: contraste(color(estilo.color), fondo),
        tamano: estilo.fontSize,
        peso: estilo.fontWeight,
      };
    };

    const enviar = Array.from(document.querySelectorAll("button")).find(
      (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
    );
    if (!enviar) return { error: "no se encontró el botón Enviar" };
    const contenedor = document.querySelector("#content") || document.body;
    /* Las opciones viven fuera de `quiz-actions`: se buscan por su clase. */
    const controles = Array.from(contenedor.querySelectorAll("button, label, [role='radio']")).filter(
      (nodo) => {
        const caja = nodo.getBoundingClientRect();
        const clase = (nodo.className || "").toString();
        return (
          caja.width > 60 &&
          caja.height > 20 &&
          !nodo.contains(enviar) &&
          /quiz|option|opcion|answer/i.test(clase) &&
          (nodo.textContent || "").trim().length > 3
        );
      }
    );
    const devolucion = Array.from(contenedor.querySelectorAll("p, div, span")).find((nodo) =>
      /^(Todavía no|Correcto)/i.test((nodo.textContent || "").trim())
    );
    return {
      contenedor:
        "<" + contenedor.tagName.toLowerCase() + " " + (contenedor.className || "").toString().slice(0, 56) + ">",
      enviar: describir(enviar),
      opciones: controles.slice(0, 4).map(describir),
      devolucion: devolucion ? describir(devolucion) : null,
    };
  });

const antes = await medir();
console.log("=== Antes de responder ===");
console.log(JSON.stringify(antes, null, 1).slice(0, 2400));

const interactuo = await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (!enviar) return { error: "sin botón Enviar" };
  /* Las opciones pueden ser radios ocultos dentro de una etiqueta: se marca el
     control, que es lo que el formulario escucha, y si no hay, se hace clic en la
     etiqueta. */
  const controles = Array.from(
    document.querySelectorAll("input[type='radio'], input[type='checkbox'], [role='radio']")
  );
  let marcado = false;
  if (controles.length) {
    const control = controles[0];
    control.click();
    if (!control.checked && control.type) {
      control.checked = true;
      control.dispatchEvent(new Event("change", { bubbles: true }));
      control.dispatchEvent(new Event("input", { bubbles: true }));
    }
    marcado = Boolean(control.checked) || control.getAttribute("aria-checked") === "true";
  } else {
    const contenedor = document.querySelector("#content") || document.body;
    const opcion = Array.from(contenedor.querySelectorAll("button, label")).find((nodo) => {
      const clase = (nodo.className || "").toString();
      return /quiz|option|opcion|answer/i.test(clase) && !nodo.contains(enviar);
    });
    if (opcion) {
      opcion.click();
      marcado = true;
    }
  }
  return {
    opcionesDetectadas: controles.length,
    marcado,
    enviarDeshabilitado: enviar.disabled === true,
  };
});
console.log("interacción: " + JSON.stringify(interactuo));
await page.waitForTimeout(800);

/* Recién ahora, si el botón quedó habilitado, se envía. */
const enviado = await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (!enviar || enviar.disabled) return false;
  enviar.click();
  return true;
});
console.log("enviado: " + enviado);
if (enviado) await page.waitForTimeout(2000);

const despues = await medir();
console.log("\n=== Después de enviar ===");
console.log(JSON.stringify(despues, null, 1).slice(0, 2400));

console.log("\n=== Resumen de contraste ===");
for (const [momento, datos] of [["antes", antes], ["después", despues]]) {
  if (datos.error) continue;
  for (const opcion of datos.opciones) {
    console.log(
      "  " + momento + " · " + opcion.contraste + ":1 · " + opcion.color + " sobre " + opcion.fondo + " · " + opcion.texto
    );
  }
  if (datos.devolucion) {
    console.log("  " + momento + " · devolución " + datos.devolucion.contraste + ":1 · " + datos.devolucion.color);
  }
}

await page.screenshot({ path: "tmp/quiz-estados.png" });
console.log("\nconsola: " + (errores.length ? errores.slice(0, 2).join(" | ") : "sin errores"));
await browser.close();
