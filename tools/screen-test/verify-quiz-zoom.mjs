// Filas de opción del cuestionario con la letra agrandada y con zoom del navegador
// (punto 23 y el pendiente del traspaso: «comprobar que la fila de opción no
// desborde con el zoom del navegador»).
//
// Mide, en cada combinación de ancho × tamaño de letra × zoom:
//   - si la fila de opción y su texto se salen de la tarjeta del cuestionario;
//   - si el botón «Siguiente pregunta» queda pegado al borde derecho de la
//     devolución (el pendiente de alineación, que dependía de la grilla);
//   - si algún elemento visible asoma fuera del ancho del viewport.
//
// Uso:
//   node verify-quiz-zoom.mjs
//   node verify-quiz-zoom.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const CLAVE_LETRA = "adt-reflow-font-size:1930-libro-completo-v47";
const SECCION = argVal("--seccion") || "qz010";
const TOLERANCIA = 1; // px, por redondeo subpíxel

const combinaciones = [
  { ancho: 1366, alto: 900, letra: "normal", zoom: 1 },
  { ancho: 1366, alto: 900, letra: "large", zoom: 1 },
  { ancho: 1366, alto: 900, letra: "xlarge", zoom: 1 },
  { ancho: 947, alto: 700, letra: "large", zoom: 1 },
  { ancho: 947, alto: 700, letra: "xlarge", zoom: 1 },
  { ancho: 1366, alto: 900, letra: "large", zoom: 1.25 },
  { ancho: 1366, alto: 900, letra: "xlarge", zoom: 1.5 },
  { ancho: 947, alto: 700, letra: "xlarge", zoom: 1.5 },
  { ancho: 800, alto: 600, letra: "xlarge", zoom: 1.25 }
];

const fallas = [];
const fail = (mensaje) => fallas.push(mensaje);
const browser = await chromium.launch();
const erroresConsola = [];

/* Con el zoom del navegador el viewport CSS se achica: se emula el mismo efecto
   reduciendo el ancho en CSS px, que es exactamente lo que ve el lector. */
async function medir(combinacion) {
  const anchoCss = Math.round(combinacion.ancho / combinacion.zoom);
  const altoCss = Math.round(combinacion.alto / combinacion.zoom);
  const contexto = await browser.newContext({
    viewport: { width: anchoCss, height: altoCss },
    deviceScaleFactor: 1
  });
  const page = await contexto.newPage();
  page.on("pageerror", (error) => erroresConsola.push(String(error)));
  page.on("console", (mensaje) => {
    if (mensaje.type() === "error") erroresConsola.push(mensaje.text());
  });

  const url = target.split("#")[0] + "#" + SECCION;
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(
    ({ clave, letra }) => {
      try {
        localStorage.setItem(clave, letra);
      } catch (_error) {}
    },
    { clave: CLAVE_LETRA, letra: combinacion.letra }
  );
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(1000);

  /* Ubicar la secuencia y responder mal para que se monte la devolución con el
     botón «Siguiente pregunta», que es lo que se quiere medir. */
  await page.evaluate((SECCION) => {
    const seccion = document.querySelector(`[data-section-id="${SECCION}"]`);
    if (!seccion) return;
    const panel = seccion.querySelector(".quiz-panel");
    const opciones = [...panel.querySelectorAll(".quiz-option")];
    const incorrecta = opciones.find((opcion) => opcion.dataset.correct !== "true");
    if (incorrecta) incorrecta.querySelector('input[type="radio"]')?.click();
    const envio = panel.querySelector("button.quiz-submit");
    if (envio) {
      envio.disabled = false;
      envio.click();
    }
  }, SECCION);
  await page.waitForTimeout(1500);

  /* Desplazar el motor hasta la página donde vive esa devolución.
     Ojo con la aritmética: `getBoundingClientRect().left` de la sección es relativo
     al viewport, no al contenido. La página de la sección se saca del borde
     izquierdo del VISOR (`content.getBoundingClientRect().left`), no del 0 de la
     ventana: sumarle el `left` relativo al viewport daba **una página de más** a
     631 px (el botón quedaba en x=−232). */
  const enPaginaDeLaDevolucion = () => {
    return page.evaluate((SECCION) => {
      const seccion = document.querySelector(`[data-section-id="${SECCION}"]`);
      if (!seccion) return false;
      const content = document.getElementById("content");
      const ancho = content.clientWidth;
      const visorLeft = content.getBoundingClientRect().left;
      const caja = seccion.getBoundingClientRect();
      /* Izquierda de la sección referida al contenido desplazado. */
      const izquierdaAbsoluta = content.scrollLeft + (caja.left - visorLeft);
      const actual = Math.round(content.scrollLeft / ancho);
      const objetivo = Math.floor(izquierdaAbsoluta / ancho);
      const botonPagina = document.getElementById(objetivo > actual ? "reflow-next" : "reflow-previous");
      if (botonPagina && objetivo !== actual) {
        botonPagina.click();
        return false;
      }
      /* Alineación fina: si la sección quedó fuera del visor por el redondeo de
         página, se corrige el desplazamiento de una vez (el motor lo admite: su
         propia navegación asigna `scrollLeft`). */
      const desvio = caja.left - visorLeft;
      if (Math.abs(desvio) > 24) {
        content.scrollLeft += desvio;
        return false;
      }
      /* Ya está en la página: la devolución tiene que estar montada y sus filas de
         opción dentro de la página visible, o la medición sería sobre nada. */
      const centro = (elemento) => {
        const caja = elemento.getBoundingClientRect();
        return caja.width > 0 && caja.left + caja.width / 2 > 0 && caja.left + caja.width / 2 < ancho;
      };
      const panel = seccion.querySelector(".quiz-panel");
      const hayDevolucion = Boolean(seccion.querySelector(".quiz-feedback .quiz-next-question"));
      const opcionesEnPagina = panel
        ? [...panel.querySelectorAll(".quiz-option")].filter(centro).length
        : 0;
      if (!hayDevolucion || opcionesEnPagina === 0) return false;
      /* Último chequeo antes de medir: la sección tiene que estar DENTRO del visor
         (si el motor revirtió el desplazamiento, se vuelve a intentar). */
      return Math.abs(caja.left - visorLeft) <= 24;
    }, SECCION);
  };

  /* El motor repagina en ciclos: se insiste hasta que la página y las filas estén
     listas, para no medir una combinación sobre una página vacía (encontraría cero
     filas y daría «ok» sin haber mirado nada). */
  let listo = false;
  for (let intento = 0; intento < 8 && !listo; intento += 1) {
    listo = await enPaginaDeLaDevolucion();
    if (listo) break;
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(400);

  /* Con la letra extra grande en un viewport chico el botón puede quedar debajo del
     pliegue. Se lo trae con desplazamiento VERTICAL del visor (el paginado corre en
     horizontal, así que la columna no se mueve) para poder medir su alineación. */
  await page.evaluate((SECCION) => {
    const seccion = document.querySelector(`[data-section-id="${SECCION}"]`);
    const boton = seccion && seccion.querySelector(".quiz-feedback .quiz-next-question");
    if (!boton) return;
    const contenedor = document.getElementById("content");
    const caja = boton.getBoundingClientRect();
    if (caja.top < 0 || caja.bottom > window.innerHeight) {
      contenedor.scrollTop += caja.top - 120;
    }
  }, SECCION);
  await page.waitForTimeout(300);

  const medicion = await page.evaluate(
    ({ SECCION, TOLERANCIA }) => {
      const seccion = document.querySelector(`[data-section-id="${SECCION}"]`);
      if (!seccion) return { hay: false };
      const content = document.getElementById("content");
      const ancho = content.clientWidth;

      /* Sólo lo que está en la página visible del paginado. */
      const enPagina = (elemento) => {
        const caja = elemento.getBoundingClientRect();
        const centro = caja.left + caja.width / 2;
        return caja.width > 0 && centro > 0 && centro < ancho;
      };

      const opciones = [...seccion.querySelectorAll(".quiz-option")].filter(enPagina);
      const filas = opciones.map((opcion) => {
        const caja = opcion.getBoundingClientRect();
        const texto = opcion.querySelector("span, label, p");
        const cajaTexto = texto ? texto.getBoundingClientRect() : null;
        const card = opcion.closest(".quiz-card");
        const cajaCard = card ? card.getBoundingClientRect() : null;
        return {
          texto: (texto ? texto.textContent : opcion.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
          left: Math.round(caja.left * 100) / 100,
          right: Math.round(caja.right * 100) / 100,
          ancho: Math.round(caja.width * 100) / 100,
          textoRight: cajaTexto ? Math.round(cajaTexto.right * 100) / 100 : null,
          cardLeft: cajaCard ? Math.round(cajaCard.left * 100) / 100 : null,
          cardRight: cajaCard ? Math.round(cajaCard.right * 100) / 100 : null,
          desbordaTarjeta: cajaCard
            ? caja.right > cajaCard.right + TOLERANCIA || caja.left < cajaCard.left - TOLERANCIA
            : false,
          textoDesbordaFila: cajaTexto
            ? cajaTexto.right > caja.right + TOLERANCIA || cajaTexto.left < caja.left - TOLERANCIA
            : false,
          desbordaViewport: caja.right > window.innerWidth + TOLERANCIA || caja.left < -TOLERANCIA
        };
      });

      const boton = seccion.querySelector(".quiz-feedback .quiz-next-question");
      let alineacion = null;
      const cajaBotonCruda = boton ? boton.getBoundingClientRect() : null;
      if (boton && cajaBotonCruda) {
        const caja = boton.getBoundingClientRect();
        const padre = boton.parentElement;
        const cajaPadre = padre.getBoundingClientRect();
        /* El borde derecho del texto de la devolución es el que manda: el botón
           tiene que terminar ahí, no en el borde de la grilla. */
        const textoFeedback = padre.querySelector(".quiz-feedback-text");
        const cajaTexto = textoFeedback ? textoFeedback.getBoundingClientRect() : null;
        alineacion = {
          botonLeft: Math.round(caja.left * 100) / 100,
          botonRight: Math.round(caja.right * 100) / 100,
          padreRight: Math.round(cajaPadre.right * 100) / 100,
          textoRight: cajaTexto ? Math.round(cajaTexto.right * 100) / 100 : null,
          gridTemplateColumns: getComputedStyle(padre).gridTemplateColumns,
          gridColumn: getComputedStyle(boton).gridColumn,
          justifySelf: getComputedStyle(boton).justifySelf,
          float: getComputedStyle(boton).float,
          anchoBoton: Math.round(caja.width * 100) / 100,
          desborda: caja.right > window.innerWidth + TOLERANCIA,
          separacionDelBorde: Math.round((cajaPadre.right - caja.right) * 100) / 100
        };
      }

      /* Elementos visibles que asoman fuera del ancho del viewport. */
      const desbordes = [];
      for (const elemento of seccion.querySelectorAll(".quiz-option, .quiz-feedback, .quiz-next-question, .quiz-card")) {
        if (!enPagina(elemento)) continue;
        const caja = elemento.getBoundingClientRect();
        if (caja.right > window.innerWidth + TOLERANCIA || caja.left < -TOLERANCIA) {
          desbordes.push({
            clase: elemento.className,
            left: Math.round(caja.left),
            right: Math.round(caja.right)
          });
        }
      }

      return {
        hay: true,
        anchoCss: ancho,
        viewport: window.innerWidth,
        letra: document.body.dataset.reflowFontSize,
        escala: getComputedStyle(content).getPropertyValue("--reflow-font-scale").trim(),
        cantidadOpcionesEnPagina: filas.length,
        filas,
        alineacion,
        /* Si el botón existe pero no se pudo medir, se informa dónde quedó: así el
           estado no se pierde en silencio. */
        botonSinMedir: !alineacion && cajaBotonCruda
          ? {
              left: Math.round(cajaBotonCruda.left * 100) / 100,
              right: Math.round(cajaBotonCruda.right * 100) / 100,
              top: Math.round(cajaBotonCruda.top),
              bottom: Math.round(cajaBotonCruda.bottom),
              enPaginaHorizontal: enPagina(boton),
              dentroDelViewport:
                cajaBotonCruda.left >= 0 &&
                cajaBotonCruda.right <= window.innerWidth &&
                cajaBotonCruda.top >= 0 &&
                cajaBotonCruda.bottom <= window.innerHeight
            }
          : null,
        hayBoton: Boolean(boton),
        desbordes
      };
    },
    { SECCION, TOLERANCIA }
  );

  await contexto.close();
  return medicion;
}

console.log("Letra grande, extra grande y zoom del navegador sobre las filas de opción\n");
for (const combinacion of combinaciones) {
  const etiqueta = `${combinacion.ancho}x${combinacion.alto} · letra ${combinacion.letra} · zoom ${combinacion.zoom}`;
  const medicion = await medir(combinacion);
  if (!medicion.hay) {
    console.log(`FALTA  ${etiqueta}: no se encontró la sección ${SECCION}`);
    fail(`${etiqueta}: no se encontró la sección ${SECCION}`);
    continue;
  }
  const filasMal = medicion.filas.filter(
    (fila) => fila.desbordaTarjeta || fila.textoDesbordaFila || fila.desbordaViewport
  );
  if (!medicion.cantidadOpcionesEnPagina) {
    console.log(`FALLA  ${etiqueta}: no se midió ninguna fila de opción en la página`);
    fail(`${etiqueta}: no se midió ninguna fila de opción (la medición sería vacía)`);
    continue;
  }
  const alineado = medicion.alineacion
    ? medicion.alineacion.separacionDelBorde >= 0 && medicion.alineacion.separacionDelBorde <= 24
    : null;
  const estado = filasMal.length || medicion.desbordes.length || alineado === false ? "FALLA" : "ok   ";
  console.log(
    `${estado} ${etiqueta} · viewport CSS ${medicion.viewport}px · escala ${medicion.escala} · ` +
      `opciones ${medicion.cantidadOpcionesEnPagina} · ` +
      (medicion.alineacion
        ? `botón a ${medicion.alineacion.separacionDelBorde}px del borde derecho (${medicion.alineacion.gridColumn}) · `
        : medicion.botonSinMedir
          ? `botón sin medir (left=${medicion.botonSinMedir.left}, top=${medicion.botonSinMedir.top}, ` +
            `en página ${medicion.botonSinMedir.enPaginaHorizontal}, en viewport ${medicion.botonSinMedir.dentroDelViewport}) · `
          : medicion.hayBoton
            ? "sin botón medido · "
            : "sin «Siguiente pregunta» (respuesta correcta) · ") +
      `desbordes ${medicion.desbordes.length}`
  );
  for (const fila of filasMal) {
    console.log(
      `      fila «${fila.texto}» left=${fila.left} right=${fila.right} tarjeta=[${fila.cardLeft},${fila.cardRight}] ` +
        `textoRight=${fila.textoRight} tarjeta=${fila.desbordaTarjeta} texto=${fila.textoDesbordaFila} viewport=${fila.desbordaViewport}`
    );
    fail(`${etiqueta}: la fila de opción «${fila.texto}» desborda`);
  }
  for (const desborde of medicion.desbordes) {
    console.log(`      desborda viewport: ${desborde.clase} [${desborde.left}, ${desborde.right}]`);
    fail(`${etiqueta}: ${desborde.clase} asoma fuera del viewport`);
  }
  if (medicion.alineacion && !alineado) {
    console.log(
      `      botón left=${medicion.alineacion.botonLeft} right=${medicion.alineacion.botonRight} ` +
        `textoRight=${medicion.alineacion.textoRight} padreRight=${medicion.alineacion.padreRight} ` +
        `grid=${medicion.alineacion.gridTemplateColumns} float=${medicion.alineacion.float}`
    );
    fail(`${etiqueta}: «Siguiente pregunta» no queda a la derecha de la devolución`);
  }
}

console.log(`\nconsola: ${erroresConsola.length ? erroresConsola.slice(0, 3).join(" | ") : "sin errores"}`);
if (erroresConsola.length) fail(`errores de consola: ${erroresConsola.slice(0, 3).join(" | ")}`);

await browser.close();
console.log(fallas.length ? `\nFALLAS:\n - ${fallas.join("\n - ")}` : "\nOK: las filas de opción y el botón aguantan letra grande y zoom");
process.exit(fallas.length ? 1 : 0);
