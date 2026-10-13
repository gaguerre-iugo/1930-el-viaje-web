// Botón de avance del cuestionario: «Siguiente pregunta» / «Saltar».
//
// Pedido: con la respuesta correcta el botón usa el estilo EVA primario
// (`Siguiente_pregunta.svg`: pastilla rellena institucional-500 con texto blanco)
// y va DEBAJO del cuadro de devolución, dentro de la tarjeta blanca. Con la
// respuesta incorrecta usa el estilo secundario (`Saltar.svg`: pastilla con
// borde, fondo blanco y texto institucional-500) y dice «Saltar».
//
// Uso:
//   node verify-quiz-button.mjs
//   node verify-quiz-button.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";

const fallas = [];
const fail = (m) => fallas.push(m);
const OK = "rgb(0, 128, 120)"; // institucional-500 (#008078)

const browser = await chromium.launch();

async function estado(opciones) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on("pageerror", (e) => fail("error de página: " + String(e).slice(0, 120)));
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(3500);
  await page.evaluate(() => {
    const content = document.getElementById("content");
    const card = document.querySelector('.quiz-panel[data-quiz-id="qz001"] .quiz-card');
    const colW = content.clientWidth;
    const left = card.getBoundingClientRect().left - content.getBoundingClientRect().left + content.scrollLeft;
    if (window.__adtReflowGoToVisualPage) window.__adtReflowGoToVisualPage(Math.round(left / colW) + 1);
  });
  await page.waitForTimeout(600);
  for (const idx of opciones) {
    await page.evaluate((i) => {
      const card = document.querySelector('.quiz-panel[data-quiz-id="qz001"] .quiz-card');
      const opts = card.querySelectorAll(".quiz-option");
      opts[i].click();
      card.querySelector(".quiz-submit").click();
      return true;
    }, idx);
    await page.waitForTimeout(900);
  }
  const r = await page.evaluate(() => {
    const card = document.querySelector('.quiz-panel[data-quiz-id="qz001"] .quiz-card');
    const fb = card.querySelector(".quiz-feedback");
    const btn = card.querySelector(".quiz-next-question");
    if (!btn) return { sinBoton: true };
    const cs = getComputedStyle(btn);
    const cb = card.getBoundingClientRect();
    const fbB = fb.getBoundingClientRect();
    const bB = btn.getBoundingClientRect();
    return {
      correcta: fb.classList.contains("is-correct"),
      incorrecta: fb.classList.contains("is-incorrect"),
      texto: btn.textContent.trim(),
      esSaltar: btn.classList.contains("is-skip"),
      esSiguiente: btn.classList.contains("is-next"),
      padreEsTarjeta: btn.parentElement.classList.contains("quiz-card"),
      bg: cs.backgroundColor,
      color: cs.color,
      borderColor: cs.borderTopColor,
      borderWidth: cs.borderTopWidth,
      radius: cs.borderRadius,
      abajoDelCuadro: bB.top >= fbB.bottom - 1,
      dentroDeLaTarjeta: bB.top >= cb.top - 1 && bB.bottom <= cb.bottom + 1,
      botones: card.querySelectorAll(":scope > .quiz-next-question").length
    };
  });
  await page.screenshot({ path: `tmp/quizbtn-${opciones.join("-")}.png` });
  await page.close();
  return r;
}

// qz001: la opción 0 es la correcta y la 1 la incorrecta (verificado en el libro).
const correcto = await estado([0]);
console.log("ACIERTO:", JSON.stringify(correcto));
if (!correcto.correcta) fail("la opción 0 de qz001 no dio por correcta la respuesta");
if (correcto.texto !== "Siguiente pregunta") fail(`en acierto el botón dice «${correcto.texto}»`);
if (!correcto.esSiguiente) fail("en acierto el botón no lleva la clase is-next");
if (correcto.bg !== OK) fail(`en acierto el fondo debería ser ${OK} y es ${correcto.bg}`);
if (correcto.color !== "rgb(255, 255, 255)") fail(`en acierto el texto debería ser blanco y es ${correcto.color}`);
if (parseFloat(correcto.radius) < 20) fail(`en acierto la pastilla debería ser redonda y el radio es ${correcto.radius}`);
if (!correcto.padreEsTarjeta) fail("el botón no cuelga de la tarjeta");
if (!correcto.abajoDelCuadro) fail("el botón no está debajo del cuadro de devolución");
if (!correcto.dentroDeLaTarjeta) fail("el botón se sale de la tarjeta");

const incorrecto = await estado([1]);
console.log("ERROR:  ", JSON.stringify(incorrecto));
if (!incorrecto.incorrecta) fail("la opción 1 de qz001 no dio por incorrecta la respuesta");
if (incorrecto.texto !== "Saltar") fail(`en error el botón debería decir «Saltar» y dice «${incorrecto.texto}»`);
if (!incorrecto.esSaltar) fail("en error el botón no lleva la clase is-skip");
if (incorrecto.bg !== "rgb(255, 255, 255)") fail(`en error el fondo debería ser blanco y es ${incorrecto.bg}`);
if (incorrecto.color !== OK) fail(`en error el texto debería ser ${OK} y es ${incorrecto.color}`);
if (incorrecto.borderColor !== OK) fail(`en error el borde debería ser ${OK} y es ${incorrecto.borderColor}`);
if (parseFloat(incorrecto.radius) < 20) fail(`en error la pastilla debería ser redonda y el radio es ${incorrecto.radius}`);
if (!incorrecto.abajoDelCuadro) fail("en error el botón no está debajo del cuadro de devolución");
if (!incorrecto.dentroDeLaTarjeta) fail("en error el botón se sale de la tarjeta");
if (correcto.botones !== 1) fail(`en acierto hay ${correcto.botones} botones y debería haber 1`);
if (incorrecto.botones !== 1) fail(`en error hay ${incorrecto.botones} botones y debería haber 1`);

/* Reintento: responder mal dos veces no debe apilar un botón por intento. */
const reintento = await estado([1, 2]);
console.log("REINTENTO:", JSON.stringify(reintento));
if (reintento.botones !== 1) fail(`tras reintentar hay ${reintento.botones} botones y debería haber 1`);
if (!reintento.abajoDelCuadro) fail("tras reintentar el botón no está debajo del cuadro");
if (!reintento.dentroDeLaTarjeta) fail("tras reintentar el botón se sale de la tarjeta");

/* Última pregunta: el cierre («¡Listo!…» + «Seguir leyendo») va debajo del cuadro,
   dentro de la tarjeta, para que quede a la vista (antes caía en la columna
   siguiente y no se veía desde la pregunta 3). */
const cierre = await (async () => {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(3500);
  const sid = "quiz_final";
  await page.evaluate((s) => {
    const content = document.getElementById("content");
    const sec = document.querySelector(`[data-section-id="${s}"]`);
    const colW = content.clientWidth;
    const left = sec.getBoundingClientRect().left - content.getBoundingClientRect().left + content.scrollLeft;
    if (window.__adtReflowGoToVisualPage) window.__adtReflowGoToVisualPage(Math.round(left / colW) + 1);
  }, sid);
  await page.waitForTimeout(600);
  for (let q = 0; q < 3; q++) {
    await page.evaluate(({ s, q }) => {
      const sec = document.querySelector(`[data-section-id="${s}"]`);
      const card = sec.querySelectorAll(".quiz-card")[q];
      const opt = card.querySelector(".quiz-option");
      const sub = card.querySelector(".quiz-submit");
      if (opt) opt.click();
      if (sub) sub.click();
    }, { s: sid, q });
    await page.waitForTimeout(800);
    await page.evaluate(({ s, q }) => {
      const sec = document.querySelector(`[data-section-id="${s}"]`);
      const btn = sec.querySelectorAll(".quiz-card")[q].querySelector(".quiz-next-question");
      if (btn) btn.click();
    }, { s: sid, q });
    await page.waitForTimeout(700);
  }
  const r = await page.evaluate((s) => {
    const sec = document.querySelector(`[data-section-id="${s}"]`);
    const card = sec.querySelectorAll(".quiz-card")[2];
    const cierre = sec.querySelector(".quiz-sequence-closing");
    if (!cierre) return { sinCierre: true };
    const cb = card.getBoundingClientRect();
    const cc = cierre.getBoundingClientRect();
    const fila = cierre.querySelector(".quiz-sequence-closing-row");
    const titulo = cierre.querySelector(".quiz-sequence-closing-title");
    const btn = cierre.querySelector(".quiz-keep-reading");
    const ct = titulo ? titulo.getBoundingClientRect() : null;
    const cbt = btn ? btn.getBoundingClientRect() : null;
    const cf = fila ? fila.getBoundingClientRect() : null;
    return {
      texto: cierre.textContent.replace(/\s+/g, " ").trim().slice(0, 44),
      padreEsTarjeta: cierre.parentElement.classList.contains("quiz-card"),
      dentroDeLaTarjeta: cc.top >= cb.top - 1 && cc.bottom <= cb.bottom + 1,
      dentroDelViewport: cc.top >= 0 && cc.bottom <= innerHeight + 1,
      seguirLeyendo: Boolean(btn),
      filaEsFlex: fila ? getComputedStyle(fila).display === "flex" : false,
      mismaLinea: Boolean(ct && cbt) && Math.abs((ct.top + ct.height / 2) - (cbt.top + cbt.height / 2)) < 6,
      botonALaDerecha: Boolean(cbt && cf) && cbt.right >= cf.right - 2,
      tituloALaIzquierda: Boolean(ct && cf) && ct.left <= cf.left + 2
    };
  }, sid);
  await page.screenshot({ path: "tmp/quizbtn-cierre.png" });
  /* «Seguir leyendo» tiene que avanzar de página (antes no hacía nada: buscaba
     «la sección siguiente» en el DOM y caía en la misma página). */
  const antesSeguir = await page.evaluate(() => window.__adtReflowQaState().current);
  await page.click(`[data-section-id="${sid}"] .quiz-keep-reading`);
  await page.waitForTimeout(1200);
  const despuesSeguir = await page.evaluate(() => window.__adtReflowQaState().current);
  r.avanzaSeguir = despuesSeguir > antesSeguir;
  r.paginaSeguir = `${antesSeguir} -> ${despuesSeguir}`;
  await page.close();
  return r;
})();
console.log("CIERRE:", JSON.stringify(cierre));
if (cierre.sinCierre) fail("no apareció el cierre en la última pregunta");
if (!cierre.seguirLeyendo) fail("el cierre no ofrece «Seguir leyendo»");
if (!cierre.padreEsTarjeta) fail("el cierre no quedó dentro de la tarjeta de la última pregunta");
if (!cierre.dentroDelViewport) fail("el cierre no se ve en la última pregunta");
if (!cierre.filaEsFlex) fail("la fila del cierre no es flex");
if (!cierre.mismaLinea) fail("«¡Listo!…» y «Seguir leyendo» no están en la misma línea");
if (!cierre.botonALaDerecha) fail("«Seguir leyendo» no está alineado a la derecha");
if (!cierre.tituloALaIzquierda) fail("«¡Listo!…» no está alineado a la izquierda");
if (!cierre.avanzaSeguir) fail(`«Seguir leyendo» no avanzó de página (${cierre.paginaSeguir})`);

await browser.close();
if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: el botón del quiz usa el estilo EVA y va debajo del cuadro");
