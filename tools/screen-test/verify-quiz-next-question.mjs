// Verifica el botón «Siguiente pregunta» de punta a punta: falla la respuesta,
// presiona el botón y comprueba que el kicker pasa de «Pregunta 1» a «Pregunta 2».
// Es la reproducción exacta del problema reportado.
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:5501/index.html";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errores = [];
page.on("pageerror", (error) => errores.push(String(error)));
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

/* Kicker visible: «Comprensión lectora · Pregunta N de 3». */
const kicker = () =>
  page.evaluate(() => {
    const nodo = Array.from(document.querySelectorAll("#content *")).find((el) =>
      /Pregunta\s+\d+\s+de\s+\d+/i.test((el.textContent || "").trim()) && (el.textContent || "").length < 80
    );
    return nodo ? (nodo.textContent || "").replace(/\s+/g, " ").trim() : "sin kicker";
  });

console.log("antes de responder: " + (await kicker()));

/* Fallar: tercera opción y enviar. */
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
console.log("después de enviar:  " + (await kicker()));

/* Presionar «Siguiente pregunta». */
const hayBoton = await page.evaluate(() => {
  const boton = document.querySelector("#content .quiz-next-question");
  if (!boton) return false;
  boton.click();
  return true;
});
console.log("había botón «Siguiente pregunta»: " + hayBoton);
await page.waitForTimeout(2600);
const despues = await kicker();
console.log("después del botón:  " + despues);

const avanzo = /pregunta\s+2/i.test(despues);
console.log("\n¿avanzó a la pregunta 2?: " + avanzo);
console.log("consola: " + (errores.length ? errores.slice(0, 2).join(" | ") : "sin errores"));
await page.screenshot({ path: "tmp/quiz-siguiente.png" });
await browser.close();
process.exit(avanzo ? 0 : 1);
