// Verifica los íconos generados para el reproductor (detener, audio anterior y
// audio siguiente) contra el set de EVA que les dio origen.
//
// Comprueba tres cosas que sí son comprobables:
//   1. el círculo de «detener» es el mismo de «pausa» (caja idéntica) y su
//      calado mide lo que las barras de pausa;
//   2. «anterior» es el espejo exacto de «siguiente» (se comparan las tramas,
//      una reflejada);
//   3. todos caen en la caja óptica del set y quedan centrados.
//
// Uso:  node verify-icons-generated.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(here, "..", "..");
const carpetaEva = "C:\\Users\\germa\\Desktop\\Eva";
const LADO = 100;

const fallas = [];
const fallar = (mensaje) => fallas.push(mensaje);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });

/** Trama booleana de 100×100, con espejo horizontal opcional. */
async function trama(nombre, { svg = false, espejo = false } = {}) {
  const ruta = svg ? path.join(raiz, "assets", "icons", nombre) : path.join(carpetaEva, nombre);
  const contenido = await fs.readFile(ruta);
  const uri = `${svg ? "data:image/svg+xml" : "data:image/png"};base64,${contenido.toString("base64")}`;
  return page.evaluate(
    async ({ uri, LADO, espejo }) => {
      const imagen = new Image();
      await new Promise((resolver, rechazar) => {
        imagen.onload = resolver;
        imagen.onerror = rechazar;
        imagen.src = uri;
      });
      const lienzo = document.createElement("canvas");
      lienzo.width = LADO;
      lienzo.height = LADO;
      const contexto = lienzo.getContext("2d");
      if (espejo) {
        contexto.translate(LADO, 0);
        contexto.scale(-1, 1);
      }
      contexto.drawImage(imagen, 0, 0, LADO, LADO);
      const datos = contexto.getImageData(0, 0, LADO, LADO).data;
      const bits = new Array(LADO * LADO);
      let minX = LADO, minY = LADO, maxX = -1, maxY = -1;
      for (let y = 0; y < LADO; y += 1) {
        for (let x = 0; x < LADO; x += 1) {
          const opaco = datos[(y * LADO + x) * 4 + 3] > 128;
          bits[y * LADO + x] = opaco;
          if (!opaco) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      return { bits, caja: [minX, minY, maxX, maxY], ancho: maxX - minX + 1, alto: maxY - minY + 1 };
    },
    { uri, LADO, espejo }
  );
}

const cajaDe = (t) => t.caja;
const iguales = (a, b, tolerancia = 1) =>
  a.every((valor, indice) => Math.abs(valor - b[indice]) <= tolerancia);

/** Intersección sobre unión de dos tramas. */
function iou(a, b) {
  let union = 0;
  let interseccion = 0;
  for (let indice = 0; indice < a.length; indice += 1) {
    if (a[indice] || b[indice]) union += 1;
    if (a[indice] && b[indice]) interseccion += 1;
  }
  return union ? interseccion / union : 0;
}

/* 1 · círculo de detener contra el de pausa */
const pausa = await trama("size=eva-icon-size-0-41.png");
const detener = await trama("eva-stop.svg", { svg: true });
console.log(
  `detener: caja ${JSON.stringify(cajaDe(detener))} · ${detener.ancho}×${detener.alto}   pausa: caja ${JSON.stringify(cajaDe(pausa))} · ${pausa.ancho}×${pausa.alto}`
);
if (!iguales(cajaDe(detener), cajaDe(pausa))) {
  fallar(`el círculo de detener no coincide con el de pausa (${cajaDe(detener)} vs ${cajaDe(pausa)})`);
}
/* Ancho del calado en la fila central. */
const filaCentral = (t) => {
  const inicio = 50 * LADO;
  const tramos = [];
  let abierto = null;
  for (let x = 0; x < LADO; x += 1) {
    const opaco = t.bits[inicio + x];
    if (!opaco && abierto === null) abierto = x;
    else if (opaco && abierto !== null) {
      tramos.push([abierto, x - 1]);
      abierto = null;
    }
  }
  if (abierto !== null) tramos.push([abierto, LADO - 1]);
  return tramos;
};
const calado = filaCentral(detener).filter(([a, b]) => b - a > 20);
const barras = filaCentral(pausa).filter(([a, b]) => b - a < 15);
console.log(
  `calado de detener: ${calado.map(([a, b]) => b - a + 1).join(", ") || "ninguno"} px · barras de pausa: ${barras.map(([a, b]) => b - a + 1).join("+")} px`
);
if (!calado.length) fallar("detener no tiene el cuadrado calado");
else {
  const ladoCalado = calado[0][1] - calado[0][0] + 1;
  /* Alto de las barras de pausa: los huecos blancos de la fila central son las
     barras; se mide el alto de la primera muestreando su columna. */
  const huecos = (() => {
    const tramos = [];
    let abierto = null;
    for (let x = 0; x < LADO; x += 1) {
      const opaco = pausa.bits[50 * LADO + x];
      if (!opaco && abierto === null) abierto = x;
      else if (opaco && abierto !== null) {
        tramos.push([abierto, x - 1]);
        abierto = null;
      }
    }
    return tramos.filter(([a, b]) => a > pausa.caja[0] && b < pausa.caja[2]);
  })();
  let altoBarras = 0;
  if (huecos.length) {
    const centro = Math.round((huecos[0][0] + huecos[0][1]) / 2);
    /* El tramo blanco más largo de esa columna es la barra: los otros son el
       espacio fuera del círculo. */
    let abierto = null;
    for (let y = 0; y <= LADO; y += 1) {
      const opaco = y < LADO ? pausa.bits[y * LADO + centro] : true;
      if (!opaco && abierto === null) abierto = y;
      else if (opaco && abierto !== null) {
        altoBarras = Math.max(altoBarras, y - abierto);
        abierto = null;
      }
    }
  }
  console.log(
    `alto de las barras de pausa: ${altoBarras} px · calado de detener: ${ladoCalado} px`
  );
  if (!altoBarras) {
    fallar("no se pudieron medir las barras de pausa");
  } else if (Math.abs(ladoCalado - altoBarras) > 3) {
    fallar(`el calado de detener mide ${ladoCalado} y las barras de pausa ${altoBarras}`);
  }
}

/* 2 · anterior es el espejo de siguiente */
const siguiente = await trama("eva-next.svg", { svg: true });
const anterior = await trama("eva-prev.svg", { svg: true });
const anteriorEspejado = await trama("eva-prev.svg", { svg: true, espejo: true });
const coincidencia = iou(siguiente.bits, anteriorEspejado.bits);
console.log(
  `anterior espejado contra siguiente: ${(coincidencia * 100).toFixed(1)} % de coincidencia · siguiente ${siguiente.ancho}×${siguiente.alto} · anterior ${anterior.ancho}×${anterior.alto}`
);
if (coincidencia < 0.9) {
  fallar(`anterior no es el espejo de siguiente (coincidencia ${(coincidencia * 100).toFixed(1)} %)`);
}

/* 3 · caja óptica y centrado del set */
for (const [nombre, t] of [
  ["detener", detener],
  ["siguiente", siguiente],
  ["anterior", anterior],
]) {
  const centroX = (t.caja[0] + t.caja[2]) / 2;
  const centroY = (t.caja[1] + t.caja[3]) / 2;
  console.log(
    `  ${nombre.padEnd(10)} centro (${centroX.toFixed(1)}, ${centroY.toFixed(1)}) · ${t.ancho}×${t.alto}`
  );
  if (Math.abs(centroX - 50) > 2 || Math.abs(centroY - 50) > 2) {
    fallar(`${nombre} no está centrado en la grilla de 100`);
  }
  if (t.caja[0] < 10 || t.caja[2] > 90 || t.caja[1] < 10 || t.caja[3] > 90) {
    fallar(`${nombre} se sale de la caja óptica del set (11–89)`);
  }
}

/* 4 · íconos trazados: coincidencia con su PNG de origen del set */
console.log("\níconos trazados del set:");
const trazados = [
  ["eva-menu.svg", "size=eva-icon-size-0-112.png"],
  ["eva-gear.svg", "size=eva-icon-size-0-91.png"],
  ["eva-close.svg", "size=eva-icon-size-0-2.png"],
  ["eva-play.svg", "size=eva-icon-size-0-4.png"],
  ["eva-pause.svg", "size=eva-icon-size-0-41.png"],
];
for (const [svg, fuente] of trazados) {
  const generado = await trama(svg, { svg: true });
  const original = await trama(fuente);
  const coincidencia = iou(generado.bits, original.bits);
  console.log(
    `  ${svg.padEnd(16)} contra ${fuente.padEnd(28)} ${(coincidencia * 100).toFixed(1)} %`
  );
  if (coincidencia < 0.9) {
    fallar(`${svg} no reproduce ${fuente} (${(coincidencia * 100).toFixed(1)} %)`);
  }
}

console.log(
  fallas.length
    ? `FALLAS:\n - ${fallas.join("\n - ")}`
    : "OK: los íconos derivados del set de EVA reproducen sus originales"
);
await browser.close();
process.exit(fallas.length ? 1 : 0);
