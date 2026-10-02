// Sondeo del cuestionario respondido: qué elementos se superponen, de dónde sale el
// borde grueso de la devolución y qué accent tiene el radio. Alimenta el arreglo.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
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

/* Responder: marcar el primero y enviar. */
await page.evaluate(() => {
  const control = document.querySelector("#content input[type='radio'], #content [role='radio']");
  if (control) control.click();
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (enviar && !enviar.disabled) enviar.click();
});
await page.waitForTimeout(2200);

const datos = await page.evaluate(() => {
  const caja = (nodo) => {
    const r = nodo.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), ancho: Math.round(r.width), alto: Math.round(r.height) };
  };
  const describir = (nodo) => {
    const estilo = getComputedStyle(nodo);
    return {
      etiqueta: "<" + nodo.tagName.toLowerCase() + " " + (nodo.className || "").toString().slice(0, 60) + ">",
      caja: caja(nodo),
      borde: estilo.borderTopWidth + " " + estilo.borderTopColor,
      fondo: estilo.backgroundColor,
      color: estilo.color,
      overflow: estilo.overflow,
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
    };
  };

  const marcada = document.querySelector("#content .quiz-option.is-incorrect, #content .quiz-option.is-correct");
  const opciones = Array.from(document.querySelectorAll("#content .quiz-option"));
  /* La devolución: el bloque con texto de devolución unificado. */
  const devolucion = Array.from(document.querySelectorAll("#content *")).find((nodo) =>
    /^Todavía no\./.test((nodo.textContent || "").trim())
  );
  /* Quiénes se superponen con la devolución. */
  const cajaDevolucion = devolucion ? devolucion.getBoundingClientRect() : null;
  const superpuestos = cajaDevolucion
    ? Array.from(document.querySelectorAll("#content *")).filter((nodo) => {
        if (!devolucion.contains(nodo) && !nodo.contains(devolucion)) {
          const r = nodo.getBoundingClientRect();
          const seCruza =
            r.width > 20 && r.height > 10 && r.bottom > cajaDevolucion.top && r.top < cajaDevolucion.bottom &&
            r.right > cajaDevolucion.left && r.left < cajaDevolucion.right;
          if (seCruza) return true;
        }
        return false;
      })
    : [];
  const radio = document.querySelector("#content input[type='radio']");
  const fondoPagina = getComputedStyle(document.querySelector("#content")).backgroundColor;
  return {
    fondoDeLaPagina: fondoPagina,
    opciones: opciones.slice(0, 4).map(describir),
    opcionMarcada: marcada ? describir(marcada) : null,
    devolucion: devolucion ? describir(devolucion) : null,
    superpuestosConLaDevolucion: superpuestos.slice(0, 6).map(describir),
    radio: radio
      ? { accent: getComputedStyle(radio).accentColor, caja: caja(radio), visible: radio.getBoundingClientRect().width > 4 }
      : null,
  };
});

console.log(JSON.stringify(datos, null, 1).slice(0, 3600));
await page.screenshot({ path: "tmp/quiz-sondeo.png" });
await browser.close();
