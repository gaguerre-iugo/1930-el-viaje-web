// Reproductor de audio: Anterior/Siguiente y Play/Pausa.
//
// Bug reportado: al mover con Anterior/Siguiente la frase siguiente se marca en
// amarillo, pero al dar Play la lectura no arrancaba desde ahí. La reanudación
// alineaba al PRIMER ítem de la página visible y perdía la selección (y, si ese
// ítem ya era el actual, `playAtIndex` quedaba en no-op y el audio ni sonaba).
// Ahora, si el ítem elegido sigue en la página visible, se reanuda desde él con
// `api.play()`; solo se alinea a la página cuando el lector navegó a otra.
//
// Segundo bug (regresión de puntero): el botón Reproducir/Pausar no respondía al
// primer toque tras pausar y mover con Siguiente. `pointerdown` sobre el
// reproductor llama a `syncPrimaryToolbar()`, que reescribía el <path> del icono
// del botón; eso desenganchaba el objetivo del `mousedown` y Chrome no
// sintetizaba el `click`. El primer toque moría y el segundo funcionaba. Por eso
// este test toca el botón con `page.click` (puntero real), no con `el.click()`.
//
// Uso:
//   node verify-tts-transport.mjs
//   node verify-tts-transport.mjs --url http://127.0.0.1:5501/index.html
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
page.on("pageerror", (error) => fallar("error de página: " + String(error).slice(0, 160)));

await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(3000);

/* Enciende la lectura en voz alta desde Herramientas: el mismo camino del lector. */
await page.click("#reflow-tools");
await page.waitForTimeout(800);
const interruptor = await page.$(".reflow-setting-read-aloud [role='switch']");
if (!interruptor) {
  fallar("no se encontró el interruptor de lectura en voz alta");
} else {
  await interruptor.click();
  await page.waitForTimeout(1200);
}
await page.waitForTimeout(800);

const estado = () =>
  page.evaluate(() => {
    const api = window.__adtReflowAudio;
    return { idx: api.currentIndex, playing: !!api.isPlaying };
  });
/* El botón Reproducir/Pausar se toca con puntero real (`page.click`), no con
   `el.click()`: en `pointerdown` el reproductor sincroniza la barra, y si esa
   sincronización reescribe el <path> del icono el `click` no se sintetiza y el
   primer toque muere. Con `el.click()` el bug no se veía. */

/* Saltar a un ítem de texto de pg019 (frases largas, sin auto-avance veloz) y
   dejar el transporte en pausa. */
const textIndex = await page.evaluate(() => {
  const api = window.__adtReflowAudio;
  return api.items.findIndex((it) => it.el && it.el.closest('[data-section-id="pg019_sec001"]'));
});
if (textIndex < 0) fallar("no se encontró texto de pg019 en los ítems de audio");
await page.evaluate((i) => window.__adtReflowAudio.playAtIndex(i + 6), textIndex);
await page.waitForTimeout(1500);
await page.evaluate(async () => {
  const toggle = document.getElementById("reflow-tts-toggle");
  for (let k = 0; k < 5 && window.__adtReflowAudio.isPlaying; k++) {
    toggle.click();
    await new Promise((r) => setTimeout(r, 700));
  }
});
await page.waitForTimeout(600);

const pausa = await estado();
if (pausa.playing) fallar("no se pudo dejar la lectura en pausa");

/* Siguiente en pausa: mueve una frase y queda en pausa. */
await page.click("#reflow-tts-next");
await page.waitForTimeout(1500);
const trasSiguiente = await estado();
if (trasSiguiente.playing) fallar("Siguiente en pausa no debe arrancar la lectura");
if (trasSiguiente.idx !== pausa.idx + 1) {
  fallar(`Siguiente debía ir a ${pausa.idx + 1} y fue a ${trasSiguiente.idx}`);
}

/* Play: reanuda desde la frase elegida, no desde el inicio de la página. */
await page.click("#reflow-tts-toggle");
await page.waitForTimeout(1200);
const trasPlay = await estado();
if (!trasPlay.playing) fallar("Play tras Siguiente no arrancó");
if (trasPlay.idx !== trasSiguiente.idx) {
  fallar(`Play tras Siguiente debía reanudar en ${trasSiguiente.idx} y arrancó en ${trasPlay.idx}`);
}

/* Anterior en pausa. */
await page.click("#reflow-tts-toggle");
await page.waitForTimeout(900);
await page.click("#reflow-tts-previous");
await page.waitForTimeout(1500);
const trasAnterior = await estado();
if (trasAnterior.playing) fallar("Anterior en pausa no debe arrancar la lectura");
if (trasAnterior.idx !== trasSiguiente.idx - 1) {
  fallar(`Anterior debía ir a ${trasSiguiente.idx - 1} y fue a ${trasAnterior.idx}`);
}

/* Play de nuevo: reanuda desde la frase elegida. */
await page.click("#reflow-tts-toggle");
await page.waitForTimeout(1200);
const trasPlay2 = await estado();
if (!trasPlay2.playing) fallar("Play tras Anterior no arrancó");
if (trasPlay2.idx !== trasAnterior.idx) {
  fallar(`Play tras Anterior debía reanudar en ${trasAnterior.idx} y arrancó en ${trasPlay2.idx}`);
}

await browser.close();

console.log(
  "pausa:", JSON.stringify(pausa),
  "siguiente:", JSON.stringify(trasSiguiente),
  "play:", JSON.stringify(trasPlay),
  "anterior:", JSON.stringify(trasAnterior),
  "play2:", JSON.stringify(trasPlay2)
);

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: Anterior/Siguiente y Play/Pausa reanudan en la frase elegida");
