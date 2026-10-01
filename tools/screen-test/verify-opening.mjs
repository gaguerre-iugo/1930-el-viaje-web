// Verifica el texto de carga y la limpieza de la apertura (revisión UX,
// puntos 21 y 22): «Abriendo 1930: El viaje…», el enlace «Saltar al contenido
// principal» invisible en reposo —sin el filo oscuro que dejaba su sombra— y
// visible al enfocarlo con el teclado.
//
// Uso:
//   node verify-opening.mjs
//   node verify-opening.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5599/index.html";

const failures = [];
const fail = (message) => failures.push(message);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(String(error)));

/* El cargador vive poco: se mira apenas arranca la navegación. */
await page.goto(target, { waitUntil: "commit" });
let cargador = null;
for (let intento = 0; intento < 40; intento += 1) {
  cargador = await page.evaluate(() => {
    const nodo = document.getElementById("reflow-loading");
    if (!nodo) return null;
    return {
      texto: nodo.textContent.replace(/\s+/g, " ").trim(),
      rol: nodo.getAttribute("role"),
      color: getComputedStyle(nodo).color,
    };
  });
  if (cargador) break;
  await page.waitForTimeout(50);
}
console.log("=== Texto de carga (punto 21) ===");
console.log(`  ${JSON.stringify(cargador)}`);
if (!cargador) {
  fail("no se llegó a ver el cargador");
} else {
  if (!/^Abriendo 1930: El viaje…$/.test(cargador.texto)) {
    fail(`el texto de carga es «${cargador.texto}»`);
  }
  if (cargador.rol !== "status") fail(`el cargador anuncia rol «${cargador.rol}»`);
}
/* Logo institucional del cargador (punto 21). Se espera a que la imagen esté
   disponible antes de la captura: el cargador vive pocos milisegundos. */
const logo = await page.evaluate(async () => {
  const nodo = document.querySelector("#reflow-loading .reflow-loading-logo");
  if (!nodo) return null;
  const estilo = getComputedStyle(nodo);
  const url = (estilo.backgroundImage.match(/url\("?([^")]+)"?\)/) || [])[1] || null;
  if (url) {
    await new Promise((resolve) => {
      const imagen = new Image();
      imagen.onload = imagen.onerror = () => resolve();
      imagen.src = url;
    });
  }
  const caja = nodo.getBoundingClientRect();
  return {
    tieneImagen: estilo.backgroundImage !== "none",
    url,
    ancho: Math.round(caja.width),
    alto: Math.round(caja.height),
  };
});
console.log(`  logo: ${JSON.stringify(logo)}`);
if (!logo || !logo.tieneImagen) fail("el cargador no tiene el logo de Ceibal");
if (logo && logo.tieneImagen && !/ceibal-logo/.test(logo.url || "")) {
  fail(`el logo apunta a ${logo.url}`);
}
if (logo && (logo.ancho < 100 || logo.alto < 30)) {
  fail(`el hueco del logo mide ${logo.ancho}×${logo.alto}`);
}
await page.screenshot({ path: "tmp/apertura-cargando.png" });

await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(2500);

/* ------------------------------------------- el enlace «saltar» en reposo */
const enlace = await page.evaluate(() => {
  const nodo = document.querySelector(".reflow-skip-link");
  if (!nodo) return null;
  const estilo = getComputedStyle(nodo);
  const caja = nodo.getBoundingClientRect();
  return {
    texto: nodo.textContent.replace(/\s+/g, " ").trim(),
    opacidad: Number(estilo.opacity),
    sombra: estilo.boxShadow,
    margen: estilo.marginTop,
    abajo: Math.round(caja.bottom),
    visible: nodo.getClientRects().length > 0 && caja.bottom > 0 && caja.top < window.innerHeight,
  };
});
console.log("\n=== Enlace «saltar» en reposo (punto 22) ===");
console.log(`  ${JSON.stringify(enlace)}`);
if (!enlace) {
  fail("no se encontró el enlace «saltar al contenido principal»");
} else {
  if (!/saltar/i.test(enlace.texto)) fail(`el enlace dice «${enlace.texto}»`);
  if (enlace.opacidad !== 0) fail(`en reposo el enlace tiene opacidad ${enlace.opacidad}`);
  if (enlace.sombra !== "none") fail(`en reposo el enlace conserva sombra: ${enlace.sombra}`);
  if (enlace.visible) fail("en reposo el enlace se ve en el borde superior");
}

/* ------------------------------------------------- y visible con el teclado */
await page.evaluate(() => {
  const nodo = document.querySelector(".reflow-skip-link");
  if (nodo) nodo.focus();
});
await page.waitForTimeout(400);
const enfocado = await page.evaluate(() => {
  const nodo = document.querySelector(".reflow-skip-link");
  const estilo = getComputedStyle(nodo);
  const caja = nodo.getBoundingClientRect();
  return {
    enfocado: document.activeElement === nodo,
    opacidad: Number(estilo.opacity),
    visible: caja.top >= 0 && caja.bottom <= window.innerHeight + 1 && estilo.opacity === "1",
    contorno: estilo.outlineStyle,
  };
});
console.log(`\n=== Enlace «saltar» enfocado ===\n  ${JSON.stringify(enfocado)}`);
if (!enfocado.enfocado) fail("el enlace no se puede enfocar con el teclado");
if (!enfocado.visible) fail("al enfocar, el enlace no se ve");
if (enfocado.contorno === "none") fail("al enfocar, el enlace no muestra contorno");
await page.screenshot({ path: "tmp/apertura-enlace.png" });

console.log(`\nURL: ${target}`);
console.log("consola:", consoleErrors.length ? consoleErrors.slice(0, 3) : "sin errores");
if (consoleErrors.length) fail(`errores de consola: ${consoleErrors.slice(0, 2).join(" | ")}`);
console.log(
  failures.length
    ? `FALLAS:\n - ${failures.join("\n - ")}`
    : "OK: el texto de carga y la apertura cumplen los puntos 21 y 22"
);
await browser.close();
process.exit(failures.length ? 1 : 0);
