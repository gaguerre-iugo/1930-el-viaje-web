// Identifica el recuadro suelto en el estado incorrecto del quiz 1 de la actividad 1.
//
// Dos vías: (a) elementos fuera de la tarjeta que se dibujan sobre ella, y (b) la
// firma visual del recuadro, que es texto blanco sobre turquesa.
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

/* Tercera opción del primer quiz: la incorrecta, que es el estado de la captura. */
const elegida = await page.evaluate(() => {
  const controles = Array.from(
    document.querySelectorAll("#content input[type='radio'], #content [role='radio']")
  );
  const tercero = controles[2] || controles[controles.length - 1];
  if (!tercero) return null;
  tercero.click();
  const fila = tercero.closest("label, li, div");
  return fila ? (fila.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40) : "sin fila";
});
console.log("opción elegida: " + elegida);
await page.waitForTimeout(600);
await page.evaluate(() => {
  const enviar = Array.from(document.querySelectorAll("button")).find(
    (nodo) => /enviar/i.test(nodo.textContent || "") || nodo.getAttribute("title") === "Enviar"
  );
  if (enviar && !enviar.disabled) enviar.click();
});
await page.waitForTimeout(2400);

const datos = await page.evaluate(() => {
  const color = (valor) => {
    const n = (String(valor).match(/[\d.]+/g) || []).map(Number);
    return { r: n[0] || 0, g: n[1] || 0, b: n[2] || 0, a: n.length > 3 ? n[3] : 1 };
  };
  const card = document.querySelector("#content .quiz-card");
  const cajaCard = card ? card.getBoundingClientRect() : null;
  const describir = (nodo) => {
    const r = nodo.getBoundingClientRect();
    const estilo = getComputedStyle(nodo);
    return {
      etiqueta:
        "<" + nodo.tagName.toLowerCase() +
        " id=" + (nodo.id || "-") +
        " class=" + (nodo.className || "").toString().slice(0, 44) + ">",
      caja: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(","),
      texto: (nodo.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34),
      color: estilo.color,
      fondo: estilo.backgroundColor,
      dentroDeLaTarjeta: card ? card.contains(nodo) : null,
    };
  };
  const visibles = Array.from(document.querySelectorAll("body *")).filter((nodo) => {
    const r = nodo.getBoundingClientRect();
    return r.width > 10 && r.height > 8 && r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight;
  });
  /* (a) fuera de la tarjeta pero encima de ella */
  const encima = cajaCard
    ? visibles.filter((nodo) => {
        const r = nodo.getBoundingClientRect();
        const texto = (nodo.textContent || "").trim();
        if (!texto || texto.length > 34 || card.contains(nodo)) return false;
        return r.right > cajaCard.left && r.left < cajaCard.right && r.bottom > cajaCard.top && r.top < cajaCard.bottom;
      })
    : [];
  /* (b) firma visual: texto blanco sobre un fondo turquesa oscuro */
  const firma = visibles.filter((nodo) => {
    const estilo = getComputedStyle(nodo);
    const t = color(estilo.color);
    const f = color(estilo.backgroundColor);
    const texto = (nodo.textContent || "").trim();
    if (!texto || texto.length > 34 || f.a < 0.5) return false;
    const blanco = t.r > 230 && t.g > 230 && t.b > 230;
    const turquesa = f.g > 60 && f.g < 170 && f.b > 50 && f.b < 160 && f.r < 90;
    return blanco && turquesa;
  });
  return {
    tarjeta: cajaCard ? [Math.round(cajaCard.x), Math.round(cajaCard.y), Math.round(cajaCard.width), Math.round(cajaCard.height)].join(",") : null,
    encimaDeLaTarjeta: encima.slice(0, 6).map(describir),
    firmaBlancoSobreTurquesa: firma.slice(0, 6).map(describir),
  };
});

console.log(JSON.stringify(datos, null, 1).slice(0, 2800));
await page.screenshot({ path: "tmp/quiz-culpable.png" });
await browser.close();
