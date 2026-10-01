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

**PENDIENTE · los interruptores**: en las filas de preferencias, la **pista y la
perilla del interruptor** quedan casi invisibles sobre blanco (el runtime las pinta
con los valores del tema oscuro) y las etiquetas de las filas deshabilitadas se
lavan por la **opacidad** reducida que aplica el runtime. Ojo: esto **no lo detecta
la medición de color del script**, porque mira el color calculado e ignora la
opacidad y los pseudo-elementos de la pista; hay que medirlo sobre los **píxeles
renderizados** (o comprobar la captura). Es el paso siguiente de esta etapa.

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
- El cargador quedó estructurado con un **hueco para el logo de Ceibal**
  (`#reflow-loading .reflow-loading-logo`), que no ocupa lugar mientras esté
  vacío. **Falta el SVG oficial**: no hay ninguno en el repositorio. Cuando
  llegue, se aplica como `background-image` en esa regla, sin tocar JavaScript.
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
