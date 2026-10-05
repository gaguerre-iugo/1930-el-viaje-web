# Changelog — Revisión UX (documento de msuarez)

Registro de los 25 puntos de `Revision_UX_1930_msuarez.docx` a medida que se
implementan. El plan completo está en `PLAN-REVISION-UX-msuarez.md`.

## Sinopsis (las 2 páginas antes del capítulo 1) en claro

Las dos páginas de la sinopsis (pg224, «1930: EL VIAJE») estaban en negro, con
título amarillo y texto blanco. Ahora son una página clara como el resto: fondo
blanco, texto y título en `--ceibal-gray-900` (gris-900) y la misma fuente
(Atkinson Hyperlegible).

- `content/reflow.css`: las reglas `.reflow-back-cover-page` /
  `.reflow-back-cover-synopsis` / `.reflow-back-cover-inner` pasaron de
  `#000` / `#fff` / `#f4ca43` a `#fff` / `--ceibal-gray-900`, y se quitó el
  `box-shadow` negro que pintaba los gutters.
- `reflow-book.js`: el fondo negro de página (`reflow-back-matter-page` sobre
  `body`, `main` y `#content`) ahora se limita a la **página de créditos**
  (`.reflow-collaborators-page`), no a la sinopsis; la sinopsis se separó de
  `state.backMatterPages`.

**Verificado**: sinopsis en blanco con texto `rgb(18, 24, 38)`; la última página
(«Sobre el libro · pág. 11 de 11», créditos) sigue negra.

Caché: `reflow.css?v=161-sinopsis-clara` y `reflow-book.js?v=187-sinopsis-clara`.

## Portadillas de los capítulos 1 y 2, iguales al resto

Las portadillas de los capítulos 1 (pg017) y 2 (pg037) tenían el tratamiento
invertido respecto de las de los capítulos 3 a 8 (`.reflow-later-chapter-cover`):
el «Capítulo N» iba en peso 400 y con otro tamaño, y el título en negrita. Ahora
comparten los mismos valores: h1 en `clamp(2.4rem, 6vh, 4.2rem)` con peso 700, y
subtítulo en `clamp(1.45rem, 3.4vh, 2.1rem)` con peso 400.

**Medido**: los capítulos 1, 2 y 3 quedan idénticos (h1 54 px / 700 / line-height
54 px / letter-spacing 2,16 px; subtítulo 30,6 px / 400 / line-height 36,72 px).
Capturas de los tres confirmadas.

Caché: `reflow.css?v=160-portadillas-cap1-2`.

## Índice: «Capítulo X. » antes de cada capítulo

El índice listaba los capítulos sólo con su título. Ahora cada entrada de capítulo
se muestra como **«Capítulo N. título»** (por ejemplo, «Capítulo 1. Hay algo
extraño en esa foto»), tanto en la pestaña **Índice** como en las cabeceras de la
pestaña **Páginas**. El número sale del orden de los capítulos agrupados en
`content/toc.json` (con el respaldo del contador si el índice llegó sin grupos, el
caso de la caché vieja). Las demás entradas (portada, «Sinopsis», «Fin», «Ana
Solari», actividades) quedan igual, y el `aria-label` de cada capítulo acompaña el
texto nuevo.

Medido en el índice: «Capítulo 1. Hay algo extraño en esa foto» … «Capítulo 8. Dos
mundiales, un mismo destino».

Caché: `reflow-book.js?v=186-indice-capitulo`.

## Aire alrededor del contador de la barra

Con el anillo de foco sobre «Siguiente», el texto del contador quedaba pegado a
los botones **a ambos lados**: la barra usa una grilla con **4 px** de separación
y el contador (ancho automático) llegaba justo. Se le dio
`padding-inline: .75rem`, así el texto queda a **16 px** de los botones y el
anillo de foco (2 px de offset más el borde) no lo toca. Medido: el contador pasó
de 217 a **241 px** de ancho.

Verificado con `verify-primary-toolbar` (8 anchos) y `verify-ui-typography`.

Caché: `reflow.css?v=159-barra-aire-contador`.

## Salto de medida en la prosa de continuación de páginas ilustradas

En pg047 (Cap. 2 · pág. 14) el texto que continúa la página ilustrada arrancaba
en el borde de la columna (**x=300, 766 px de ancho**) mientras el resto de la
página lo hacía en la medida de lectura (**x=347, 672 px**). Causa: la regla
`section[data-section-id="pg047_sec001"] > div { display: contents }` alcanzaba
también al bloque de prosa `.illustrated-overflow`; al no tener caja, el tope de
medida del `.reading-block` no aplicaba y sus párrafos se hoisteaban al ancho
completo de la columna.

- Se excluyó `.illustrated-overflow` (y `.illustrated-page`) de esa regla, así la
  prosa de continuación vuelve a ser un bloque con la medida del texto.
- Se sumó un tope de medida por párrafo dentro de `.illustrated-overflow` como
  respaldo.

**Verificado en todo el libro**: escaneo de los 3.207 párrafos; todos los bloques
de prosa arrancan en **347** (la medida) salvo los dos-columnas de créditos
(pg225, por diseño). Los `.illustrated-overflow` de pg025, pg047, pg052, pg068,
pg078, pg092, pg099, pg110, pg113, pg132, pg142, pg150, pg173 y pg190 quedan en
**347..1019** (la medida).

Caché: `reflow.css?v=158-pg047-overflow-bloque`.

## Ancho de las ventanas de chat = ancho del texto

Las ventanas de chat medían distinto y **más ancho que el texto**: 766 px en la
mayoría (pg020, pg029, pg068…pg183), 672 px donde la normalización de prosa las
encogía (pg021, pg095) y 702 px en la composición del capítulo 5. La corrección
pedida es que **todas queden del ancho de la medida de lectura**, alineadas con
el texto de la página.

- Se excluyeron las ventanas (`whatsapp-chat-window`, `reflow-book-chat-window`,
  `chapter-one-chat-window`) de la normalización de prosa, así las burbujas
  conservan su ancho propio (saliente ajustada al texto; entrante 100 %).
- Regla única para todas las ventanas (`whatsapp`, `reflow-book`,
  `chapter-one-chat-part`, `chapter5`): `width: min(100%,
  var(--reflow-text-measure))` y centradas. La medida acompaña la escala (42 rem
  normal, 52 rem en tableros grandes). Medido después: **todas en 672 px** a
  1366 (pg020, pg021, pg029, pg068…pg183, pg095 y pg117), el mismo ancho que el
  texto. La burbuja saliente de pg021 queda en 240 px (ajustada al texto).
- La composición del capítulo 5 (página con `overflow: hidden`) queda dentro de
  su página.

`verify-chapter-progress` falla por un desajuste **preexistente** del índice
cacheado (`sobre:260-271` contra `260-270`); se reprodujo igual contra HEAD.

Caché: `reflow.css?v=155-chat-ancho-texto`.

## Reproductor de voz centrado (ajuste de uso)

Con la lectura en voz alta activa, el reproductor quedaba anclado a la derecha
mientras la barra se centra. Se pidió centrarlo: `#reflow-tts-player` pasa de
`right: 1rem` a `left: 50%; transform: translateX(-50%)`, igual que
`#reflow-pagination`. Medido: a 1366 el centro pasa de **998** a **683** (el del
viewport) y a 1702 de **1334** a **851**. La pastilla angosta ya estaba centrada.

`verify-floating-player.mjs` ahora exige el centrado en pantallas anchas (antes
pedía un margen derecho de 16 px). `verify-tts-avoidance` y
`verify-tts-avoidance-real` siguen en verde.

Caché: `reflow.css?v=152-tts-centrado`.

## Interruptores on/off con los SVG de EVA (Herramientas y Glosario)

Se reemplazaron los interruptores de los paneles por los gráficos de EVA que dejó
Comunicación (`status=off/on, label=no`): pista y perilla viajan juntas en una
imagen por estado.

- **Assets**: `assets/icons/eva-switch-off.svg` (pista `#F3F4F6`, borde `#4B5563`,
  perilla `#6B7280` a la izquierda) y `eva-switch-on.svg` (pista `#CCECEA`, borde
  `#008078`, perilla `#00635D` a la derecha). Declarados en `imsmanifest.xml`
  porque el CSS los referencia.
- **CSS**: el interruptor (`.reflow-reader-panel [role="switch"]`) dibuja la pista
  con `background-image` según `aria-checked`, con `background-origin/clip:
  content-box`, y oculta la perilla nativa. La caja de contenido queda en
  **52 × 24 px** (la proporción del SVG de 73 × 34) y el elemento conserva
  **60 × 48 px** de área táctil (el alto de 48 px no cambia).
- **Motor**: el pase inline ya no pinta la pista —la dibuja el CSS—; sólo
  neutraliza el fondo oscuro que escribe el runtime, para no dejar un fleco detrás
  de la imagen. Las casillas nativas conservan su acento.

**Verificación**: `verify-tools-panel` (escritorio y 390 px), `verify-light-theme`,
`verify-focus-visible` y `verify-glossary-highlight`, todos en verde; sin 404 de
los SVG.

**Dos correcciones posteriores** (reportadas en uso):

- El borde del SVG se recortaba en algunos lados: `background-clip: content-box`
  cortaba la mitad externa del trazo. Pasó a `border-box`, con el origen en
  `content-box` (la imagen sigue midiendo 52 × 24).
- El interruptor de «Reducir movimiento» es un `<button>` y el hover genérico de
  los botones del panel (atajo `background:`) le borraba la imagen y lo dejaba
  como un círculo vacío. Se excluyó `[role="switch"]` de esas reglas y el anillo
  de hover ahora lo dibuja un pseudo-elemento del tamaño de la pista, no del área
  táctil.

Caché: `reflow.css?v=151-switch-eva-hover` y `reflow-book.js?v=185-switch-eva`.

## Correcciones de los quiz (kicker y separación)

Tres ajustes pedidos sobre **todas** las páginas de actividad (8 secuencias, 24
preguntas):

- **Kicker**: «Comprensión lectora · Pregunta N de 3» → **«Pregunta N de 3»**. El
  prefijo estaba escrito en los 8 HTML (`quiz_final.html` y `qz007…qz025`); se quitó
  de los 24. El `aria-label` y el `h1` para lectores de pantalla no cambian.
- **Separación kicker → título**: medido, el hueco era **0 px** (los dos párrafos
  comparten caja, sin margen). Se agregó `margin-bottom: .5rem` al kicker → **8 px**.
- **Separación «Enviar» → devolución**: medido, el hueco era **6 px**. La devolución
  evaluada pasó de `margin-top: .35rem` a **.75rem** → **12 px**.

Para que la tarjeta no recorte con la devolución desplegada, en columnas de lectura
bajas (`@media (max-height: 780px)`) se compensa: relleno de la tarjeta `.55rem`,
separación de opciones `.4rem` y margen de acciones `.35rem`; además, el
`max-height` de la tarjeta pasa de `- 5rem` a `- 4.5rem`. Verificado:
`verify-quiz-feedback-fit.mjs` en verde en los 7 tamaños (antes fallaba 1–3 px a
947x700 con letra extra grande). Las otras suites de quiz (opciones, zoom,
contraste, reintento, «Siguiente pregunta») siguen en verde.

Caché: `reflow.css?v=148-quiz-espaciado`. El precargador offline se regeneró
(`node tools/sync_offline_preloader.js`, 225 entradas) para que el modo `file://`
sirva los HTML con el texto nuevo.

## Punto 18 · Estados de color de las opciones — MEDIDO (cierre)

El sondeo anterior no fallaba por la interfaz sino por la consulta: tomaba las
**cuatro primeras opciones de `#content`**, que pertenecen a **otra pregunta**
(el libro repite 8 secuencias × 3 paneles y el primer nodo del DOM cae fuera del
visor). La muestra ahora se acota al **panel de la pregunta** (`[data-quiz-id]`).

`tools/screen-test/verify-quiz-contrast.mjs` (nuevo) mide, en los 8 paneles, el
texto de la opción contra su fondo efectivo en **normal, elegida, correcta e
incorrecta**, más la devolución, el botón, la marca ✓/× y el borde. El parser lee
`oklch`/`oklab` convirtiéndolos a sRGB (no por su luminosidad), porque una
medición de contraste no puede conformarse con el primer número. Criterios: 4,5:1
para texto, 3:1 para gráficos.

| Elemento | Contraste | Mínimo | ¿Cumple? |
|---|---|---|---|
| Opciones · texto en los 4 estados (gris-900 sobre blanco) | **17,73:1** | 4,5 | ✓ |
| Devolución incorrecta (`#68160f` sobre `#fbefef`) | **10,93:1** | 4,5 | ✓ |
| Devolución correcta (`#275e2e` sobre `#edf8f1`) | **7,08:1** | 4,5 | ✓ |
| Marca ✓ (blanco sobre verde `#16803a`) | **5,02:1** | 3 | ✓ |
| Marca ✕ (blanco sobre rojo `#c42b24`) | **5,65:1** | 3 | ✓ |
| Botón «Enviar» inactivo (gris-700 sobre gris-200) | **6,08:1** | 4,5 | ✓ |
| Borde de la opción en reposo (gris-400 sobre blanco) | 2,20:1 | 3 | observación |

El texto de las opciones **no cambia de color** al elegir, corregir o fallar: la
señal de estado va en el borde (elegida `#008078` 4,82:1; correcta 5,02:1;
incorrecta 5,65:1), la marca y el relleno de la devolución. Todo pasa.

**Lo que queda**: el borde **en reposo** es 2,20:1. Es un gráfico decorativo —la
opción se identifica por su etiqueta—, pero WCAG 1.4.11 pide 3:1 para los límites
que identifican un componente. Es una decisión de diseño (oscurecer gris-400);
queda informada, no como falla. La regla previa de 4,72:1 para la devolución **no
se reproduce**; la medición actual da 10,93:1 y 7,08:1, con más margen.

## Punto 25 · La evitación en lectura real — FALLO ENCONTRADO Y CORREGIDO

El traspaso anotaba que la regla de no tapar la oración se había verificado
**simulando** bloques marcados. Medido en **lectura real**, el resaltado del
runtime es un rango de la **Custom Highlight API** (`adt-tts-active`) y el párrafo
**NO lleva `.tts-active-block`** ni `.bg-yellow-300`. La función buscaba esas
clases, así que **no encontraba la caja activa y nunca se disparaba**.
Reproducido arrancando la lectura y saltando a una oración baja: resaltado en
**754–779**, reproductor en **763–823**, `reflow-tts-player-top` ausente → la
oración quedaba tapada.

Segundo problema, de disparo: el resaltado por Custom Highlight **no muta el DOM**,
así que ningún observador despertaba a la evitación; el «ciclo cada 650 ms» que
decía el changelog no existía.

**Arreglo** (`reflow-book.js`):

- `ttsActiveBox()` toma la caja del **resaltado real** (unión de sus rangos) y, si
  no hay, cae a `.tts-active-block` / `.bg-yellow-300` y al elemento activo del
  motor (`state.ttsActiveElement`).
- `ttsPlayerRestingBox()` compara contra la **franja de reposo** del reproductor
  (abajo), no contra su posición actual: al correrse arriba dejaba de «cruzarse» y
  volvía abajo en el ciclo siguiente.
- La evitación se **engancha donde cambia la caja activa**: `paintTtsRange`,
  `paintTtsImageHighlight` y `clearTtsRangeHighlight`.

**Verificación**: `tools/screen-test/verify-tts-avoidance-real.mjs` (nuevo) enciende
la lectura, arranca la reproducción y comprueba que hay resaltado real
(`CSS.highlights`). Salta a una oración baja con `playAtIndex`: el reproductor pasa
a **8–68 px** y no la tapa. Salta a una oración alta: el reproductor **vuelve a
763–823** y no cubre el inicio. La prueba simulada (`verify-tts-avoidance.mjs`)
sigue en verde.

**Caché**: `reflow-book.js` sube a `?v=184-evitacion-lectura-real` en `index.html`.
El precargador offline **no embebe** `reflow-book.js` (sólo HTML y catálogos), así
que no hay que regenerarlo por esto.

## Bloqueante cerrado · «Siguiente pregunta» volvía a mostrar la misma pregunta

El botón se sentía roto y **el motor estaba bien**: lo que estaba mal era **lo que
la prueba medía**. Es el caso más útil para no repetir.

### La contradicción, resuelta midiendo

El traspaso dejaba abierta una duda que decidía el arreglo: ¿la pregunta siguiente
está en la misma página o en la de al lado? **Está en la de al lado.** Con la sonda
en el manejador del botón (`?quizdebug=1`), en un clic real:

```
MEDICION quiz-next {"scrollLeft":43712,"ancho":1366,"cajaLeft":1666,"actual":32,"objetivo":33}
```

`cajaLeft` = **1666**, o sea una página entera a la derecha del visor de 1366 px:
el panel de la pregunta siguiente vive en la **página 33** y el lector estaba en la
**32**. Las dos mediciones anteriores eran correctas cada una en su momento: las
opciones en x=1691 eran las de la pregunta 2 (en la página de al lado) y el «panel
siguiente en la misma página» se midió **después** de que el motor ya había
cambiado de página. `actual` 32 → `objetivo` 33 confirma que **el salto de página
es el arreglo correcto**, y el mensaje del traspaso («el manejador sale sin hacer
nada si la página calculada es la actual») describía un estado **previo** al clic,
no el clic.

Línea de tiempo del scroll tras el clic (una sola asignación, sin reversión):

```
[{"t":2707,"valor":43712},{"t":9656,"valor":45078}]
```

Y ningún clic al motor: el cambio de página lo hace el `goToPage` del propio motor
al recibir el clic, no el bucle de botones del manejador.

### La causa real: la prueba leía un kicker fuera de pantalla

`#content` contiene **24 kickers** (8 capítulos × 3 preguntas) con los mismos tres
textos repetidos. La prueba buscaba el **primero del DOM**, que es una copia de la
pregunta 1 **corrida fuera del visor**, y por eso seguía leyendo «Pregunta 1 de 3»
aunque el lector ya veía la 2:

| Momento | Candidato que leía la prueba | Lo que se veía en pantalla |
|---|---|---|
| antes de responder | n.º 0 · left=325 · **visible** | Pregunta 1 de 3 |
| después de enviar | n.º 0 · left=325 · **visible** | Pregunta 1 de 3 |
| después del botón | n.º 0 · left=**−1041** · **fuera** | **Pregunta 2 de 3** (left=325) |

Al avanzar, el panel visible pasa de la página 32 a la 33: el kicker n.º 0 se va a
−1041 y el n.º 1 entra a 325. La prueba fallaba por su propia consulta.

**Arreglo de la prueba**: el kicker se busca entre los `.quiz-kicker`, exigiendo
que el centro caiga dentro del viewport y que `elementFromPoint` lo confirme —la
misma definición de «visible» que usa el resto del arnés—. La traza del manejador
se conserva con `?quizdebug=1` para que la medición quede disponible.

### El otro pendiente: «Siguiente pregunta» a la izquierda

Tres intentos con `margin-left: auto`, `justify-self: end` y `float: right` no
tuvieron efecto, y **no era la hoja de estilos**: las tres reglas se aplicaban
(medido: `float` computado `right`) pero el contenedor `.quiz-feedback` es una
**grilla de dos columnas** —el icono ✓/✕ y el texto—, y en una grilla el ítem ocupa
su área por defecto, así que ni el `float` ni el margen automático mueven nada:
el botón se estiraba al ancho de la grilla (716 px) con su contenido pegado al
borde izquierdo (x=333,8). En una grilla, `float` se **ignora**.

**Arreglo**: decirle al botón en qué columna vive y que se pegue a su borde
derecho (`grid-column: 2; justify-self: end`), y borrar las tres reglas anteriores
que se contradecían entre sí. Medido:

| | antes | después |
|---|---|---|
| borde izquierdo del botón | 333,8 px | **840,2 px** |
| borde derecho del botón | 525,8 px | **1032,2 px** (contenedor: 1041) |

### Verificación

- `tools/screen-test/verify-quiz-next-question.mjs` — **en verde**: «antes de
  responder: Pregunta 1 de 3 · después del botón: Pregunta 2 de 3».
- `tools/screen-test/verify-quiz-zoom.mjs` (nuevo) — **en verde** en 9
  combinaciones (1366, 947 y 800/640 px CSS; letra normal, grande y extra grande;
  zoom 1, 1,25 y 1,5): ninguna fila de opción desborda su tarjeta ni el viewport, y
  el botón queda **a 8,8 px del borde derecho de la devolución en las 9** (columna
  de grilla 2). Esto cierra el pendiente del traspaso («comprobar que la fila de
  opción no desborde con el zoom del navegador»).

  Dos trampas de medición que costaron tiempo y quedan anotadas en la propia
  prueba: (a) el motor repagina en ciclos, así que hay que insistir hasta que la
  devolución esté montada y las filas dentro de la página —si no, se mide una
  página vacía y el «ok» no significa nada—; (b) la página de la sección **no** se
  calcula sumando su `getBoundingClientRect().left`, que es relativo al viewport:
  a 631 px eso daba **una página de más** y el botón quedaba en x=−232. Se usa el
  borde izquierdo del visor (`content.getBoundingClientRect().left`) como origen.
- `tools/screen-test/_diag-nav.mjs` — sin regresión en la navegación.

## El recorte del cuestionario: «Siguiente pregunta» quedaba cortado

La captura de la revisión en uso mostró que, con la devolución desplegada, la
tarjeta del cuestionario **recortaba la devolución y el botón**. Eran **dos**
causas apiladas, las dos medidas.

### 1. El desplazamiento del motor empujaba el contenido fuera de la tarjeta

`reflow-book.js` compensa el reacomodo que hace el runtime al reemplazar «Enviar»
por la devolución: mide dónde estaba el enunciado antes de enviar y luego lo
mantiene ahí con una **transformación** (`--reflow-quiz-content-shift`). Como es
una transformación, **no cambia el layout**: lo que empuja fuera de la caja de la
tarjeta lo recorta su `overflow: hidden`.

Muestreo cuadro por cuadro (952x645, respuesta incorrecta):

| Momento | desplazamiento | devolución respecto de la tarjeta | botón |
|---|---|---|---|
| justo después del clic | — | −11 px (adentro) | −19 px |
| **cuadro 1 en adelante** | **32,06 px** | **+21 px** (afuera) | **+13 px** |

El desplazamiento se aplicaba **después** de que la devolución crecía, y pedía más
lugar del que había. Medido el hueco real disponible en cinco tamaños: **−33 px a
952x645, −32 px a 800x600, −19 px a 947x700, −1 px a 1024 y a 1366**. O sea: el
desplazamiento **nunca** cabía, y en los dos tamaños chicos el botón terminaba
recortado (41 px a 800x600).

**Arreglo** (`reflow-book.js`): el desplazamiento ahora se **acota al hueco que
queda dentro de la tarjeta** y se descarta cuando no hay ninguno (que es el caso
medido en todos los tamaños). Se mide con la transformación quitada, en lugar de
restarle el desplazamiento anterior a la posición ya transformada.

### 2. Aun sin desplazamiento, el contenido no entraba

Con el desplazamiento en cero la devolución ya no se salía, pero el botón seguía
pasándose: el contenido pedía **565 px en una caja de 558** (1280x720) y **452 en
438** (800x600). Probadas en vivo las salidas posibles:

| Salida | Resultado medido |
|---|---|
| `max-height: none` en la tarjeta | la tarjeta no crece: la limita la fila del paginado |
| `overflow-y: auto` (lo que ya hacía la regla de teléfonos) | el contenido se puede desplazar, pero el botón sigue naciendo cortado |
| apretar el ritmo vertical | **el botón entra 19 px adentro a 800x600 y 8 px a 1280x720** |

**Arreglo** (`reflow.css`, `@media (max-height: 780px)`): en columnas de lectura
bajas se acota la separación de las opciones (`.5rem`), el margen de las opciones y
de las acciones, y el relleno de la tarjeta. Sólo clases del cuestionario y sólo en
esa condición; ninguna fila de opción baja del mínimo táctil de 44 px.

**Trampa de especificidad (costó dos intentos)**: el acotado no surtía efecto
porque dos reglas existentes son **más específicas** y también usan `!important`:
`body.reflow-book[data-reflow-font-size="xlarge"] … .quiz-options` y
`body.reflow-book … .quiz-card:has(.quiz-feedback:not(:empty)) .quiz-options`. Se
midió el `gap` calculado: seguía en **28 px**. La regla nueva replica esas dos
formas de selector.

**Verificación**: `tools/screen-test/verify-quiz-feedback-fit.mjs` (nuevo) responde
mal en **las 8 secuencias** y exige, en 7 combinaciones de tamaño y letra (56
casos), que la devolución y «Siguiente pregunta» entren completos en la tarjeta y
que el botón sea lo que se pinta en su centro. **En verde**, y era **rojo** antes
del arreglo (16 fallas, con el botón hasta 41 px afuera).

**Regresión**: las 16 suites del arnés en verde, salvo
`verify-glossary-highlight.mjs`, que falla **de forma intermitente** (1 de 3
corridas: «con el valor viejo en "false" el globo no abrió»). **No es de este
cambio**: se reprodujo igual contra HEAD. Queda anotado como intermitencia previa
del globo del glosario.

### 3. La fila de la opción cortaba su propio texto

La captura de la segunda vuelta mostró otra cosa: en la opción marcada, el texto
pasaba a dos líneas y **la segunda se salía del recuadro** («europeas.» cortado
abajo). Es un tercer recorte, independiente de los dos anteriores.

La causa es la misma familia de problema, pero al revés: el motor fija la altura de
cada fila de opción con la que midió **antes de enviar**
(`--reflow-quiz-option-interaction-height`), y esa altura queda **corta** cuando el
texto envuelve después. La regla del motor es

```css
body.reflow-book #content .quiz-card:has(.quiz-feedback:not(:empty)) .quiz-option {
  height: var(--reflow-quiz-option-interaction-height, auto) !important;
}
```

y **es una cuarta regla con `!important` que ya existía** en `reflow.css`
(`… .quiz-option { height: auto !important }`, al final del archivo) **con la
intención de arreglar exactamente esto**. No lo lograba: cuando dos declaraciones
tienen `!important`, decide la **especificidad**, no el orden, y el selector con
`:has()` encadenado a `body.reflow-book #content` tiene más.

Listado de las reglas que declaran `height` sobre la fila, sacado del CSSOM (el
orden es la posición en la hoja):

| Orden | Selector | `height` |
|---|---|---|
| 534 | `… .quiz-card:has(.quiz-feedback:not(:empty)) .quiz-option` | `var(--…interaction-height, auto) !important` |
| 809 | `… .quiz-option` | `auto !important` |

Medido con el texto envolviendo después de enviar (892x681): la fila quedaba en
**43,03 px** con el texto en 3 líneas y la última **37,42 px por debajo del borde**.

**Arreglo**: la regla del final ahora **replica el selector del motor** para ganar
la comparación. Medido después: la fila crece a **90,34 px** y la última línea queda
**10,16 px adentro**.

**Verificación**: `tools/screen-test/verify-quiz-option-fit.mjs` (nuevo) mide, en 7
combinaciones de tamaño y letra y en las 8 secuencias, que cada línea del texto de
cada opción entre en la caja de su fila — en las dos formas del problema: la opción
marcada más larga y el texto que se alarga **después** de enviar (112 comprobaciones).

**Lección para este archivo**: cuando un ajuste «no hace nada», hay que listar las
reglas que declaran esa propiedad y su orden, no revisar el CSS a ojo: acá había una
regla con la intención correcta que perdía por especificidad.

## Regresión y reversión: el recorte del visor rompió la navegación

Se aplicó `body.reflow-book #content { overflow-x: clip; overflow-y: visible }` para
que el contenido de la página vecina no sangrara sobre la tarjeta del cuestionario.
**Rompió la navegación**: no se podía avanzar ni con las flechas de la barra ni
saltando desde el índice.

La causa: `overflow-x: clip` **no crea** un contenedor de scroll, pero **deshabilita
el que ya existía** en ese elemento, y el motor navega **haciendo scroll sobre
`#content`**. Mi razonamiento cubrió la mitad del problema (que `clip` no obliga al
otro eje a comportarse como `auto`, a diferencia de `hidden`) y se me escapó la otra:
que `clip` quita la capacidad de desplazarse.

**Revertido y verificado**: flechas 1→2→3→4, «Anterior» vuelve a 3, salto por el
índice a «Sinopsis» (pág. 9 de 10), consola sin errores
(`tools/screen-test/_diag-nav.mjs`).

**Enfoque correcto para el sangrado**: recortar sin tocar el desplazamiento, con
`clip-path: inset(0)`, que es puramente visual. Antes de aplicarlo hay que verificar
**las dos cosas juntas**: que el sangrado se detenga **y** que la navegación siga
funcionando.

## Punto 18 · Contraste de los cuestionarios (hallazgo suelto) — CORREGIDO

El documento **no** pide cambiar el fondo de los cuestionarios: el turquesa es
identidad de Ceibal y tiene su token (`--ceibal-quiz-page` =
`var(--ceibal-institutional-400)` = `rgb(0, 160, 150)`). Pero la fila de pruebas del
punto 18 pide «medir contraste en **cada estado**», cuestionarios incluidos, y al
medirlo apareció un fallo real:

| Combinación | Contraste | AA |
|---|---|---|
| **Blanco sobre el turquesa del cuestionario** | **3,25:1** | ✗ (pide 4,5:1) |
| Gris oscuro sobre ese turquesa | 5,53:1 | ✓ |
| Blanco sobre institucional-600 | **7,14:1** | ✓ |
| Kicker y enunciado del cuestionario sobre blanco | 7,52:1 | ✓ |

El fallo estaba en **cuatro reglas propias** con `color: #fff` sobre
`--ceibal-quiz-page` (pestaña activa del panel de navegación, un control del panel de
accesibilidad, pestaña activa del glosario y una etiqueta del dock). Es la misma
combinación que usa el runtime en sus pestañas activas, replicada por este CSS.

**Corrección aplicada**: los cuatro rellenos pasan a **institucional-600**, que es lo
que manda la tabla de EVA para el estado seleccionado, y da **7,14:1**. El turquesa
sobrevive sólo como fondo de la página del cuestionario (sin texto blanco encima).
Verificado: no queda ninguna regla con texto blanco sobre el turquesa.

**Pendiente**: medir los estados de las **opciones** (normal, elegida, correcta,
incorrecta) y la devolución. El diagnóstico quedó a medio hacer porque usa template
literals anidados (`${}` dentro de una plantilla que se inyecta en la página) y hay
que reescribirlo con concatenación. Es lo único del punto 18 que falta medir.

### Medición de los estados del cuestionario (parcial)

Con `tools/screen-test/_mide-quiz-estados.mjs` (reescrito sin plantillas de cadena,
con la lógica dentro de `page.evaluate`) se midió, sobre una actividad real:

| Elemento | Contraste | AA |
|---|---|---|
| Opciones (texto gris-900 sobre blanco) | **17,73:1** | ✓ |
| Devolución | **4,72:1** | ✓ (justo) |
| Botón «Enviar» en su estado inactivo | **6,08:1** | ✓ |
| Kicker y enunciado | 7,52:1 | ✓ |

**Lo que no se pudo confirmar**: los colores de los estados **elegida, correcta e
incorrecta**. Las mediciones salen idénticas antes y después de enviar, así que el
clic y la corrección no llegaron a registrarse en el sondeo (o la actividad ya venía
con la devolución mostrada). Falta ajustar la interacción —marcar la opción y
enviar— para ver esos estados. Los textos base y la devolución sí quedaron medidos y
cumplen.

**Segundo intento**: se ajustó la interacción y ahora **sí funciona** —el sondeo
detecta 72 controles, marca la opción y el botón «Enviar» deja de estar inactivo—,
pero los colores siguen saliendo iguales. La causa es de la **medición**, no de la
interfaz: la página tiene **varias preguntas** y el sondeo toma las **cuatro primeras
opciones de la página**, que pertenecen a otra pregunta. Para ver los estados hay que
acotar la muestra al contenedor de la pregunta respondida (el que tiene el control
marcado).

Lo que queda firme de la medición: opciones **17,73:1**, devolución **4,72:1**,
botón inactivo **6,08:1** y kicker **7,52:1**, todo sobre blanco y por encima de
4,5:1, con la salvedad de que la devolución tiene poco margen.

## Punto 18 · Tema claro — CIERRE: pop-ups del runtime

El punto pedía «barra, paneles y **pop-up** claros con los tokens de EVA». Cuando se
cerraron las etapas 1 y 2 quedaron afuera los **pop-ups**: el globo de definición
del glosario y los diálogos en capa, que el runtime crea con las clases del tema
oscuro (`oklch(0.269 0 0)` de fondo, texto casi blanco, borde blanco al 10 %).

- El pase inline del motor se extendió a los **contenedores flotantes**
  (`[data-radix-popper-content-wrapper]`, `[role="dialog"]`, `[role="tooltip"]`,
  `[role="menu"]`, `[data-state="open"]`): pinta el elemento que tiene fondo propio
  —sólo si está oscuro— con los tokens y le repara el contraste de los textos.
  Se llama en el mismo ciclo que el pase de los paneles.
- El medidor de contraste ahora también lee **`oklab`** (la definición del glosario
  viene en `oklab(0.985 0 0 / 0.8)`), leyendo su **luminosidad perceptual** igual
  que oklch: es el primer número y alcanza para saber si el texto se lee.
- Reglas CSS declarativas para adelantar el color, con el pase inline como garantía.

**Verificación**: `tools/screen-test/verify-popup-theme.mjs` (nuevo) abre el globo
desde una palabra del glosario y mide, con lectura de oklch/oklab: fondo **blanco**
(luminancia 1), texto del globo **17,73:1** y la definición **4,83:1**. En verde.

Con esto el punto 18 queda completo: barra, reproductor de voz, paneles y pop-ups.

## Punto 25 · Reproductor de voz flotante — PARTE 1

El reproductor reservaba un **carril fijo**: `syncToolbarReserve` sumaba la altura
de la barra **más** 4 rem (`--reflow-tts-player-lane`), y el texto se encogía para
dejarle lugar. El documento pide un pop-up que flote.

- **Sin carril**: la reserva es sólo la altura de la barra. Medido: pasa de
  **141 px a 69 px**, o sea que el contenido recupera 4 rem de alto.
- **Flotante**: se apoya 8 px sobre la barra, sin superponerse ni dejar hueco.
- **Forma según el ancho**: en pantallas anchas se ancla a la **derecha con 16 px
  de margen**; en angostas es una **pastilla compacta** de sólo íconos, centrada
  (las etiquetas quedan para lectores de pantalla).
- La variable `--reflow-tts-player-lane` desapareció: ya no se usa en CSS ni en JS.

**Verificación**: `tools/screen-test/verify-floating-player.mjs` (nuevo) mide en
tres anchos (1366, 1024 y 420 px): que la reserva no supere la barra, que el
reproductor se apoye en ella, que en ancha el margen derecho sea 16 px con
etiquetas visibles, y que en angosta esté centrado, más angosto que el viewport y
con las etiquetas ocultas. Los tres anchos en verde.

Nota sobre las capturas de esta prueba: el motor vuelve a ocultar el reproductor en
su ciclo de sincronización (650 ms), así que la foto no siempre lo muestra; las
**mediciones** se toman en la misma evaluación en que se lo muestra, y por eso son
válidas.

**Falta la parte 2**: la regla de **no tapar la oración resaltada**. Como el
reproductor flota sobre el contenido, cuando el resaltado de la lectura en voz alta
cae detrás de él hay que desplazar el libro lo justo para que la oración quede a la
vista (observando el elemento resaltado del runtime y corrigiendo el desplazamiento
sin animación, para no pelear con `prefers-reduced-motion`).

### Parte 2 · La oración en lectura no queda tapada — RESUELTO

El resaltado del runtime usa la **Custom Highlight API** (`::highlight(adt-tts-active)`),
así que no es un elemento y no tiene caja. El **bloque** en lectura sí la tiene:
lleva la clase `.tts-active-block`. Y como el libro es **paginado en columnas**, la
oración no se puede desplazar: lo que se mueve es el reproductor.

- `syncTtsPlayerAvoidance()` mide la caja del bloque activo contra la del
  reproductor y, si se cruzan, le pone la clase `reflow-tts-player-top`, que lo
  corre **arriba de la pantalla** mientras dure la situación; cuando el bloque sale
  de esa franja, vuelve abajo.
- Sin transición: el ciclo de lectura es rápido y una animación pelearía con
  `prefers-reduced-motion`.
- Se engancha en el ciclo de sincronización que ya corre cada 650 ms y se expone
  `window.__adtReflowSyncTtsAvoidance` para la verificación.

**Verificación**: `tools/screen-test/verify-tts-avoidance.mjs` (nuevo) marca un
bloque real de contenido como «en lectura», en la banda de abajo y arriba, y
comprueba que no se superponga con el reproductor. Medido: con el bloque abajo
(737–793) el reproductor pasa a 8–68 px; con el bloque arriba (36–129) el
reproductor queda en 763–823 px. **Sin superposición en los dos casos.**

**Aclaración sobre la fila del índice**: la suite `verify-light-theme.mjs` había
quedado en rojo en un punto, la fila de capítulo del índice, que medía 1:1. **No era
un problema del producto sino de la prueba**: la primera fila del índice es el
**capítulo actual**, que el runtime pinta con fondo institucional-500
(`rgb(0, 128, 120)`) y texto blanco, y la prueba calculaba el contraste contra el
**blanco del panel** en vez de contra el fondo de la fila. Medida bien: **4,82:1**,
por encima del 4,5:1 exigido.

Dos cosas quedaron de esto:

- La prueba ahora mide la fila contra su **fondo efectivo** (subiendo por sus
  ancestros), que es lo correcto para cualquier elemento con fondo propio.
- Se endureció igual el pase inline (el observador ahora también mira `class`, y hay
  un repaso por intervalo mientras hay un panel abierto), porque el runtime
  re-renderiza los paneles cuando quiere.

**Observación para el diseño**: el capítulo actual queda en institucional-500
(4,82:1) cuando la tabla de EVA pide institucional-600 para lo accionable (7,1:1).
Es legible y cumple AA; cambiarlo a 600 es un ajuste de una línea, pendiente de
confirmar con el equipo.

## Punto 23 · Detalles tipográficos del contenido — RESUELTO

Se agregaron dos herramientas y se aplicaron tres arreglos.

**Herramientas nuevas**

- `tools/audit_typo.py` — informa comillas que no son las del libro, `--` en lugar
  de raya, `...` en lugar de `…`, espacios dobles, espacios antes de puntuación,
  `<br>` dentro de párrafos y espacios duros. Analiza **sólo el texto visible**: el
  primer relevo daba 41 033 coincidencias porque contaba las comillas de los
  atributos HTML, y 1 840 después porque reemplazaba las etiquetas por espacios
  (`</p><p>` parecía un espacio doble). Se descartan `head`, `script` y `style`, y
  cada etiqueta corta el texto en vez de separarlo con un espacio.
- `tools/fix_typo_content.py` — aplica los arreglos.

**Arreglos aplicados**

| Qué | Cuántos | Resultado |
|---|---|---|
| Puntos suspensivos `...` → `…` | 3 | «En cuanto pueda…», «Ni que el bisabuelo fuera…», «…aprieta las herramientas…» |
| Rangos de fecha con guion sin espacios | 3 | `(1877 - 1929)` y `(1916 - ?)` → convención en español |
| Encabezado de página para lectores de pantalla | **20** | anunciaban el nombre del archivo PDF (`1930-el-viaje---PDF--1--21`) |
| `<title>` del documento | 21 | el nombre del archivo en la pestaña del navegador |

El encabezado es el hallazgo importante: en 20 páginas (pg036 a pg057) el `h1`
oculto que leen los lectores de pantalla decía `1930-el-viaje---PDF--1--21`. Ahora
dice el tipo de página («Separador de capítulo», «Página ilustrada», «Página del
libro»); cuando el título del capítulo está en el índice, se usa ese.

**Verificación**: `audit_typo.py` pasa de **45 coincidencias a 1**. La que queda no
es un error de forma sino de **contenido** y necesita decisión editorial:
`pg176177_n0009` dice «Instituto para el futuro ???». El control de charset no sumó
avisos: los 30 hallazgos son de dos archivos con citas en otros idiomas y ya estaban.

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

## Punto 7 · Voseo en la interfaz — RESUELTO

**Inventario**: `tools/inventory_interface_texts.py` (nuevo) junta las **144
claves** de `assets/interface_translations/es-UY/interface_translations.json` —el
catálogo que resuelve el runtime, no sólo nuestros textos— y los literales del
motor, y clasifica cada uno como voseo, tuteo o usted con listas explícitas de
verbos (para no marcar palabras del relato por parecido).

**Resultado**: 2 textos en usted (los dos del motor) y 9 en tuteo (del catálogo).
Se corrigieron 7:

| Dónde | Antes | Ahora |
|---|---|---|
| `reflow-book.js` | «Active Lectura en voz alta para utilizar el resaltado.» | «**Activá** Lectura en voz alta para utilizar el resaltado.» |
| `reflow-book.js` | «Habilita el modo. **Use** Reproducir para comenzar.» | «**Habilitá** el modo. **Usá** Reproducir para comenzar.» |
| `eli5-content-lang` | «Toca cualquier cosa para que me la explique.» | «**Tocá**…» |
| `notepad-placeholder` | «Escribe tus notas aquí...» | «**Escribí** tus notas aquí...» |
| `success-try-next-activity` | «¡Buen trabajo! ¡Intenta la siguiente actividad!» | «¡**Intentá** la siguiente actividad!» |
| `validation-check-spelling` | «Verifica tu ortografía» | «**Verificá** tu ortografía» |
| `reduce-motion-description` | «Desactiva las animaciones y transiciones del lector.» | «**Desactivá** las animaciones…» |

Los **4 del tutorial** quedan como están, por la decisión editorial de no tocar
esa parte; el verificador los informa aparte para que no se pierdan de vista.

`--check` falla si vuelve a aparecer un texto sin voseo (excluido el tutorial):
hoy informa «0 en usted · 4 en tuteo (tutorial) · 140 neutros».

**Nota de caché**: el runtime pide el catálogo con una URL que puede quedar en
caché del navegador. El texto nuevo se ve tras recargar; si no, conviene forzar
la recarga. El precargador offline se regeneró con el catálogo nuevo.

**Piezas propias del panel de configuración**: el selector de tamaño de letra, la
tarjeta de preferencias y las descripciones son marcado de este repositorio (no del
runtime) y conservaban los colores del tema oscuro. Se pasaron a los tokens
(`.reflow-font-settings-card`, `.reflow-font-settings-options`,
`.reflow-setting-description` → N4) y se sumó al pase inline el estado del selector
de tamaño (`[data-reflow-font-size]`: elegido en institucional con texto blanco).
Medido en el panel de Herramientas: de 4 elementos ilegibles a 1.

**Interruptores (resuelto)**: la pista y la perilla se pintaban con los valores del
tema oscuro y sobre blanco desaparecían, y las filas deshabilitadas se lavaban por
la **opacidad** que aplica el runtime (el tema pide color, no transparencia). El
pase inline ahora fija: pista encendida en institucional-600, apagada en
`--ui-text-muted` (grey-600, 5,5:1), perilla blanca con sombra, y `opacity: 1` en
las filas deshabilitadas.

Se midió sobre los **píxeles renderizados** (no sobre el color calculado, que
ignora la opacidad y los pseudo-elementos): `tmp/mide_interruptores.py` recorta la
caja de cada interruptor de la captura y comprueba que la pista se distinga del
fondo. Resultado: **5 de 5 en OK** (antes, 5 de 5 apenas visibles).

Dos cosas que salieron de esta medición y conviene recordar:

- La primera métrica era mala: medía la proporción de píxeles con color sobre toda
  la **caja de toque** (48 × 48, que incluye relleno), por lo que una pista
  correcta y chica daba «apenas visible». Ahora se exige que la pista exista y que
  no sea un píxel suelto.
- `--ceibal-gray-500` **no existe** en la paleta del proyecto: usarlo dejaba el
  `var()` inválido y el fondo terminaba **transparente** (peor que antes). Se usa
  `--ui-text-muted`, que sí existe. Vale para cualquier valor nuevo: verificar el
  token antes de usarlo.

**Etiquetas lavadas (resuelto, con causa raíz)**: las etiquetas de esas filas
—«Lectura fácil», «Descripción de imágenes», «Activar lectura en voz alta»— se veían
casi blancas. El color calculado era `oklch(0.985 0 0)`: **Tailwind v4 escribe los
colores en oklch**, y el medidor de contraste del pase inline extraía los números del
texto y los interpretaba como r/g/b, así que un casi blanco se leía como un rojo
oscuro (contraste 21:1) y la reparación no corregía nada. Ahora `panelRgb` lee
`oklch(L C H)` por su **luminosidad perceptual** (el primer número, que alcanza para
decidir si el texto se lee sobre el fondo).

Medido sobre los píxeles de la etiqueta: **`(18, 24, 38)` con 17,73:1** (antes, casi
blanco). La lección sirve para todo el tema: **cualquier medición de color sobre este
runtime tiene que contemplar oklch**; el truco de normalizar con el canvas **no**
funciona acá (devolvía el valor previo y el color quedaba como negro, que es peor).

## Punto 18 · Tema claro — ETAPA 2: paneles

- Los tres paneles (**Herramientas**, **Índice** y **Glosario**) pasaron a
  **superficie blanca** con texto grey-900. El relevo previo mostró que el color
  oscuro no venía de este repositorio sino de utilidades de Tailwind del runtime
  (`oklch(0.269 0 0)` de fondo y `oklch(0.985 0 0)` de texto), inyectadas
  **después** de `reflow.css`: por eso el bloque nuevo usa `!important`.
- Se aplicaron los **colores por nivel** de la tabla: N1 grey-900 en los títulos
  (medidos en 20 px / 700 ✓), N3 grey-900 en filas y etiquetas, N4 grey-600 en
  descripciones y ayudas, N2 institucional-600 en los títulos de bloque.
- Estados: hover grey-100, seleccionado o pestaña activa institutional-100 con
  texto institutional-700, deshabilitado grey-100 con grey-600, foco
  institutional-600, y `accent-color` institucional en los controles de
  formulario del runtime (interruptores, casillas, selects).
- Se corrigieron dos piezas que quedaban **invisibles** sobre blanco: las
  **pestañas** de los paneles (la activa era blanca y la inactiva grey-400 →
  ahora 9,34:1) y las **filas de capítulo**, que siguen pendientes (ver abajo).

**Verificación** (ampliada en `verify-light-theme.mjs`): para cada panel se abre,
se mide su superficie, el contraste del texto (17,73:1 en los tres), el título
(20 px / 700, N1) y la fila.

**El pase inline (resuelto)**: las **filas de capítulo** del índice quedaban con
texto blanco sobre blanco, y el **buscador** del panel, oscuro. La causa estaba
identificada: el runtime los pinta desde una **capa de Tailwind**, y una
declaración `!important` dentro de una capa gana sobre otra sin capa, así que el
`!important` de `reflow.css` no alcanzaba. Se agregó al motor un **pase inline**
(`applyPanelInlineTheme` + `watchPanelInlineTheme` en `reflow-book.js`) que fija el
color con `style.setProperty(..., "important")` —lo único que gana— sobre las
filas, las pestañas y los controles de formulario de cada panel, con un
`MutationObserver` que lo repite cuando el runtime vuelve a renderizar. El
observador **no** observa `style` para no reaccionar a lo que escribe él mismo.
Medido: la fila del índice pasó de **1:1 a 17,73:1**.

## Punto 18 · Tema claro — ETAPA 1: barra y reproductor de voz

El punto se hace por etapas (barra → reproductor → paneles), porque la mayor
parte del color de los paneles viene de clases de Tailwind del runtime.

- Se definieron los **colores semánticos** de la interfaz en variables
  (`--ui-surface`, `--ui-surface-hover`, `--ui-surface-selected`, `--ui-border`,
  `--ui-text`, `--ui-text-muted`, `--ui-accent`, `--ui-on-accent`,
  `--ui-disabled-surface`, `--ui-disabled-text`, `--ui-focus`, sombras) sobre los
  tokens de EVA, y se aplicaron a **la barra** y al **reproductor de voz**.
- La barra pasó de la superficie oscura (`rgb(24 24 24 / 96%)`) a **blanca** con
  texto grey-900. Los botones secundarios van sin relleno, con hover grey-100;
  el estado abierto o encendido usa institutional-100 con texto
  institutional-700, y el pulsado se rellena de institucional.
- El estado deshabilitado de los secundarios pasó a grey-100 con texto grey-600 y
  **sin borde**. Las flechas conservan el 40 % de opacidad que pide el punto 3.
- El **anillo de foco** sobre superficie clara usa institutional-600 (antes
  institutional-400, pensado para fondo oscuro).
- El reproductor de voz quedó con superficie blanca, borde grey-200 y texto
  grey-900. Su estado deshabilitado lo pintaba una regla del runtime con grey-500,
  que sobre claro daba 4,32:1; ahora usa los tokens del tema.

**Verificación**: `tools/screen-test/verify-light-theme.mjs` (nuevo) mide el color
real de cada superficie y **calcula el contraste con la fórmula de WCAG**:

| Elemento | Fondo | Texto | Contraste |
|---|---|---|---|
| barra | `#FFFFFF` | grey-900 | **17,73:1** |
| contador | barra | grey-600 | **4,83:1** |
| Siguiente | institutional-600 | blanco | **7,14:1** |
| reproductor de voz | `#FFFFFF` | grey-900 | **17,73:1** |

Exige luminancia ≥ 0,5 en las superficies, contraste ≥ 4,5:1 en todo lo que se
lee y que el foco sea institutional-600. Los **controles inactivos** se miden y se
informan, pero se eximen del mínimo: WCAG 1.4.3 los exceptúa.

**Falta la etapa 2**: los paneles del runtime (Herramientas, Índice, Glosario) y
los pop-ups, donde se aplican además los colores por nivel (N1 grey-900, N2
institutional-600, N3 grey-900, N4 grey-600) que ya están en variables.

## Punto 19 · Íconos SVG de EVA en la interfaz — RESUELTO

- **Los cinco que llegaron como PNG** (menú, engranaje, cerrar, reproducir y
  pausa) se convirtieron a SVG trazando su geometría con
  `tools/trace_eva_icons.py`: potracer sobre el export de 100 px, normalizado al
  `viewBox` de 24 que usa la interfaz. Medido contra su PNG de origen, la
  coincidencia va del **97,5 % al 98,8 %**.
  - Dato del trazador: potracer toma como figura los valores **bajos** de la
    máscara, así que el alfa va invertido. Con la máscara directa la coincidencia
    era del 0,4 %.
- **Los tres que faltaban** (detener, audio anterior y siguiente) ya se habían
  generado a partir de pausa y reproducir, y están verificados aparte.
- El motor **embebe los ocho trazados** en un bloque delimitado por marcadores
  (`/* eva-icons:start … end */`) que reescribe
  `tools/trace_eva_icons.py --inyectar`: regenerar un ícono no exige editar
  código a mano.
- Se reemplazaron **todos los caracteres** de ícono: barra (`☰`, `⚙`),
  reproductor de voz (`⏮`, `▶`, `⏭`, `⚙`, `■` y el `❚❚` de pausa) y encabezados
  de panel (`←`, `×`). No queda ninguno en el marcado.
- El botón de reproducir **cambia al ícono de pausa** al encender la lectura
  (antes cambiaba a un `❚❚` de texto).
- Los SVG miden **24 px** en todos los contextos (`--ui-icon-size`, punto 24) y
  heredan `currentColor`, que es lo que va a permitir el tema claro del punto 18.

**Verificación**: `tools/screen-test/verify-ui-icons.mjs` (nuevo) comprueba que
los nueve controles de barra y reproductor usen SVG de 24 × 24 —el reproductor
vive oculto hasta que hay sesión, así que ahí vale el tamaño calculado— y que no
queden caracteres; además exige que el trazado de pausa sea distinto del de
reproducir y que el botón arranque con el de reproducir.
`tools/screen-test/verify-eva-icons.mjs` cubre los ocho contra el set de EVA.

## Puntos 21 y 22 · Apertura — RESUELTOS

**Punto 21 · Texto de carga**

- «Preparando el libro reflowable…» → «**Abriendo 1930: El viaje…**», con
  `role="status"`, en institucional-600 y con N2 (17 px / 700) de la escala del
  punto 24.
- El cargador tiene el **logo de Ceibal**: `assets/icons/ceibal-logo.svg` (el SVG
  oficial, `viewBox="0 0 190 64"`, símbolo en `#00A096`), aplicado como
  `background-image` en `#reflow-loading .reflow-loading-logo` a 12 × 4 rem, con el
  texto debajo, sin tocar JavaScript. Está declarado en `imsmanifest.xml` porque el
  CSS lo referencia.
  > Nota: una versión anterior de este changelog decía que el SVG seguía faltando.
  > Era incorrecto: el archivo está en el repositorio y la regla lo aplica desde el
  > commit del logo. Verificado sobre el repositorio, no sobre la nota.
- El mensaje de error del cargador («No fue posible preparar el libro
  reflowable.») sigue con `role="alert"`.

**Punto 22 · Nada debe asomar en la apertura**

- El enlace «Saltar al contenido principal» dejaba ver un **filo oscuro** en el
  borde superior: su `box-shadow` y su `margin: .5rem` asomaban aunque estuviera
  desplazado hacia arriba. Ahora en reposo va sin margen, sin sombra y con
  opacidad 0 —sigue siendo enfocable, no se usa `visibility: hidden`— y al
  enfocarlo aparece completo con su contorno.
- **Sin transición a propósito**: el motor consume cuadros mientras pagina y la
  animación dejaba el enlace a mitad de camino justo al enfocarlo. Ahora aparece
  de golpe, que es lo que el lector espera al tabular.

**Verificación**: `tools/screen-test/verify-opening.mjs` (nuevo) mira el cargador
apenas arranca la navegación (texto exacto y `role`) y comprueba que el enlace no
se vea en reposo —opacidad 0, sin sombra, fuera de pantalla— y que sí se vea, con
contorno, al enfocarlo con el teclado.

## Punto 24 · Jerarquía tipográfica de la interfaz — RESUELTO

Cuatro niveles, con los nombres del sistema de EVA y los valores de la tabla del
documento, centralizados en variables de `content/reflow.css`:

| Nivel | Dónde se usa | Estilo EVA | Tamaño / peso | Color (llega con el punto 18) |
|---|---|---|---|---|
| N1 · Título de panel | «Índice», «Herramientas», «Glosario» | `eva-text-body-bold-lg` | 20 px / 700 | grey-900 `#15171A` |
| N2 · Título de grupo | «Leer», «Escuchar», «Pantalla»; capítulos del índice | `eva-text-body-bold-md` | 17 px / 700 | institucional-600 `#00635D` |
| N3 · Etiqueta de control | «Lectura fácil», «Voz del narrador», secciones del índice, barra | `eva-text-body-regular-md` | 17 px / 400 | grey-900 `#15171A` |
| N4 · Ayuda o descripción | «Usá Reproducir para comenzar», estados, contador | `eva-text-body-regular-sm` | 15 px / 400 | grey-600 `#565B66` |

- **La negrita quedó en tres lugares**: N1, N2 y la acción principal de la barra.
  Antes también iban en negrita las etiquetas de fila, las opciones del tamaño de
  letra y el contador. Los chips de tecla («Alt+A») la conservan porque es parte
  del símbolo.
- **Íconos de interfaz a 24 px** en la barra y en las filas del índice y del
  glosario. El panel de Herramientas no tiene íconos: sus controles son texto.
- Los **colores** de cada nivel quedan declarados en las variables
  (`--ui-n1-color` … `--ui-n4-color`) pero se aplican con el tema claro
  (punto 18): sobre la barra oscura actual el grey-900 no se leería.
- Al pasar N3 de 16 a 17 px, la barra volvió a recortar «Herramientas» a 1024 px;
  se amplió la columna correspondiente (9 → 9,75 rem) y el barrido de ocho anchos
  vuelve a pasar sin recortes ni desborde.

**Verificación**: `tools/screen-test/verify-ui-typography.mjs` (nuevo) mide los
tamaños y pesos reales, exige que ninguna etiqueta de fila quede en negrita
—salvo los chips de tecla— y que los íconos midan 24 × 24. El panel sigue sin
scroll (termina en 823 de 900 px).

## Punto 7 · Voseo en la interfaz — RESUELTO

## Puntos 15, 16 y 17 · Actividades — RESUELTOS

**Punto 17 · «Pregunta 1 de 3» y cierre de la secuencia**

- El kicker («Comprensión lectora · Pregunta 1 de 3») ya estaba en las ocho
  secuencias y lo ocultaba una regla que compartía con la dimensión de lectura.
  Ahora sólo se oculta la dimensión: es información para el equipo, no para el
  lector.
- Al responder las tres preguntas aparece el cierre, con `role="status"`:
  «Terminaste las 3 preguntas de este capítulo.» y, según cómo haya salido, la
  nota «Las que quedaron marcadas se pueden volver a intentar: elegí otra opción
  y volvé a enviar.» o «Las respondiste todas bien.»

**Punto 15 · Reintento señalizado, incorrecta marcada y «Siguiente pregunta»**

- La opción que se probó y estaba mal **sigue marcada** al elegir otra: antes,
  cada intento borraba todas las marcas y el lector perdía la referencia de lo
  que ya había probado.
- Cada devolución ofrece un botón **«Siguiente pregunta»** —salvo en la última—
  que lleva a la pregunta siguiente y enfoca su primera opción, respetando
  `prefers-reduced-motion`.
- El texto de la devolución señala el reintento (ver punto 16).

**Punto 16 · Devoluciones unificadas y audio en las dos voces**

- Criterio único para las 72 devoluciones: la incorrecta dice «Todavía no.
  <explicación> Elegí otra opción y volvé a enviar.»; la correcta, «Correcto.
  <explicación>». Sin emojis: **lo que se ve es lo que se narra** (antes el HTML
  decía «No.» y el catálogo de narración «❌ No.»).
- `tools/standardize_quiz_feedback.py` (nuevo) aplica el criterio en el HTML y en
  `content/i18n/es-UY/texts.json`, retira las devoluciones de las actividades que
  ya no están en el paquete (9) y verifica con `--check`. 48 devoluciones
  incorrectas cambiaron; el catálogo quedó en 72.
- **Audio regenerado en las dos voces**: 96 mp3 (48 devoluciones × Valentina y
  Mateo) con `edge-tts`, junto con los límites de palabra de cada archivo, que el
  generador obtiene del propio servicio. La versión de caché se subió **sólo en
  esas 48 entradas por voz**: 20.064 entradas de los dos catálogos conservaron la
  suya. Verificación del cambio: `qz007_o0_exp` pasó de 40,5 KB a 60,3 KB en
  Valentina y de 38,7 KB a 56,7 KB en Mateo, consistente con el texto más largo.
- El precargador offline se regeneró.
- Nota: el audio base (`content/i18n/es-UY/audios.json`) sigue siendo un catálogo
  legado cuyos mp3 no existen —hallazgo previo de `validate_v46.py`—; el lector
  reproduce desde los catálogos de voz, que están completos.

**Verificación**: `tools/screen-test/verify-quiz-retry.mjs` (nuevo) comprueba el
kicker visible, la dimensión oculta, la marca conservada, «Siguiente pregunta» (y
su ausencia en la última pregunta) y el cierre de la secuencia. Las seis suites
anteriores siguen en verde y sin errores de consola.

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

### Revisión del final del libro y limpieza del paquete

**Lo que estaba mal era el índice, no el libro.** Los créditos y agradecimientos
sí se ven: `pg225_sec001` es «Sobre el libro · pág. 8 de 11» (créditos: dirección,
autoría, equipo) y `pg226_sec001` es «pág. 10 de 11» (agradecimientos). El motor
arma el orden con su propia lista (`var sections = [...]` en `reflow-book.js`,
207 secciones), que incluía esas páginas; `content/pages.json`, el índice que leen
el runtime y las herramientas, tenía 204 y no las listaba. Eso explicaba el
hallazgo previo de `validate_v46.py` («Runtime section order/files differ from
content/pages.json»), que ahora queda resuelto.

- `tools/complete_pages_index.py` (nuevo) completa el índice con las tres
  secciones que faltaban, al final y en el orden real. `pages.json` pasa de 204 a
  **207** entradas, igual que la lista del motor. No se agrega
  `pg224_collaborators`: esa página la construye el motor en tiempo de ejecución
  y no tiene archivo de origen.
- **`pg227` revisado**: no duplica a `pg226`. Es el colofón («FIN · 1930 El viaje
  · Novela educativa transmedia · Ceibal - 2025»), once palabras que caen en la
  misma página visual que el final de los agradecimientos. Se queda.
- **Retirados del paquete** (decisión editorial): `qz001.html` a `qz006.html`
  —actividades que el libro no monta, y cuyas qz001–qz003 duplicaban preguntas ya
  presentes en `quiz_final` con otra clave de corrección— y `pg003_sec001.html` /
  `pg005_sec001.html`, variantes de portada. Se quitaron los 8 archivos, sus 8
  líneas del manifiesto SCORM y sus 6 entradas del archivo de respuestas (queda en
  8 actividades y 72 opciones). El contenido sigue disponible en el historial de
  git.
- `validate_v46.py` ya no marca los `data-id` de los créditos, los agradecimientos
  y el colofón: son páginas que no se narran, así que sus párrafos no tienen
  entradas en los catálogos de texto ni de audio. La excepción quedó explícita en
  el validador.
- El precargador offline se regeneró (207 secciones y el índice nuevo): pasó de
  233 a 225 claves.

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
