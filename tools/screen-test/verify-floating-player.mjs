// Verifica el pop-up de voz flotante (revisión UX, punto 25):
//  - que no reserve carril (la reserva es la barra);
//  - que en pantalla ancha (≥1024) vaya en el MARGEN DERECHO, fuera de la medida
//    de lectura, con todos los controles;
//  - que en angosta sea una pastilla compacta centrada con Reproducir/Pausa,
//    Opciones, Minimizar y Cerrar;
//  - que se pueda minimizar a un botón redondo de 48 px.
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

/** Muestra el reproductor, lo mide expandido y luego minimizado. */
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
    const medida = parseFloat(estiloRaiz.getPropertyValue("--reflow-text-measure")) || 672;
    const visibles = (sel) =>
      [...player.querySelectorAll(sel)].filter((n) => n.getClientRects().length);
    return {
      reserva: estiloRaiz.getPropertyValue("--reflow-toolbar-reserve").trim(),
      altoBarra: Math.round(cajaBarra.height),
      bordeTextoDerecho: Math.round((window.innerWidth + medida) / 2),
      player: {
        x: Math.round(caja.x),
        ancho: Math.round(caja.width),
        alto: Math.round(caja.height),
        arriba: Math.round(caja.bottom),
        barraArriba: Math.round(cajaBarra.top),
        derecha: Math.round(window.innerWidth - caja.right),
      },
      botones: visibles(".reflow-tts-player-main button").map((b) =>
        b.id.replace("reflow-tts-", "")
      ),
    };
  });
  await page.screenshot({ path: `tmp/popup-${ancho}.png` });
  const min = await page.evaluate(() => {
    const player = document.getElementById("reflow-tts-player");
    /* El motor vuelve a ocultarlo en su ciclo: se re-muestra y se mide en el
       mismo paso, así la medición no queda condicionada por ese ciclo. */
    player.hidden = false;
    player.setAttribute("aria-hidden", "false");
    const btn = document.getElementById("reflow-tts-minimize");
    if (btn) btn.click();
    const caja = player.getBoundingClientRect();
    return {
      clase: player.classList.contains("reflow-tts-player-minimized"),
      w: Math.round(caja.width),
      h: Math.round(caja.height),
      fabVisible: document.getElementById("reflow-tts-fab").getClientRects().length > 0,
    };
  });
  await page.close();
  return { ...datos, min, errores };
}

console.log("=== Reproductor de voz flotante (punto 25) ===");
for (const [ancho, alto, etiqueta] of [
  [1366, 900, "ancha"],
  [1024, 800, "media"],
  [620, 800, "angosta"],
]) {
  const d = await medirEn(ancho, alto);
  console.log(`\n${etiqueta} ${ancho}×${alto}:`);
  console.log(`  reserva (--reflow-toolbar-reserve): ${d.reserva} · barra ${d.altoBarra} px`);
  console.log(`  pop-up: ${JSON.stringify(d.player)} · botones ${JSON.stringify(d.botones)}`);
  console.log(`  minimizado: ${JSON.stringify(d.min)}`);

  /* 1 · la reserva es la barra, sin carril del reproductor */
  const reserva = parseFloat(d.reserva) || 0;
  if (reserva > d.altoBarra + 8) {
    fallar(`${etiqueta}: la reserva (${d.reserva}) supera la barra (${d.altoBarra} px): sigue el carril`);
  }
  /* 2 · flota apoyado en la barra (sin hueco ni superposición) */
  const separacion = d.player.barraArriba - d.player.arriba;
  if (separacion < 0 || separacion > 24) {
    fallar(`${etiqueta}: el pop-up no se apoya en la barra (separación ${separacion} px)`);
  }
  /* 3 · forma según el ancho */
  if (ancho >= 1024) {
    if (d.player.x < d.bordeTextoDerecho - 1) {
      fallar(`${etiqueta}: el pop-up invade la medida de lectura (x ${d.player.x} < ${d.bordeTextoDerecho})`);
    }
    if (d.player.derecha < 4 || d.player.derecha > 40) {
      fallar(`${etiqueta}: margen derecho inesperado (${d.player.derecha} px)`);
    }
    for (const id of ["previous", "toggle", "next", "options", "minimize", "stop"]) {
      if (!d.botones.includes(id)) fallar(`${etiqueta}: falta el control ${id}`);
    }
  } else {
    const centro = d.player.x + d.player.ancho / 2;
    if (Math.abs(centro - ancho / 2) > 6) {
      fallar(`${etiqueta}: la pastilla no está centrada (centro ${Math.round(centro)} de ${ancho})`);
    }
    if (d.player.ancho > ancho - 8) {
      fallar(`${etiqueta}: la pastilla ocupa todo el ancho (${d.player.ancho})`);
    }
    for (const id of ["toggle", "options", "minimize", "stop"]) {
      if (!d.botones.includes(id)) fallar(`${etiqueta}: falta el control ${id}`);
    }
    if (d.botones.includes("previous") || d.botones.includes("next")) {
      fallar(`${etiqueta}: la pastilla angosta no debería llevar las flechas de audio`);
    }
  }
  /* 4 · se minimiza a un botón redondo de 48 px */
  if (!d.min.clase || !d.min.fabVisible) {
    fallar(`${etiqueta}: no se minimiza a un botón redondo`);
  }
  if (Math.abs(d.min.w - 48) > 3 || Math.abs(d.min.h - 48) > 3) {
    fallar(`${etiqueta}: el botón minimizado no mide 48 px (${d.min.w}×${d.min.h})`);
  }
  if (d.errores.length) fallar(`${etiqueta}: errores de consola: ${d.errores[0]}`);
}

console.log(
  `\nURL: ${target}\n` +
    (fallas.length
      ? `FALLAS:\n - ${fallas.join("\n - ")}`
      : "OK: el pop-up flota sin carril, en el margen derecho en ancha, pastilla en angosta, y se minimiza a 48 px")
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
