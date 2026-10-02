// Comprueba si los arreglos llegan al navegador y por qué no tienen efecto:
// (1) qué versión de quiz-sequence.js se cargó, (2) si la fila de opción tiene la
// altura en línea (que ganaría sobre mi hoja de estilos) y (3) cómo está posicionado
// el botón «Siguiente pregunta», que ignora float y márgenes.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 947, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

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
await page.evaluate(() => {
  const controles = Array.from(
    document.querySelectorAll("#content input[type='radio'], #content [role='radio']")
  );
  const tercero = controles[2] || controles[controles.length - 1];
  if (tercero) tercero.click();
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (enviar && !enviar.disabled) enviar.click();
});
await page.waitForTimeout(2400);

const datos = await page.evaluate(() => {
  /* 1 · Versión del script cargada. */
  const scripts = Array.from(document.querySelectorAll("script[src]"))
    .map((nodo) => nodo.getAttribute("src"))
    .filter((src) => /quiz-sequence|reflow-book/.test(src));
  /* 2 · La fila de opción que envuelve: su altura y de dónde sale. */
  const opciones = Array.from(document.querySelectorAll("#content .quiz-option"));
  const filas = opciones.map((nodo) => {
    const estilo = getComputedStyle(nodo);
    const r = nodo.getBoundingClientRect();
    return {
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26),
      altoCaja: Math.round(r.height),
      altoScroll: nodo.scrollHeight,
      altoComputado: estilo.height,
      minHeight: estilo.minHeight,
      maxHeight: estilo.maxHeight,
      overflow: estilo.overflow,
      alturaEnLinea: nodo.style.getPropertyValue("height"),
      alturaEnLineaPrioridad: nodo.style.getPropertyPriority("height"),
      parienteAlto: (() => {
        let padre = nodo.parentElement;
        let nivel = 0;
        while (padre && nivel < 4) {
          const e = getComputedStyle(padre);
          if (e.height !== "auto" || padre.style.getPropertyValue("height")) {
            return (
              "<" + padre.tagName.toLowerCase() + " " + (padre.className || "").toString().slice(0, 30) + ">" +
              " alt=" + e.height + " enLinea=" + (padre.style.getPropertyValue("height") || "-")
            );
          }
          padre = padre.parentElement;
          nivel += 1;
        }
        return "sin pariente con altura fija";
      })(),
    };
  });
  /* 3 · Posición del botón y layout de su contenedor. */
  const boton = document.querySelector("#content .quiz-next-question");
  const contenedor = boton ? boton.parentElement : null;
  return {
    scripts,
    filas,
    boton: boton
      ? {
          caja: (() => {
            const r = boton.getBoundingClientRect();
            return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(",");
          })(),
          position: getComputedStyle(boton).position,
          float: getComputedStyle(boton).cssFloat,
          marginLeft: getComputedStyle(boton).marginLeft,
          displayBoton: getComputedStyle(boton).display,
          contenedor:
            "<" + contenedor.tagName.toLowerCase() + " " + (contenedor.className || "").toString().slice(0, 40) + ">" +
            " display=" + getComputedStyle(contenedor).display +
            " justify=" + getComputedStyle(contenedor).justifyContent +
            " alignItems=" + getComputedStyle(contenedor).alignItems,
        }
      : null,
  };
});

console.log(JSON.stringify(datos, null, 1).slice(0, 3000));
await browser.close();
