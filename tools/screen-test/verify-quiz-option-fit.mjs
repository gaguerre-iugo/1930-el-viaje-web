// La fila de la opción marcada cortaba su propio texto: el motor le fija la altura
// que midió ANTES de enviar (`--reflow-quiz-option-interaction-height`) y, cuando el
// texto pasa a dos o tres líneas, la última se sale de la fila. Medido con el texto
// envolviendo después de enviar: fila de 43,03 px con tres líneas de texto y la
// última 37,42 px por debajo del borde.
//
// Esta prueba cubre las dos formas del problema:
//   1. la opción marcada es la más larga (que es el caso real de la captura);
//   2. el texto se alarga DESPUÉS de enviar, que es lo que dispara el corte.
// En las dos exige que cada línea del texto entre en la caja de su fila y que el
// contenido no exceda la fila.
//
// Uso:
//   node verify-quiz-option-fit.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";
const CLAVE = "adt-reflow-font-size:1930-libro-completo-v47";
const TOLERANCIA = 0.5;

const vistas = [
  { ancho: 1366, alto: 900, letra: "normal" },
  { ancho: 1024, alto: 768, letra: "normal" },
  { ancho: 892, alto: 681, letra: "normal" },
  { ancho: 952, alto: 645, letra: "normal" },
  { ancho: 800, alto: 600, letra: "normal" },
  { ancho: 947, alto: 700, letra: "large" },
  { ancho: 1366, alto: 900, letra: "xlarge" }
];

const fallas = [];
const fail = (mensaje) => fallas.push(mensaje);
const browser = await chromium.launch();
const erroresConsola = [];

/* Medición de las filas de opción de la sección visible. */
const MEDIR_FILAS = (SECCION) => {
  const seccion = document.querySelector('[data-section-id="' + SECCION + '"]');
  if (!seccion) return [];
  const filas = [...seccion.querySelectorAll(".quiz-option")];
  return filas.map((fila) => {
    const texto = fila.querySelector(".quiz-option-text");
    if (!texto) return { hay: false };
    const cajaFila = fila.getBoundingClientRect();
    const rango = document.createRange();
    rango.selectNodeContents(texto);
    const lineas = [...rango.getClientRects()].map((c) => ({
      top: c.top,
      bottom: c.bottom,
      right: c.right
    }));
    const ultima = lineas[lineas.length - 1];
    const estilo = getComputedStyle(fila);
    return {
      hay: true,
      texto: (texto.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
      marcada: fila.classList.contains("is-correct") || fila.classList.contains("is-incorrect"),
      fila: {
        top: Math.round(cajaFila.top * 100) / 100,
        bottom: Math.round(cajaFila.bottom * 100) / 100,
        right: Math.round(cajaFila.right * 100) / 100,
        alto: Math.round(cajaFila.height * 100) / 100
      },
      height: estilo.height,
      overflowY: estilo.overflowY,
      scrollHeight: fila.scrollHeight,
      clientHeight: fila.clientHeight,
      excede: fila.scrollHeight > fila.clientHeight + 1,
      cantidadLineas: lineas.length,
      ultimaLineaSeSale: ultima ? Math.round((ultima.bottom - cajaFila.bottom) * 100) / 100 : null,
      ultimaLineaSeVa: ultima ? Math.round((ultima.right - cajaFila.right) * 100) / 100 : null
    };
  });
};

/* Deja la sección del cuestionario en la página visible del paginado. */
const esperarEnPagina = async (page, SECCION) => {
  for (let intento = 0; intento < 10; intento += 1) {
    const listo = await page.evaluate((SECCION) => {
      const seccion = document.querySelector('[data-section-id="' + SECCION + '"]');
      if (!seccion) return true;
      const content = document.getElementById("content");
      if (!content) return false;
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
    if (listo) return;
    await page.waitForTimeout(600);
  }
};

/* `page.reload()` a veces no alcanza a montar el paginador (medido: TimeoutError
   esperando `#reflow-pagination button`). Se reintenta la carga en vez de dar por
   fallida la corrida: la prueba mide el producto, no el tiempo del motor. */
const recargarYEsperar = async (page, target) => {
  for (let intento = 0; intento < 3; intento += 1) {
    try {
      await page.goto(target, { waitUntil: "load" });
      await page.waitForSelector("#reflow-pagination button", { timeout: 20000 });
      await page.waitForTimeout(1800);
      return true;
    } catch (_error) {
      await page.waitForTimeout(1500);
    }
  }
  return false;
};

const celebrar = async (page, SECCION, { alargar }) => {
  await page.evaluate(
    ({ SECCION, alargar }) => {
      const panel = document.querySelector('[data-section-id="' + SECCION + '"] .quiz-panel');
      const opciones = [...panel.querySelectorAll(".quiz-option")];
      /* La opción más larga es la que más probablemente envuelva. */
      const elegida = opciones.sort(
        (a, b) => (b.textContent || "").length - (a.textContent || "").length
      )[0];
      elegida.querySelector('input[type="radio"]').click();
      const envio = panel.querySelector("button.quiz-submit");
      envio.disabled = false;
      envio.click();
      void alargar;
    },
    { SECCION, alargar }
  );
  await page.waitForTimeout(2600);
  if (alargar) {
    await page.evaluate((SECCION) => {
      const seccion = document.querySelector('[data-section-id="' + SECCION + '"]');
      const fila = [...seccion.querySelectorAll(".quiz-option")].find(
        (f) => f.classList.contains("is-incorrect") || f.classList.contains("is-correct")
      );
      const texto = fila && fila.querySelector(".quiz-option-text");
      if (texto) {
        texto.textContent =
          (texto.textContent || "").trim() +
          " y además, con muchísimo detalle, sobre cada una de las selecciones que participaron del campeonato.";
      }
    }, SECCION);
    await page.waitForTimeout(900);
  }
  await esperarEnPagina(page, SECCION);
  await page.waitForTimeout(700);
};

for (const vista of vistas) {
  const contexto = await browser.newContext({ viewport: { width: vista.ancho, height: vista.alto } });
  const page = await contexto.newPage();
  page.on("pageerror", (error) => erroresConsola.push(String(error)));
  page.on("console", (mensaje) => {
    if (mensaje.type() === "error") erroresConsola.push(mensaje.text());
  });
  /* Primera carga del tamaño: se fija el tamaño de letra y se recarga, con el
     mismo reintento que en las pasadas siguientes. */
  await page.goto(target, { waitUntil: "load" });
  await page.evaluate(({ clave, letra }) => localStorage.setItem(clave, letra), { clave: CLAVE, letra: vista.letra });
  if (!(await recargarYEsperar(page, target))) {
    fail(`${vista.ancho}x${vista.alto} ${vista.letra}: no se pudo cargar el libro`);
    await contexto.close();
    continue;
  }
  await page.waitForTimeout(700);

  const secciones = await page.evaluate(() =>
    [...document.querySelectorAll('[data-section-type="quiz_sequence"]')].map((s) => s.dataset.sectionId)
  );

  console.log(`\n=== ${vista.ancho}x${vista.alto} · letra ${vista.letra} · ${secciones.length} secuencias ===`);

  for (const seccion of secciones) {
    for (const alargar of [false, true]) {
      if (alargar) {
        /* Volver al texto original antes de la segunda pasada, reintentando la
           carga si el paginador no llega a montarse. */
        const recargo = await recargarYEsperar(page, target);
        if (!recargo) {
          fail(`${vista.ancho}x${vista.alto} ${vista.letra} · ${seccion}: no se pudo recargar el libro`);
          continue;
        }
      }
      await celebrar(page, seccion, { alargar });
      const filas = await page.evaluate(MEDIR_FILAS, seccion);
      const malas = filas.filter(
        (fila) =>
          fila.hay &&
          (fila.excede ||
            (fila.ultimaLineaSeSale !== null && fila.ultimaLineaSeSale > TOLERANCIA) ||
            (fila.ultimaLineaSeVa !== null && fila.ultimaLineaSeVa > TOLERANCIA))
      );
      const etiqueta = `${seccion}${alargar ? " (texto alargado después de enviar)" : ""}`;
      const maxLineas = Math.max(...filas.filter((f) => f.hay).map((f) => f.cantidadLineas), 0);
      console.log(
        `${malas.length ? "FALLA" : "ok   "} ${etiqueta} · filas ${filas.filter((f) => f.hay).length} · máx líneas ${maxLineas} · ` +
          `alturas ${filas.filter((f) => f.hay).map((f) => f.fila.alto).join("/")}`
      );
      for (const fila of malas) {
        console.log(
          `      «${fila.texto}» fila [${fila.fila.top}, ${fila.fila.bottom}] alto ${fila.fila.alto} · height ${fila.height} · ` +
            `líneas ${fila.cantidadLineas} · última se sale ${fila.ultimaLineaSeSale} px · excede ${fila.excede} · ` +
            `scrollHeight ${fila.scrollHeight} vs clientHeight ${fila.clientHeight}`
        );
        fail(
          `${vista.ancho}x${vista.alto} ${vista.letra} · ${etiqueta}: la fila «${fila.texto}» corta su texto ` +
            `(${fila.cantidadLineas} líneas, última ${fila.ultimaLineaSeSale} px fuera)`
        );
      }
    }
  }
  await contexto.close();
}

await browser.close();
console.log(`\nconsola: ${erroresConsola.length ? erroresConsola.slice(0, 3).join(" | ") : "sin errores"}`);
if (erroresConsola.length) fail(`errores de consola: ${erroresConsola.slice(0, 3).join(" | ")}`);
console.log(fallas.length ? `\nFALLAS (${fallas.length}):\n - ${fallas.join("\n - ")}` : "\nOK: ninguna fila de opción corta su texto");
process.exit(fallas.length ? 1 : 0);
