// Verifica el pop-up de voz flotante (revisión UX, punto 25, parte 1):
// que no reserve carril, que flote apoyado en la barra, que quede centrado como
// la barra en pantallas anchas y que en angostas sea una pastilla de íconos.
//
// Uso:
//   node verify-floating-player.mjs
//   node verify-floating-player.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);

const browser = await chromium.launch();

/** Muestra y mide el reproductor en un ancho dado. */
async function medirEn(ancho, alto) {
  const page = await browser.newPage({ viewport: { width: ancho, height: alto } });
  const errores = [];
  page.on("pageerror", (error) => errores.push(String(error)));
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
  await page.waitForTimeout(2500);
  const datos = await page.evaluate(() => {
    const raiz = document.documentElement;
    const estiloRaiz = getComputedStyle(raiz);
    const barra = document.getElementById("reflow-pagination");
    const player = document.getElementById("reflow-tts-player");
    /* Para medirlo hay que mostrarlo: vive oculto hasta que hay sesión. */
    if (player) {
      player.hidden = false;
      player.setAttribute("aria-hidden", "false");
    }
    const cajaBarra = barra.getBoundingClientRect();
    const caja = player.getBoundingClientRect();
    const etiqueta = player.querySelector(".reflow-tts-player-label");
    const estiloEtiqueta = etiqueta ? getComputedStyle(etiqueta) : null;
    const estiloPlayer = getComputedStyle(player);
    return {
      reserva: estiloRaiz.getPropertyValue("--reflow-toolbar-reserve").trim(),
      altoBarra: Math.round(cajaBarra.height),
      player: {
        x: Math.round(caja.x),
        ancho: Math.round(caja.width),
        alto: Math.round(caja.height),
        arriba: Math.round(caja.bottom),
        barraArriba: Math.round(cajaBarra.top),
        derecha: Math.round(window.innerWidth - caja.right),
        etiquetaVisible: estiloEtiqueta ? estiloEtiqueta.position !== "absolute" : null,
        columnas: estiloPlayer.gridTemplateColumns,
      },
    };
  });
  await page.screenshot({ path: `tmp/popup-${ancho}.png` });
  await page.close();
  return { ...datos, errores };
}

console.log("=== Reproductor de voz flotante (punto 25) ===");
for (const [ancho, alto, etiqueta] of [
  [1366, 900, "ancha"],
  [1024, 800, "media"],
  [420, 860, "angosta"],
]) {
  const datos = await medirEn(ancho, alto);
  console.log(`\n${etiqueta} ${ancho}×${alto}:`);
  console.log(`  reserva (--reflow-toolbar-reserve): ${datos.reserva} · barra ${datos.altoBarra} px`);
  console.log(`  reproductor: ${JSON.stringify(datos.player)}`);

  /* 1 · la reserva es la barra, sin carril del reproductor */
  const reserva = parseFloat(datos.reserva) || 0;
  if (reserva > datos.altoBarra + 8) {
    fallar(`${etiqueta}: la reserva (${datos.reserva}) supera la barra (${datos.altoBarra} px): sigue el carril`);
  }
  /* 2 · flota apoyado en la barra (sin hueco ni superposición) */
  const separacion = datos.player.barraArriba - datos.player.arriba;
  if (separacion < 0 || separacion > 24) {
    fallar(`${etiqueta}: el reproductor no se apoya en la barra (separación ${separacion} px)`);
  }
  /* 3 · forma según el ancho */
  if (ancho >= 1024) {
    const centro = datos.player.x + datos.player.ancho / 2;
    if (Math.abs(centro - ancho / 2) > 3) {
      fallar(`${etiqueta}: el reproductor no está centrado (centro ${Math.round(centro)} de ${ancho})`);
    }
    if (!datos.player.etiquetaVisible) {
      fallar(`${etiqueta}: las etiquetas del reproductor deberían verse`);
    }
  } else {
    /* Pastilla: centrada, más angosta que el viewport y sin etiquetas visibles. */
    const centro = datos.player.x + datos.player.ancho / 2;
    if (Math.abs(centro - ancho / 2) > 6) {
      fallar(`${etiqueta}: la pastilla no está centrada (centro ${Math.round(centro)} de ${ancho})`);
    }
    if (datos.player.ancho > ancho - 8) {
      fallar(`${etiqueta}: la pastilla ocupa todo el ancho (${datos.player.ancho})`);
    }
    if (datos.player.etiquetaVisible) {
      fallar(`${etiqueta}: las etiquetas deberían quedar sólo para lectores de pantalla`);
    }
  }
  if (datos.errores.length) fallar(`${etiqueta}: errores de consola: ${datos.errores[0]}`);
}

console.log(
  `\nURL: ${target}\n` +
    (fallas.length
      ? `FALLAS:\n - ${fallas.join("\n - ")}`
      : "OK: el reproductor flota sin carril, centrado en ancha y pastilla en angosta")
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
