// Captura el cuestionario con la devolución desplegada, incluida la opción LARGA
// (la del barco y las selecciones), que es la que envuelve a dos líneas. Sirve para
// la verificación visual del recorte de la fila.
//
// Uso:
//   node _captura-quiz.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const SECCION = argVal("--seccion") || "quiz_final";
const CLAVE = "adt-reflow-font-size:1930-libro-completo-v47";

/* Anchos que obligan a la opción larga a ocupar dos líneas. */
const vistas = [
  { ancho: 892, alto: 681, letra: "normal" },
  { ancho: 800, alto: 600, letra: "normal" },
  { ancho: 1280, alto: 720, letra: "normal" },
  { ancho: 1366, alto: 900, letra: "xlarge" }
];

const browser = await chromium.launch();
for (const vista of vistas) {
  const contexto = await browser.newContext({ viewport: { width: vista.ancho, height: vista.alto } });
  const page = await contexto.newPage();
  await page.goto(target.split("#")[0] + "#" + SECCION, { waitUntil: "load" });
  await page.evaluate(({ clave, letra }) => localStorage.setItem(clave, letra), { clave: CLAVE, letra: vista.letra });
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(2000);

  await page.evaluate((SECCION) => {
    const panel = document.querySelector(`[data-section-id="${SECCION}"] .quiz-panel`);
    const larga = [...panel.querySelectorAll(".quiz-option")].sort(
      (a, b) => (b.textContent || "").length - (a.textContent || "").length
    )[0];
    larga.querySelector('input[type="radio"]').click();
    const envio = panel.querySelector("button.quiz-submit");
    envio.disabled = false;
    envio.click();
  }, SECCION);
  await page.waitForTimeout(2800);

  for (let intento = 0; intento < 6; intento += 1) {
    const listo = await page.evaluate((SECCION) => {
      const seccion = document.querySelector(`[data-section-id="${SECCION}"]`);
      const content = document.getElementById("content");
      const visorLeft = content.getBoundingClientRect().left;
      const ancho = content.clientWidth;
      const caja = seccion.getBoundingClientRect();
      const actual = Math.round(content.scrollLeft / ancho);
      const objetivo = Math.floor((content.scrollLeft + (caja.left - visorLeft)) / ancho);
      if (objetivo !== actual) {
        const boton = document.getElementById(objetivo > actual ? "reflow-next" : "reflow-previous");
        if (boton) boton.click();
        return false;
      }
      const desvio = caja.left - visorLeft;
      if (Math.abs(desvio) > 24) {
        content.scrollLeft += desvio;
        return false;
      }
      return true;
    }, SECCION);
    if (listo) break;
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(800);

  const caja = await page.evaluate((SECCION) => {
    const card = document.querySelector(`[data-section-id="${SECCION}"] .quiz-card`);
    const c = card.getBoundingClientRect();
    return {
      x: Math.max(0, Math.round(c.left) - 8),
      y: Math.max(0, Math.round(c.top) - 8),
      width: Math.min(window.innerWidth, Math.round(c.width) + 16),
      height: Math.min(window.innerHeight, Math.round(c.height) + 16)
    };
  }, SECCION);
  await page.screenshot({
    path: `tmp/quiz-tarjeta-${vista.ancho}x${vista.alto}-${vista.letra}.png`,
    clip: caja
  });
  console.log(`${vista.ancho}x${vista.alto} ${vista.letra}: capturado`);
  await contexto.close();
}
await browser.close();
