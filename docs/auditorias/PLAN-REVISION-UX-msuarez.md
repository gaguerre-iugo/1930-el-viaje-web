# Plan de implementación — Revisión UX 1930 (documento de msuarez)

## Qué es esto

Plan de trabajo para los **25 puntos** de `Revision_UX_1930_msuarez.docx`. El
documento trae hallazgos, pasos a seguir y, en varios puntos, tablas de tokens y
tipografía de EVA ya validadas. Dos imágenes lo acompañan: la **ubicación del
pop-up de voz** (punto 25) y las **tres opciones de ícono del glosario**
(punto 1, recomendada: libro abierto con «Aa»).

Nada de este plan está implementado: es la propuesta de orden, alcance y
verificación, más las decisiones que faltan.

## Estado de partida

- Repo en `master`, con dos commits locales sin pushear (`cb50d205`, `fd86dd23`)
  que ya resuelven cuatro puntos.
- El servidor local se levanta con `node tools/serve-local.js` (puerto 5501).
- Al tocar `content/i18n/es-UY/*.json` hay que **resincronizar el precargador
  offline** (`node tools/sync_offline_preloader.js`), porque embebe los catálogos.
- Cada cambio de `assets/reflow-book.js` o `content/reflow.css` necesita subir su
  parámetro `?v=` en `index.html`; el `bundleVersion` de `assets/config.json` se
  sube sólo al publicar (invalida los catálogos de voz, ~9 MB por voz).

## Puntos ya resueltos

| # | Punto | Evidencia |
|---|---|---|
| 2 | Caracteres rotos en el glosario | `cb50d205`: los tres campos `emoji` corregidos y `tools/audit_charset.py`, que hoy reporta 0 caracteres de alfabetos ajenos en las 229 superficies del libro. |
| 6 | El panel es demasiado largo | `fd86dd23`: filas de audio sólo con la voz encendida, reproducción automática debajo del interruptor, tres bloques con título y panel sin scroll (745 px de contenido; termina en 828/900 y 1008/1080). |
| 8 | Los atajos no deberían estar en el panel | `fd86dd23`: `Alt+I/H/G/A`, ayuda propia como diálogo, letras sueltas inertes (WCAG 2.1.4). |
| 9 | Subtítulo repetido | Resuelto de hecho: las secciones se disolvieron en los tres bloques y ya no hay una sección «Herramientas» dentro de «Herramientas». Queda pendiente sólo la parte que depende del punto 1 (sacar el glosario del panel cuando pase a la barra). |

## Los 25 puntos: interpretación y alcance

### Estado de la barra y los paneles (base para 3, 18, 19, 24)

La barra inferior y los paneles **no los dibuja `reflow-book.js`**: el runtime
(React) los renderiza con clases de Tailwind y `reflow-book.js` los parchea por
DOM y por CSS. Datos medidos hoy:

- `content/reflow.css`: 43 variables `--ceibal-*`, **ninguna** variable `--ui-*`
  (las que pide el punto 18), un uso de `#212936` y tres de `#121826`.
- La barra (`#reflow-pagination`) es una grilla fija con botones de
  `min-height: 2.875rem` (46 px); las etiquetas «Anterior»/«Siguiente» van en
  `span.reflow-toolbar-label`, que se ocultan en pantallas angostas.
- El contador de páginas se calcula desde `scrollLeft / pageWidth()`: por eso
  cambia con el ancho y con el tamaño de letra (confirma el punto 4).
- Íconos de texto en `reflow-book.js`: `☰` ×1, `←` ×2, `→` ×2, `⚙` ×2, `⌕` ×1.

### Prioridad alta (antes de publicar)

| # | Qué pide | Dónde se toca | Falta decidir |
|---|---|---|---|
| 1 | Glosario visible: ícono de diccionario, «Resaltar palabras» por defecto con subrayado punteado y definición en globo | Barra/paneles (acceso al glosario), `glossaryHighlightEnabled` en `reflow-book.js`, CSS del resaltado | Ícono oficial de EVA o el dibujado (libro + «Aa»); si «Resaltar palabras» pasa a estar activado por defecto para todos |
| 3 | Jerarquía de la barra: flechas principales (≥56 px, más anchas que Índice/Herramientas, color institucional), «Anterior»/«Siguiente» siempre visibles, íconos de EVA, deshabilitado al 40 % y sin borde | CSS de `#reflow-pagination` + marcado en `reflow-book.js` | Ver punto 18: los colores dependen del tema |
| 4 | Contador por capítulo («Cap. 1 · pág. 3 de 18») en lugar de «14 / 395» | Cálculo en `reflow-book.js` (los capítulos se derivan de `content/toc.json` y de la paginación viva) | Formato exacto; si además se numeran las secciones y actividades de forma fija |
| 5 | Sacar `data-correct` del HTML y cargar la devolución recién al enviar | Los 14 archivos de actividad (72 `data-correct`, 72 `data-feedback-audio-id`), `quiz-sequence.js` y un archivo de respuestas nuevo | Esquema de ofuscación y aceptación de que en un libro offline esto es disuasión, no seguridad (ver riesgos) |

### Panel de Herramientas

| # | Qué pide | Dónde se toca | Falta decidir |
|---|---|---|---|
| 7 | Voseo en toda la interfaz + inventario de textos | Hoy sólo hay **2 textos en usted** en `reflow-book.js` («Habilita el modo. Use Reproducir para comenzar.» y «Active Lectura en voz alta para utilizar el resaltado.»); `interface_translations.json` no tiene ninguno, pero el runtime trae textos propios | Confirmar la lista de textos de interfaz (incluye los del runtime, no sólo los nuestros) |
| 9 | Sacar la sección «Herramientas» del panel | Ya no existe; el glosario hoy vive como fila del bloque «Leer» | Se resuelve junto con el punto 1 |
| 10 | «Extra grande» cortado en el selector de tamaño | Grilla 2×2 actual (`.reflow-font-settings-options`) | Cuatro «A» crecientes (mi preferencia, es lo más compacto) o columna de cuatro botones de ancho completo |
| 24 | Jerarquía tipográfica de barra y paneles (N1…N4, íconos 24 px, negrita sólo en tres niveles) | CSS de barra, panel, índice y glosario + variables `--ui-*` | Se implementa junto con el punto 18 (es el mismo archivo y la misma pasada) |

### Índice y navegación

| # | Qué pide | Dónde se toca | Falta decidir |
|---|---|---|---|
| 11 | Cerrar el índice al elegir un ítem en pantallas < 1024 px y llevar el foco al título | Adaptador del índice en `reflow-book.js` (`installRuntimeMenuAdapter`) | — |
| 12 | Renombrar las pestañas «Índice»/«Páginas» | Etiquetas del runtime (traducciones + parches) | Confirmar «Capítulos» / «Vista de páginas» |
| 13 | «Cap. 1 · título», agrupar prólogos y cierre, «Ana Solari» → «Sobre la autora», sacar «Fin» | `content/toc.json` (22 entradas; hoy hay «Fin» y «Ana Solari», y ningún «Capítulo N») + encabezados de grupo en el panel | Confirmar los nombres de los dos grupos nuevos («Antes de empezar», «Sobre el libro») |
| 14 | Anillo de foco turquesa en el índice | Hoy hay **1** `focus:outline-none` (la clase de los botones de página en `reflow-book.js`); el resto de los `outline-none` vienen del runtime | — |

### Actividades

| # | Qué pide | Dónde se toca | Falta decidir |
|---|---|---|---|
| 15 | Señalizar el reintento, mantener marcada la incorrecta, ofrecer «Siguiente pregunta» | `quiz-sequence.js` y el marcado de los 14 archivos | — |
| 16 | «No.» → «Todavía no.» + cierre «Elegí otra opción y volvé a enviar.» | Hay **dos generaciones**: 8 actividades usan «Comprensión lectora · Pregunta N de 3» y textos «No.»/«Correcto»; 6 usan ✅/❌. De las 81 devoluciones `_exp`, sólo **6** empiezan con «No.»/«No,»/«Incorrecto», **3** con «Correcto» y **72** usan emoji | Unificar el criterio en las 81 (mi recomendación) o tocar sólo las 9; y si se regeneran los audios de las devoluciones cambiadas (72 audios × 2 voces + timecodes) |
| 17 | Mostrar «Pregunta 1 de 3», mantener oculta la dimensión, cierre al terminar las tres | El kicker ya existe en las 8 actividades nuevas y hoy está oculto por CSS (`#content .quiz-kicker { display: none !important }`); las 6 viejas no lo tienen | Decidir si se agrega el kicker a las 6 actividades viejas |

### Estética y marca

| # | Qué pide | Dónde se toca | Falta decidir |
|---|---|---|---|
| 18 | Barra, paneles y pop-up **claros** con los tokens de EVA, y variables semánticas `--ui-*` | `content/reflow.css` + `content/tailwind_output.css` (la mayor parte del color de los paneles viene de clases de Tailwind del runtime) | Es el cambio más grande y transversal. ¿Lo hacemos completo o por etapas (barra → paneles → pop-up)? ¿Tenés el archivo de tokens de EVA o implemento con los hex de la tabla? |
| 19 | Íconos SVG de EVA en barra y paneles; decidir qué hacer con los emojis del glosario | Marcado en `reflow-book.js` + CSS | Necesito el set de íconos de EVA (menú, flechas, herramientas, glosario, cerrar). Para el glosario, el documento ofrece tres caminos |
| 20 | Escala tipográfica de contenido en tres niveles (antetítulo, título, sección) | `content/reflow.css` (contenido de lectura) | El documento deja a confirmar **20 px vs 18 px** del cuerpo (EVA propone 20; hoy son 18 y cada página muestra menos texto) |

### Detalles y voz

| # | Qué pide | Dónde se toca | Falta decidir |
|---|---|---|---|
| 21 | Texto de carga «Abriendo 1930: El viaje…» + logo de Ceibal | `reflow-book.js` (hoy dice «Preparando el libro reflowable…», con variante de error) | Logo: ¿SVG oficial? |
| 22 | Ocultar del todo el enlace «Saltar al contenido principal» y la línea negra de la apertura | `.reflow-skip-link` (hoy `translateY(-120%)` y `margin: .5rem`, que deja ver la sombra); la línea hay que reproducirla e identificarla | — |
| 23 | Dobles espacios y saltos de línea sueltos | `content/i18n/es-UY/texts.json` y los `pg*.html` | Hoy hay **1** valor con doble espacio y **656** con saltos internos, pero la mayoría son listas de lectura fácil legítimas: hay que clasificar antes de tocar |
| 25 | Pop-up de voz flotante, sin carril fijo | `--reflow-tts-player-lane` (2 usos en CSS, 1 en JS), reproductor en `reflow-book.js`, CSS del pop-up | Confirmar la propuesta de la imagen (pastilla compacta sobre la barra en angosta, margen derecho en ancha) y la regla de no tapar la oración resaltada |

## Decisiones que necesito antes de empezar

1. **Tema claro (18)**: ¿completo o por etapas? ¿Tenés los tokens de EVA en un
   archivo, o uso la tabla del documento?
2. **Íconos de EVA (19, 1, 21)**: ¿me pasás los SVG (menú, flechas, herramientas,
   glosario, cerrar, logo de Ceibal) o los dibujo en el estilo propuesto?
3. **«Resaltar palabras» por defecto (1)**: activado para todos los lectores
   desde el arranque, ¿sí o no?
4. **Cuerpo a 20 px (20)**: ¿pasamos a 20 px como EVA o mantenemos 18?
5. **Devoluciones (16)**: ¿unifico las 81 o toco sólo las 9 que no usan emoji? ¿Y
   regenero los audios de las que cambien?
6. **Respuestas fuera del HTML (5)**: ¿aceptás el esquema de hashes + devolución
   al enviar, sabiendo que en un libro offline es disuasión y no seguridad?
7. **Contador por capítulo (4)**: ¿«Cap. 1 · pág. 3 de 18» o barra de progreso?
8. **Pestañas (12) y grupos del índice (13)**: ¿confirmás «Capítulos» / «Vista de
   páginas» y «Antes de empezar» / «Sobre el libro»?

## Fases propuestas

Cada fase termina con su verificación en Chromium y, cuando cambia algo visible,
con capturas en 620 px y 1280 px (el documento las pide para validar con
Comunicación y CAI).

| Fase | Contenido | Tamaño | Verificación |
|---|---|---|---|
| 0 | Rama de trabajo, inventario de textos de interfaz (punto 7, primera mitad) y capturas «antes» | S | — |
| 1 | **Prioridad alta**: glosario accesible (1), barra (3), foco (14) y contador por capítulo (4) | L | Capturas + medición de áreas táctiles y contraste con `tools/screen-test/run.mjs` |
| 2 | Actividades: reintento (15), progreso (17) y devoluciones (16, sin audio todavía) | M | Prueba de las 14 actividades con `verify-*` nuevo |
| 3 | Respuestas fuera del HTML (5) + resincronización del precargador | M | Verificar que la devolución aparece sólo al enviar y que el modo `file://` sigue funcionando |
| 4 | Índice: cierre automático (11), pestañas (12), etiquetas y grupos (13) | M | Navegación con teclado y en 620 px |
| 5 | Panel: voseo (7), tamaño de letra (10) y jerarquía tipográfica del panel (24) | M | Extender `tools/screen-test/verify-tools-panel.mjs` |
| 6 | Tema claro de EVA con variables `--ui-*` (18) + íconos SVG (19) | L | Contraste medido, capturas de barra, tres paneles y pop-up en 620 y 1280 px |
| 7 | Pop-up de voz (25) | L | Regla de no tapar la oración resaltada probada en páginas llenas; teclado y lector de pantalla |
| 8 | Tipografía del contenido (20) | M | Comparación de texto por página antes/después |
| 9 | Detalles: carga (21), restos visuales (22), espacios y saltos (23) | S | Barrido con script y revisión de los 8 capítulos |
| 10 | Cierre: documentación, changelog por punto y verificación global | S | Las dos corridas de verificación en verde, sin errores de consola |

Dependencias: 9 depende de 1; 24 y 3 dependen de 18; 16 con audio depende de la
decisión 5; 5 debe hacerse antes de publicar cualquier versión con actividades.

## Riesgos y notas técnicas

- **Las respuestas no se pueden esconder del todo** (punto 5). El libro funciona
  sin servidor y el precargador offline embebe los catálogos: cualquier archivo
  con las respuestas viaja con el libro. Se puede subir el costo (hashes por
  opción, devolución cargada al enviar) pero no impedir que alguien dedicado las
  encuentre. Si la intención es evitar la copia casual en el aula, alcanza; si es
  evitar trampa deliberada, hay que decirlo y buscar otra estrategia.
- **Regenerar audios** (punto 16) es un paso pesado: `edge-tts` por voz y
  `generate_whisper_timecodes.py` después, sólo para las devoluciones cambiadas.
  Los nombres de archivo no cambian, así que el manifiesto SCORM no se toca.
- **El tema claro** (punto 18) toca clases de Tailwind que vienen del runtime, no
  sólo `reflow.css`. Hay que verificar los tres paneles, los diálogos, los
  cuestionarios y el pop-up, y medir contraste en cada estado.
- **El contador por capítulo** (punto 4) tiene que calcularse sobre la paginación
  viva: cambia con el ancho y con el tamaño de letra, así que «pág. 3 de 18» hay
  que recalcularlo en cada repaginación.
- **Los textos de interfaz del runtime** no están todos en
  `interface_translations.json`: hay cadenas dentro del bundle que hoy se
  parchean con reemplazos de texto. El inventario del punto 7 tiene que
  incluirlos o la lista queda incompleta.
- **Precargador offline**: cada cambio en `texts.json`, `toc.json`, `config.json`
  o las páginas obliga a resincronizarlo, y cualquier archivo **nuevo** (por
  ejemplo el de respuestas del punto 5) necesita revisar cómo entra al catálogo
  `INLINE`, porque el sincronizador sólo refresca las claves que ya existen.
- **Versión de caché**: subir `?v=` en `index.html` en cada cambio de CSS o JS.
  Sin eso, quien ya abrió el libro sigue viendo la versión vieja.

## Qué NO entra en este plan

- La prueba con 3 a 5 estudiantes y la validación con Comunicación y CAI (punto
  25 y cierre del 18): son del equipo, no del repo. Yo entrego las capturas.
- El contenido del libro (textos narrativos, actividades nuevas): sólo se tocan
  los textos de interfaz, las devoluciones (punto 16) y los espacios del punto 23.
