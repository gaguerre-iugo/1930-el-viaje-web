# Auditoría móvil — Chrome en Android

Fecha: 29 de septiembre de 2026.
Alcance: libro publicado en GitHub Pages (`gaguerre-iugo.github.io/1930-el-viaje-web`)
y su copia local, medidas con emulación de Chrome en Android (Playwright/Chromium).

## 0. Resumen ejecutivo

**No hay errores de JavaScript ni recursos 404.** En los cuatro perfiles Android
auditados: 0 errores de consola, 0 promesas rechazadas, 0 pedidos fallidos y 0
respuestas HTTP ≥ 400. El libro no está "roto" por una excepción: lo que se ve mal
es **geometría y tiempo de arranque**.

Tres problemas explican la mayor parte de la mala experiencia en un teléfono:

| # | Problema | Magnitud medida |
|---|---|---|
| **0** | **El viewport se infla y todo lo `position: fixed` cae fuera de la pantalla.** La tira multicolumna de `#content` (cientos de miles de píxeles de ancho) hace que Chrome Android infle el *initial containing block* a 4× el viewport de layout; la barra de navegación, el reproductor TTS y los paneles se posicionan contra esa caja inflada | `window.innerWidth/innerHeight` = 4268×1920 con layout de 1067×480; la barra terminaba en `y=1920` en una pantalla de 480 px — **CORREGIDO**, ver §8 |
| **1** | La barra de navegación inferior (Índice / Anterior / Siguiente / Herramientas) **no existe o está invisible y sin recibir toques durante los primeros 7 a 30 segundos** | Contenido visible a los 6,5–12 s; barra usable a los 6,8–29 s. En ese lapso, deslizar o tocar "Siguiente" **no cambia de página** — **CORREGIDO**, ver §7 |
| **2** | **Teléfono en horizontal (915×412)**: la columna de lectura queda de **228 px de alto** con 875 px de ancho → ~10 líneas por página y **964 páginas** (contra 395 en vertical). Las portadas de capítulo se dibujan a **105×59 px** (originales de 1484×825) | `--reflow-page-height` = 228 px; portada pintada a 107×156 px — pendiente |
| **3** | La barra de direcciones de Chrome Android **re-pagina el libro** en horizontal y en tablet (la columna cambia de 228→276 px y de 1088→1144 px), porque esas ramas usaban `100dvh`, que Chrome cambia dinámicamente | Medido con `setViewportSize` — **CORREGIDO** en el CSS (`100svh`), ver §7 |

> El problema **0** es el que explica el reporte original ("en Chrome de Android no se
> ve bien"): es invisible en escritorio y catastrófico en el teléfono, y no produce
> ningún error de consola.

En vertical (el caso normal) el libro se ve correcto: portada completa, prosa de
34 líneas por página, sin texto cortado, sin solapamiento de barras, sin desborde
horizontal.

## 1. Cómo se reprodujo

No hace falta la consola del teléfono: todo se reproduce en el escritorio con
emulación de viewport móvil (mismo ancho CSS, mismo `devicePixelRatio`, mismo
`userAgent` de Android, `hasTouch`).

```powershell
cd tools\screen-test
node mobile-audit.mjs --pages 6          # audita los 4 perfiles Android
node mobile-boot-timeline.mjs            # mide cuándo queda usable el lector
node verify-published.mjs                # ¿lo publicado es igual a este repo?
```

- `mobile-audit.mjs` mide por vista: errores de consola, red, geometría, unidades
  de viewport, imágenes, objetivos táctiles efectivos y usabilidad temporal.
  Deja capturas y `report-mobile/mobile-summary.json`.
- Perfiles: `412×915` (Pixel 7 vertical), `360×640` (teléfono chico),
  `915×412` (Pixel 7 horizontal), `800×1280` (tablet vertical).
- Verificación previa: `index.html`, `reflow.css`, `viewport-layout.css`,
  `tailwind_output.css`, `reflow-book.js` y `quiz-sequence.js` publicados son
  idénticos (hash SHA-256) a los del repositorio, así que lo medido es lo que se ve.

## 2. Hallazgos

### 2.1 La barra de navegación llega tarde (crítico)

**Síntoma.** Se abre el libro en el teléfono: primero aparece "Preparando el libro
reflowable…", después el contenido, y durante un rato largo la pantalla no tiene
ningún control. Si el lector intenta avanzar, no pasa nada: no hay forma de pasar
de página con el dedo.

**Causa estructural.** `assets/reflow-book.js` (`syncPrimaryToolbar`, ~línea 2920)
mantiene la barra con la clase `reflow-primary-toolbar-pending` mientras
`runtimeMenuReady` sea falso. Ese indicador exige que el runtime empaquetado
(`assets/base.bundle.local.js`, 709 KB) haya montado su propio dock y expuesto
`window.__adtReflowSetDockMenu` / `__adtReflowGetDockMenu`. El estado `pending`
aplica `opacity: 0; pointer-events: none; transform: translate(-50%, 150%)`
(`content/reflow.css`, líneas 1196–1200): la barra está fuera de la pantalla y no
recibe toques.

**Evidencia (publicado, 412×859, corrida fría).**

| Hito | Momento |
|---|---|
| `DOMContentLoaded` / `load` | 437 ms |
| El runtime expone `__adtReflowSetDockMenu` | 5.706 ms |
| `#content` pasa a visible y se calculan las 395 páginas | 10.185 ms |
| Aparecen los botones del dock del runtime | 18.619 ms |
| La barra queda **usable** (opacity 1, `pointer-events: auto`) | 19.552–29.400 ms |

En el mismo arranque se midieron **29 tareas largas y 22,2 s de bloqueo del hilo
principal** (la peor, 3,8 s), entre los 803 ms y los 23,7 s. La carga de red no es
el cuello de botella: 290 pedidos / 6,8 MB terminan antes del segundo 1.

**Comprobación de que no se puede navegar mientras está oculta** (a los 11 s,
estado `pending`): deslizamiento sobre `#content` → página 1; toque en la zona
donde está "Siguiente" (`#reflow-next`, rect `top: 804`) → página 1. La barra
existe en el DOM, pero su contenedor tiene `pointer-events: none`.

**Agravante.** El runtime tiene una red de seguridad para el contenido
(`setTimeout(…, 2000)` → "ADT runtime: forcing content display after timeout",
dentro de `base.bundle.min.js`), pero **no existe ninguna red equivalente para la
barra de navegación**.

### 2.2 El modo horizontal del teléfono es inservible (crítico)

**Síntoma.** En horizontal el libro muestra tres o cuatro líneas de texto por
página, en una columna larguísima, y las ilustraciones se ven del tamaño de un
sello.

**Causa estructural.** La corrección que fija la altura de la columna al viewport
siempre visible (`100svh`) está limitada a `@media (max-width: 47.999rem)`
(`content/reflow.css`, líneas 66–84). Un teléfono en horizontal mide ~915 px de
ancho, así que **cae en la rama de escritorio** (`100dvh`), donde la reserva de
barras es de 136 px fijos (`--reflow-toolbar-reserve: 4rem + 4rem`) y la barra
inferior ocupa 64 px de los 364 px visibles (18 %).

**Evidencia (915×364).**

- `--reflow-page-height` = **228 px**; columna de 875 px de ancho → ~10 líneas.
- **965 páginas** (contra 393 en vertical, mismo contenido).
- `pg001_cover_art_repaired_v2.jpg` (738×1078) pintada a **107×156 px**.
- `chapter1_cover.jpg` (1484×825) pintada a **105×59 px** dentro de una caja de
  823×59 px.
- Portada: el título "1930 / EL VIAJE" se superpone al arte, que quedó minúsculo
  en el centro de una pantalla casi vacía.

Capturas: `report-mobile/landscape-cover-pg001_sec001.png`,
`report-mobile/landscape-cover-pg058059_sec001.png`.

### 2.3 La barra de direcciones re-pagina el libro (horizontal y tablet)

**Síntoma.** Al retraerse la barra de direcciones de Chrome (o al abrirse el teclado
en una actividad de respuesta abierta), el texto bajo los ojos cambia: el lector
conserva número de página y `scrollLeft`, pero cambia el alto de columna, así que
cada página pasa a contener otro texto.

**Causa estructural.** Donde no aplica la corrección de móvil se usa `100dvh`, que
Chrome Android actualiza dinámicamente. `100svh` (viewport chico, con barras
visibles) es estable; `100dvh` no lo es.

**Evidencia (simulando la retracción con `setViewportSize`).**

| Perfil | Columna con barra visible | Columna con barra retraída |
|---|---|---|
| Pixel 7 horizontal | 228 px (`100dvh`) | 276 px |
| Tablet 800×1280 | 1088 px (`100dvh`) | 1144 px |
| Pixel 7 vertical | 707 px (`100svh`) | 763 px (el CSS no cambia: `svh` es estable) |

### 2.4 Ilustraciones encogidas en tablet y en pantallas chicas

- Tablet 800×1280: `pg025_im002.jpg` en una caja de 449×632 px se pinta a
  **449×318**; `pg031_im002.jpg` en 397×632 se pinta a **397×305**. Queda media
  caja vacía.
- Teléfono chico 360×640: la portada se pinta a **242×353** dentro de una caja de
  320×353 → bandas blancas a los costados.

La causa es que la caja la fija el layout (alto disponible) y la imagen se ajusta
con `object-fit: contain`, así que no se deforma pero se achica.

### 2.5 Controles chicos en "Herramientas"

Medidos como **área táctil efectiva** (el `<label>` que envuelve, criterio WCAG
2.5.5), en los cuatro perfiles:

| Control | Tamaño |
|---|---|
| Interruptor "Lectura fácil" | 86×24 px |
| Conmutador "Palabra" | 67×40 px |
| Conmutador "Oración" | 70×40 px |

El resto de los controles (incluidos los radios de los cuestionarios, que van
dentro de `<label>` grandes) cumple. Los falsos positivos iniciales de "72
objetivos < 44 px" eran los `<input type="radio">` desnudos de 19×13 px.

### 2.6 Detalles menores

- **"Herramientas" se corta**: en 360–412 px de ancho el botón muestra "Herram.".
- **Interlineado y tamaño desparejos**: hay prosa a 17,28 px con interlineado 1,2
  (20,74 px) y otras secciones a 18 px con interlineado 1,55 (27,9 px). El
  interlineado 1,2 es ajustado para lectura en pantalla.
- **Portada con overflow propio**: el `h1` tiene `scrollHeight` 90 px contra
  `clientHeight` 80 px con `overflow: visible`; según la fuente disponible puede
  recortarse.
- **Higiene de build**: `reflow-book.js` (línea ~10583) hace
  `fetch("./assets/base.bundle.local.js")`, es decir el bundle "local" también en
  producción, en lugar de `base.bundle.min.js`. Ambos pesan ~709 KB y son el mismo
  runtime de producción, pero el nombre delata un artefacto equivocado.

### 2.7 Hipótesis no verificable en emulación: tema oscuro de Chrome Android

El libro no declara `color-scheme` en ninguna parte (ni `<meta name="color-scheme">`
ni la propiedad CSS), y no tiene reglas `@media (prefers-color-scheme: dark)`.
Chrome Android aplica oscurecimiento automático a los sitios que no se declaran
claros; con un libro lleno de ilustraciones eso se vería mal. En el emulador
headless el auto-dark no se reproduce (`--force-dark-mode` no cambió un solo
píxel: las tres capturas son idénticas), así que **no está confirmado**; lo
prudente es excluirse explícitamente.

## 3. Lo que está bien (verificado)

- Cero errores de consola, cero promesas rechazadas, cero 404, cero pedidos fallidos
  en los cuatro perfiles.
- Fuente Atkinson Hyperlegible cargada (400 y 700) y FontAwesome disponible.
- Ninguna imagen rota; ninguna deformada (`object-fit: contain` en las ilustraciones).
- Ningún desborde horizontal real y ningún solapamiento entre barras fijas y texto.
- Ningún texto queda por debajo del área visible en vertical, ni siquiera con el
  escalado de texto del sistema al 200 % (el lector re-pagina correctamente:
  393 → 2452 páginas).
- Los cuatro perfiles sirven el mismo build publicado que este repositorio.

## 4. Correcciones propuestas (por orden de impacto)

Todas son acotadas y verificables con el arnés. Las marcadas ✅ ya están aplicadas
(§7); el resto queda pendiente.

1. ✅ **Desacoplar la barra del dock del runtime** (`assets/reflow-book.js`,
   `syncPrimaryToolbar`): la barra ya no espera al runtime para mostrarse.
2. ✅ **Usar `100svh` también fuera del ancho de teléfono**
   (`content/reflow.css`, `--reflow-page-height`): deja de re-paginarse cuando
   Chrome Android retrae la barra de direcciones.
3. ⏳ **Reserva de barras proporcional al alto**: `--reflow-toolbar-reserve: 128px`
   fijos es el 37 % de un viewport de 364 px. Algo como
   `min(8rem, 22svh)` libera la columna en horizontal y en pantallas bajas.
   Es lo que falta para que el modo horizontal de un teléfono sea usable
   (columna de 228 px → ~230-260 px y sin 965 páginas).
4. ⏳ **Ilustraciones con tope proporcional**: en pantallas de poca altura, topar
   las portadas de capítulo a un porcentaje del alto de la columna (p. ej. 60 %)
   en vez de dejar que la caja de 59 px las achique con `contain`.
5. ⏳ **Objetivos táctiles de Herramientas ≥ 44 px** (86×24, 67×40, 70×40) y
   etiqueta de la barra abreviable en anchos chicos ("Herramientas" → "Herram.").
6. ⏳ **Unificar la tipografía de prosa** (17,28 px/1,2 convive con 18 px/1,55)
   para que todas las páginas tengan la misma densidad e interlineado ≥ 1,4.
7. ⏳ **Declarar `color-scheme: light`** en `:root` y
   `<meta name="color-scheme" content="light">` en `index.html`, para excluirse
   del oscurecimiento automático de Chrome Android (hipótesis de §2.7).
8. ⏳ **Aligerar el arranque**: 22 s de bloqueo del hilo principal en escritorio es
   mucho. Incluye revisar qué bundle se sirve (`base.bundle.local.js`).

## 5. Cómo capturar errores en el teléfono real

Como la consola de Chrome en Android no es accesible a mano, quedan dos caminos:

### 5.1 Panel de diagnóstico en pantalla (`?diag=1`)

Se agregó `assets/mobile-diagnostics.js`, que se carga **solo** si la URL lleva
`?diag=1` (en `index.html` no cambia nada sin ese parámetro):

```
https://gaguerre-iugo.github.io/1930-el-viaje-web/index.html?diag=1
```

El panel muestra sobre el libro: errores de JS, promesas rechazadas, recursos que
no cargan, respuestas HTTP ≥ 400, `console.warn/error`, y las medidas reales del
dispositivo (vh/dvh/svh, alto de la columna, reserva de barras, líneas por página,
estado de la barra de navegación, orientación, DPR). Incluye un botón
**"Copiar informe"** para pegar el reporte en un chat o correo. Alcanza con sacarle
una captura de pantalla.

### 5.2 Depuración remota por USB

1. En el teléfono: Ajustes → Opciones de desarrollador → Depuración por USB.
2. Conectar por cable y abrir `chrome://inspect` en Chrome de escritorio.
3. "Inspect" sobre la pestaña del libro: consola, red y elementos reales del
   teléfono, sin emulación.

## 6. Anexo: comandos y archivos

```
tools/screen-test/mobile-audit.mjs         auditoría Android (4 perfiles)
tools/screen-test/mobile-boot-timeline.mjs cuándo queda usable el lector
tools/screen-test/verify-published.mjs     compara lo publicado con el repo
tools/screen-test/report-mobile/           capturas y mobile-summary.json
assets/mobile-diagnostics.js               panel ?diag=1
```

Umbrales usados: objetivo táctil ≥ 44 px CSS (WCAG 2.5.5), sin texto bajo el
pliegue visible, sin solapamiento barra/texto, fuentes e imágenes cargadas.

## 7. Correcciones aplicadas y verificación

Versiones nuevas: `reflow-book.js?v=135-barra-sin-espera` y
`reflow.css?v=93-svh-estable` (el `?v=` cambia para que los navegadores no
sirvan la copia cacheada).

### 7.1 `assets/reflow-book.js` — la barra deja de esperar al runtime

En `syncPrimaryToolbar`:

- La clase `reflow-primary-toolbar-pending` —que aplica `opacity: 0` y
  `pointer-events: none`— ya **no** se ata a que el runtime haya montado su dock.
  La barra queda pendiente solo mientras el libro todavía no está paginado
  (`state.total > 1`) y, en cualquier caso, se muestra al vencer un plazo de
  seguridad de 4 s (`PRIMARY_TOOLBAR_FALLBACK_MS`).
- Anterior/Siguiente son del lector y funcionan siempre. Índice y Herramientas
  delegan en el runtime, así que quedan `disabled` hasta que esté listo: mejor un
  botón anunciado como no disponible que un toque muerto.
- `watchRuntimeForPrimaryToolbar()` revisa una vez por segundo (máximo 90) para
  habilitarlos apenas el runtime responda, sin depender de que el lector cambie
  de página.

**Verificación (local, 412×859, emulación Pixel 7):**

| Medición | Antes | Después |
|---|---|---|
| Barra de navegación usable (desde el inicio de la navegación) | 13,8 – 29,4 s | **9,9 s**, en cuanto el contenido se muestra |
| Contenido visible | 10,3 – 12,1 s | 8,1 – 10,3 s |
| Toque en "Siguiente" con el runtime todavía arrancando | no cambia de página | **cambia de página (1 → 2)** |
| Errores de consola | 0 | 0 |
| Índice | invisible (no se podía tocar) | se habilita cuando el runtime está listo y abre el panel (`aria-expanded=true`) |

**Verificación sobre el sitio publicado** (GitHub Pages, `?v=135-barra-sin-espera`,
dos corridas independientes):

| Medición | Antes | Después |
|---|---|---|
| Barra usable | 19,6 – 29,4 s | **11,6 – 13,1 s**, junto con el contenido |
| Contenido visible | 10,2 – 12,1 s | 10,9 – 12,1 s (no cambia: es el arranque del runtime) |
| Toque inmediato en "Siguiente" al aparecer la barra | imposible (barra oculta) | **página 1 → 2, OK** |
| Errores de consola / pedidos fallidos | 0 | 0 |

En los cuatro perfiles Android la barra quedó usable **al mismo tiempo que el
contenido** (antes llegaba 9–18 s después). El tiempo que queda —entre 6,5 s para
crear la barra y ~12 s para terminar de paginar— es el costo de arranque del
runtime y del motor, que es el punto 8 de §4 y no lo toca esta corrección.

### 7.2 `content/reflow.css` — `100svh` en lugar de `100dvh`

`--reflow-page-height` pasó de `100dvh` a `100svh`. `svh` es el viewport chico
(barras del navegador desplegadas), que **no cambia mientras la página está
abierta**; `dvh` sí cambia cuando Chrome Android retrae la barra de direcciones, y
al cambiar el alto de la columna el libro entero se re-pagina y el texto bajo los
ojos se corre. En escritorio `svh` y `vh` valen lo mismo, así que es un no-op.

**Verificación:**

- Escritorio 1440×900: la columna sigue midiendo **764 px** (idéntico a antes) y el
  token ahora dice `100svh`.
- Teléfono horizontal 915×412 y tablet 800×1224: el token usa `100svh`.
- Arnés de pantallas grandes (FHD 1920×1080): `táctil<44px = 0`, sin regresiones.
- **Límite de la emulación**: en Chromium emulado `svh` y `dvh` valen siempre lo
  mismo (el alto del viewport), así que la estabilidad frente a la barra de
  direcciones **no se puede medir acá**; se sostiene en la definición de `svh` y en
  el comportamiento documentado de Chrome Android. El arnés ahora imprime esa
  aclaración en lugar de una falsa alarma de "la columna cambia de alto".

### 7.3 `assets/offline-preloader.js`

Se sincronizó con `node tools/sync_offline_preloader.js` porque el precargador
inlina `index.html`. La única entrada que cambió es `./index.html`
(2.757 → 3.371 caracteres); el catálogo sigue teniendo 231 claves.

### 7.4 Qué queda pendiente

Los puntos 3 a 8 de §4, en especial la reserva de barras proporcional al alto
(es lo que hace inservible el modo horizontal del teléfono: en el dispositivo del
reporte quedan 11 líneas por página) y el peso del arranque, que es la otra mitad
del síntoma: entre 6,5 s (creación de la barra) y ~12 s (paginación terminada) con
22 s de bloqueo acumulado del hilo principal.

Los cambios ya están publicados: GitHub Pages sirve
`reflow-book.js?v=136-viewport-sin-inflar`, `reflow.css?v=94-viewport-sin-inflar`
y el panel `?diag=1`.

## 8. Causa raíz principal: el viewport inflado por la tira multicolumna

Este es el error que explica el reporte original ("en Chrome de Android no se ve
bien"), y el único de la lista que **no aparece en escritorio**.

### 8.1 Síntoma reportado desde el dispositivo

El panel `?diag=1` en el teléfono mostró:

```
La barra de navegación termina en 1920px, por debajo del área visible 480px
viewport 4269x1920 dpr 1.5 horizontal vh=576 dvh=480
```

`window.innerWidth/innerHeight` (4269×1920) era **exactamente 4×** el viewport de
layout (≈1067×480), y por eso todo lo `position: fixed` aterrizaba en `y≈1920` de
una pantalla de 480 px: **la barra de menú no se veía**.

### 8.2 Causa

`#content` contiene el libro entero como una tira horizontal de columnas: medido,
**662.607 px de ancho** en el teléfono. Ese desbordamiento se recorta y se desplaza
dentro de `#content` (`overflow-x: auto`), pero Chromium lo sigue contando como el
desbordamiento de layout del documento y, en modo móvil, **infla el initial
containing block** hasta el mínimo de escala de página (0,25 → ×4).

Reproducción mínima: una página con `<meta name="viewport" content="width=device-width,
initial-scale=1">` y un solo `div` de 150.000 px de ancho ya devuelve la misma firma:

```
inner: 4268x1920 · layout: 1067x480 · icb: 4268x1920 · scrollWidth: 150000
```

En modo escritorio el ICB es el viewport sin importar el desbordamiento, y por eso
el libro se veía bien en la computadora. Es también la razón de que el error pasara
desapercibido: en el arnés de pantallas grandes (`isMobile: false`) nunca aparece.

### 8.3 Corrección

```css
body.reflow-book #content {
  /* … comentario completo en content/reflow.css … */
  contain: paint;
}
```

La contención de pintado saca el subárbol del desbordamiento del ancestro **sin
tocar el layout de columnas ni el scroll propio de la tira**. Se probaron y
descartaron `html, body { overflow: clip }` y envolver `#content` en un contenedor
con `overflow: hidden`: ninguno evita el inflado.

Además, el overlay de repaginación de cuestionarios dejó de colgar de `#content`
(ahora va a `body`, ubicación que el CSS ya contemplaba): dentro de una caja con
`contain: paint` un `position: fixed` se mide contra ella, y como la tira se
desplaza cientos de miles de píxeles, la tarjeta congelada aparecía corrida. Se
extendió la regla del overlay para que conserve `inset: 0` y el fondo blanco en las
dos ubicaciones.

### 8.4 Verificación (perfil del dispositivo: 1067×480, dpr 1.5, horizontal, modo móvil)

| Medición | Antes | Después |
|---|---|---|
| `window.innerWidth×innerHeight` | 4268×1920 | **1067×480** |
| Initial containing block | 4268×1920 | **1067×480** |
| Barra de navegación | `y 1856..1920`: **fuera de pantalla** | **`y 416..480`, visible y con opacidad 1** |
| Toque en "Siguiente" | imposible | **página 1 → 2** (`scrollLeft` 0 → 1067) |
| Paneles Índice / Herramientas | — | `0,8 288x400` y `779,8 288x400`, dentro de pantalla |
| Tarjeta de cuestionario | — | visible en pantalla (pág 74) |
| Overlay de repaginación | — | la tarjeta congelada coincide **exactamente** con la original |
| Páginas del libro | 964 (`vw` inflado ⇒ columnas de 4228 px) | 622 (columnas de 1027 px) |
| `#content` scrollWidth | 654.091 | 662.607 (intacto: el paginado no se rompió) |
| Errores de consola | 0 | 0 |

Regresiones: los cuatro perfiles Android quedan con `inner == layout` (coherente) y
la barra usable junto con el contenido; el arnés de pantallas grandes (FHD
1920×1080) sigue con `táctil<44px = 0` y los mismos contadores que antes.

### 8.5 Cambio de método en el arnés

`tools/screen-test/mobile-audit.mjs` ahora audita con **`isMobile: true`** (modo
móvil fiel a Chrome Android). La firma de "×4" que en la primera pasada se
descartó como artefacto de emulación **era este error del libro**. El arnés ahora
mide la coherencia entre `window.innerWidth` y el viewport de layout, y avisa si la
barra de navegación queda fuera del área visible o si el viewport está inflado.

El panel `?diag=1` también se ancló **arriba** (antes tapaba justamente la barra que
tiene que diagnosticar) y muestra `layout`, `pantalla` y una línea `coherencia ok /
INFLADO x4`.
