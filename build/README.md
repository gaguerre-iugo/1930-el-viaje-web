# Paquete kiosco 1930: El viaje

Generado desde el libro original (reflow) con:

1. `render-kiosk.mjs`: captura cada pagina visual a `pages/NNN.webp (WebP, calidad 82)`.
2. `build-kiosk-manifest.mjs`: genera `kiosk-manifest.json` (seccion y audios por pagina).

El visor es `kiosk.html`; `index.html` decide entre libro normal y kiosco:
`?kiosco=1` o autodeteccion (Haier / Android tactil >=1920).

Los binarios (`content/`, `assets/`, `images/`, `pages/`) no se versionan: se
regeneran copiando el libro y corriendo los dos scripts.


