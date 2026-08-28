# Playbook — Adaptar un libro web a pantallas grandes interactivas (boards 65")

Guía reutilizable para repetir en **otro libro** el trabajo que se hizo aquí:
verificar y corregir que el lector se vea bien en pizarras interactivas de 65"
(16:9 apaisado, Android + Chrome, dedo y lápiz capacitivo), sin romper móvil,
ilustraciones, quizzes ni portada.

El flujo tiene dos piezas:

1. **Un arnés de pruebas** (`tools/screen-test/`) que audita el lector en varios
   viewports y genera capturas + métricas por página.
2. **Tres correcciones de CSS** apuntadas y aisladas al final de la hoja de
   estilos del lector.

---

## 0. Cuándo aplica

Estos libros son exportaciones "reflow" de Ceibal/UNICEF: una sola página
(`index.html`) que carga un JS (`assets/reflow-book.js`) y concatena todo el
libro dentro de `#content`, paginado con multicolumna CSS. La hoja de estilos
clave es **`content/reflow.css`** (generada por máquina, con mucho `!important`).

Si el libro objetivo tiene esa estructura, este playbook aplica casi tal cual.
Si no, sirve igual como método, pero los selectores concretos cambiarán.

---

## 1. Requisitos previos

- Node.js 20+ (probado en v24) y permiso para instalar paquetes locales.
- El repositorio del libro objetivo, servible localmente.
- Copiar la carpeta `tools/screen-test/` de este repo al repo del nuevo libro.

```powershell
# desde la raíz del nuevo libro
Copy-Item -Recurse <ruta-a-este-repo>\tools\screen-test tools\screen-test
cd tools\screen-test
npm install            # instala Playwright
npx playwright install chromium
```

Revisá `config.mjs`:
- **Viewports** representativos ya definidos: 4K 3840×2160, FHD 1920×1080 @1x y
  @2x, HD 1366×768, HD 1280×720. Ajustá si el board real es distinto.
- **Servidor local**: el arnés levanta el servidor del libro. Confirmá el
  comando/carpeta de arranque (`serve-local.js` / `run.mjs`) — debe servir la
  **raíz del repo** para que `#content` cargue el libro completo (si sirve la
  subcarpeta equivocada, `#content` queda vacío).

---

## 2. Instrucciones para darle al agente

Copiá y pegá esto como pedido inicial al agente que trabaje sobre el nuevo
libro. **Reemplazá `<RAÍZ-DEL-NUEVO-LIBRO>` por la ruta absoluta real** donde
copiaste el repo (por ejemplo `C:\Users\germa\Desktop\otro-libro`):

> Antes de empezar, leé completo el playbook en
> `<RAÍZ-DEL-NUEVO-LIBRO>\tools\screen-test\PLAYBOOK.md` y seguí sus pasos.
>
> Este repo es un libro web "reflow" (Ceibal/UNICEF) que debe verse bien en
> pizarras interactivas de 65" (16:9 apaisado, Android/Chrome, dedo y lápiz),
> además de en móvil. Quiero que:
>
> 1. Uses el arnés de pruebas en `<RAÍZ-DEL-NUEVO-LIBRO>\tools\screen-test\`
>    (ejecutá `node run.mjs` desde esa carpeta) para auditar el lector en todos
>    los viewports y me muestres capturas 4K de las páginas de solo texto,
>    ilustradas y de quiz. Las capturas quedan en
>    `<RAÍZ-DEL-NUEVO-LIBRO>\tools\screen-test\report\`.
> 2. Corrijas **solo** estos tres problemas, con cambios **aislados al final de
>    `<RAÍZ-DEL-NUEVO-LIBRO>\content\reflow.css`** (para no tocar la geometría
>    móvil, las ilustraciones, los quizzes ni la portada):
>    - **Ancho de línea (medida):** la prosa corre de borde a borde (~150+
>      caracteres en pantallas grandes). Limitala a una medida legible (~65
>      caracteres).
>    - **Legibilidad a distancia:** en boards muy grandes (`@media
>      (min-width: 100rem)`) subí el cuerpo del texto y la medida para lectura
>      desde el fondo del aula.
>    - **Objetivos táctiles ≥48px:** en pantallas grandes (`@media
>      (min-width: 72rem)`) llevá a 48px paginación, botones de paneles, radios
>      segmentados, switches y opciones de quiz.
> 3. Después de cada cambio, re-ejecutes el arnés y **verifiques con capturas**
>    que la paginación no se rompió y que el texto quedó uniforme.
> 4. No agregues dependencias nuevas al libro; el único archivo del libro que
>    debés modificar es `<RAÍZ-DEL-NUEVO-LIBRO>\content\reflow.css`.
>
> Ojo con estas trampas propias de este lector (documentadas en el playbook):
> las secciones `text_only` usan `display:contents` y el lector "eleva" la
> mayoría de los `<p>` a hijos directos de la sección, así que un tope por
> envoltorio no alcanza; hay que centrar la **sección entera**. Y sus reglas de
> ancho completo son `!important` con especificidad de un solo `#content`, así
> que para ganarles usá el truco `#content#content` (ID duplicado, mismo
> elemento, más especificidad).

---

## 3. Cómo correr el arnés

```powershell
cd tools\screen-test
node run.mjs                              # los 5 viewports (~6-7 min)
node run.mjs --viewport 4k-3840x2160-dpr1 # uno solo
node run.mjs --pages 30                   # limita el muestreo de páginas
```

Salida: `report/index.html` + PNGs por página/panel y `report/summary.json`.
Por viewport imprime: `táctil<44px`, `táctil<mm`, `separación`, `contraste`,
`overflow`, `zonaSegura`, `qrFail`.

**El objetivo de este trabajo es `táctil<44px = 0` en todos los viewports.**
`contraste`, `overflow` y `separación` suelen ser de contenido preexistente
(contraste medido dentro de ilustraciones, imágenes a sangre intencionales,
heurística de separación de párrafos) — no dependen de estas tres correcciones.

---

## 4. Las tres correcciones (referencia)

Todo va **al final de `content/reflow.css`** para que el orden de cascada las
haga ganar. Ver el bloque real en este repo (después de la línea ~5606) como
plantilla. Resumen:

### 4.1 Medida de lectura
- Token base: `--reflow-text-measure` a un valor tipo `42rem`.
- Páginas **sin arte** (`section[data-section-type="text_only"]`): centralas
  como bloque —
  `display:block; max-width:var(--reflow-text-measure); margin-inline:auto` —
  usando `#content#content …` para ganar especificidad. Esto captura también los
  `<p>` "elevados".
- Páginas **con arte** (`text_and_single_image`, `text_and_images`,
  `boxed_text`): NO toques la sección; limitá solo el envoltorio de prosa
  (`div:has(> p)`), excluyendo las clases de copia ilustrada
  (`:not(.illustrated-copy)…`) para que la imagen siga a ancho completo.

### 4.2 Legibilidad a distancia (`@media (min-width: 100rem)`)
- Subí `--reflow-body-size` (p. ej. a `1.5rem`/24px), títulos y subtítulos, y
  **ensanchá la medida** (p. ej. `52rem`) para que la columna llene más pantalla
  y no quede como una isla estrecha en 4K.

### 4.3 Objetivos táctiles ≥48px (`@media (min-width: 72rem)`)
- `min-height: 3rem` en paginación, botones de lista/índice de paneles,
  cabeceras de panel, glosario y "reducir movimiento".
- Radios segmentados (`[role="radio"]`): `inline-flex` + `min-height:3rem`.
- Switches (`[role="switch"]`): agrandá el área de toque a 3rem con padding,
  manteniendo la **pista visible idéntica** vía `background-clip:content-box`.
- Opciones de quiz (`.quiz-option`): `min-height:3rem` y agrandá el radio nativo
  (y su columna de grilla).

> Si el arnés marcaba radios de quiz como <44px, revisá que la auditoría mida el
> **`<label>` que envuelve** al input (target-size WCAG), no el input desnudo.
> En este repo eso está resuelto en `audits.mjs` (`effectiveRect`).

---

## 5. Verificación (obligatoria antes de dar por hecho)

1. `táctil<44px = 0` en los 5 viewports.
2. Capturas 4K de: página **solo texto** (todos los párrafos centrados y
   uniformes, ~65 car.), página **ilustrada** (imagen a ancho completo, prosa
   acotada), página de **quiz** (tarjeta centrada, radios legibles).
3. **La paginación no se rompió**: los números "N / total" avanzan y no hay
   texto perdido ni columnas partidas (cambiar `display:contents`→`block` en
   `text_only` es el punto de mayor riesgo — hay que mirar capturas).
4. Móvil intacto: en anchos chicos la columna ya es más angosta que la medida,
   así que las reglas deben ser no-ops; confirmalo con un viewport chico.

---

## 6. Commit

Estilo del repo: mensajes en español, en imperativo, concisos, sin prefijos de
scope. Dos commits limpios:

```powershell
git add tools/screen-test
git commit -m "Agrega arnes de pruebas visuales multi-viewport"

git add content/reflow.css
git commit -m "Adapta el lector a pantallas grandes interactivas"

git push origin master
```

El `.gitignore` del arnés ya excluye `node_modules/` y `report/` (capturas
generadas), así que solo se versiona el código fuente del arnés.

---

## 7. Puntos de decisión que conviene consultar al usuario

- **Tamaño de la medida a 4K**: 52rem/24px es un punto de partida; puede
  quererse más grande (llenar más pantalla) o más angosto (tipo libro). Es un
  solo valor dentro del `@media (min-width: 100rem)`.
- **Páginas ilustradas a 4K**: la prosa queda arriba-izquierda y pequeña frente
  a una ilustración enorme. Opcional: centrar verticalmente la prosa respecto a
  la imagen y/o subir un punto el cuerpo en esas secciones. Es más invasivo;
  dejarlo salvo pedido explícito.
