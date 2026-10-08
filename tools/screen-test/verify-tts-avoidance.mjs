// Verifica la parte 2 del punto 25: el reproductor no tapa la oración en lectura.
//
// Simula el estado de lectura marcando un bloque con la clase del runtime y
// comprobando que, tras el ciclo de sincronización, el reproductor y el bloque no
// se superpongan. Se prueba abajo (donde arranca) y arriba.
//
// Uso: node verify-tts-avoidance.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";
const ancho = Number(argVal("--ancho") || 1366);

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: ancho, height: 900 } });
const errores = [];
page.on("pageerror", (error) => errores.push(String(error)));
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/** Marca el bloque indicado como "en lectura", muestra el reproductor y mide. */
async function medir(posicion) {
  return page.evaluate((posicion) => {
    const player = document.getElementById("reflow-tts-player");
    if (!player) return { error: "sin reproductor" };
    player.hidden = false;
    player.setAttribute("aria-hidden", "false");
    /* Sin el estado de lectura el ciclo no lo corre arriba. */
    document.body.classList.add("reflow-tts-session-active");

    document.querySelectorAll(".tts-active-block").forEach((nodo) => {
      nodo.classList.remove("tts-active-block");
    });
    /* Un párrafo de contenido, el que esté más cerca de la banda pedida. */
    const parrafos = [...document.querySelectorAll("#content p[data-id]")].filter((nodo) => {
      const caja = nodo.getBoundingClientRect();
      return caja.width > 40 && caja.height > 8;
    });
    if (!parrafos.length) return { error: "sin párrafos visibles" };
    const alto = window.innerHeight;
    const objetivo =
      posicion === "abajo"
        ? parrafos.reduce((mejor, nodo) =>
            nodo.getBoundingClientRect().bottom > mejor.getBoundingClientRect().bottom ? nodo : mejor
          )
        : parrafos.reduce((mejor, nodo) =>
            nodo.getBoundingClientRect().top < mejor.getBoundingClientRect().top ? nodo : mejor
          );
    objetivo.classList.add("tts-active-block");

    const aplicar = window.__adtReflowSyncTtsAvoidance;
    if (typeof aplicar === "function") aplicar();

    const cajaBloque = objetivo.getBoundingClientRect();
    const cajaPlayer = player.getBoundingClientRect();
    /* Intersección real (2D): el pop-up puede estar al costado y no superponerse
       aunque se cruce en vertical. */
    const seCruzan =
      cajaBloque.bottom > cajaPlayer.top &&
      cajaBloque.top < cajaPlayer.bottom &&
      cajaBloque.right > cajaPlayer.left &&
      cajaBloque.left < cajaPlayer.right;
    return {
      posicion,
      bloque: { top: Math.round(cajaBloque.top), bottom: Math.round(cajaBloque.bottom) },
      player: {
        top: Math.round(cajaPlayer.top),
        bottom: Math.round(cajaPlayer.bottom),
        minimizado: player.classList.contains("reflow-tts-player-minimized"),
      },
      seCruzan,
      altoVentana: alto,
      tieneGancho: typeof aplicar === "function",
    };
  }, posicion);
}

console.log("=== El reproductor no tapa la oración en lectura (punto 25, parte 2) ===");
for (const posicion of ["abajo", "arriba"]) {
  const datos = await medir(posicion);
  console.log(`  ${posicion}: ${JSON.stringify(datos)}`);
  if (datos.error) {
    fallar(`${posicion}: ${datos.error}`);
    continue;
  }
  if (!datos.tieneGancho) {
    fallar("no está expuesto __adtReflowSyncTtsAvoidance");
    continue;
  }
  if (datos.seCruzan) {
    fallar(`${posicion}: el reproductor se superpone con el bloque en lectura`);
  }
  if (posicion === "abajo" && !datos.player.minimizado) {
    fallar("con el bloque en la banda de abajo, el reproductor no se minimizó");
  }
}

await page.screenshot({ path: `tmp/popup-evitacion-${ancho}.png` });
console.log(`\nURL: ${target}\nconsola: ${errores.length ? errores.slice(0, 2) : "sin errores"}`);
if (errores.length) fallar(`errores de consola: ${errores[0]}`);
console.log(
  fallas.length
    ? `FALLAS:\n - ${fallas.join("\n - ")}`
    : "OK: el reproductor se minimiza y no tapa el bloque en lectura"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
