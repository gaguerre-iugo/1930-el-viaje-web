// Contraste exacto del blanco sobre el color de cuestionario (--ceibal-quiz-page),
// que es el que usan cuatro reglas propias con color #fff.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto(process.argv[2] || "http://127.0.0.1:5501/index.html", { waitUntil: "load" });
await page.waitForTimeout(2500);

const datos = await page.evaluate(() => {
  const raiz = getComputedStyle(document.documentElement);
  const color = (valor) => {
    const n = (String(valor).match(/[\d.]+/g) || []).map(Number);
    return { r: n[0] || 0, g: n[1] || 0, b: n[2] || 0 };
  };
  const luminancia = ({ r, g, b }) => {
    const canal = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  };
  const contraste = (uno, otro) => {
    const a = luminancia(uno);
    const b = luminancia(otro);
    return Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2));
  };
  /* Se resuelve el valor con un elemento real, así el navegador calcula los var(). */
  const sonda = document.createElement("div");
  sonda.style.color = "var(--ceibal-quiz-page)";
  document.body.appendChild(sonda);
  const quiz = color(getComputedStyle(sonda).color);
  sonda.style.color = "var(--ceibal-institutional-600)";
  const seiscientos = color(getComputedStyle(sonda).color);
  sonda.remove();
  return {
    quizPage: `rgb(${quiz.r}, ${quiz.g}, ${quiz.b})`,
    blancoSobreQuiz: contraste({ r: 255, g: 255, b: 255 }, quiz),
    negroSobreQuiz: contraste({ r: 21, g: 23, b: 26 }, quiz),
    institucional600: `rgb(${seiscientos.r}, ${seiscientos.g}, ${seiscientos.b})`,
    blancoSobre600: contraste({ r: 255, g: 255, b: 255 }, seiscientos),
  };
});

console.log(JSON.stringify(datos, null, 1));
await browser.close();
