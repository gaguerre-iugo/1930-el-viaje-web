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

---

# Testeo en teléfonos y tablets Android (Chrome móvil)

Además del arnés de pantallas grandes, `mobile-audit.mjs` audita el lector en
perfiles Android reales (viewport móvil, `hasTouch`, `devicePixelRatio` y
`userAgent` de Android) y mide lo que rompe la experiencia en un teléfono:

```powershell
cd tools\screen-test

# Los 4 perfiles (412x915 vertical, 360x640 chico, 915x412 horizontal, 800x1280 tablet)
node mobile-audit.mjs

# Menos muestreo = más rápido
node mobile-audit.mjs --pages 3

# Un solo perfil, o contra el servidor local
node mobile-audit.mjs --device pixel7-landscape
node mobile-audit.mjs --url http://127.0.0.1:5599/index.html
```

Qué informa por perfil y por vista:

| Métrica | Por qué importa |
|---|---|
| **Usabilidad** (ms) | Cuándo el contenido es visible y, sobre todo, cuándo la barra de navegación queda **usable** (opacidad y toques activos). El lector la mantiene oculta mientras arranca el runtime: es la métrica que decide si el libro parece colgado |
| Errores de consola / red | Excepciones, promesas rechazadas, 404 y HTTP ≥ 400. En el sitio publicado hoy: 0 |
| Unidades de viewport | Valor real de `vh`, `dvh`, `svh`, `lvh` y de `--reflow-page-height` |
| Barra de direcciones | Se simula su retracción con `setViewportSize` y se detecta si el libro se **re-pagina** (columna que cambia de alto) |
| Geometría | Texto bajo el pliegue visible, solapamiento barra/texto, elementos que cruzan los bordes |
| Imágenes | Rotas, deformadas y **encogidas por `contain`** (caja desproporcionada, con el tamaño realmente pintado) |
| Objetivos táctiles | Área táctil **efectiva** (el `<label>` que envuelve), no el `<input>` desnudo |

Genera capturas y `report-mobile/mobile-summary.json`.

Complementos:

```powershell
node mobile-boot-timeline.mjs     # hitos del arranque: cuándo queda usable el lector
node verify-published.mjs         # ¿lo publicado en GitHub Pages es igual a este repo?

# Reglas del panel de Configuración (menú Herramientas) y de los atajos:
# tres bloques (Leer, Escuchar, Pantalla), filas de audio sólo con la lectura en
# voz alta encendida, reproducción automática debajo del interruptor, panel sin
# scroll con la voz apagada y atajos Alt+I/H/G/A sin letras sueltas.
# Necesita el libro servido por HTTP (node tools/serve-local.js).
node verify-tools-panel.mjs --url http://127.0.0.1:5599/index.html
node verify-tools-panel.mjs --url http://127.0.0.1:5599/index.html --viewport 1920x1080

# Barra inferior (revisión UX, punto 3) y acceso al glosario: Anterior y
# Siguiente como acción principal (56 px, más anchas que Índice y Herramientas,
# en institucional 600), etiquetas siempre visibles y sin recortar, íconos de
# EVA, deshabilitado al 40 % sin borde, y el glosario abriéndose desde la barra.
# Recorre ocho anchos, de 1920 a 340 px.
node verify-primary-toolbar.mjs --url http://127.0.0.1:5599/index.html

# Contador por capítulo (punto 4): "Cap. 1 · pág. 3 de 18" con tres formas según
# el ancho, etiqueta hablada, bloques que cubren todo el libro sin huecos y
# resistencia a un toc.json cacheado sin grupos.
node verify-chapter-progress.mjs --url http://127.0.0.1:5599/index.html

# Resaltado del glosario (punto 1): encendido por defecto, subrayado punteado
# sutil en el color institucional, definición al tocar la palabra y preferencia
# del lector respetada y persistida.
node verify-glossary-highlight.mjs --url http://127.0.0.1:5599/index.html

# Foco visible con teclado en la barra y el índice (punto 14).
node verify-focus-visible.mjs --url http://127.0.0.1:5599/index.html

# Fidelidad de los íconos de interfaz contra el export de EVA (no necesita servidor).
node verify-icons.mjs

# Respuestas de las actividades (punto 5): que no queden en el HTML, que el
# archivo content/i18n/es-UY/quiz-answers.json cubra las 14 actividades y que el
# motor reproduzca esa clave en el DOM (72 opciones) corrigiendo bien y mal.
node verify-quiz-answers.mjs --url http://127.0.0.1:5599/index.html

# Actividades (puntos 15 y 17): kicker «Pregunta N de 3» visible, dimensión
# oculta, la incorrecta que sigue marcada al reintentar, «Siguiente pregunta» y
# cierre de la secuencia al responder las tres.
node verify-quiz-retry.mjs --url http://127.0.0.1:5599/index.html
```

El diagnóstico completo, con magnitudes y causas, está en
`docs/auditorias/AUDITORIA-MOVIL-ANDROID.md`.

Para ver los errores **en el teléfono real**, el libro acepta `?diag=1` en la URL
(ver `assets/mobile-diagnostics.js`): dibuja un panel con los errores capturados y
las medidas del dispositivo, con botón "Copiar informe".
