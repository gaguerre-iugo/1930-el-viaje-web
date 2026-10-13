// Portadillas de capítulo: las 8 tienen que verse iguales.
//
// Bug reportado: el título del capítulo 2 salía distinto (26,1 px y peso 400)
// mientras los demás estaban en 34 px y peso 700. Causa: reglas viejas con más
// especificidad (`.chapter-two-cover h2` y `[data-id="pg037_n0004"]`) que le
// ganaban al sistema tipográfico del punto 20 sólo en el capítulo 2. Además el
// capítulo 2 heredaba el `mt-3` de Tailwind y el 1/3-8 márgenes distintos.
//
// Uso:
//   node verify-chapter-covers.mjs
//   node verify-chapter-covers.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (bandera) => {
  const indice = args.indexOf(bandera);
  return indice >= 0 ? args[indice + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";

const fallas = [];
const fallar = (m) => fallas.push(m);
const PROPS = ["fontSize", "fontWeight", "fontStyle", "fontFamily", "letterSpacing", "lineHeight", "textTransform", "color", "marginTop", "marginBottom", "textAlign", "whiteSpace"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
page.on("pageerror", (e) => fallar("error de página: " + String(e).slice(0, 120)));
await page.goto(target, { waitUntil: "load" });
await page.waitForSelector("#reflow-pagination button", { timeout: 40000 });
await page.waitForTimeout(4000);

const data = await page.evaluate((props) => {
  const grab = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const o = { texto: (el.textContent || "").trim().replace(/\s+/g, " ") };
    props.forEach((p) => (o[p] = cs[p]));
    return o;
  };
  const out = [];
  document.querySelectorAll(".chapter-cover, .reflow-later-chapter-cover").forEach((cover, i) => {
    out.push({
      i: i + 1,
      antetitulo: grab(cover.querySelector("h1")),
      titulo: grab(cover.querySelector("h2") || cover.querySelector("[data-id$='_n0004']"))
    });
  });
  return out;
}, PROPS);

await browser.close();

if (data.length !== 8) fallar(`se esperaban 8 portadillas y hay ${data.length}`);

for (const campo of ["antetitulo", "titulo"]) {
  const base = data[0][campo];
  if (!base) { fallar(`no se encontró el ${campo} del capítulo 1`); continue; }
  for (const c of data) {
    const t = c[campo];
    if (!t) { fallar(`capítulo ${c.i}: falta el ${campo}`); continue; }
    for (const p of PROPS) {
      if (t[p] !== base[p]) fallar(`capítulo ${c.i}: ${campo}.${p} = ${t[p]} (el capítulo 1 tiene ${base[p]})`);
    }
  }
  // Cordura: el título pesa más que el antetítulo y no está en 400.
  if (campo === "titulo") {
    if (base.fontWeight !== "700") fallar(`el título debería pesar 700 y pesa ${base.fontWeight}`);
    const antet = data[0].antetitulo;
    if (antet && parseFloat(base.fontSize) <= parseFloat(antet.fontSize)) {
      fallar(`el título (${base.fontSize}) debería ser más grande que el antetítulo (${antet.fontSize})`);
    }
  }
}

for (const c of data) {
  console.log(`Cap ${c.i}: "${c.titulo.texto}" · título ${c.titulo.fontSize}/${c.titulo.fontWeight} · antetítulo ${c.antetitulo.fontSize}/${c.antetitulo.fontWeight}`);
}

if (fallas.length) {
  console.log("\nFALLÓ:");
  fallas.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: las 8 portadillas tienen el mismo estilo de antetítulo y título");
