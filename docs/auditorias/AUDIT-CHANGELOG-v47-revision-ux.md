# Changelog — Revisión UX (documento de msuarez)

Registro de los 25 puntos de `Revision_UX_1930_msuarez.docx` a medida que se
implementan. El plan completo está en `PLAN-REVISION-UX-msuarez.md`.

## Preparación

- **Tokens de EVA**: la paleta institucional y la de grises quedó transcripta de
  la lámina `Color.png` en `docs/arquitectura/EVA-TOKENS.md`, con los valores que
  necesita el tema claro (puntos 18 y 24).
- **Íconos**: `assets/icons/eva-arrow-right.svg` y `eva-arrow-left.svg`
  reproducen la flecha de EVA (derivada del export de 100 px que pasó la
  revisión) y `glossary-book.svg` es el libro abierto con «Aa» que pidió el
  documento, dibujado para el libro porque no existe un equivalente en el set de
  EVA. `tools/screen-test/verify-icons.mjs` compara la flecha contra el export:
  caja con 1 px de diferencia, área al 100,7 % y espejo exacto entre las dos.
- El **enlace de Figma** del sistema de diseño no se pudo leer (HTTP 403: hace
  falta sesión), así que los valores salen de la lámina exportada.

### Corrección posterior (reportada en uso)

Con el libro abierto el contador mostraba el capítulo y **enseguida pasaba al
formato global** («pág. 24 de 317»), y ahí quedaba. Causa: durante el arranque
—y mientras el runtime reacomoda el contenido— las mediciones de página pueden
volver cero o desordenarse. Los bloques quedaban con rangos colapsados, la página
actual caía fuera de todos y el contador usaba el formato de reserva; además ese
resultado inválido **se guardaba en la caché**, así que el error persistía hasta
la próxima repaginación.

Tres cambios:

1. Los rangos se **reparan** al construirlos: el primero arranca en 0 y cada uno
   sigue al anterior, así los bloques cubren el libro de punta a punta y ninguna
   página puede quedar afuera.
2. Los bloques **sólo se guardan cuando la medición es confiable** (arrancan en 0
   y avanzan). Si no, se devuelven reparados pero sin fijar, para reintentar en la
   próxima consulta. La firma de caché ahora incluye la geometría
   (`scrollWidth`, cantidad de hijos y ancho de página), no sólo el total.
3. El contador se reescribe en el **mismo ciclo que sigue los cambios de DOM**
   (el que ya usaba el resaltado), así abrir o cerrar el panel no lo deja con un
   valor viejo. Si la página no cae en los bloques guardados, se reconstruyen una
   vez antes de resignar el capítulo.

Regresión agregada a `verify-chapter-progress.mjs`: muestreo del contador cada
100 ms durante el arranque (no puede aparecer el formato global mientras haya
bloques), cobertura completa (arranca en 0, sin huecos y con las 286 páginas
mapeadas a un bloque) y apertura/cierre del panel.

### Segunda corrección: la caché del índice (el caso real)

La corrección anterior no alcanzaba. En un Chrome con uso previo el contador
seguía cayendo al formato global **sin errores de consola**, y la causa era otra:
`content/toc.json` se pide con **versión fija** (`?v=10-activities-index` desde
`reflow-book.js` y `?v=<bundleVersion>` desde el runtime) y el servidor sirve las
URL versionadas como inmutables. Un lector que ya había abierto el libro tenía el
índice viejo, **sin el campo `group`**, así que no había ningún bloque que armar
y el contador mostraba el total del libro. Las pruebas no lo veían porque corren
en contextos nuevos, sin caché.

Arreglo: el contador ya no depende de que el índice traiga los grupos. La tabla
de grupos vive también en `reflow-book.js` (que sí se versiona) y se usa **sólo
cuando el índice llega sin grupos**; si el índice los trae, manda el índice. El
fetch propio del índice pasó a `?v=11-toc-groups` para que un lector nuevo pida
el archivo agrupado.

Regresión agregada: `verify-chapter-progress.mjs` intercepta
`**/content/toc.json*` y responde la versión **sin** `group`, que es lo que tiene
un navegador con caché. Comprueba que el índice queda con 0 grupos, que el
contador conserva el capítulo y que los diez bloques son **idénticos** a los del
índice agrupado.

> **Consecuencia para el punto 13**: los cambios de `content/toc.json` (nombres
> del índice y agrupación) no llegan a un lector que ya abrió el libro hasta que
> se suba `bundleVersion`. Hay que decidirlo antes de esa fase, o mover esos
> datos a un archivo con versión propia.

## Punto 5 · Las respuestas viajaban en el HTML — RESUELTO

**Problema:** cada actividad llevaba su clave de corrección en el propio HTML:
`data-correct="true|false"` en cada opción y, en seis archivos, además
`data-correct-answers` con el mapa completo sobre la sección. Cualquiera podía
leer la respuesta con Ctrl+U o copiando el markup.

**Solución**

- La clave vive ahora en `content/i18n/es-UY/quiz-answers.json`
  (`sección → { opción: esCorrecta }`, 14 actividades y 90 opciones), y se aplica
  al montar la actividad. El contrato del motor no cambia: sigue leyendo
  `option.dataset.correct`, sólo que ahora lo escribe el motor desde el archivo.
- `tools/extract_quiz_answers.py` (nuevo) hace la migración y la verifica:
  extrae las respuestas cubriendo **las dos formas** de actividad del libro
  (`activity_quiz`, con `data-correct-answers`, y `quiz_sequence`, con
  `data-correct` en cada etiqueta), escribe el JSON y limpia el HTML.
  `--check` no modifica nada y falla si vuelve a aparecer una respuesta en el
  HTML o si el JSON se desalinea.
- Se quitó del HTML el pisotón que quedaba: `prepareChapterTwoQuiz()` reescribía
  `data-correct` desde `data-correct-answers`; ahora delega en la carga común
  (con el atributo ausente habría marcado **todas** las opciones como falsas).
- **Paquete offline**: `tools/build_offline_preloader.py` no incluía el archivo
  nuevo ni `speech_texts.json` (hueco previo, reportado por `validate_v46.py`).
  Se agregaron los dos a la lista blanca: el precargador pasa de 231 a **233**
  claves y el libro abierto como `file://` vuelve a corregir.
- `validate_v46.py` leía `data-correct="true"` del HTML para comprobar que cada
  pregunta tiene exactamente una respuesta correcta; ahora lee el archivo nuevo
  (y falla si la clave vuelve al HTML).

**Verificación**: `tools/screen-test/verify-quiz-answers.mjs` (nuevo) comprueba
que los 14 archivos de actividad tengan **0** atributos de respuesta, que el
archivo tenga las 14 actividades y 90 opciones, que el DOM reproduzca
exactamente el archivo (**72 opciones comparadas, 0 discrepancias**) y que la
corrección siga funcionando: elegir la opción correcta da «correcto» en las
actividades probadas y elegir una incorrecta da «incorrecto» —sin esta última
prueba, un motor que marcara todo como correcto pasaría inadvertido.

**Decisión pendiente (contenido)**: los archivos `qz001.html` a `qz006.html` no
están en el orden de lectura ni los enlaza nadie; sólo los lista
`imsmanifest.xml`. Contienen las preguntas qz001–qz003 (que también viven dentro
de `quiz_final`, con las mismas claves pero respuestas distintas) y **qz004,
qz005 y qz006, que no existen en ningún otro lado**. Hay que decidir si se
integran al libro, se dejan como están o se retiran del paquete.

## Punto 3 · Las flechas pesaban menos que los botones de al lado — RESUELTO

**Qué se hizo**

- **Anterior y Siguiente son la acción principal**: 56 px de alto
  (`3.5rem !important`, porque el arnés del proyecto fuerza 48 px a todos los
  botones de la barra desde 1152 px), más anchas que Índice y Herramientas en
  todos los anchos medidos, y en `institucional-600` con texto blanco (7,1:1).
- **Íconos de EVA**: las flechas de texto `←` y `→` se reemplazaron por los SVG
  derivados del export de EVA (embebidos en `reflow-book.js` con
  `currentColor`, 24 px). Se sumó el libro con «Aa» para el glosario.
- **Etiquetas siempre visibles**: la barra pasó de 62 a 68 rem de ancho máximo y
  las acciones secundarias dieron su relleno horizontal, para que las seis
  columnas entren con el texto completo (el primer intento recortaba
  «Índice», «Glosario» y «Herramientas» con puntos suspensivos).
- **Por debajo de 32 rem** las flechas se apilan (ícono arriba, etiqueta abajo,
  como pide el documento para cuando falta espacio), el contador queda sólo con
  el avance y las tres acciones secundarias pasan a ícono con nombre accesible.
- **Estado deshabilitado**: 40 % de opacidad y sin borde.

**Verificación**: `tools/screen-test/verify-primary-toolbar.mjs` (nuevo) recorre
ocho anchos (1920, 1366, 1024, 768, 620, 480, 400 y 340 px) y comprueba: sin
desborde de barra, seis columnas, flechas más altas (56 px) y más anchas que
Índice y Herramientas, etiquetas presentes y **sin recortar**, fondo
`rgb(0, 99, 93)`, texto blanco, íconos SVG presentes, el estado deshabilitado al
40 % sin borde y que el glosario se abra desde la barra.

## Punto 1 · El glosario quedaba escondido — RESUELTO

**Qué se hizo**

- El glosario se abre desde **la barra**, en un botón propio entre «Siguiente» y
  «Herramientas», con el ícono de libro abierto con «Aa» que propone el
  documento. No existe un ícono equivalente en el set de EVA, así que se dibujó
  para el libro (ver `docs/arquitectura/EVA-TOKENS.md`).
- Se eliminó la fila del glosario que vivía al final del panel Herramientas
  (punto 9) junto con su CSS, y el regreso del panel de glosario ahora enfoca el
  interruptor de lectura en voz alta en lugar de una fila que ya no existe.
- **El subrayado viene encendido de fábrica.** El estado vive en el store
  `glossaryMode` del reproductor y no se podía encender desde afuera, así que se
  cambia el valor inicial en la fuente, con el mismo mecanismo de parches que ya
  usa el motor (`("glossaryMode",!1)` → `("glossaryMode",!0)`). Esto era
  imprescindible: el globo con la definición **también** depende de ese store, de
  modo que con el subrayado apagado tocar la palabra no hacía nada.
- **Subrayado punteado sutil** en lugar de la píldora verde
  (`bg-emerald-100/80 text-emerald-800`): línea punteada de 1 px en el
  institucional 600, sin fondo, para que el texto se siga leyendo como texto.
- **La elección del lector se respeta y persiste.** El runtime no guarda la
  preferencia del switch en la misma clave que consulta para resaltar, así que
  el libro registra la intención al tocar el switch
  (`adt-reflow-glossary-highlight:…`), la respeta al recargar y sincroniza el
  switch para que muestre lo que realmente pasa.

**Verificación**: `tools/screen-test/verify-glossary-highlight.mjs` (nuevo)
comprueba, en un perfil limpio, que hay palabras subrayadas a la vista sin tocar
nada (14 en la segunda página), que el subrayado es `dotted` de 1 px en
`rgb(0, 99, 93)` y sin fondo, que al tocar «trayectos» se abre el globo con su
definición, que el switch dice «encendido», que al apagarlo no queda ninguna
palabra subrayada y que la preferencia sobrevive a la recarga.

### Correcciones posteriores (reportadas en uso)

**1. El subrayado parpadeaba** («subraya punteado, se va, vuelve a puntear»). Con
el modo glosario encendido, el reproductor volvía a aplicar su propio resaltado:
su función de arranque limpiaba las palabras y envolvía **630 de una sola vez en
todo el libro**, con su clase verde de fábrica, pisando el resaltado paginado del
motor. Medido con un observador de mutaciones: había dos cambios de cantidad y a
los 17 s aparecían 630 palabras del reproductor. Ese tramo ahora **delega en el
motor** (parche blando: si un bundle no trae el marcador, el libro sigue
cargando), y además la limpieza que el motor le devuelve al efecto del
reproductor ya no borra las palabras mientras el subrayado esté pedido, con
reaplicación inmediata si algo externo las borra. Después: una sola cantidad
observada y 0 palabras del reproductor.

**2. El globo no abría** (reportado ya sin parpadeo). No era el código: el store
`glossaryMode` del reproductor se lee de `localStorage` al arrancar y el efecto
que instala la escucha del clic **sale antes si está apagado**. Un perfil con el
valor viejo en `false` dejaba las palabras subrayadas (por el valor por defecto
del motor) y el clic muerto. Reproducido a voluntad:

| `glossaryMode` | palabras subrayadas | globo |
|---|---|---|
| `false` | 14 | ninguno |
| `true` | 14 | «Definition for trayecto» |

Arreglo: al arrancar, el motor **alinea el valor persistido con la preferencia
del lector** antes de que el reproductor lo lea (si nunca eligió, queda
encendido), y al tocar el switch escribe las dos claves para que el subrayado y
el globo no se separen. La suite incorpora ese caso como regresión: contexto con
`glossaryMode` en `false`, donde exige globo abierto y cantidad estable (14
palabras, una sola cantidad observada). Para diagnóstico en el navegador del
lector queda `__adtReflowGlossaryState()` en la consola.

## Punto 14 · Sin indicador de foco en el índice — RESUELTO

**Problema:** los botones del índice llevaban `focus:outline-none` en su clase:
con teclado, el foco sólo se notaba por un cambio de fondo leve.

**Solución:** se quitó `focus:outline-none` (y el anillo genérico de Tailwind) de
la clase de los botones de página en `reflow-book.js`, y `reflow.css` les da el
mismo anillo turquesa que la barra: contorno de
`var(--ceibal-border-focus)` con `--ceibal-focus-on-dark` y la sombra de foco.

**Verificación:** `tools/screen-test/verify-focus-visible.mjs` (nuevo) enfoca uno
por uno los controles de la barra y de los tres paneles y comprueba dos cosas: que
el foco cambie alguna señal visual y que el control enfocado tenga **contorno**
real (no alcanza con el cambio de fondo). Resultado: barra 3/3 controles con
contorno, índice 24/24. Quedan como pendientes del runtime 4 controles del panel
Herramientas y 1 del glosario, que no muestran contorno al enfocarse: se revisan
junto con la jerarquía tipográfica (punto 24) y el tema claro (punto 18), que
tocan esos mismos componentes.

## Punto 4 · El número de página cambia según la pantalla — RESUELTO

**Problema:** el total de páginas depende del ancho y del tamaño de letra (395 a
620 px, 326 a 1280 px, y cambia otra vez con la letra). «14 / 395» no sirve para
que un docente mande a la misma página.

**Solución:** el contador de la barra muestra el bloque de lectura y el avance
dentro de él.

| Ancho | Forma | Ejemplo |
|---|---|---|
| ≥ 768 px | larga | `Cap. 1 · pág. 3 de 18` |
| 352–767 px | corta | `Cap. 1 · 3/18` |
| < 352 px | mínima | `3/18` |

La etiqueta accesible y el anuncio para lectores de pantalla usan siempre la
forma completa hablada: *«Capítulo 1, página 3 de 18»*. Lo que cambia con el
ancho es sólo lo que se ve.

### Cómo se arman los bloques

`content/toc.json` ahora marca cada entrada con `group`:

- `antes` — portada, «La historia que nos une», «Una mezcla perfecta» y
  «Sinopsis» → bloque **Antes de empezar**.
- `chapter` — los ocho capítulos narrados, numerados **en orden de lectura** (no
  por el orden del archivo): 1 → `pg017`, 2 → `pg037`, 3 → `pg058059`,
  4 → `pg080081`, 5 → `pg104105`, 6 → `pg122123`, 7 → `pg144145`,
  8 → `pg176177`.
- `sobre` — «Fin» y «Ana Solari» → bloque **Sobre el libro**.
- Las **actividades no llevan `group`**: no abren bloque, así que caen dentro del
  capítulo al que pertenecen (una actividad es parte del bloque de su capítulo).

Los bloques cubren el libro entero y se recalculan cuando cambia la paginación
(`state.ttsLayoutRevision`), no en cada vuelta de página. Medidos hoy a 1366 px:
Antes de empezar 10 páginas, capítulos de 27 a 49, Sobre el libro 11.

### Archivos

- `content/toc.json` — campo `group` en 14 entradas (las 8 actividades quedan
  como estaban).
- `assets/reflow-book.js` — `buildChapterProgressBlocks()`, `chapterProgressBlocks()`
  (con caché por revisión de paginación) y `chapterProgressAt()`, que es **pura**
  y se prueba con bloques sintéticos. `updateControls()` escribe las tres formas
  y la etiqueta accesible; el `<output>` pasó de «N / M» a los tres `<span>`.
- `content/reflow.css` — el contador deja de tener ancho fijo, la columna pasa a
  `minmax(5.25rem, auto)` y las grillas compactas le dan más lugar; el CSS elige
  la forma según el ancho.
- `index.html` — `reflow.css?v=99-contador-capitulo` y
  `reflow-book.js?v=142-contador-capitulo`.
- `assets/offline-preloader.js` — resincronizado (el índice viaja en el paquete
  offline).

### Verificación

`tools/screen-test/verify-chapter-progress.mjs` (nuevo), con las dos capas que
pidió la revisión:

- **Unitario** (12 casos): la función pura con bloques sintéticos cubre primera y
  última página de cada bloque, bloque de una sola página, las tres formas, la
  forma hablada, una página fuera de todo bloque y una lista vacía.
- **Integración** (libro real, Chromium): 8 capítulos numerados en orden, 10
  bloques con sus rangos, el texto del contador en la primera página, la etiqueta
  accesible, el avance tras navegar 4 páginas, el recálculo al agrandar la letra
  (los bloques pasan de 10/27/28… a 14/35/37…), y las tres formas a 1366, 620 y
  340 px **sin desborde interno ni de barra**.

Regresiones: `verify-tools-panel.mjs` sigue en verde y `audit_charset.py` no
cambia su línea de base (0 caracteres de alfabetos ajenos).

### Pendientes de este punto

- El contador **incluye las páginas de la actividad** dentro del capítulo (una
  actividad pertenece a su capítulo). Si se prefiere que las actividades no
  cuenten, hay que decidirlo: el punto 13 (índice) las numera como «Actividad N».
- `tools/validate_v46.py` reporta hallazgos **previos** a este cambio (audio y
  timecodes base del pipeline viejo, y el precargador sin
  `content/i18n/es-UY/speech_texts.json`, que ya faltaba en HEAD).
- `tools/validate_paragraph_geometry.py` no corre en este entorno: necesita
  `pdfplumber`, que no está instalado.
