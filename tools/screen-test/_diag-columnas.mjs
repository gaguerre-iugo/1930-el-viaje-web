// Sonda del paginado: cómo está armado el contenedor de columnas y por qué el
// contenido de la columna siguiente sangra sobre la tarjeta del cuestionario.
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

const datos = await page.evaluate(() => {
  const describir = (nodo, etiqueta) => {
    if (!nodo) return { etiqueta, falta: true };
    const estilo = getComputedStyle(nodo);
    const caja = nodo.getBoundingClientRect();
    return {
      etiqueta,
      clase: (nodo.className || "").toString().slice(0, 70),
      caja: {
        x: Math.round(caja.x),
        y: Math.round(caja.y),
        ancho: Math.round(caja.width),
        alto: Math.round(caja.height),
      },
      overflow: estilo.overflow,
      overflowX: estilo.overflowX,
      columnas: estilo.columnCount + " / " + estilo.columnWidth,
      columnGap: estilo.columnGap,
      contiene: estilo.contain,
      transform: estilo.transform === "none" ? "none" : estilo.transform.slice(0, 40),
      posicion: estilo.position,
    };
  };
  /* La cadena desde la tarjeta del cuestionario hacia arriba. */
  const tarjeta = document.querySelector("#content .quiz-card, #content .quiz-panel");
  const cadena = [];
  let nodo = tarjeta;
  while (nodo && nodo !== document.documentElement) {
    cadena.push(describir(nodo, "<" + nodo.tagName.toLowerCase() + ">"));
    nodo = nodo.parentElement;
  }
  /* Elementos cuyo contenido se sale de su caja por la derecha. */
  const desbordes = Array.from(document.querySelectorAll("#content *"))
    .filter((el) => el.scrollWidth > el.clientWidth + 8 && el.clientWidth > 40)
    .slice(0, 6)
    .map((el) => ({
      clase: (el.className || "").toString().slice(0, 50),
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      overflow: getComputedStyle(el).overflowX,
    }));
  return { cadenaHaciaArriba: cadena, desbordes };
});

console.log(JSON.stringify(datos, null, 1).slice(0, 3200));
await browser.close();
