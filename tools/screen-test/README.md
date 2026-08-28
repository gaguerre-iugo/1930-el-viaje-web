# Testeo en pantallas interactivas grandes (65", 16:9)

Harness automatizado (Playwright + Chromium) para verificar que el lector
"1930 — El viaje" se vea y se use bien en una **pantalla interactiva de aula de
65" en horizontal (16:9)**, según las especificaciones del manual (`Aspecto.pdf`):
Android + Chrome, interacción táctil y con lápiz, uso colectivo, legibilidad a
distancia, áreas táctiles amplias y separadas, zona segura y QR escaneables.

Esta es la **Capa 1** de la estrategia de testeo. No reemplaza la validación en
dispositivo real (2 lápices simultáneos, legibilidad a distancia de aula, escaneo
de QR), pero detecta de forma automática la mayoría de los problemas de layout.

## Requisitos

- Node.js (ya usado por `tools/serve-local.js`).
- Dependencias locales instaladas en esta carpeta:

```powershell
cd tools/screen-test
npm install
npx playwright install chromium
```

## Uso

```powershell
cd tools/screen-test

# Todos los viewports 16:9 (4K y FHD/HD), muestreo completo de páginas
node run.mjs

# Un solo viewport
node run.mjs --viewport fhd-1920x1080-dpr1

# Limitar el muestreo de páginas (más rápido)
node run.mjs --pages 3
```

El script levanta `tools/serve-local.js` en un puerto propio (5599 por defecto,
configurable con `PORT`), recorre el lector y escribe los resultados en
`tools/screen-test/report/`:

- `index.html` — reporte visual con tabla de hallazgos por vista y enlaces a los screenshots.
- `summary.json` — datos completos de cada auditoría (para diff/regresión).
- `*.png` — capturas de cada página muestreada y de cada panel.

Abrir el reporte:

```powershell
start tools/screen-test/report/index.html
```

## Qué verifica cada auditoría

| Auditoría | Qué mide | Umbral (configurable en `config.mjs`) |
|---|---|---|
| **Áreas táctiles** | Ancho/alto de cada control interactivo, en px CSS y en **mm físicos** (calculados para un panel de 65") | ≥ 44 px CSS y ≥ 9 mm |
| **Separación** | Distancia al control interactivo más cercano | ≥ 8 px / 3 mm |
| **Contraste** | Ratio WCAG de texto vs. fondo. Marca "incierto" cuando el fondo es translúcido, degradado o con `backdrop-filter` (no deducible del DOM) | ≥ 4.5 (normal) / 3.0 (grande) |
| **Recortes** | Contenido visible que sobresale del borde del viewport | > 4 px |
| **Zona segura** | Controles pegados a los bordes del panel | margen 24 px |
| **QR** | Tamaño de cualquier QR renderizado (este libro no incluye QR hoy) | ≥ 160 px CSS |

Se recorren páginas de portada, prosa, ilustradas, cierre y cuestionario
(muestreo por proporción), más los estados de **Índice**, **Herramientas**,
**Glosario** y **reproductor TTS**.

## Notas de interpretación

- El lector usa **paginación por columnas**: las páginas fuera de pantalla son
  intencionales, por eso el harness mide recortes solo sobre elementos visibles,
  no el `scrollWidth` del documento.
- La **grilla de números del Índice** y los conmutadores **Palabra/Oración** del
  TTS suelen aparecer como áreas pequeñas o poco separadas: es justamente el
  riesgo que el manual señala para el uso táctil colectivo. Revisar en los
  screenshots del panel correspondiente.
- El contraste "incierto" (p. ej. la barra inferior con `backdrop-filter`) debe
  confirmarse visualmente o con muestreo de píxeles.

## Capas siguientes (manuales)

- **Capa 2 — Emulación en Chrome DevTools**: dispositivo personalizado 16:9 con
  touch activado para inspeccionar los estados que marque el reporte.
- **Capa 3 — Dispositivo real**: panel de 65" o tablet Android grande en Chrome
  horizontal, para validar 2 lápices simultáneos, uso colectivo, legibilidad a
  distancia de aula y escaneo de QR.
