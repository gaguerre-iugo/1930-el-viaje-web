// Localiza el texto suelto que sangra sobre la tarjeta del cuestionario y muestra
// su cadena de ancestros, para saber qué contenedor abarca la fila del paginado.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Ir a una actividad y responder, para reproducir el estado que sangra. */
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
    return Math.round(r.x) + "," + Math.round(r.y) + " " + Math.round(r.width) + "x" + Math.round(r.height);
  };
  const describir = (nodo) => {
    const estilo = getComputedStyle(nodo);
    return (
      "<" + nodo.tagName.toLowerCase() +
      " id=" + (nodo.id || "-") +
      " class=" + (nodo.className || "").toString().slice(0, 46) + ">" +
      " [" + caja(nodo) + "]" +
      " ovf=" + estilo.overflowX +
      " pos=" + estilo.position +
      " z=" + estilo.zIndex
    );
  };

  /* El texto suelto: fragmentos cortos con «quiere» o «seguir» visibles en pantalla. */
  const candidatos = Array.from(document.querySelectorAll("body *")).filter((nodo) => {
    const propio = Array.from(nodo.childNodes)
      .filter((hijo) => hijo.nodeType === 3)
      .map((hijo) => hijo.textContent.trim())
      .join(" ");
    if (!/quiere|seguir/i.test(propio)) return false;
    const r = nodo.getBoundingClientRect();
    return r.width > 8 && r.height > 6 && r.top > 0 && r.left > 0 && r.bottom < window.innerHeight;
  });

  const muestras = candidatos.slice(0, 3).map((nodo) => {
    const cadena = [];
    let actual = nodo;
    let nivel = 0;
    while (actual && actual !== document.documentElement && nivel < 10) {
      cadena.push(describir(actual));
      actual = actual.parentElement;
      nivel += 1;
    }
    return {
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
      cadena,
    };
  });

  /* Y el contenedor que abarca la fila: el de mayor ancho dentro de body. */
  const anchos = Array.from(document.querySelectorAll("body *"))
    .map((nodo) => ({ nodo, ancho: nodo.getBoundingClientRect().width }))
    .filter((par) => par.ancho > window.innerWidth * 1.2)
    .sort((a, b) => b.ancho - a.ancho)
    .slice(0, 6)
    .map((par) => describir(par.nodo) + " ancho=" + Math.round(par.ancho));

  return { muestras, contenedoresAnchos: anchos };
});

console.log("=== textos sueltos y su cadena de ancestros ===");
console.log(JSON.stringify(datos.muestras, null, 1).slice(0, 2600));
console.log("\n=== contenedores mas anchos que la ventana ===");
for (const linea of datos.contenedoresAnchos) console.log("  " + linea);
await browser.close();
