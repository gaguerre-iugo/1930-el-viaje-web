// El cuestionario se recortaba: al enviar la respuesta, el motor desplaza la
// devolución con una transformación (`--reflow-quiz-content-shift`) que la empuja
// fuera de la tarjeta, y la tarjeta recorta con `overflow: hidden`. Medido: el
// desplazamiento necesita entre 19 y 33 px más de los que hay, así que la
// devolución y «Siguiente pregunta» quedaban cortados.
//
// Esta prueba responde mal en cada una de las 8 secuencias y exige que, con la
// devolución desplegada, la devolución y el botón entren completos en la tarjeta.
//
// Uso:
//   node verify-quiz-feedback-fit.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const CLAVE = "adt-reflow-font-size:1930-libro-completo-v47";

const vistas = [
  { ancho: 1366, alto: 900, letra: "normal" },
  { ancho: 1280, alto: 720, letra: "normal" },
  { ancho: 1024, alto: 768, letra: "normal" },
  { ancho: 952, alto: 645, letra: "normal" },
  { ancho: 800, alto: 600, letra: "normal" },
  { ancho: 1366, alto: 900, letra: "large" },
  { ancho: 947, alto: 700, letra: "xlarge" }
];

const fallas = [];
const fail = (mensaje) => fallas.push(mensaje);
const TOLERANCIA = 0.5;

const browser = await chromium.launch();
const erroresConsola = [];

for (const vista of vistas) {
  const contexto = await browser.newContext({ viewport: { width: vista.ancho, height: vista.alto } });
  const page = await contexto.newPage();
  page.on("pageerror", (error) => erroresConsola.push(String(error)));
  page.on("console", (mensaje) => {
    if (mensaje.type() === "error") erroresConsola.push(mensaje.text());
  });
  await page.goto(target, { waitUntil: "load" });
  await page.evaluate(({ clave, letra }) => localStorage.setItem(clave, letra), { clave: CLAVE, letra: vista.letra });
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(2500);

  const secciones = await page.evaluate(() =>
    [...document.querySelectorAll('[data-section-type="quiz_sequence"]')].map(
      (seccion) => seccion.dataset.sectionId
    )
  );

  console.log(`\n=== ${vista.ancho}x${vista.alto} · letra ${vista.letra} · ${secciones.length} secuencias ===`);

  for (const seccion of secciones) {
    /* Responder mal la opción más larga de la primera pregunta. */
    const hay = await page.evaluate((SECCION) => {
      const nodo = document.querySelector(`[data-section-id="${SECCION}"]`);
      if (!nodo) return false;
      const panel = nodo.querySelector(".quiz-panel");
      if (!panel) return false;
      const larga = [...panel.querySelectorAll(".quiz-option")].sort(
        (a, b) => (b.textContent || "").length - (a.textContent || "").length
      )[0];
      if (!larga) return false;
      larga.querySelector('input[type="radio"]').click();
      const envio = panel.querySelector("button.quiz-submit");
      if (envio) {
        envio.disabled = false;
        envio.click();
      }
      return true;
    }, seccion);
    if (!hay) {
      fail(`${seccion}: no se encontró la secuencia`);
      continue;
    }

    /* Esperar a que la devolución y el botón se monten y el motor asiente. */
    let listo = false;
    for (let intento = 0; intento < 14 && !listo; intento += 1) {
      await page.waitForTimeout(350);
      listo = await page.evaluate(
        (SECCION) => {
          const nodo = document.querySelector(`[data-section-id="${SECCION}"]`);
          const devolucion = nodo && nodo.querySelector(".quiz-feedback");
          const boton = nodo && nodo.querySelector(".quiz-next-question");
          if (!devolucion || !boton) return false;
          const texto = (devolucion.textContent || "").trim();
          return texto.length > 0;
        },
        seccion
      );
    }

    /* Llevar la sección a la página visible del paginado. */
    for (let intento = 0; intento < 8; intento += 1) {
      const enPagina = await page.evaluate(
        (SECCION) => {
          const nodo = document.querySelector(`[data-section-id="${SECCION}"]`);
          const content = document.getElementById("content");
          const visorLeft = content.getBoundingClientRect().left;
          const ancho = content.clientWidth;
          const caja = nodo.getBoundingClientRect();
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
        },
        seccion
      );
      if (enPagina) break;
      await page.waitForTimeout(600);
    }
    await page.waitForTimeout(500);

    const medicion = await page.evaluate(
      ({ SECCION, TOLERANCIA }) => {
        const nodo = document.querySelector(`[data-section-id="${SECCION}"]`);
        const card = nodo.querySelector(".quiz-card");
        const devolucion = nodo.querySelector(".quiz-feedback");
        const boton = nodo.querySelector(".quiz-next-question");
        if (!card || !devolucion || !boton) return { hay: false };

        const cajaCard = card.getBoundingClientRect();
        const cajaDevolucion = devolucion.getBoundingClientRect();
        const cajaBoton = boton.getBoundingClientRect();

        /* ¿Quién recorta? Se sube por los ancestros con overflow oculto. */
        const recortadores = [];
        let ancestro = card.parentElement;
        while (ancestro && ancestro !== document.documentElement) {
          const estilo = getComputedStyle(ancestro);
          if (estilo.overflowY !== "visible" || estilo.overflowX !== "visible") {
            const caja = ancestro.getBoundingClientRect();
            recortadores.push({
              que: ancestro.id ? "#" + ancestro.id : ancestro.tagName + "." + String(ancestro.className).slice(0, 30),
              bottom: caja.bottom
            });
          }
          ancestro = ancestro.parentElement;
        }
        /* El límite efectivo es el más ajustado de todos los recortadores. */
        const limite = Math.min(cajaCard.bottom, ...recortadores.map((r) => r.bottom));

        const centroBotonX = (cajaBoton.left + cajaBoton.right) / 2;
        const centroBotonY = (cajaBoton.top + cajaBoton.bottom) / 2;
        const pintado = document.elementFromPoint(centroBotonX, Math.min(centroBotonY, window.innerHeight - 1));
        const botonEsLoPintado = Boolean(pintado) && (pintado === boton || boton.contains(pintado));

        return {
          hay: true,
          limite: Math.round(limite * 100) / 100,
          devolucion: {
            top: Math.round(cajaDevolucion.top * 100) / 100,
            bottom: Math.round(cajaDevolucion.bottom * 100) / 100,
            exceso: Math.round((cajaDevolucion.bottom - limite) * 100) / 100
          },
          boton: {
            top: Math.round(cajaBoton.top * 100) / 100,
            bottom: Math.round(cajaBoton.bottom * 100) / 100,
            exceso: Math.round((cajaBoton.bottom - limite) * 100) / 100,
            centroEsLoPintado: botonEsLoPintado,
            dentroDelViewport: cajaBoton.bottom <= window.innerHeight && cajaBoton.top >= 0
          },
          desplazamiento: getComputedStyle(card).getPropertyValue("--reflow-quiz-content-shift").trim() || "0px",
          cardScroll: { scrollHeight: card.scrollHeight, clientHeight: card.clientHeight }
        };
      },
      { SECCION: seccion, TOLERANCIA }
    );

    if (!medicion.hay) {
      fail(`${vista.ancho}x${vista.alto} ${vista.letra} · ${seccion}: no se pudo medir`);
      continue;
    }

    const desbordaDevolucion = medicion.devolucion.exceso > TOLERANCIA;
    const desbordaBoton = medicion.boton.exceso > TOLERANCIA;
    const estado = desbordaDevolucion || desbordaBoton ? "FALLA" : "ok   ";
    console.log(
      `${estado} ${seccion} · límite ${medicion.limite} · devolución exceso ${medicion.devolucion.exceso} · ` +
        `botón exceso ${medicion.boton.exceso} (top ${medicion.boton.top} bottom ${medicion.boton.bottom}) · ` +
        `pintado ${medicion.boton.centroEsLoPintado} · desplazamiento ${medicion.desplazamiento} · card ${medicion.cardScroll.scrollHeight}/${medicion.cardScroll.clientHeight}`
    );
    if (desbordaDevolucion) {
      fail(`${vista.ancho}x${vista.alto} ${vista.letra} · ${seccion}: la devolución se pasa ${medicion.devolucion.exceso}px y queda recortada`);
    }
    if (desbordaBoton) {
      fail(`${vista.ancho}x${vista.alto} ${vista.letra} · ${seccion}: «Siguiente pregunta» se pasa ${medicion.boton.exceso}px y queda recortado`);
    }
    if (!medicion.boton.dentroDelViewport) {
      fail(`${vista.ancho}x${vista.alto} ${vista.letra} · ${seccion}: «Siguiente pregunta» queda fuera del viewport`);
    }
  }
  await contexto.close();
}

await browser.close();
console.log(`\nconsola: ${erroresConsola.length ? erroresConsola.slice(0, 3).join(" | ") : "sin errores"}`);
if (erroresConsola.length) fail(`errores de consola: ${erroresConsola.slice(0, 3).join(" | ")}`);
console.log(fallas.length ? `\nFALLAS (${fallas.length}):\n - ${fallas.join("\n - ")}` : "\nOK: la devolución y «Siguiente pregunta» entran completos en la tarjeta");
process.exit(fallas.length ? 1 : 0);
