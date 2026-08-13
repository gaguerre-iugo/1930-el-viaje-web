"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const preloaderPath = path.join(root, "assets", "offline-preloader.js");
const marker = "  var INLINE = ";
const afterInlineMarker = ";\n  var BASE_DIR";
const syncPaths = [
  "./index.html",
  "./quiz_final.html",
  "./qz007.html",
  "./qz010.html",
  "./qz013.html",
  "./qz016.html",
  "./qz019.html",
  "./qz022.html",
  "./qz025.html"
];

const source = fs.readFileSync(preloaderPath, "utf8");
const start = source.indexOf(marker) + marker.length;
const end = source.indexOf(afterInlineMarker, start);

if (start < marker.length || end < 0) {
  throw new Error("No se encontró el catálogo INLINE del preloader.");
}

const inline = JSON.parse(source.slice(start, end));
for (const relative of syncPaths) {
  if (!Object.prototype.hasOwnProperty.call(inline, relative)) {
    throw new Error(`El preloader no contiene ${relative}`);
  }
  inline[relative] = fs.readFileSync(
    path.join(root, relative.replace(/^\.\//, "")),
    "utf8"
  );
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
