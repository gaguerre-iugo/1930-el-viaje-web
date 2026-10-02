// ¿Cómo posiciona el motor las columnas y quién debería recortar?
// Busca el contenedor con columnas múltiples, los que tienen transform y los que
// desbordan, con su caja y su overflow. Sin plantillas de cadena.
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
await page.waitForTimeout(1500);

const datos = await page.evaluate(() => {
  const describir = (nodo) => {
    const estilo = getComputedStyle(nodo);
    const caja = nodo.getBoundingClientRect();
    return {
      etiqueta:
        "<" + nodo.tagName.toLowerCase() + " " + (nodo.className || "").toString().slice(0, 54) + ">",
      id: nodo.id || "",
      caja: {
        x: Math.round(caja.x),
        ancho: Math.round(caja.width),
        alto: Math.round(caja.height),
      },
      overflow: estilo.overflowX + "/" + estilo.overflowY,
      columnas: estilo.columnCount + " · " + estilo.columnWidth + " · gap " + estilo.columnGap,
      transform: estilo.transform === "none" ? "none" : estilo.transform.slice(0, 46),
      posicion: estilo.position,
      scrollLeft: nodo.scrollLeft,
      scrollWidth: nodo.scrollWidth,
      clientWidth: nodo.clientWidth,
      zIndex: estilo.zIndex,
    };
  };

  const todos = Array.from(document.querySelectorAll("body *"));
  /* 1 · Quién tiene columnas múltiples. */
  const conColumnas = todos
    .filter((nodo) => {
      const columnas = getComputedStyle(nodo).columnCount;
      return columnas !== "auto" && Number(columnas) > 1;
    })
    .slice(0, 5)
    .map(describir);
  /* 2 · Quién se mueve con transform. */
  const conTransform = todos
    .filter((nodo) => getComputedStyle(nodo).transform !== "none")
    .slice(0, 8)
    .map(describir);
  /* 3 · Quién desborda su caja. */
  const desbordan = todos
    .filter((nodo) => nodo.clientWidth > 200 && nodo.scrollWidth > nodo.clientWidth + 40)
    .slice(0, 6)
    .map(describir);
  return { conColumnas, conTransform, desbordan };
});

console.log("=== con columnas múltiples ===");
console.log(JSON.stringify(datos.conColumnas, null, 1).slice(0, 1400));
console.log("\n=== con transform ===");
console.log(JSON.stringify(datos.conTransform, null, 1).slice(0, 2000));
console.log("\n=== que desbordan ===");
console.log(JSON.stringify(datos.desbordan, null, 1).slice(0, 1600));
await browser.close();
