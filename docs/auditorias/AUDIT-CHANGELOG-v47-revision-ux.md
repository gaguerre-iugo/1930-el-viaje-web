# Changelog — Revisión UX (documento de msuarez)

Registro de los 25 puntos de `Revision_UX_1930_msuarez.docx` a medida que se
implementan. El plan completo está en `PLAN-REVISION-UX-msuarez.md`.

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
