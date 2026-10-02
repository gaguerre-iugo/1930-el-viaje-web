// Comprueba que la navegación funcione: flechas de la barra y salto por el índice.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errores = [];
page.on("pageerror", (error) => errores.push(String(error)));
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

const contador = () =>
  page.evaluate(() => {
    const salida = document.getElementById("reflow-page-status");
    return salida ? (salida.textContent || "").replace(/\s+/g, " ").trim() : null;
  });

const inicio = await contador();
console.log("contador inicial: " + inicio);

/* Flecha siguiente tres veces. */
const trasFlechas = [];
for (let i = 0; i < 3; i += 1) {
  await page.click("#reflow-next");
  await page.waitForTimeout(1600);
  trasFlechas.push(await contador());
}
console.log("tras tres veces Siguiente: " + JSON.stringify(trasFlechas));

/* Flecha anterior una vez. */
await page.click("#reflow-previous");
await page.waitForTimeout(1600);
const trasAnterior = await contador();
console.log("tras Anterior: " + trasAnterior);

/* Salto por el índice. */
await page.click("#reflow-index");
await page.waitForTimeout(1800);
const salto = await page.evaluate(() => {
  const botones = Array.from(document.querySelectorAll(".reflow-reader-panel li > button"));
  const destino = botones.find((nodo) => /sinopsis|capítulo|actividad/i.test(nodo.textContent || ""));
  if (!destino) return "sin destino";
  const texto = (destino.textContent || "").trim().slice(0, 30);
  destino.click();
  return texto;
});
await page.waitForTimeout(2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);
const trasIndice = await contador();
console.log("salto por el índice a «" + salto + "» → contador: " + trasIndice);

const avanzo = new Set([inicio, ...trasFlechas, trasAnterior, trasIndice]).size > 1;
const flechasOk = trasFlechas[0] !== inicio;
console.log("\nflechas cambian de página: " + flechasOk);
console.log("el contador cambió en total: " + avanzo);
console.log("consola: " + (errores.length ? errores.slice(0, 2).join(" | ") : "sin errores"));
await browser.close();
process.exit(flechasOk ? 0 : 1);
