// Lista los elementos que se dibujan SOBRE la tarjeta del cuestionario, con texto
// corto: ahí tiene que estar el recuadro suelto. Filtro corregido (dentro de la
// pantalla y no fuera), que es lo que se me pasó antes.
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
  const card = document.querySelector("#content .quiz-card");
  if (!card) return { error: "sin tarjeta" };
  const cajaCard = card.getBoundingClientRect();
  const describir = (nodo) => {
    const r = nodo.getBoundingClientRect();
    const estilo = getComputedStyle(nodo);
    return {
      etiqueta:
        "<" + nodo.tagName.toLowerCase() +
        " id=" + (nodo.id || "-") +
        " class=" + (nodo.className || "").toString().slice(0, 40) + ">",
      caja: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(","),
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30),
      color: estilo.color,
      fondo: estilo.backgroundColor,
      z: estilo.zIndex,
      pos: estilo.position,
      dentroDeLaTarjeta: card.contains(nodo),
    };
  };
  /* Elementos dentro de la pantalla cuya caja toca la de la tarjeta y con texto corto. */
  const sospechosos = Array.from(document.querySelectorAll("body *")).filter((nodo) => {
    const r = nodo.getBoundingClientRect();
    if (r.width < 12 || r.height < 8) return false;
    if (r.left < 0 || r.top < 0 || r.right > window.innerWidth || r.bottom > window.innerHeight) return false;
    const texto = (nodo.textContent || "").trim();
    if (!texto || texto.length > 34) return false;
    const seCruza =
      r.right > cajaCard.left && r.left < cajaCard.right && r.bottom > cajaCard.top && r.top < cajaCard.bottom;
    return seCruza && !card.contains(nodo);
  });
  return {
    tarjeta: [Math.round(cajaCard.x), Math.round(cajaCard.y), Math.round(cajaCard.width), Math.round(cajaCard.height)].join(","),
    fueraDeLaTarjetaSobreElla: sospechosos.slice(0, 8).map(describir),
  };
});

console.log(JSON.stringify(datos, null, 1).slice(0, 2600));
await page.screenshot({ path: "tmp/quiz-sangrado.png" });
await browser.close();
