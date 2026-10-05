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

# «Siguiente pregunta» de punta a punta: falla la respuesta, presiona el botón y
# exige que el kicker pase de «Pregunta 1 de 3» a «Pregunta 2 de 3». Mide el kicker
# VISIBLE: el libro repite el mismo texto en 24 nodos (8 capítulos × 3 preguntas) y
# buscar el primero del DOM devuelve una copia fuera de pantalla.
node verify-quiz-next-question.mjs --url http://127.0.0.1:5599/index.html

# Filas de opción y «Siguiente pregunta» con letra grande, extra grande y zoom del
# navegador: 9 combinaciones (1366, 947 y 800/640 px CSS × zoom 1, 1,25 y 1,5).
# Ninguna fila puede desbordar su tarjeta ni el viewport, y el botón tiene que
# quedar pegado al borde derecho de la devolución (entre 0 y 24 px).
node verify-quiz-zoom.mjs --url http://127.0.0.1:5599/index.html

# Con la devolución desplegada, la devolución y «Siguiente pregunta» tienen que
# entrar completos en la tarjeta: el motor las empujaba con una transformación y la
# tarjeta las recortaba, y en columnas bajas el contenido no entraba. Responde mal
# en las 8 secuencias y mide 7 combinaciones de tamaño y letra (56 casos).
node verify-quiz-feedback-fit.mjs --url http://127.0.0.1:5599/index.html

# Ninguna fila de opción puede cortar su propio texto. El motor le fija la altura
# que midió ANTES de enviar, así que cuando el texto pasa a dos o tres líneas la
# última se salía del recuadro. Cubre las dos formas: la opción marcada más larga y
# el texto que se alarga DESPUÉS de enviar (112 comprobaciones).
node verify-quiz-option-fit.mjs --url http://127.0.0.1:5599/index.html

# Contraste de los estados del cuestionario (punto 18): normal, elegida,
# correcta e incorrecta, más la devolución y el botón. Acota la muestra al panel
# de la pregunta respondida (el sondeo viejo tomaba opciones de otra pregunta) y
# convierte oklch/oklab a sRGB. Recorre las 8 secuencias.
node verify-quiz-contrast.mjs --url http://127.0.0.1:5599/index.html

# La evitación del reproductor de voz en LECTURA REAL (punto 25): el resaltado
# real es un rango de la Custom Highlight API y no lleva la clase que buscaba la
# regla, así que se comprueba arrancando la lectura, saltando a una oración baja
# (el reproductor se corre arriba) y después a una alta (vuelve abajo).
node verify-tts-avoidance-real.mjs --url http://127.0.0.1:5599/index.html

# Apertura (puntos 21 y 22): texto de carga «Abriendo 1930: El viaje…» y el
# enlace «saltar al contenido» invisible en reposo (sin el filo de su sombra)
# pero visible al enfocarlo con el teclado.
node verify-opening.mjs --url http://127.0.0.1:5599/index.html

# Jerarquía tipográfica de la interfaz (punto 24): N1 20/700, N2 17/700,
# N3 17/400, N4 15/400, íconos de 24 px y negrita sólo en los títulos.
node verify-ui-typography.mjs --url http://127.0.0.1:5599/index.html

# Íconos generados para el reproductor (detener, audio anterior y siguiente):
# que reproduzcan los componentes del set de EVA. Necesita la carpeta con los
# originales de EVA en el escritorio (ver el script).
node verify-eva-icons.mjs

# Interfaz con los íconos SVG de EVA (punto 19): barra, reproductor de voz y
# encabezados de panel, todos de 24 × 24 y sin caracteres de texto.
node verify-ui-icons.mjs --url http://127.0.0.1:5599/index.html

# Tema claro de barra y reproductor (punto 18, etapa 1): superficies claras y
# contraste WCAG medido (barra 17,73:1 · contador 4,83:1 · flechas 7,14:1).
node verify-light-theme.mjs --url http://127.0.0.1:5599/index.html
```

El diagnóstico completo, con magnitudes y causas, está en
`docs/auditorias/AUDITORIA-MOVIL-ANDROID.md`.

Para ver los errores **en el teléfono real**, el libro acepta `?diag=1` en la URL
(ver `assets/mobile-diagnostics.js`): dibuja un panel con los errores capturados y
las medidas del dispositivo, con botón "Copiar informe".
