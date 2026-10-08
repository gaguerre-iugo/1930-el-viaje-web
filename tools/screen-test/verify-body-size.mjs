// Verifica que el cuerpo de lectura tenga el MISMO tamaño en todos los tipos de
// sección. Regresión del bug «dos fuentes» reportado por el usuario: text_only
// usaba var(--reflow-body-size) y boxed_text quedaba fijo en 20px porque
// --adt-cuerpo estaba en 1.25rem. En celular (18px) y en pizarras ≥100rem (24px)
// el texto de boxed_text/chat no acompañaba y se veían dos tamaños.
//
// Uso:
//   node verify-body-size.mjs
//   node verify-body-size.mjs --url http://127.0.0.1:5501/index.html
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argVal = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const target = argVal("--url") || "http://127.0.0.1:5501/index.html";

const VIEWPORTS = [
  { nombre: "celular", width: 390, height: 844 },
  { nombre: "laptop", width: 1366, height: 900 },
  { nombre: "pizarra", width: 1680, height: 1050 },
];

const failures = [];
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
  });
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector("#reflow-pagination button", { timeout: 30000 });
  await page.waitForTimeout(3000);

  const medida = await page.evaluate(() => {
    const tam = (selector) => {
      const el = document.querySelector(selector);
      return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10 : null;
    };
    return {
      reflowBodySize: getComputedStyle(document.body)
        .getPropertyValue("--reflow-body-size")
        .trim(),
      adtCuerpo: getComputedStyle(document.body)
        .getPropertyValue("--adt-cuerpo")
        .trim(),
      textOnly: tam('section[data-section-type="text_only"] p.reading-sentence'),
      boxed: tam('section[data-section-type="boxed_text"] p.reading-sentence'),
    };
  });
  await page.close();

  console.log(
    `=== ${vp.nombre} (${vp.width}x${vp.height}) === ` + JSON.stringify(medida)
  );

  if (medida.textOnly === null || medida.boxed === null) {
    failures.push(`${vp.nombre}: no se encontraron párrafos text_only y boxed_text`);
  } else if (medida.textOnly !== medida.boxed) {
    failures.push(
      `${vp.nombre}: text_only mide ${medida.textOnly}px y boxed_text ${medida.boxed}px`
    );
  }
  if (consoleErrors.length) {
    failures.push(`${vp.nombre}: errores de consola: ${consoleErrors.join(" | ")}`);
  }
}

await browser.close();

if (failures.length) {
  console.log("\nFALLÓ:");
  failures.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nOK: text_only y boxed_text comparten el mismo tamaño de cuerpo");
