# Tokens de EVA e íconos de interfaz

Referencia para el trabajo de la revisión UX (puntos 3, 18, 19, 24). La paleta se
transcribió de la lámina `Color.png` del sistema de diseño (export de Figma,
4765 × 6235 px): los valores están tomados de los hex que muestra cada muestra.

## Escala institucional

| Token | Hex |
|---|---|
| `eva-color-institucional-100` | `#CCECEA` |
| `eva-color-institucional-200` | `#99D9D5` |
| `eva-color-institucional-300` | `#66C6C0` |
| `eva-color-institucional-400` | `#00A096` |
| `eva-color-institucional-500` | `#008078` |
| `eva-color-institucional-600` | `#00635D` |
| `eva-color-institucional-700` | `#00504B` |
| `eva-color-institucional-800` | `#00403C` |
| `eva-color-institucional-900` | `#00302D` |

Coincide con la escala que ya trae el ADT (`--ceibal-institutional-*`): los
valores son los mismos, cambia el nombre.

## Escala de grises

| Token | Hex |
|---|---|
| `eva-color-grey-50` | `#FCFCFC` |
| `eva-color-grey-100` | `#E1E3E6` |
| `eva-color-grey-200` | `#C4C7CC` |
| `eva-color-grey-300` | `#A6AAB3` |
| `eva-color-grey-400` | `#898E99` |
| `eva-color-grey-500` | `#6B7280` |
| `eva-color-grey-600` | `#565B66` |
| `eva-color-grey-700` | `#40444D` |
| `eva-color-grey-800` | `#2B2E33` |
| `eva-color-grey-900` | `#15171A` |

La escala del ADT es gris azulada y no coincide: el punto 18 la reemplaza por
esta.

## Íconos

Los SVG viven en `assets/icons/`. El libro los usa **embebidos** en
`reflow-book.js` (así heredan `currentColor` y no suman pedidos), y los archivos
quedan como pieza de diseño para revisión o reemplazo.

### Tamaños del set de EVA

El export trae cada ícono en ocho tamaños con nombre propio (`eva-icon-size-…`),
que es también la escala en la que se piden los que faltan:

| Token | Lado |
|---|---|
| `eva-icon-size-xs` | 12 px |
| `eva-icon-size-sm` | 16 px |
| `eva-icon-size-xmd` | 18 px |
| **`eva-icon-size-md`** | **24 px** ← el que usa la interfaz (punto 24) |
| `eva-icon-size-lg` | 32 px |
| `eva-icon-size-xl` | 48 px |
| `eva-icon-size-xxl` | 64 px |
| `eva-icon-size-0-99` | 100 px ← el que se usa para trazar el SVG |

| Archivo | Qué es | Origen |
|---|---|---|
| `eva-arrow-right.svg` | flecha siguiente | derivada del export de EVA (`size=eva-icon-size-0-99.png`, 100 px) midiendo su geometría: caja 11–88 × 27–73, asta de 13 px, remates de la cabeza en (69, 33,5) y (69, 66,5), punta en (81,5, 50) |
| `eva-arrow-left.svg` | flecha anterior | espejo exacto de la derecha |
| `glossary-book.svg` | libro abierto con «Aa» | dibujado para el libro: no existe un ícono equivalente en el set de EVA. Sigue la propuesta del documento de revisión (libro abierto con «Aa» encima) |

### Íconos pedidos al equipo (puntos 18 y 19)

La interfaz todavía usa caracteres de texto para estos ocho. Se piden en dos
tamaños: **`md` (24 px)**, que es el tamaño de uso y sirve de referencia para la
prueba visual, y **`0-99` (100 px)**, que es el que se mide para trazar el SVG.

| Ícono | Dónde se usa | Hoy es |
|---|---|---|
| Menú (hamburguesa) | barra · «Índice» | `☰` |
| Herramientas (engranaje) | barra · «Herramientas» y reproductor de voz | `⚙` |
| Cerrar | encabezado de los paneles | `×` |
| Reproducir | reproductor de voz | `▶` |
| Pausa | reproductor de voz (encendido) | texto «Pausa» |
| Detener | reproductor de voz | `■` |
| Audio anterior | reproductor de voz | `⏮` |
| Audio siguiente | reproductor de voz | `⏭` |

Opcionales: chevron izquierdo y derecho (para el «volver» de los paneles),
altavoz (botón «Voz y velocidad») y lupa (buscador del glosario).

### Verificación de la flecha

`tools/screen-test/verify-icons.mjs` rasteriza el SVG a 100 px y lo compara con
el export de EVA:

- caja contenedora: 11–87 × 27–72 contra 11–88 × 27–73 (1 px de diferencia, por
  el antialias del raster de referencia);
- área: 1497 px contra 1487 px (100,7 %);
- solapamiento de siluetas (IoU): 87,8 %, con un piso exigido de 85 % — el
  antialias del PNG de referencia engorda la silueta, así que el solapamiento
  puro no llega al 100 % ni con la misma geometría;
- la flecha izquierda es el espejo de la derecha al 100,0 %.

La referencia queda en `tools/screen-test/fixtures/eva-arrow-right-100.png`.
