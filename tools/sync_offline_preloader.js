"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const preloaderPath = path.join(root, "assets", "offline-preloader.js");
const marker = "  var INLINE = ";
const afterInlineMarkerPattern = /;\r?\n  var BASE_DIR/g;
/* Rutas que ya no van en el paquete offline (se quitaron del libro). */
const removePaths = ["./pg219_sec001.html", "./pg223_sec001.html"];

const source = fs.readFileSync(preloaderPath, "utf8");
const start = source.indexOf(marker) + marker.length;
afterInlineMarkerPattern.lastIndex = start;
const afterInlineMatch = afterInlineMarkerPattern.exec(source);
const end = afterInlineMatch ? afterInlineMatch.index : -1;

if (start < marker.length || end < 0) {
  throw new Error("No se encontró el catálogo INLINE del preloader.");
}

const inline = JSON.parse(source.slice(start, end));
for (const relative of removePaths) {
  delete inline[relative];
}

/* Se refresca TODO el catálogo desde el disco, no una lista fija: cualquier
   cambio en las páginas (por ejemplo, pasar las imágenes a WebP) tiene que
   quedar también en el paquete offline, o el modo file:// pide archivos que ya
   no existen. Las claves que ya no están en disco se informan y se dejan como
   estaban para no romper el paquete por un archivo ausente. */
let updated = 0;
const missing = [];
for (const relative of Object.keys(inline)) {
  const absolute = path.join(root, relative.replace(/^\.\//, ""));
  let contenido;
  try {
    contenido = fs.readFileSync(absolute, "utf8");
  } catch (error) {
    missing.push(relative);
    continue;
  }
  /* El manejador del precargador hace JSON.stringify(data) sobre las claves
     .json, asi que esos valores tienen que guardarse como objeto. Guardarlos
     como texto los devolvia doblemente escapados y el lector recibia un
     string en vez de un objeto. */
  inline[relative] = relative.endsWith(".json") ? JSON.parse(contenido) : contenido;
  updated += 1;
}

console.log(`entradas sincronizadas: ${updated} de ${Object.keys(inline).length}`);
if (missing.length) {
  console.warn(`sin archivo en disco (quedan como estaban): ${missing.join(", ")}`);
}

const escaped = JSON.stringify(inline)
  .replace(/</g, "\\u003c")
  .replace(/>/g, "\\u003e")
  .replace(/&/g, "\\u0026");

fs.writeFileSync(
  preloaderPath,
  source.slice(0, start) + escaped + source.slice(end),
  "utf8"
);
