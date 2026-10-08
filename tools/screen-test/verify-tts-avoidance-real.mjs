// Punto 25 · La regla de no tapar la oración, verificada en LECTURA REAL.
//
// `verify-tts-avoidance.mjs` marca un bloque a mano. Eso dejó pasar un fallo:
// medido en lectura real, el resaltado del runtime es un rango de la Custom
// Highlight API y el párrafo NO lleva `.tts-active-block`, así que la evitación
// no encontraba la caja activa y no se disparaba (oración en 754–779 tapada por
// el reproductor en 763–823). Esta prueba arranca la lectura de verdad, salta a
// una oración baja con `playAtIndex` y comprueba que el reproductor se corre;
// después salta a una oración alta y comprueba que vuelve abajo.
//
// Uso:
//   node verify-tts-avoidance-real.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);
const browser = await chromium.launch({
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const erroresConsola = [];
page.on("pageerror", (error) => erroresConsola.push(String(error)));
page.on("console", (mensaje) => {
  if (mensaje.type() === "error") erroresConsola.push(mensaje.text());
});

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Enciende la lectura en voz alta desde Herramientas y arranca la reproducción:
   es el mismo camino que usa el lector. */
await page.click("#reflow-tools");
await page.waitForTimeout(800);
const interruptor = await page.$(".reflow-setting-read-aloud [role='switch']");
if (!interruptor) {
  fallar("no se encontró el interruptor de lectura en voz alta");
} else {
  await interruptor.click();
  await page.waitForTimeout(1200);
}
/* El panel de Herramientas se cierra solo al aparecer el reproductor; no se
   pulsa Escape, porque ahora Escape minimiza el pop-up (punto 25). */
await page.waitForTimeout(800);
await page.click("#reflow-tts-toggle");
await page.waitForTimeout(2500);

/* La lectura real tiene que estar viva: el resaltado se comprueba en los saltos
   de abajo, que exigen `estado.rango` (la caja del resaltado real
   `adt-tts-active`), no una clase puesta a mano. No se comprueba aquí porque el
   ítem inicial puede no tener texto resaltable (p. ej. la portada). */

/** Caja activa: la del rango resaltado (o del bloque, si no hay rango). */
const MEDIR_ACTIVO = () => {
  const player = document.getElementById("reflow-tts-player");
  const pr = player.getBoundingClientRect();
  const hl = window.CSS && CSS.highlights && CSS.highlights.get("adt-tts-active");
  let rango = null;
  if (hl) {
    const cajas = [...hl].map((r) => r.getBoundingClientRect()).filter((c) => c.width || c.height);
    if (cajas.length) {
      rango = {
        top: Math.min(...cajas.map((c) => c.top)),
        bottom: Math.max(...cajas.map((c) => c.bottom)),
        left: Math.min(...cajas.map((c) => c.left)),
        right: Math.max(...cajas.map((c) => c.right)),
      };
    }
  }
  return {
    playerTop: pr.top,
    playerBottom: pr.bottom,
    playerLeft: pr.left,
    playerRight: pr.right,
    playerMinimizado: player.classList.contains("reflow-tts-player-minimized"),
    rango,
  };
};

/** Salta la lectura a un ítem cuyo elemento caiga en la franja pedida. */
const saltarA = async (modo) => {
  return page.evaluate((modo) => {
    const player = document.getElementById("reflow-tts-player");
    const pr = player.getBoundingClientRect();
    const api = window.__adtReflowAudio;
    if (!api || !api.items || !api.playAtIndex) return { ok: false, motivo: "sin API de audio" };
    for (let i = 0; i < api.items.length; i += 1) {
      const el = api.items[i].el;
      if (!el || !el.getBoundingClientRect) continue;
      const c = el.getBoundingClientRect();
      if (c.width < 40 || c.height < 8) continue;
      const enBanda = c.bottom > pr.top + 2 && c.bottom < pr.bottom - 2;
      const arriba = c.bottom < 320;
      if ((modo === "banda" && enBanda) || (modo === "arriba" && arriba)) {
        api.playAtIndex(i);
        return { ok: true, id: api.items[i].id, top: Math.round(c.top), bottom: Math.round(c.bottom) };
      }
    }
    return { ok: false, motivo: "sin ítem para " + modo };
  }, modo);
};

const esperarEstado = async (modo, banda, milisegundos) => {
  const inicio = Date.now();
  let ultimo = null;
  while (Date.now() - inicio < milisegundos) {
    await page.waitForTimeout(500);
    const estado = await page.evaluate(MEDIR_ACTIVO);
    ultimo = estado;
    if (
      modo === "banda" &&
      estado.rango &&
      estado.rango.bottom > banda.top + 1 &&
      estado.rango.top < banda.bottom - 1
    ) {
      return { estado, util: true };
    }
    if (modo === "arriba" && estado.rango && estado.rango.bottom < 400) {
      return { estado, util: true };
    }
  }
  return { estado: ultimo, util: false };
};

/* --- Caso 1: oración en la banda inferior del reproductor --------------- */
const banda = await page.evaluate(() => {
  const pr = document.getElementById("reflow-tts-player").getBoundingClientRect();
  return { top: pr.top, bottom: pr.bottom };
});
console.log("=== Lectura real · oración en la banda del reproductor ===");
console.log("banda de reposo: " + Math.round(banda.top) + "–" + Math.round(banda.bottom));
const saltoBajo = await saltarA("banda");
console.log("ítem bajo: " + JSON.stringify(saltoBajo));
if (!saltoBajo.ok) {
  fallar("no se pudo saltar a una oración en la banda: " + saltoBajo.motivo);
} else {
  const { estado, util } = await esperarEstado("banda", banda, 9000);
  console.log("estado: " + JSON.stringify(estado));
  if (!util) {
    fallar("la oración baja no llegó a la banda del reproductor; la prueba no ejercitó el caso");
  } else {
    const seCruzan =
      estado.rango &&
      estado.rango.bottom > estado.playerTop &&
      estado.rango.top < estado.playerBottom &&
      estado.rango.right > estado.playerLeft &&
      estado.rango.left < estado.playerRight;
    if (!estado.playerMinimizado) fallar("con la oración en la banda, el reproductor no se minimizó");
    if (seCruzan) fallar("el reproductor tapa la oración en lectura real (" + JSON.stringify(estado.rango) + ")");
  }
}

/* --- Caso 2: oración alta; el reproductor debe volver abajo ------------- */
console.log("\n=== Lectura real · oración alta; el reproductor vuelve abajo ===");
const saltoAlto = await saltarA("arriba");
console.log("ítem alto: " + JSON.stringify(saltoAlto));
if (!saltoAlto.ok) {
  fallar("no se pudo saltar a una oración alta: " + saltoAlto.motivo);
} else {
  const { estado, util } = await esperarEstado("arriba", banda, 9000);
  console.log("estado: " + JSON.stringify(estado));
  if (!util) {
    fallar("la oración alta no se pintó; la prueba no ejercitó el regreso");
  } else if (estado.playerMinimizado) {
    fallar("con la oración alta, el reproductor siguió minimizado");
  }
}

console.log("\nconsola: " + (erroresConsola.length ? erroresConsola.slice(0, 3).join(" | ") : "sin errores"));
if (erroresConsola.length) fallar("errores de consola: " + erroresConsola.slice(0, 3).join(" | "));
console.log(
  fallas.length
    ? "\nFALLAS (" + fallas.length + "):\n - " + fallas.join("\n - ")
    : "\nOK: en lectura real el reproductor no tapa la oración y vuelve a su lugar"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
