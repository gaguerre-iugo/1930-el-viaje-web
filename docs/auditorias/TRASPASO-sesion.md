# Traspaso de sesión — 1930: El viaje

Estado al retomar la **Revisión UX (documento de msuarez)**. Este archivo es el
punto de entrada: leelo primero y después el changelog
(`docs/auditorias/AUDIT-CHANGELOG-v47-revision-ux.md`), que tiene el detalle punto
por punto.

## Para retomar: pegá esto en la sesión nueva

> Retomamos **1930: El viaje** (proyecto en
> `C:\Users\germa\Desktop\1930-el-viaje-web-export-v48-full-book`).
>
> **Leé primero, en este orden:**
> 1. `docs/auditorias/TRASPASO-sesion.md` — este archivo: estado, mediciones ya
>    hechas que no hay que volver a descubrir, convenciones y prompt de arranque.
> 2. `docs/auditorias/AUDIT-CHANGELOG-v47-revision-ux.md` — el detalle de cada punto
>    de la Revisión UX, con las causas y las mediciones.
> 3. `docs/auditorias/PLAN-REVISION-UX-msuarez.md` — el plan original de los 25
>    puntos (hallazgos, alcance y decisiones que pedía el equipo).
> 4. `AGENTS.md` — estructura del proyecto y cómo verificarlo.
>
> Contexto: los **25 puntos** de `Revision_UX_1930_msuarez.docx` están atendidos; en
> el traspaso está la tabla con el estado real de cada uno, incluidas las salvedades
> (tres ítems que dependen de decisiones o de material del equipo, y tres
> verificaciones que quedaron a medias). **No hace falta rehacer nada de eso.**
>
> **Levantá el servidor y corré la verificación antes de tocar nada:**
> ```bash
> node tools/serve-local.js &          # puerto 5501 (ya puede estar corriendo)
> node tools/screen-test/verify-quiz-next-question.mjs --url http://127.0.0.1:5501/index.html
> node tools/screen-test/verify-quiz-option-fit.mjs    --url http://127.0.0.1:5501/index.html
> node tools/screen-test/verify-quiz-feedback-fit.mjs  --url http://127.0.0.1:5501/index.html
> node tools/screen-test/verify-quiz-zoom.mjs          --url http://127.0.0.1:5501/index.html
> ```
> Las cuatro tienen que dar **exit 0**. Si alguna falla, arrancá por ahí.
>
> **Qué necesito ahora:** *(elegí una)*
> - Seguir con los tres ítems que quedaron a medias → el traspaso dice cuáles son y
>   qué falta exactamente en cada uno.
> - Publicar la release (subir `bundleVersion`, `?v=`, precargador offline).
> - Otra cosa que te digo acá.
>
> Reglas del repo que importan: commits **en español y sin acentos**; al tocar
> `assets/reflow-book.js`, `assets/quiz-sequence.js` o `content/reflow.css` hay que
> **subir su `?v=` en `index.html`**; y **no confíes en el changelog ni en este
> archivo sin medir** — varias veces la documentación decía una cosa y el navegador
> otra (por ejemplo: decía que el logo de Ceibal faltaba y estaba aplicado).

## Qué está hecho

Los **25 puntos** del `Revision_UX_1930_msuarez.docx` están atendidos. Los 21
primeros se cerraron en la sesión del changelog (tema claro, íconos de EVA, pop-up
de voz, tipografía, voseo, contraste de los cuestionarios); el **bloqueante de
«Siguiente pregunta» se cerró en esta sesión**, junto con la alineación del botón y
la comprobación del desborde con zoom.

Detalle de esta sesión en el changelog, sección **«Bloqueante cerrado · “Siguiente
pregunta” volvía a mostrar la misma pregunta»**.

Cambios posteriores (ya en `master`): la definición del glosario se cierra al cambiar
de página, y la devolución ya no se encoge (en pantallas bajas el fondo no acompañaba
al texto); además, la devolución `qz012_o2_exp` ahora nombra a **Federica** y su audio
se regeneró en las dos voces. Detalle en el changelog.

## Estado real de los 25 puntos

Tabla de entrada rápida. **El detalle de cada punto, con las mediciones, está en el
changelog** (buscá el encabezado «Punto N»). Las salvedades están marcadas: no
conviene dar por cerrado lo que figura con asterisco.

| # | Punto | Estado | Dónde está el detalle |
|---|---|---|---|
| 1 | Glosario visible (barra, resaltado punteado por defecto, globo) | Cerrado | Punto 1 del changelog |
| 2 | Caracteres rotos en el glosario | Cerrado | commit `cb50d205`; `audit_charset.py` |
| 3 | Jerarquía de la barra (flechas 56 px, íconos de EVA, 40 % deshabilitado) | Cerrado | `verify-primary-toolbar.mjs` (8 anchos) |
| 4 | Contador por capítulo en vez de «14 / 395» | Cerrado | `verify-chapter-progress.mjs` |
| 5 | Sacar la clave de corrección del HTML | Cerrado | `extract_quiz_answers.py --check` |
| 6 | Panel demasiado largo | Cerrado | commit `fd86dd23`; `verify-tools-panel.mjs` |
| 7 | Voseo en toda la interfaz + inventario | Cerrado | `inventory_interface_texts.py --check` |
| 8 | Atajos fuera del panel (ayuda como diálogo) | Cerrado | commit `fd86dd23` |
| 9 | Sacar la sección «Herramientas» del panel | Cerrado (el glosario pasó a la barra) | Punto 1 del changelog |
| 10 | «Extra grande» cortado en el selector | Cerrado | `verify-tools-panel.mjs` |
| 11 | Cerrar el índice al elegir y llevar el foco | Cerrado | `verify-tools-panel.mjs` |
| 12 | Renombrar las pestañas del índice | Cerrado | `content/toc.json` |
| 13 | «Cap. N · título», agrupar, «Sobre la autora» | Cerrado | `complete_pages_index.py`; 207 entradas |
| 14 | Anillo de foco turquesa en el índice | Cerrado, **con salvedad** | Quedan **4 controles del runtime** del panel Herramientas y 1 del glosario sin contorno al enfocar (son del runtime, no nuestros) |
| 15 | Reintento señalizado, incorrecta marcada, «Siguiente pregunta» | Cerrado | `verify-quiz-retry.mjs` + las tres pruebas nuevas |
| 16 | «Todavía no.» + cierre, sin emojis, audio en dos voces | Cerrado | `standardize_quiz_feedback.py --check` |
| 17 | Kicker «Pregunta N de 3», dimensión oculta, cierre | Cerrado | `verify-quiz-retry.mjs` |
| 18 | Tema claro con tokens de EVA (barra, paneles, pop-ups) | Cerrado, **con una salvedad** | Los estados de las opciones ya se **midieron** (`verify-quiz-contrast.mjs`: 17,73:1 el texto en los cuatro estados; 10,93:1 / 7,08:1 las devoluciones). Queda sólo el borde en reposo (gris-400, 2,2:1) y el capítulo actual del índice en institucional-500 (4,82:1, cumple AA) donde EVA pide 600 (7,14:1) |
| 19 | Íconos SVG de EVA en la interfaz | Cerrado, **con salvedad** | **3 de los 8** (detener, audio anterior, audio siguiente) fueron **generados** por nosotros a partir de pausa y reproducir: si Comunicación tiene los originales, se reemplazan. `verify-eva-icons.mjs` |
| 20 | Escala tipográfica del contenido | **Decisión pendiente** | Cuerpo **20 px vs 18 px**: hoy 18. Es la única decisión que cambia la paginación de todo el libro (cliente) |
| 21 | «Abriendo 1930: El viaje…» + logo de Ceibal | Cerrado | El SVG oficial está en `assets/icons/ceibal-logo.svg` y aplicado en el cargador |
| 22 | Ocultar el enlace «Saltar al contenido» y la línea de apertura | Cerrado | `verify-opening.mjs` |
| 23 | Dobles espacios y saltos sueltos | Cerrado, **con salvedad** | `audit_typo.py` bajó de 45 a **1** coincidencia; la que queda es de **contenido** («???» en `pg176177_n0009`), decisión editorial |
| 24 | Jerarquía tipográfica N1–N4, íconos 24 px | Cerrado | `verify-ui-typography.mjs` |
| 25 | Pop-up de voz flotante, sin carril | Cerrado | La evitación se midió **en lectura real**: se encontró que el resaltado de la Custom Highlight API no ponía la clase que la regla buscaba, y se corrigió (`verify-tts-avoidance-real.mjs`) |

**Resumen**: 25 puntos atendidos. Quedan **1 decisión del cliente** (punto 20, 20 px
vs 18 px), **1 verificación a medias** (los 3 íconos generados del punto 19, que
dependen de que Comunicación mande los originales) y **3 salvedades menores** (el
borde en reposo del cuestionario, el capítulo actual del índice —las dos de
diseño— y el foco del punto 14). Los estados de color del punto 18 y la lectura
real del punto 25 **quedaron medidos y cerrados en esta sesión**.

### Lo que aún se puede hacer sin que nadie decida nada

En orden de valor, y todo dentro del repo:

1. **Medir los estados de color de las opciones** (punto 18) — **HECHO**: el
   sondeo se acota al panel de la pregunta (`verify-quiz-contrast.mjs`) y los
   cuatro estados cumplen (17,73:1 el texto; 10,93:1 / 7,08:1 las devoluciones).
2. **Reemplazar los 3 íconos generados** si Comunicación manda los originales
   (punto 19). Único ítem que depende de material externo.
3. **Verificar el punto 25 en una lectura real** — **HECHO**, y encontró un fallo:
   la regla no se disparaba porque el resaltado real no lleva `.tts-active-block`.
   Corregido y con prueba nueva (`verify-tts-avoidance-real.mjs`).

## El bloqueante, resuelto (y por qué parecía un problema del motor)

**El motor estaba bien: lo que estaba mal era lo que medía la prueba.**

La duda que decidía el arreglo —¿la pregunta siguiente está en la misma página o en
la de al lado?— quedó resuelta **midiendo**, con la sonda del manejador
(`?quizdebug=1`) en un clic real:

```
MEDICION quiz-next {"scrollLeft":43712,"ancho":1366,"cajaLeft":1666,"actual":32,"objetivo":33}
```

- **`cajaLeft` = 1666** con un ancho de página de 1366: la pregunta siguiente está
  **en la página de al lado** (una página entera a la derecha). El arreglo es
  **navegar de página**, que es lo que hace el manejador.
- `actual` **32** → `objetivo` **33**: el motor cambia de página al recibir el clic
  y **no lo revierte** (una sola asignación de `scrollLeft`: 43712 → 45078).
- Las dos mediciones que parecían contradecirse eran correctas **en su momento**:
  las opciones en x=1691 eran las de la pregunta 2 (página de al lado), y el «panel
  siguiente en la misma página» se midió **después** de que el motor ya había
  cambiado de página.

**La causa de que se viera «la misma pregunta»**: `#content` tiene **24 kickers**
(8 capítulos × 3 preguntas) con los mismos textos repetidos, y la prueba buscaba el
**primero del DOM**, que es una copia de la pregunta 1 **corrida fuera del visor**
(left = −1041). Leía bien y miraba el lugar equivocado. El arreglo de la prueba es
elegir el kicker **visible** (centro dentro del viewport y confirmado con
`elementFromPoint`), que es el criterio que ya usa el resto del arnés.

**Alineación del botón** (el otro pendiente): no era la hoja de estilos —las tres
reglas se aplicaban— sino que `.quiz-feedback` es una **grilla** de dos columnas y
en una grilla `float` se ignora y el margen automático no mueve nada. Se le dice al
botón en qué columna vive (`grid-column: 2; justify-self: end`) y pasó de x=333,8 a
**x=840,2** (borde derecho en 1032,2 de 1041).

## Y lo que apareció después: el recorte del cuestionario

La captura de revisión en uso mostró que la devolución y «Siguiente pregunta»
**quedaban cortados** por la tarjeta. Eran dos causas apiladas, las dos medidas y
las dos corregidas:

1. **El desplazamiento del motor** (`--reflow-quiz-content-shift`, una
   transformación que mantiene el enunciado en su lugar) se aplicaba después de que
   la devolución crecía y **empujaba el contenido fuera de la tarjeta**, que lo
   recortaba con `overflow: hidden`. Medido: pedía entre **19 y 33 px más** de los
   que había en todos los tamaños (a 952x645 el botón quedaba 13 px afuera; a
   800x600, **41 px**). Ahora se **acota al hueco disponible** y se descarta si no
   hay ninguno.
2. **El contenido no entraba** en el techo de la tarjeta: 565 px de contenido contra
   558 px de caja a 1280x720. Se aprieta el ritmo vertical del cuestionario en
   columnas bajas (`@media (max-height: 780px)`), con lo que el botón entra 19 px
   adentro a 800x600 y 8 px a 1280x720.
3. **La fila de la opción cortaba su propio texto**: el motor le fija la altura que
   midió antes de enviar y, al pasar a dos líneas, la segunda se salía del recuadro.
   La regla que debía arreglarlo ya existía pero **perdía por especificidad** frente
   a la del motor (las dos con `!important`). Medido: fila de 43,03 px con 3 líneas y
   la última 37,42 px afuera; ahora la fila crece a 90,34 px.

**Trampa de especificidad** (vale para las dos últimas): el acotado no surtía efecto
porque dos reglas existentes son más específicas y también usan `!important` (la de
letra extra grande, la del estado con devolución y la de la altura de la fila).
Verificar el valor **calculado** y **listar las reglas que declaran esa propiedad**
fue lo que las delató: el `gap` seguía en 28 px y la fila en 43 px.

El detalle completo está en el changelog, sección **«El recorte del cuestionario»**.

## Cómo se verifica

```bash
node tools/serve-local.js &                                   # puerto 5501
node tools/screen-test/verify-quiz-next-question.mjs --url http://127.0.0.1:5501/index.html
node tools/screen-test/verify-quiz-zoom.mjs --url http://127.0.0.1:5501/index.html
node tools/screen-test/verify-quiz-feedback-fit.mjs --url http://127.0.0.1:5501/index.html
node tools/screen-test/verify-quiz-option-fit.mjs --url http://127.0.0.1:5501/index.html
```

Las cuatro están **en verde**. La suite completa y las que importan:

```bash
node tools/screen-test/_diag-nav.mjs                    # la navegación funciona
node tools/screen-test/verify-quiz-next-question.mjs    # VERDE: Pregunta 1 → Pregunta 2
node tools/screen-test/verify-quiz-zoom.mjs             # VERDE: 9 combinaciones de letra y zoom
node tools/screen-test/verify-quiz-retry.mjs            # puntos 15 y 17
node tools/screen-test/verify-quiz-contrast.mjs         # punto 18: contraste en los 4 estados
node tools/screen-test/verify-light-theme.mjs           # tema claro y contraste
node tools/screen-test/verify-popup-theme.mjs           # globo del glosario
node tools/screen-test/verify-floating-player.mjs       # pop-up de voz
node tools/screen-test/verify-tts-avoidance.mjs         # punto 25: bloque simulado
node tools/screen-test/verify-tts-avoidance-real.mjs    # punto 25: lectura real
```

Validadores de contenido: `python tools/validate_v46.py`,
`python tools/audit_typo.py`, `python tools/audit_charset.py`.

**Línea de base de los validadores** (no son fallas de esta sesión, ya estaban):
`audit_charset.py` informa **30 hallazgos** (citas en otros idiomas, idéntico en
HEAD) y `validate_v46.py` informa los desajustes de audio y timecodes del pipeline
viejo. `extract_quiz_answers.py --check` pasa limpio.

**Intermitencia conocida**: `verify-glossary-highlight.mjs` falla **1 de cada 3
corridas** («con el valor viejo en "false" el globo no abrió»). No es de estos
cambios: se reproduce igual contra HEAD. Está sin arreglar.

## Hechos medidos que no hay que volver a descubrir

- **El paginado no usa columnas**: el motor arma el libro como **una fila horizontal
  de más de 50 000 px** (medido: `scrollWidth` 371 552) y muestra una página
  corriendo **el scroll de `#content`** (1366 px por página). `main` tiene
  `overflow: hidden` y `#content` `overflow: auto`: **el recorte ya existe**.
- **Los textos de la interfaz se repiten por capítulo**: cualquier búsqueda «el
  primero del DOM» puede devolver una copia fuera de pantalla. Medir visibilidad
  (centro en el viewport + `elementFromPoint`), no orden de documento.
- **Los `!important` de este CSS compiten por especificidad**: dos reglas del
  cuestionario (la de letra extra grande y la del estado con devolución) ganan sobre
  una regla nueva con el mismo `!important`. Cuando un ajuste «no hace nada», medir
  el valor **calculado** antes de dar por hecho que el CSS no se aplica. Y el
  `getBoundingClientRect().left` de una sección es relativo al **viewport**, no al
  contenido: para sacar su página hay que restar el borde izquierdo de `#content`.
- **Cualquier cosa que use `scrollIntoView` pelea con el paginado.** El foco de la
  primera opción usa `focus({ preventScroll: true })` por eso.
- **El manejador del botón no es lo que cambia la página**: el `goToPage` del motor
  responde al clic. El bucle sobre `#reflow-next` del manejador existe como respaldo
  y no se ejecuta en el caso normal.
- **En una grilla, `float` se ignora** y `margin: auto` no mueve un ítem de grilla:
  hay que decirle su columna (`grid-column`) y su alineación (`justify-self`).
- **El motor fija geometría medida, y la impone con `!important`.** Escribe en cada
  fila de opción la altura que midió **antes de enviar**
  (`--reflow-quiz-option-interaction-height`, con decimales) y su regla la aplica con
  `!important`, en un selector con `:has()` encadenado a `body.reflow-book #content`
  (más específico que una regla suelta). Cuando un ajuste de CSS «no hace nada»,
  revisar la **especificidad** y listar las reglas que declaran esa propiedad, no el
  orden en el archivo. En la tarjeta pasa lo mismo con
  `--reflow-quiz-interaction-height`.
- **El desplazamiento de la devolución es una transformación** (`--reflow-quiz-content-shift`),
  así que **no cambia el layout**: lo que empuja fuera de la caja de la tarjeta lo
  recorta su `overflow: hidden`. Medido: pedía entre 19 y 33 px más de los que había
  en todos los tamaños. Ahora se acota al hueco real.
- **El runtime usa Tailwind v4 con colores en `oklch` y `oklab`, dentro de capas.**
  (a) Una medición de color tiene que leer oklch/oklab por su **luminosidad** (el
  primer número). (b) Una regla `!important` **dentro de una capa gana sobre otra
  sin capa**: el CSS no alcanza y gana el **pase inline**.
- **`--ceibal-gray-500` no existe** en la paleta: el `var()` queda inválido y el
  fondo sale transparente.
- **`overflow-x: clip` deshabilita el scroll** de ese elemento: rompió la navegación.
- **El resaltado de la lectura real es un rango de la Custom Highlight API**
  (`CSS.highlights.get("adt-tts-active")`), no un elemento: el párrafo **no** lleva
  `.tts-active-block` en modo palabra/sentencia (sólo en imágenes o fallback). Y
  como un rango no muta el DOM, **ningún observador se despierta** al cambiar de
  oración: la evitación del reproductor hay que llamarla desde el pintado
  (`paintTtsRange`), no esperar un ciclo. Ver el punto 25 del changelog.
- **Al medir contraste de este runtime hay que convertir oklch/oklab a sRGB**, no
  leer sólo su luminosidad: para decidir claro/oscuro alcanza el primer número,
  pero para un contraste WCAG no. `verify-quiz-contrast.mjs` trae el conversor.

## Convenciones del repo

- Los mensajes de commit van **en español y sin acentos**.
- Al tocar `assets/reflow-book.js`, `assets/quiz-sequence.js` o `content/reflow.css`
  hay que **subir su `?v=` en `index.html`**, si no el navegador sirve la versión
  vieja. Valores actuales: `reflow.css?v=162-feedback-sin-encoger`,
  `reflow-book.js?v=189-glosario-cierra` y
  `quiz-sequence.js?v=6-siguiente-pagina`.
- El servidor local está en el puerto **5501** y sigue corriendo.
- **Playwright**: el lanzador necesita `--remote-debugging-pipe`, que el sandbox de
  DSH bloquea (`spawn EPERM`). Las pruebas corren con acceso pleno.
- **`.gitignore`**: `tmp/` y `Export/sitio/` están ignorados. Los PNG de verificación
  que se citan en el changelog viven en `tmp/`, así que **no viajan en el commit**:
  si una captura es evidencia, hay que copiarla a `docs/` o regenerarla.

## Las pruebas de esta revisión, y qué ejercita cada una

| Prueba | Qué comprueba | Ojo con |
|---|---|---|
| `verify-quiz-next-question.mjs` | «Siguiente pregunta» pasa de la pregunta 1 a la 2 | Mide el kicker **visible**; el libro repite el mismo texto en 24 nodos |
| `verify-quiz-option-fit.mjs` | Ninguna fila de opción corta su texto (112 casos) | Cubre las **dos** formas: opción larga y texto alargado después de enviar |
| `verify-quiz-feedback-fit.mjs` | Devolución y botón entran completos en la tarjeta (56 casos) | Mide contra el **límite efectivo** (sube por los ancestros que recortan) |
| `verify-quiz-zoom.mjs` | Filas de opción y alineación del botón con letra grande y zoom | El zoom se emula **achicando el viewport CSS**, que es lo que ve el lector |
| `verify-quiz-retry.mjs` | Puntos 15 y 17: reintento, marcas, cierre de la secuencia | — |
| `verify-quiz-contrast.mjs` | Punto 18: contraste de texto y gráficos en los 4 estados, devolución y botón | Acota la muestra al panel de la pregunta; convierte oklch/oklab a sRGB |
| `verify-tts-avoidance.mjs` | El reproductor no tapa el bloque en lectura | Marca los bloques **a mano**: es el caso simulado |
| `verify-tts-avoidance-real.mjs` | Punto 25 en lectura real: oración baja y alta | Necesita `--autoplay-policy=no-user-gesture-required` (lo pasa el lanzador) |
| `verify-glossary-highlight.mjs` | Punto 1: resaltado, globo, preferencia | **Intermitente**: falla ~1 de 3 corridas, también en HEAD |
| `_diag-nav.mjs` | La navegación del libro funciona | Es el canario del paginado: corrélo después de tocar CSS del visor |

## Decisiones que NO son de código

| Pendiente | De quién depende |
|---|---|
| El «???» de `pg176177_n0009` | Editorial: no se puede inventar el texto |
| Cuerpo de texto **20 px vs 18 px** (punto 20) | Cliente |
| Fondo turquesa a sangre de la página del cuestionario | Identidad de Ceibal: ¿se deja o se atenúa? |
| El capítulo actual del índice en institucional-500 (4,82:1) en vez de 600 (7,1:1) | Diseño: cumple AA, es un ajuste de una línea |
| La devolución del cuestionario mide 4,72:1 (por encima de 4,5:1, con poco margen) | **Re-medido**: 10,93:1 la incorrecta y 7,08:1 la correcta; el 4,72 no se reproduce, ya no es un pendiente de diseño |
| El borde en reposo de las opciones del cuestionario (gris-400, 2,2:1) | Diseño: WCAG 1.4.11 pide 3:1 si el límite identifica el componente; ¿se oscurece? |
| Subir `bundleVersion` y publicar | Release. **No invalida los catálogos de voz** (cada audio tiene su propia versión): son 4 ediciones y regenerar el precargador |
| Los 3 íconos de EVA generados (detener, audio anterior, siguiente) | Comunicación: si aparecen los originales, se reemplazan |

## Estado del repositorio al cerrar esta sesión

- Rama `master`, con los cambios de esta sesión **commiteados** (ver el historial:
  los últimos commits cierran el bloqueante de «Siguiente pregunta», la alineación
  del botón, el recorte de la tarjeta y el recorte de la fila de opción).
- `Export/` (el `.zip` de 444 MB y el script de S3) **no** está versionado: sólo
  `Export/sitio/` está ignorado, el resto queda como archivos sin seguimiento. Si
  molesta en `git status`, conviene ignorar `Export/` completo.
- Los PNG de verificación viven en `tmp/` (ignorado). Para conservar una captura como
  evidencia hay que moverla a `docs/`.

