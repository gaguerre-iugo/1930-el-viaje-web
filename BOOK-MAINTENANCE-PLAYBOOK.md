# Manual de mantenimiento para libros web reflowables

Este documento reúne acciones reutilizables para mantener exportaciones web/SCORM de libros similares a **1930: El viaje**. Cada receta debe poder aplicarse a otro proyecto después de revisar sus rutas, su estructura y sus excepciones.

## Principios de trabajo

1. Crear un repositorio Git y un commit base antes de modificar el libro.
2. Auditar primero; no asumir que la apariencia visible refleja todas las reglas presentes en los archivos.
3. Modificar tanto las páginas originales como cualquier copia incluida en el paquete offline.
4. No alterar fuentes de iconos, recursos de terceros ni archivos generados sin verificar para qué se usan.
5. Validar estáticamente los archivos y comprobar el resultado final en un navegador.
6. Registrar aquí cada acción nueva con su objetivo, procedimiento, validaciones y forma de reversión.

---

## Acción 1: unificar toda la tipografía en Atkinson Hyperlegible

### Objetivo

Usar **Atkinson Hyperlegible** como única tipografía editorial en títulos, subtítulos, párrafos, cuestionarios, navegación y controles. Eliminar familias heredadas como Merriweather, Georgia, Times y Verdana.

Las fuentes de iconos —por ejemplo, Font Awesome— se conservan porque no representan texto editorial y eliminarlas rompe los iconos de la interfaz.

### Áreas que deben revisarse

- Todos los archivos HTML del libro.
- La hoja que declara las fuentes, normalmente `assets/fonts.css`.
- La salida compilada de Tailwind, normalmente `content/tailwind_output.css`.
- Las hojas de presentación y reflow.
- Clases como `font-serif`, `font-mono` y valores arbitrarios como `font-[Georgia,serif]`.
- Atributos `style` y bloques `<style>` dentro de cada página.
- El preloader portátil, normalmente `assets/offline-preloader.js`.
- Los archivos `.woff`, `.woff2`, `.ttf` u `.otf` que ya no se utilicen.

### Auditoría inicial

Desde la raíz del proyecto:

```powershell
rg -n -i "font-family|@font-face|font-serif|font-mono|Merriweather|Verdana|Georgia|Times New Roman|Times_New_Roman" `
  -g "*.html" -g "*.css" -g "*.js" .

Get-ChildItem -Recurse -File -Include *.woff,*.woff2,*.ttf,*.otf |
  Select-Object FullName, Length
```

Excluir del reemplazo las hojas de iconos y revisar manualmente los resultados procedentes de dependencias minificadas.

### Declaración central recomendada

Mantener únicamente los bloques `@font-face` de Atkinson Hyperlegible y definir todas las variables tipográficas con la misma familia:

```css
:root {
  --font-sans: "Atkinson Hyperlegible", sans-serif;
  --font-serif: "Atkinson Hyperlegible", sans-serif;
  --font-mono: "Atkinson Hyperlegible", sans-serif;
  --default-font-family: "Atkinson Hyperlegible", sans-serif;
  --default-mono-font-family: "Atkinson Hyperlegible", sans-serif;
}

html, body, main, section, article, header, footer, nav, aside,
p, h1, h2, h3, h4, h5, h6, span, div, a, label, button,
input, textarea, select, option, li, dt, dd, blockquote,
figcaption, table, th, td, small, strong, em, code, pre {
  font-family: "Atkinson Hyperlegible", sans-serif !important;
}
```

No incluir `i` ni selectores de Font Awesome en esta regla global.

### Limpieza de las páginas

En cada HTML:

1. Sustituir declaraciones `font-family` heredadas por Atkinson Hyperlegible.
2. Cambiar `font-serif` y `font-mono` por `font-sans`, o hacer que todas esas variables resuelvan a Atkinson.
3. Eliminar valores arbitrarios que nombren otra familia.
4. Conservar tamaños, pesos, cursivas, interlineados y demás decisiones editoriales.
5. Comprobar que las entidades HTML como `&apos;` no provoquen reemplazos parciales.

Los reemplazos masivos deben hacerse con codificación UTF-8 sin BOM y escribiendo únicamente archivos cuyo contenido realmente cambió.

### Tailwind y CSS compilado

Actualizar las variables `--font-sans`, `--font-serif` y `--font-mono` dentro de la salida compilada. También deben retirarse las listas de fallback que nombren Georgia, Times, fuentes del sistema o familias monoespaciadas.

No es suficiente con añadir una regla visual posterior: la auditoría final no debe encontrar referencias tipográficas editoriales obsoletas en los archivos activos.

### Paquete offline

Algunas exportaciones guardan copias serializadas de los HTML dentro de `assets/offline-preloader.js`. Después de cambiar las páginas:

1. Regenerar el preloader con la herramienta original del proyecto, si está disponible.
2. Si no existe el generador, resincronizar sus entradas HTML desde los archivos actuales sin modificar el resto del runtime.
3. Verificar que el JavaScript siga siendo válido y que el libro funcione tanto por HTTP como mediante la apertura portátil prevista por el proyecto.

### Eliminación de archivos de fuente

Eliminar únicamente los archivos tipográficos cuya ausencia haya sido comprobada mediante búsqueda. En esta acción se retiraron:

```text
assets/fonts/Merriweather-VariableFont.woff2
assets/fonts/Merriweather-Italic-VariableFont.woff2
```

No eliminar los archivos ubicados bajo `assets/libs/fontawesome/`.

### Validación estática

La búsqueda siguiente debe devolver cero resultados en los archivos activos del libro:

```powershell
rg -n -i "Merriweather|Verdana|Georgia|Times New Roman|Times_New_Roman|font-serif|font-mono|font-\[Georgia" `
  -g "*.html" .
```

Repetir la búsqueda en CSS y JavaScript, excluyendo documentación histórica, dependencias de terceros y fuentes de iconos solamente cuando esas exclusiones estén justificadas.

Verificar además:

```powershell
git diff --check
git status --short
```

### Validación en navegador

1. Servir el proyecto mediante HTTP local.
2. Abrir `index.html`.
3. Esperar a que `document.fonts.ready` se resuelva.
4. Inspeccionar la familia calculada de todos los elementos con texto.
5. Confirmar que Atkinson esté cargada y que no existan excepciones.
6. Revisar títulos, páginas narrativas, cuestionarios, navegación y configuración.
7. Tomar una captura de referencia.

Una comprobación equivalente desde la consola del navegador es:

```javascript
await document.fonts.ready;

const selector = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a",
  "label", "button", "input", "textarea", "select", "option", "li",
  "dt", "dd", "blockquote", "figcaption", "th", "td", "small",
  "strong", "em", "code", "pre"
].join(",");

const violations = [...document.querySelectorAll(selector)]
  .filter((element) => (element.textContent || element.value || "").trim())
  .map((element) => ({
    element,
    family: getComputedStyle(element).fontFamily
  }))
  .filter(({ family }) =>
    !family.toLowerCase().includes("atkinson hyperlegible")
  );

console.table(violations);
```

El resultado esperado es una lista vacía.

### Resultado obtenido en este proyecto

- 190 páginas HTML actualizadas.
- 207 secciones del libro cargadas durante la prueba.
- 4.769 elementos de texto inspeccionados.
- 26 encabezados comprobados.
- Cero familias tipográficas editoriales distintas de Atkinson Hyperlegible.
- Dos archivos Merriweather eliminados, con una reducción aproximada de 4,7 MB.
- Paquete offline resincronizado.

### Reversión

Antes de confirmar los cambios, se puede inspeccionar o descartar esta acción mediante Git. Después de crear el commit, revertirla con un commit de reversión, sin reescribir el historial compartido.

---

## Acción 2: limitar los pesos tipográficos a 400 y 700

### Objetivo

Solicitar únicamente los pesos que existen como archivos embebidos de Atkinson Hyperlegible:

- `400`: texto regular.
- `700`: texto en negrita.

Evitar que el navegador sintetice pesos inexistentes, cuyo aspecto puede variar entre motores y sistemas operativos.

### Áreas que deben revisarse

- Bloques `@font-face` y archivos tipográficos disponibles.
- Clases Tailwind de peso presentes en todos los HTML.
- Valores `font-weight` inline y dentro de bloques `<style>`.
- Variables de peso en la salida compilada de Tailwind.
- Reglas de peso en las hojas de reflow.
- Estilos del runtime de interfaz.
- Copias serializadas dentro del paquete offline.

### Correspondencia de pesos

Aplicar esta normalización:

| Peso solicitado | Peso disponible |
| ---: | ---: |
| 100, 200, 300 | 400 |
| 400 | 400 |
| 500 | 400 |
| 600 | 700 |
| 700 | 700 |
| 800, 900 | 700 |

Para clases Tailwind:

- `font-thin`, `font-extralight`, `font-light` y `font-medium` → `font-normal`.
- `font-semibold`, `font-extrabold` y `font-black` → `font-bold`.

### Refuerzo CSS recomendado

```css
.font-thin, .font-extralight, .font-light,
.font-normal, .font-medium {
  font-weight: 400 !important;
}

.font-semibold, .font-bold, .font-extrabold, .font-black {
  font-weight: 700 !important;
}
```

Este refuerzo protege contenido generado dinámicamente, pero no reemplaza la limpieza de las fuentes HTML y CSS.

### Procedimiento

1. Confirmar mediante `@font-face` cuáles son los pesos realmente embebidos.
2. Contar las clases y declaraciones que solicitan otros valores.
3. Normalizar los HTML según la correspondencia anterior.
4. Actualizar las variables `--font-weight-*` de Tailwind.
5. Normalizar las reglas explícitas de reflow y del runtime.
6. Resincronizar el paquete offline desde los archivos modificados.
7. Verificar que no queden solicitudes activas de otros pesos.

### Validación estática

```powershell
rg -n -i "font-weight\s*:\s*(100|200|300|500|600|800|900)" `
  -g "*.html" -g "*.css" -g "*.js" .

rg -n "font-(thin|extralight|light|medium|semibold|extrabold|black)" `
  -g "*.html" .
```

Revisar por separado dependencias, mapas de fuentes y documentación histórica antes de excluirlos de la auditoría.

### Validación en navegador

Después de `document.fonts.ready`, recorrer todos los elementos con texto y agrupar `getComputedStyle(element).fontWeight`. El conjunto de resultados permitido es únicamente:

```text
400
700
```

También se deben revisar títulos, botones, cuestionarios, menús, mensajes y paneles de configuración.

### Resultado obtenido en este proyecto

- Todas las solicitudes editoriales fueron normalizadas a 400 o 700.
- Se actualizaron páginas, estilos, Tailwind y el runtime de interfaz.
- El paquete offline quedó resincronizado.
- Se conservaron las diferencias semánticas entre texto regular y negrita.

### Riesgos y excepciones

- No convertir todo el libro a un único peso: se perdería la jerarquía visual.
- No modificar pesos usados exclusivamente para dibujar iconos.
- Si en otro proyecto se incorporan archivos reales para 300, 500, 600 u 800, actualizar esta receta antes de aplicarla.

### Reversión

Revertir el commit correspondiente mediante Git. Si se añaden nuevos archivos de peso en el futuro, restaurar las clases originales solamente después de declarar correctamente sus respectivos `@font-face`.

---

## Acción 3: aplicar tamaños mínimos de texto y controles

### Objetivo

Evitar textos de interfaz difíciles de leer y dar una jerarquía consistente a los controles:

- `16 px` como mínimo para información secundaria, etiquetas y metadatos.
- `18 px` como mínimo para controles importantes y sus opciones interactivas.

### Áreas que deben revisarse

- Metadatos editoriales, como fechas y remitentes de conversaciones.
- Barra principal del lector.
- Paneles de navegación, configuración, texto a voz y glosario.
- Etiquetas y opciones de cuestionarios, incluso en reglas responsivas.
- Contenedores cuyo tamaño calculado puede ser menor aunque todo su texto visible esté en descendientes más grandes.
- Copias serializadas dentro del paquete offline.

### Procedimiento

1. Auditar en el navegador los elementos visibles que contienen texto directo y registrar su tamaño calculado.
2. Clasificar cada caso como texto secundario, control importante, contenido principal o elemento oculto semántico.
3. Elevar etiquetas y metadatos secundarios a un mínimo de `1rem`.
4. Elevar los controles importantes a `1.125rem` y conservar una altura táctil adecuada.
5. Usar `max(1rem, calc(1rem * var(--reflow-font-scale)))` cuando el texto secundario deba crecer con la preferencia tipográfica sin bajar nunca de 16 px.
6. Revisar reglas para pantallas bajas o estrechas para que no vuelvan a reducir el texto por debajo del mínimo.
7. Resincronizar el paquete offline y repetir la auditoría en el navegador.

### Validación estática

Buscar tamaños explícitos inferiores a los mínimos en los estilos activos y revisar cada resultado según su función:

```powershell
rg -n "font-size:\s*(\.(7|8|9)[0-9]*rem|1[0-5](\.[0-9]+)?px)" `
  -g "*.css" -g "*.html" content assets .
```

Las utilidades generadas pueden conservar valores pequeños si las reglas de reflow las sustituyen de forma comprobable. No basta con reemplazar texto dentro del CSS compilado sin verificar qué regla gana en el navegador.

### Validación en navegador

- Esperar a que finalicen la carga de fuentes y la paginación.
- Medir elementos visibles con nodos de texto directos para evitar falsos positivos de contenedores.
- Confirmar que el texto secundario visible sea de al menos 16 px.
- Confirmar que los controles importantes sean de al menos 18 px.
- Abrir los paneles de navegación, configuración, voz y glosario para medir también su contenido dinámico.
- Repetir la comprobación con una ventana estrecha y confirmar que no haya recortes ni solapamientos.
- Registrar el nuevo total de páginas, ya que un aumento de tamaño puede cambiar la paginación.

### Riesgos y excepciones

- `.reflow-scene-separator` conserva `font-size: 0`: su frase existe para lectura semántica y los asteriscos visibles se dibujan con pseudo-elementos. Mostrar ambos produciría contenido duplicado.
- Un contenedor puede informar menos de 16 px sin renderizar texto propio. Si sus descendientes visibles cumplen el mínimo, no debe modificarse solo para silenciar la auditoría.
- Aumentar controles puede exigir más espacio horizontal; comprobar siempre estados abiertos y ventanas estrechas.
- No reducir altura, espaciado o área táctil para compensar el aumento de fuente.

### Resultado obtenido en este proyecto

- Metadatos de chat elevados a un mínimo de 16 px.
- Controles principales y opciones interactivas relevantes elevados a 18 px.
- Etiquetas secundarias de los paneles normalizadas a 16 px.
- Separadores semánticos conservados como excepción documentada.
- Identificador de caché actualizado y copia offline de `index.html` resincronizada.

### Reversión

Revertir el commit correspondiente mediante Git. Si se ajustan estos mínimos en otro proyecto, conservar las excepciones semánticas y volver a validar la paginación y el diseño responsivo.

---

## Acción 4: asegurar áreas táctiles de 44–48 px

### Objetivo

Ofrecer objetivos fáciles de activar con tacto, ratón o puntero:

- `44–48 px` como dimensión recomendada para controles importantes.
- `24 × 24 CSS px` como mínimo absoluto para objetivos operables por el usuario.

La medición corresponde al área interactiva completa, no al icono o indicador visual contenido dentro de ella.

### Áreas que deben revisarse

- Barra principal, flechas y paginación.
- Pestañas y opciones de navegación.
- Búsquedas, glosario, idioma y configuración.
- Interruptores y grupos de opciones.
- Tarjetas de respuesta y botones de envío de cuestionarios.
- Controles compactos que aparecen únicamente al abrir paneles.

### Procedimiento

1. Recorrer todos los elementos interactivos visibles y medir su `getBoundingClientRect()`.
2. Medir la etiqueta pulsable completa cuando un `input` esté contenido en un `<label>`; el círculo del radio no representa por sí solo el objetivo efectivo.
3. Clasificar por separado controles internos, ocultos o no destinados a interacción directa.
4. Elevar los controles principales a un área efectiva de entre 44 y 48 px.
5. Si el paginador aplica una transformación de escala, definir un mínimo previo suficientemente grande para que la medida final siga siendo de al menos 44 px.
6. En interruptores, ampliar el elemento interactivo y de foco sin deformar la pista visual de 40 × 24 px.
7. Abrir cada panel y repetir la medición; después comprobar el diseño en una ventana estrecha.

### Refuerzo CSS recomendado

```css
.quiz-option,
.quiz-submit {
  min-height: 3rem; /* conserva al menos 44 px tras un escalado leve */
}

[role="switch"] {
  box-sizing: border-box;
  width: 2.75rem;
  height: 2.75rem;
  padding: .5625rem .0625rem;
  background-clip: content-box;
}
```

El relleno del interruptor forma parte del objetivo real. `background-clip: content-box` mantiene la pista visual en su tamaño original.

### Validación estática

Buscar dimensiones pequeñas en controles y revisar las reglas responsivas que puedan reducirlas:

```powershell
rg -n "(min-)?(width|height):\s*([0-9]|1[0-9]|2[0-3])px" `
  -g "*.css" -g "*.html" content assets .
```

Esta búsqueda es orientativa: el cumplimiento debe decidirse mediante el objetivo efectivo calculado en el navegador.

### Validación en navegador

- Medir botones, enlaces, etiquetas pulsables, campos, pestañas, radios e interruptores.
- Confirmar que ningún objetivo destinado al usuario mida menos de `24 × 24 CSS px`.
- Confirmar que los controles principales queden entre 44 y 48 px como mínimo en su dimensión corta.
- Abrir navegación, glosario, idioma, voz y configuración.
- Probar cuestionarios antes y después de responder.
- Verificar foco, estados activos y ausencia de solapamientos.

### Resultado obtenido en este proyecto

- Opciones y botones de cuestionario elevados para conservar al menos 44 px después del escalado del paginador.
- Pestañas de navegación ampliadas a la franja recomendada.
- Interruptores con objetivo y foco de 44 × 44 px, conservando su pista visual de 40 × 24 px.
- Barra principal, navegación, búsqueda y glosario conservados porque ya cumplían la recomendación.
- Controles internos de control de calidad de 1 px excluidos por no ser objetivos operables de la interfaz.

### Riesgos y excepciones

- No evaluar solamente el radio nativo cuando toda la tarjeta `<label>` es pulsable.
- No agrandar iconos para simular un área táctil mayor: debe crecer el elemento interactivo real.
- Los enlaces integrados en frases pueden estar sujetos a excepciones normativas, pero conviene mantener separación suficiente siempre que el diseño lo permita.
- Un aumento de altura puede modificar la paginación o el espacio disponible en paneles bajos.

### Reversión

Revertir el commit correspondiente mediante Git y restaurar el identificador de caché anterior. Después de revertir, volver a medir los objetivos efectivos, no solo sus iconos.

---

## Acción 5: garantizar la carga y el renderizado efectivo de Atkinson

### Objetivo

Comprobar que Atkinson Hyperlegible no solo figure en CSS, sino que sus archivos se carguen y que la familia calculada de la interfaz sea realmente Atkinson en servidor, ejecución local y paquete SCORM.

### Áreas que deben revisarse

- Dígitos distintivos: el `3` del contador y el `0` del título «1930».
- Índice, pestañas, botones, formularios y actividades.
- Pesos 400 y 700, incluida la cobertura de caracteres en español.
- Carga mediante servidor HTTP, apertura local y LMS/SCORM.
- Reglas de Tailwind, componentes base y estilos incrustados.
- Caché del CSS, del validador y de los archivos WOFF2.

### Procedimiento

1. Versionar la URL de `assets/fonts.css` y las URLs WOFF2 para invalidar copias anteriores de caché.
2. Precargar las caras latinas 400 y 700 desde cada documento completo.
3. Mantener una regla global con `!important` que cubra texto editorial y controles, incluidas funciones ARIA.
4. Esperar `document.fonts.ready`, solicitar ambas caras con `document.fonts.load()` y confirmarlas con `document.fonts.check()`.
5. Recorrer los controles visibles y comparar su `font-family` calculada con `Atkinson Hyperlegible`.
6. Repetir la auditoría cuando se incorporen controles dinámicos y después de interacciones del usuario, sin observar las animaciones continuas del paginador.
7. Incluir CSS, validador y los cuatro WOFF2 en `imsmanifest.xml`.
8. Sincronizar las páginas serializadas dentro del paquete de ejecución offline.

### Archivos modificados o añadidos

- `assets/fonts.css`: versionado de fuentes y cobertura reforzada de controles.
- `assets/font-validation.js`: auditoría automática en tiempo de ejecución.
- Todos los HTML completos: precargas, CSS versionado y carga del auditor.
- `assets/offline-preloader.js`: copia sincronizada de los HTML.
- `imsmanifest.xml`: recursos tipográficos declarados para SCORM.

El fragmento `content/navigation/nav.html` no carga hojas ni scripts por sí mismo: hereda los recursos del documento que lo contiene.

### Validación estática

Comprobar que cada HTML completo contiene las dos precargas, la hoja versionada y el validador; que el manifiesto enumera los seis recursos tipográficos; y que no quedan enlaces directos sin versionar:

```powershell
rg -l 'fonts.css\?v=2-atkinson-runtime' -g '*.html' .
rg -l 'font-validation.js\?v=4-atkinson-runtime' -g '*.html' .
rg -n '<file href="assets/(fonts.css|font-validation.js|fonts/Atkinson)' imsmanifest.xml
rg -n 'href="./assets/fonts.css"' -g '*.html' .
```

Los WOFF2 deben existir, empezar con la firma `wOF2` y servirse como `font/woff2`.

### Validación automática en navegador

Después de cargar una página, inspeccionar:

```javascript
document.documentElement.dataset.atkinsonFontAudit
JSON.parse(document.documentElement.dataset.atkinsonFontAuditDetails)
```

El primer valor debe ser `pass`. El segundo conserva fecha, caras ausentes y controles infractores. Cuando el entorno permite ampliar `window`, el mismo informe también queda disponible en `window.__ATKINSON_FONT_AUDIT__`. Además, cada ejecución emite el evento `atkinson-font-audit`; un fallo queda registrado en la consola.

Para una comprobación puntual:

```javascript
document.fonts.check('400 16px "Atkinson Hyperlegible"', '30 áéíóúñ¿¡')
document.fonts.check('700 16px "Atkinson Hyperlegible"', '1930')
getComputedStyle(document.querySelector('output')).fontFamily
```

### Resultado obtenido en este proyecto

- Las caras esenciales 400 y 700 se solicitan antes del renderizado normal y se validan después de cargarse.
- El contador, «1930» y los controles se incluyen explícitamente en el criterio automático.
- La auditoría vuelve a ejecutarse cuando aparecen paneles, actividades o controles dinámicos y después de interacciones del usuario.
- Las fuentes y el validador forman parte del manifiesto SCORM.
- Las URLs versionadas evitan reutilizar indefinidamente una versión anterior de `fonts.css` o de los WOFF2.

### Riesgos y excepciones

- La precarga no sustituye una prueba real dentro del LMS usado en producción.
- Un icono dibujado mediante una fuente de iconos no debe confundirse con texto de interfaz; el auditor revisa controles, no cada glifo decorativo descendiente.
- Si se cambia el contenido de CSS, JavaScript o WOFF2, incrementar su identificador de versión en todas las páginas y volver a sincronizar el paquete offline.
- Una interfaz que se mantenga con la fuente de respaldo producirá estado `fail`; la UI continúa operativa para no bloquear el contenido.

### Reversión

Revertir el commit correspondiente. Si se revierte parcialmente, eliminar también las referencias del manifiesto, las precargas, el script de auditoría y restaurar de forma coherente los identificadores de caché.

---

## Acción 6: preservar la capitalización editorial sin transformaciones CSS

### Objetivo

Mostrar la interfaz y las actividades en formato oración y conservar únicamente las mayúsculas que estén escritas de forma intencional en el contenido. CSS y los componentes no deben transformar automáticamente nombres propios, siglas ni textos históricos.

### Áreas que deben revisarse

- Etiquetas de accesibilidad, especialmente «Lectura en voz alta», «Tamaño de letra» y «Descripción de imágenes».
- Encabezados de navegación, configuración, índice y actividades.
- Clases utilitarias `uppercase`, `capitalize` y `lowercase`.
- Declaraciones `text-transform` en CSS general, estilos de reflujo y estilos incrustados.
- Componentes compilados que construyen clases dinámicamente.
- Copias de HTML, traducciones y componentes incluidas en el paquete offline.

### Procedimiento

1. Buscar declaraciones `text-transform` y utilidades que modifiquen la capitalización.
2. Eliminar `uppercase` de documentos y componentes; no convertir el texto fuente a minúsculas de forma mecánica.
3. Eliminar las declaraciones `text-transform: uppercase` del CSS compilado y del CSS de reflujo.
4. Aplicar `text-transform: none !important` como protección contra estilos incrustados o componentes de terceros.
5. Normalizar las etiquetas de interfaz en el archivo de traducciones.
6. Versionar CSS y JavaScript modificados y resincronizar el paquete offline.
7. Revisar por separado las mayúsculas escritas en el contenido y registrar las excepciones editoriales.

### Excepciones editoriales de este proyecto

Estas excepciones se conservan como texto fuente, nunca mediante transformación CSS:

- Siglas institucionales: `ANEP` y `UTEC`.
- Títulos y divisores cuya composición original usa mayúsculas, por ejemplo `EL VIAJE`, `CAPÍTULO 4` y `CONTENIDO`.
- Identificadores de hablantes en conversaciones reproducidas gráficamente, como `JAVI` y `FEDE`.
- Rótulos históricos o reproducidos desde la obra, como `CONTE VERDE`.
- Créditos y nombres escritos originalmente en mayúsculas cuando la decisión editorial esté confirmada.

Los nombres propios dentro del texto narrativo —por ejemplo Javier, Federica, Josephine Baker o Conte Verde— mantienen su capitalización lingüística normal.

### Archivos modificados

- `content/reflow.css` y `content/tailwind_output.css`.
- `assets/tailwind_css.css`.
- `assets/base.bundle.local.js` y `assets/base.bundle.min.js`.
- `assets/interface_translations/es-UY/interface_translations.json`.
- HTML que contenían la utilidad `uppercase` y referencias compartidas versionadas.
- `assets/offline-preloader.js`.

### Validación estática

```powershell
rg -n -i "text-transform\s*:\s*uppercase" -g "*.css" .
rg -n "\buppercase\b" -g "*.html" .
rg -n "uppercase" assets/base.bundle.local.js assets/base.bundle.min.js
```

La primera y segunda búsquedas deben devolver cero resultados. En los bundles puede permanecer la palabra `uppercase` únicamente como metadato interno de Tailwind; no debe formar parte de ningún `className` renderizado.

### Validación en navegador

1. Abrir configuración, navegación, índice y al menos una actividad.
2. Confirmar que las etiquetas usan formato oración.
3. Recorrer los elementos textuales visibles y comprobar que `getComputedStyle(element).textTransform` sea `none`.
4. Confirmar que siglas y excepciones editoriales siguen en mayúsculas porque así están escritas en el DOM.

### Resultado obtenido en este proyecto

- «Lectura en voz alta», «Tamaño de letra» y «Descripción de imágenes» quedan en formato oración.
- Se eliminaron las transformaciones automáticas de páginas, actividades, navegación y configuración.
- Las mayúsculas editoriales se conservan en el texto fuente.
- Una regla protectora impide que Tailwind o un componente vuelva a imponer capitalización.

### Riesgos y excepciones

- No convertir masivamente textos escritos en mayúsculas: puede destruir siglas, nombres o decisiones de la edición original.
- Una excepción nueva debe documentarse y escribirse explícitamente en el contenido.
- Si se recompila Tailwind o el componente base, repetir la búsqueda estática y comprobar que no reaparezcan utilidades activas.

### Reversión

Revertir el commit correspondiente y restaurar conjuntamente los identificadores de caché. Después, volver a sincronizar `assets/offline-preloader.js`.

---

## Acción 7: simplificar la arquitectura de la barra inferior

### Objetivo

Reducir la carga cognitiva y mantener una navegación predecible. El primer nivel debe conservar siempre este orden: Índice, Página anterior, Página actual/total, Página siguiente, Leer/Pausar y Herramientas.

### Áreas que deben revisarse

- Barra generada por el componente base y paginación añadida por el modo reflujo.
- Paneles de Índice, Configuración, Glosario, Idioma y lectura en voz alta.
- Configuración de idiomas disponibles.
- Etiquetas visibles, nombres accesibles, orden de foco y tamaños táctiles.
- Apertura de paneles en escritorio y móvil.

### Procedimiento

1. Crear una sola barra primaria con seis posiciones invariables.
2. Mantener el componente base montado únicamente como puente de estado para sus paneles, ocultándolo de la presentación, el puntero y el orden de foco.
3. Ocultar Idioma cuando exista una única lengua y anular su atajo de teclado.
4. Mover tamaño de letra, lectura fácil, descripción de imágenes, resaltado, velocidad, reproducción automática, voz y Glosario a Herramientas.
5. Hacer que Leer/Pausar controle directamente el estado real del audio, sin exigir la apertura de un panel secundario.
6. Mostrar icono y etiqueta cuando haya espacio; ocultar solo la etiqueta visual en móvil, conservando `aria-label`.
7. Mantener los paneles superpuestos a la caja del libro y conservar la página visual al abrirlos o cerrarlos.
8. Distinguir la apertura de un panel de un cambio tipográfico: modificar el tamaño de letra puede repaginar, pero debe preservar el ancla semántica.

### Archivos modificados

- `assets/reflow-book.js`.
- `content/reflow.css`.
- `index.html` y `assets/offline-preloader.js` para versionado y ejecución local.
- `tools/sync_offline_preloader.js`.
- `BOOK-MAINTENANCE-PLAYBOOK.md`.

### Validación estática

- Confirmar que `#reflow-pagination` contiene exactamente los cinco botones y el contador esperados.
- Confirmar que cada botón tiene nombre accesible y una altura mínima de 44 px.
- Verificar que el componente base recibe `aria-hidden="true"` y que sus controles salen del orden de foco.
- Verificar que el panel de Idioma no puede mostrarse y que `Alt + Shift + L` queda anulado.
- Comprobar sintaxis JavaScript y ejecutar `git diff --check`.

### Validación en navegador

1. Recorrer la barra con teclado en escritorio y móvil.
2. Confirmar el orden Índice → Anterior → contador → Siguiente → Leer/Pausar → Herramientas.
3. Abrir y cerrar Índice, Herramientas y Glosario sin que cambie la página actual.
4. Iniciar, pausar y reanudar la lectura desde la barra, comprobando etiqueta, icono y `aria-pressed`.
5. Confirmar que Idioma no aparece y que todas las preferencias siguen disponibles en Herramientas.
6. Cambiar el tamaño de letra y verificar que se conserva el fragmento semántico leído.

### Resultado obtenido en este proyecto

- El primer nivel se limita a las seis posiciones definidas.
- Idioma queda oculto porque solo existe `es-UY`.
- Glosario y las preferencias de lectura se agrupan bajo Herramientas.
- Los paneles se superponen sin desplazar ni ocultar el libro.
- La barra mantiene iconos y etiquetas en escritorio, y nombres accesibles completos en móvil.
- La preferencia «Ocultar menús automáticamente» controla también la barra simplificada; el foco de teclado la mantiene visible.
- El esqueleto y la barra base se ocultan desde su primer fotograma para evitar que aparezcan detrás de la barra simplificada durante la carga.
- La barra simplificada espera a que el runtime esté listo y abre sus paneles mediante el estado compartido, sin simular clics sobre controles ocultos.

### Incidencias encontradas y medidas preventivas

#### 1. Abrir el libro con `file://` produce falsos fallos de aplicación

**Síntomas observados:** Atkinson Hyperlegible no carga, aparecen errores CORS con origen `null`, las navegaciones internas entre documentos se bloquean y algunos controles no responden.

**Causa:** Chromium trata cada URL `file://` como un origen opaco. Las fuentes externas, los `fetch()` y las navegaciones entre marcos no tienen las mismas garantías que bajo HTTP o SCORM.

**Prevención:**

- Probar el desarrollo local mediante `http://127.0.0.1:<puerto>/`, nunca usando el archivo directamente como validación principal.
- Validar por separado los tres destinos reales: servidor local HTTP, paquete SCORM y servidor final.
- Si un entregable debe funcionar obligatoriamente con doble clic, incrustar fuentes y documentos requeridos y eliminar toda navegación entre archivos. No asumir que un paquete HTTP funcionará sin cambios bajo `file://`.

#### 2. El preloader portable bloqueaba también la versión HTTP

**Síntomas observados:** pantalla en «Preparando…», controles congelados, carga muy lenta o caída del proceso sin error JavaScript.

**Causa:** `assets/offline-preloader.js` contiene una copia incrustada del libro y pesa aproximadamente 17 MB. Aunque su función terminaba inmediatamente bajo HTTP, el navegador debía descargarlo y analizarlo antes de continuar.

**Prevención:**

- Cargar `offline-preloader.js` de forma síncrona únicamente cuando `location.protocol === "file:"`.
- No incluir el preloader portable como `<script src>` incondicional en páginas servidas por HTTP o SCORM.
- Después de modificar `index.html`, actualizar su copia incrustada con la herramienta de sincronización y verificar que HTTP no solicita el preloader.

#### 3. Esperas ilimitadas impedían terminar la inicialización

**Síntomas observados:** el mensaje de carga permanecía indefinidamente sin excepción en consola.

**Causa:** `document.fonts.ready` y `HTMLImageElement.decode()` podían quedar pendientes cuando un recurso fallaba o el navegador no completaba su decodificación.

**Prevención:**

- Acotar la espera de fuentes e imágenes mediante `Promise.race()` y un tiempo máximo razonable.
- Permitir que los observadores de diseño procesen recursos que terminen después del primer render utilizable.
- Un recurso decorativo o una fuente fallida nunca debe impedir que aparezcan navegación y controles.

#### 4. Un `MutationObserver` global provocó saturación y crash

**Síntomas observados:** los botones dejaban de responder y la aplicación caía unos segundos después, sin error en consola.

**Causa:** la barra nueva observaba todo `document.body` y, en cada sincronización, volvía a escribir `class`, `aria-hidden` y `tabindex` sobre el componente base. Esas escrituras activaban otros observadores de diseño y creaban realimentación continua.

**Prevención:**

- Observar solamente el contenedor mínimo necesario; para la barra, `#nav-container`.
- Usar filtros de atributos específicos y no observar `style`, `class` o todo el subárbol sin una necesidad demostrada.
- Antes de llamar a `setAttribute()` o modificar una clase, comprobar que el valor realmente cambió.
- No realizar cálculos de paginación completos desde un observador de alta frecuencia; agruparlos mediante una única actualización programada.
- Mantener la aplicación abierta al menos 30 segundos durante la prueba y accionar repetidamente Índice, Herramientas, Leer/Pausar y navegación.

#### 5. El menú base aparecía brevemente detrás de la barra nueva

**Síntoma observado:** el esqueleto y la barra anterior se veían durante el primer fotograma y luego desaparecían.

**Causa:** ocultarlos sólo desde JavaScript dejaba una ventana entre el render inicial de React y la clasificación del componente.

**Prevención:** ocultar desde CSS tanto el esqueleto (`data-testid="dock-skeleton"`) como el grupo con los disparadores conocidos. Mantenerlos montados como puente de estado, pero fuera de presentación, puntero y foco.

#### 6. Preferencias ocultas por el estado de lectura en voz alta

**Síntomas observados:** Descripción de imágenes, Resaltado y Reproducción automática aparecían únicamente después de activar Lectura en voz alta; Velocidad no aparecía en Herramientas porque pertenecía al panel de audio.

**Causa:** el componente base condicionaba conjuntamente esas preferencias al estado activo de TTS y ubicaba la velocidad en otro popover.

**Prevención:**

- Mantener siempre visibles en Herramientas las preferencias configurables, aunque la reproducción esté apagada.
- Conectar controles trasladados al mismo estado compartido del runtime; no mantener dos valores independientes.
- Verificar los dos estados de aceptación: Lectura en voz alta apagada y encendida.
- Confirmar que Herramientas contiene Lectura fácil, Lectura en voz alta, Reproducción automática, Descripción de imágenes, Resaltado, voz, Velocidad, Tamaño de letra, comportamiento y accesos de consulta aplicables.

#### 7. Chrome bloqueaba el audio por falta de gesto del usuario

**Síntoma observado:** `NotAllowedError: play() failed because the user didn't interact with the document first`.

**Causas:** la primera llamada a `audio.play()` se retrasaba mediante un temporizador y el estado persistido intentaba reproducir automáticamente durante la carga del documento.

**Prevención:**

- Ejecutar la primera llamada real a `play()` sincrónicamente dentro del clic en Leer o del interruptor activado por el usuario.
- No reproducir audio audible durante la carga, aunque las preferencias persistidas indiquen Lectura en voz alta y Reproducción automática.
- Interpretar Reproducción automática como continuidad entre fragmentos después del primer clic, no como reproducción al abrir el libro.
- Probar con una consola limpia en Chrome: recargar, confirmar que no aparece `NotAllowedError`, pulsar Leer, pausar y reanudar.

#### 8. Caché y verificación de cada corrección

- Incrementar el identificador `?v=` de cada JavaScript o CSS modificado.
- Confirmar que el servidor entrega el identificador nuevo antes de evaluar el resultado.
- Recargar con `Ctrl + F5` durante desarrollo.
- Ejecutar `node --check assets/reflow-book.js`, comparar llaves CSS y ejecutar `git diff --check`.
- Revisar consola, carga de Atkinson, estabilidad prolongada, apertura de paneles, audio en Chrome y ausencia de la barra anterior.

### Riesgos y excepciones

- El componente base sigue siendo la fuente de estado de los paneles; una recompilación puede cambiar sus etiquetas o estructura interna.
- No eliminar físicamente el puente del componente base sin reemplazar antes sus estados y paneles.
- Si se incorpora otro idioma, restaurar el selector dentro de Herramientas y su atajo accesible.

### Reversión

Revertir conjuntamente JavaScript, CSS y documentación. La paginación anterior y el componente base deben restaurarse en el mismo cambio para evitar dos barras visibles.

---

## Acción 8: reforzar la jerarquía de navegación

### Objetivo

Dar prioridad perceptiva y operativa a Anterior y Siguiente, conservar sus equivalentes de teclado y garantizar que la barra inferior no cubra contenido ni foco al aplicar zoom.

### Procedimiento

1. Mantener Anterior y Siguiente en 48 px en escritorio y 44 px en móvil.
2. Usar una superficie y un borde con mayor contraste que el fondo general de la barra.
3. Diferenciar el estado deshabilitado mediante color, fondo y borde discontinuo; no depender únicamente de opacidad.
4. Mantener el contador visual abreviado, con números tabulares, y actualizar su nombre accesible como «Página actual de total».
5. Exponer los atajos mediante `aria-keyshortcuts`. Cuando un control de la barra principal tiene foco, usar las flechas para recorrer sus opciones, omitiendo controles deshabilitados y conservando Tab. Fuera de la barra, usar las flechas izquierda/derecha para cambiar de página. Page Up, Page Down, Inicio y Fin mantienen su función de navegación de página en ambos contextos. No capturar estas teclas dentro de formularios, actividades o paneles.
6. Medir la altura real de la barra con `ResizeObserver` y `visualViewport`, publicarla en `--reflow-toolbar-reserve` y usarla para calcular el alto disponible del libro.
7. Incluir `env(safe-area-inset-bottom)` en la barra para dispositivos con área segura inferior.

### Validación

- Confirmar objetivos de 48 px y 44 px en los dos puntos de quiebre.
- Revisar el primer y último estado del libro: uno de los botones debe seguir siendo claramente reconocible como deshabilitado.
- Comprobar que el contador conserva `font-variant-numeric: tabular-nums` y que la auditoría Atkinson incluye el elemento `output`.
- Probar teclado con foco en el libro y confirmar que no interfiere con formularios, actividades ni paneles.
- Probar zoom de 200 % y 400 %, foco visible y `safe-area` sin superposición del contenido.

### Riesgos y excepciones

- No fijar la reserva inferior con un valor independiente de la barra: los textos traducidos, el zoom o un área segura pueden modificar su altura.
- Evitar que el observador de tamaño escriba propiedades que cambien la propia altura de la barra, porque produciría un ciclo de redimensionamiento.

### Reversión

Restaurar conjuntamente los estilos de navegación, los metadatos de teclado y el cálculo anterior de `--reflow-page-height`.

---

## Acción 9: rediseñar el índice con jerarquía semántica

### Objetivo

Presentar capítulos, secciones y páginas con una jerarquía perceptible y navegable, conservar los títulos editoriales en sentence case y mantener una gestión de foco predecible.

### Procedimiento

1. Corregir el sentence case en `content/toc.json`; no aplicar `lowercase` global desde CSS o JavaScript porque dañaría nombres propios, siglas y textos históricos.
2. Conservar en cada entrada el nivel editorial `level` y exponerlo en la interfaz mediante `data-reflow-toc-level` y `data-reflow-entry-kind`.
3. Diferenciar los niveles con tamaño, peso y sangría: capítulo en primer nivel, sección en segundo y página o detalle en tercero.
4. Construir la lista de páginas con encabezados semánticos y resultados subordinados visualmente.
5. Mantener `aria-current="location"` en la entrada activa del índice y `aria-current="page"` en la página visual actual.
6. Garantizar un mínimo de 44 px para todos los botones de resultado.
7. Detectar el cierre real del índice, ya sea mediante el botón, Escape, clic exterior o selección de un resultado, y devolver el foco a `#reflow-index`. Tras elegir un resultado, repetir la comprobación durante la transición breve del componente base, sin robar el foco si el usuario ya lo movió a otro control. No moverlo al cambiar directamente a Herramientas.

### Validación

- Revisar todos los títulos de `toc.json`, con atención especial a nombres propios como «Ana Solari» y «Cabo Frío».
- Inspeccionar los tres niveles y confirmar que se distinguen sin depender de color ni mayúsculas.
- En la consola, comprobar que el resultado activo tiene `aria-current` y que cada botón mide al menos 44 px de alto.
- Abrir el índice con teclado, cerrarlo con Escape y confirmar que `document.activeElement.id` devuelve `reflow-index`.
- Seleccionar una entrada y repetir la comprobación de foco después de que se cierre el panel.

### Riesgos y excepciones

- Sentence case es una decisión editorial: cualquier importación nueva debe corregir su fuente de datos y preservar conscientemente nombres propios y siglas.
- No inferir el nivel por color, mayúsculas o posición DOM; usar siempre el campo `level`.
- No devolver el foco a Índice cuando el usuario haya cambiado directamente a otro panel.

### Reversión

Restaurar conjuntamente los datos del índice, su decorador JavaScript y los estilos de jerarquía para no dejar niveles declarados sin representación visual.

---

## Acción 10: limitar el resaltado del glosario a la página visible

### Objetivo

Evitar que «Resaltar palabras» bloquee el hilo principal al procesar un libro completo, manteniendo términos interactivos y actualizados al cambiar de página.

### Procedimiento

1. No ejecutar el resaltador global del componente base sobre todo `#content`: combina miles de nodos de texto con todas las palabras y variaciones del glosario.
2. Obtener únicamente los nodos de texto cuya geometría pertenece a la página visual actual.
3. Filtrar el catálogo contra el texto de esa página, ordenar las formas por longitud y compilar una sola expresión regular Unicode para sus coincidencias.
4. Insertar `.glossary-term` solamente en esos nodos y conservar tanto las clases visuales originales (`bg-emerald-100/80`, `text-emerald-800`, `rounded`, `cursor-pointer`) como `role="button"`, `tabindex="0"` y `data-glossary-key` para el popup y el teclado.
5. Al navegar o apagar la opción, desenvolver exclusivamente los resaltados existentes y normalizar solo sus padres directos.
6. Ignorar temporalmente esas mutaciones en el observador global de contenido, pues son decorativas y no justifican repaginar el libro completo.
7. Al construir «En esta página», incluir el texto dentro de los `.glossary-term` existentes; excluirlos únicamente al crear nuevos resaltados para impedir envoltorios anidados.
8. Incrementar la versión de `reflow-book.js` para impedir que el navegador reutilice la implementación anterior.

### Validación

- Activar «Resaltar palabras» y confirmar que la interfaz sigue respondiendo después de varios segundos.
- Comprobar que solo existen términos resaltados en la página visible y que cada uno abre su definición.
- Comparar los términos resaltados con «En esta página»: el listado debe incluir también las palabras que ya están envueltas por el resaltador.
- Navegar con Anterior y Siguiente: los resaltados anteriores deben desaparecer y los de la nueva página deben aparecer.
- Desactivar la opción y confirmar que no queda ningún `.glossary-term[data-glossary-key]`.
- Revisar la consola y ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Riesgos y excepciones

- Una expresión que atraviese dos nodos de texto separados no se resalta; es preferible conservar la estructura semántica a fusionar nodos editoriales.
- Los encabezados, actividades, cuestionarios, contenido oculto y el propio popup se excluyen deliberadamente.
- Si cambia el efecto interno del componente base, actualizar el marcador de integración antes de publicar el libro.

### Reversión

Restaurar conjuntamente el puente del glosario, la exclusión del observador y la versión de `reflow-book.js`; no reactivar el recorrido global sin medirlo con un catálogo completo.

---

## Acción 11: añadir un atajo directo al glosario

### Objetivo

Permitir abrir el Glosario con la tecla `G` y comunicar el atajo dentro de Herramientas.

### Procedimiento

1. Capturar `G` sin distinguir mayúsculas y minúsculas, siempre que no se utilicen Ctrl, Alt o Meta.
2. No capturar escritura dentro de campos, elementos editables, formularios o actividades.
3. Abrir el estado real del panel Glosario; si ya está abierto, mantenerlo abierto en vez de alternarlo.
4. Añadir «Abrir glosario — G» a la sección «Atajos de teclado» y exponer `aria-keyshortcuts="G"` en su acceso visible.
5. Mantener la página actual y sincronizar el estado de la barra después de abrir el panel.

### Validación

- Con foco en el libro, pulsar `G` y confirmar que se abre el Glosario.
- Pulsar `G` nuevamente y comprobar que el panel permanece abierto.
- Escribir `g` en Buscar y en campos de actividades: la letra debe introducirse y no abrir otro panel.
- Confirmar que Herramientas muestra «Abrir glosario» junto a la tecla `G`.

### Riesgos y excepciones

- No reutilizar `toggleRuntimePanel` para este atajo: una acción denominada «Abrir» no debe cerrar el panel cuando se repite.
- Si se asigna `G` a otra función global, resolver el conflicto en un único controlador antes de conservar ambos atajos.

### Reversión

Eliminar conjuntamente el controlador de `G`, la fila de ayuda y `aria-keyshortcuts`.

---

## Acción 12: devolver el foco al término que abrió una definición

### Objetivo

Mantener la continuidad de teclado al abrir y cerrar una definición emergente del glosario.

### Procedimiento

1. Hacer activables los `.glossary-term` mediante `Enter` y `Espacio`, además del clic.
2. Antes de abrir, recordar el elemento exacto, su clave, texto, página y posición entre términos repetidos.
3. Detectar el cierre real del diálogo de definición y restaurar el foco después de que termine el desmontaje del componente.
4. Usar `focus({ preventScroll: true })` para no desplazar ni repaginar el contenido.
5. Si el envoltorio original fue reconstruido, buscar la misma clave y aparición en la página; si ya no existe, usar Herramientas como destino estable.
6. No devolver el foco al origen al elegir «Ver en glosario» ni al cerrar mediante otro control interactivo: en esos casos prevalece el nuevo destino elegido.
7. Mostrar un contorno perceptible sobre la palabra enfocada y declarar `aria-haspopup="dialog"`.
8. No iniciar el resaltado durante el estado transitorio `1 / 1`: esperar a que termine la paginación y no reconstruir los términos si la página y la revisión de diseño no cambiaron.

### Validación

- Enfocar una palabra, abrirla con `Enter`, cerrar con `Esc` y confirmar que `document.activeElement` es el mismo `.glossary-term`.
- Repetir con `Espacio` y con clic.
- Confirmar que la página y el desplazamiento no cambian.
- Seleccionar «Ver en glosario» y comprobar que el foco no regresa a la palabra.
- Desactivar el resaltado mientras la definición está abierta y comprobar el destino alternativo sin errores.

### Riesgos y excepciones

- El diálogo pertenece al componente base y se monta en un portal; la restauración debe ejecutarse después de su desmontaje para no ser sobrescrita por el gestor de foco interno.
- Reconstruir continuamente los resaltados desconecta la palabra enfocada, puede bloquear la interfaz y vuelve inestable cualquier prueba; el resaltado debe ser idempotente por página.
- No forzar el foco hacia atrás cuando el usuario haya pulsado otro control durante el cierre.

### Reversión

Eliminar conjuntamente la gestión del origen, la activación con teclado, `aria-haspopup` y el estilo de foco visible.

---

## Acción 13: aplicar los tokens verificables del sistema EVA

### Objetivo

Unificar color institucional, espaciado, bordes, sombras y estados interactivos con la referencia EVA sin inventar valores que Figma no expone.

### Procedimiento

1. Sustituir cualquier escala institucional aproximada por los valores EVA: `100 #CCECEA`, `200 #99D9D5`, `300 #66C6C0`, `400 #00A096`, `500 #008078`, `600 #00635D`, `700 #00504B`, `800 #00403C` y `900 #00302D`.
2. Usar la escala espacial `4, 8, 12, 16, 20, 24, 32, 64, 96 y 160 px`. El valor de 20 px corresponde al token semántico `500` utilizado por los botones.
3. Mantener los controles importantes entre 44 y 48 px. El botón normal EVA mide 46 px; Anterior y Siguiente conservan 48 px.
4. Aplicar borde normal de 1 px y foco exterior de 3 px.
5. En fondos claros, usar `#00635D` para el foco. En fondos oscuros, usar `#00A096`.
6. Aplicar la sombra normal `1px 1px 4px rgb(0 0 0 / 10%)` y la sombra de foco `0 2px 4px #008078`.
7. Representar de forma diferenciada los estados normal, hover, active, focus y disabled; el estado deshabilitado no debe depender únicamente de opacidad.
8. Versionar la URL de `reflow.css` después de modificar estos tokens.

### Validación

- Comprobar foco visible sobre paneles claros y oscuros.
- Recorrer con teclado la barra, Herramientas, Índice, Glosario y actividades.
- Confirmar que botones y campos no cambian de tamaño al recibir foco.
- Verificar contraste, estado activo y estado deshabilitado sin depender solo del color o la opacidad.

### Riesgos y excepciones

- La página de primitivos «Bordes» de la referencia EVA está vacía y el modo de lectura de Figma no expone el valor numérico de `eva-border-radio-button` ni `eva-border-radio-normal`.
- Hasta contar con ese dato, conservar los `border-radius` existentes. No deducirlos a partir de una captura ni sustituirlos por valores aproximados.
- Los colores editoriales del libro y de sus ilustraciones no forman parte de la interfaz EVA y no deben modificarse.

### Reversión

Restaurar los tokens anteriores y la versión previa de `reflow.css`; los radios de borde no requieren reversión porque permanecen sin cambios.

---

## Acción 14: separar el reproductor TTS de la barra principal

### Objetivo

Mantener la barra inferior dedicada a navegación y presentar controles de audio persistentes únicamente durante una sesión de lectura en voz alta.

### Procedimiento

1. Retirar «Leer/Pausar» de la barra principal y conservar solamente Índice, Anterior, contador, Siguiente y Herramientas.
2. Crear un reproductor flotante con Audio anterior, Reproducir/Pausar, Audio siguiente, acceso a Voz y velocidad y Detener.
3. Mostrar el reproductor mientras la preferencia de lectura en voz alta esté activa, incluso si la reproducción está pausada; ocultarlo únicamente al detener o desactivar la sesión.
4. Conectar los controles al mismo puente de audio del componente base para conservar voz, velocidad, resaltado y seguimiento de página.
5. Mantener el estado pausado al usar Anterior o Siguiente; esos controles seleccionan otro fragmento, pero no reanudan por sí solos una sesión pausada.
6. Reservar desde la carga inicial una franja estable para el reproductor. Mostrarlo u ocultarlo no debe cambiar la altura del libro, repaginar ni tapar texto, navegación o foco.
7. Al activar TTS desde Herramientas, cerrar el panel y llevar el foco a Reproducir/Pausar. Al detener, devolver el foco al contenido visible.
8. Permitir recorrer los controles del reproductor con flechas cuando el foco ya está dentro de él.
9. En móvil conservar cinco áreas táctiles de al menos 44 px y ocultar solo las etiquetas visuales; los nombres accesibles permanecen completos.
10. Versionar conjuntamente `reflow-book.js` y `reflow.css`.

### Validación

- Confirmar que la barra principal no contiene «Leer» ni «Pausar».
- Activar lectura en voz alta desde Herramientas y comprobar que aparece el reproductor, se cierra el panel y queda preparado en estado «Reproducir», sin iniciar audio.
- Pausar y verificar que el reproductor permanece visible.
- Usar Audio anterior y Audio siguiente tanto en reproducción como en pausa.
- Abrir Voz y velocidad y confirmar que lleva a Herramientas sin finalizar la sesión.
- Pulsar Detener y comprobar que el audio, el resaltado y el reproductor desaparecen, y que el foco vuelve al libro.
- Verificar escritorio y móvil sin superposición sobre texto ni barra.
- Revisar consola, ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Resultado obtenido

- La barra principal quedó reducida a cinco elementos: Índice, Anterior, contador, Siguiente y Herramientas.
- El reproductor permanece visible al pausar y desaparece solamente al detener la sesión.
- La reserva estable evita repaginaciones al mostrar u ocultar el reproductor y no cubre contenido ni foco.
- Las pruebas en escritorio y móvil confirmaron el flujo completo, la devolución del foco y áreas táctiles mínimas de 44 px.
- Una recarga con TTS activo pero pausado no generó nuevos intentos de reproducción automática ni errores de consola.

### Riesgos y excepciones

- No crear un segundo elemento `Audio`: el reproductor es una interfaz para la sesión existente.
- No confundir Pausar con Detener. Pausar conserva la sesión y el reproductor; Detener desactiva ambos.
- Chrome exige que el primer `play()` audible se origine en el gesto de la persona. No iniciar audio durante la carga del documento.
- No recalcular la altura disponible al mostrar u ocultar el reproductor: en libros extensos una segunda paginación puede bloquear la interfaz durante varios segundos.
- Al leer una medida CSS desde JavaScript, convertir correctamente unidades como `rem` a píxeles. `parseFloat("4rem")` devuelve `4`, no los `64 px` esperados, y una reserva subestimada puede dejar texto detrás del reproductor.

### Reversión

Restaurar la columna y el botón Leer de la barra, eliminar `#reflow-tts-player`, retirar su reserva de altura y volver a las versiones anteriores de JavaScript y CSS.

---

## Acción 15: diferenciar activación de reproducción TTS

### Objetivo

Separar la disponibilidad de la lectura en voz alta del transporte de audio: «Activar lectura en voz alta» prepara la sesión y «Reproducir» inicia el sonido.

### Procedimiento

1. Al encender «Lectura en voz alta», conservar el audio pausado y mostrar el reproductor.
2. Cerrar Herramientas y llevar el foco a «Reproducir», para que la siguiente acción sea explícita y predecible.
3. Anunciar «Lectura en voz alta activada. Pulse Reproducir para comenzar» mediante la región viva.
4. Ejecutar la primera llamada real a `play()` únicamente desde el botón «Reproducir».
5. Mantener «Pausar» como estado temporal de la reproducción y «Detener» como cierre completo de la sesión.
6. Conservar la preferencia activa durante una recarga, pero iniciar siempre en pausa hasta recibir un nuevo gesto.
7. Registrar en memoria si la sesión recibió un «Reproducir» explícito y no permitir que una repaginación tardía aplique reproducción automática antes de ese gesto.

### Validación

- Activar la preferencia y comprobar que el reproductor muestra «Reproducir», con `aria-pressed="false"`.
- Confirmar que no comienza audio y que no aparecen advertencias `NotAllowedError`.
- Pulsar «Reproducir» y comprobar que cambia a «Pausar», con `aria-pressed="true"`.
- Pausar y verificar que la preferencia continúa activa y el reproductor permanece visible.
- Desactivar la preferencia o pulsar «Detener» y comprobar que el reproductor desaparece.
- Recargar con la preferencia activa y confirmar que la sesión reaparece pausada.

### Resultado obtenido

- Activar la preferencia muestra el reproductor en «Reproducir», con `aria-pressed="false"`, sin iniciar sonido.
- El panel Herramientas se cierra y el foco queda sobre «Reproducir».
- Un clic posterior en «Reproducir» cambia el control a «Pausar», con `aria-pressed="true"`.
- La preferencia activa sobrevive a una recarga, pero el audio permanece pausado.
- Una espera prolongada después de la recarga confirmó que la repaginación tardía no intenta reproducir audio ni genera `NotAllowedError`.
- Desactivar la preferencia detiene la sesión y oculta el reproductor.

### Riesgos y excepciones

- No volver a enlazar el interruptor directamente con `play()`: eso fusionaría otra vez configuración y transporte.
- «Reproducción automática» gobierna la continuidad entre fragmentos una vez iniciada la lectura; no autoriza reproducir al activar la preferencia ni durante la carga.
- En libros extensos, observadores de diseño pueden repaginar varios segundos después de la carga. Esa ruta también debe comprobar el inicio explícito antes de alinear y reproducir audio.

### Reversión

Volver a invocar `startTtsFromUserGesture()` desde el cambio del interruptor y retirar el estado preparado; esta reversión no se recomienda porque restaura la ambigüedad original.

---

## Acción 16: cerrar, regresar y controlar el foco de los paneles

### Objetivo

Permitir cerrar Índice, Herramientas y Glosario de forma explícita, regresar desde Glosario a Herramientas y mantener un recorrido de foco predecible sin cambiar la página de lectura.

### Procedimiento

1. Añadir un encabezado propio a cada panel con título y botón «Cerrar»; en Glosario, incluir además «Volver a Herramientas».
2. Al abrir Índice o Herramientas, guardar el elemento que tenía el foco y llevarlo al botón «Cerrar».
3. Al abrir Glosario, conservar como origen el control que abrió Herramientas y llevar el foco a «Volver a Herramientas».
4. Al regresar desde Glosario, abrir Herramientas y enfocar su acceso «Glosario» para conservar el contexto.
5. Al cerrar con el botón o con `Escape`, devolver el foco al control que abrió el panel.
6. Confinar `Tab` y `Shift+Tab` dentro del diálogo mientras permanezca abierto.
7. Mantener Índice y Herramientas mutuamente excluyentes y usar Glosario como reemplazo temporal de Herramientas, no como un tercer panel superpuesto.
8. No animar la aparición de estos paneles ni modificar la página actual o la distribución horizontal.

### Validación

- Abrir cada panel y comprobar que el foco inicial llega a su primer control de navegación.
- Recorrer los extremos con `Tab` y `Shift+Tab` y confirmar que el foco no sale del diálogo.
- Cerrar mediante el botón y mediante `Escape`; verificar que el foco vuelve al control de origen.
- Abrir Glosario desde Herramientas, pulsar «Volver a Herramientas» y comprobar que el foco queda en el acceso «Glosario».
- Abrir Glosario con el atajo `G`, cerrarlo y comprobar que el foco vuelve al elemento desde el que se accionó el atajo.
- Alternar Índice y Herramientas y confirmar que existe un solo diálogo.
- Medir «Volver» y «Cerrar»: sus áreas táctiles deben ser de al menos `44 × 44 px`.
- Confirmar que el contador de página no cambia y que el panel no tiene desbordamiento horizontal.

### Resultado obtenido

- Índice y Herramientas muestran un botón «Cerrar»; Glosario muestra «Volver a Herramientas» y «Cerrar».
- `Escape` y el cierre explícito devuelven correctamente el foco al origen.
- Volver desde Glosario restaura Herramientas con foco en su acceso «Glosario».
- El foco queda confinado dentro del panel y los controles nuevos cumplen el mínimo de `44 × 44 px`.
- Índice y Herramientas continúan siendo excluyentes y Glosario los reemplaza sin crear paneles superpuestos.
- La página de prueba permaneció en `7 / 413` durante todas las aperturas y cierres; no hubo desbordamiento horizontal ni errores nuevos de consola.

### Riesgos y excepciones

- No interceptar `Escape` dentro del diálogo de definición de una palabra: ese diálogo debe conservar su propia devolución del foco a la palabra de origen.
- No restaurar automáticamente el foco del panel cuando una acción tiene un destino más específico, como activar TTS y continuar en «Reproducir».
- Los componentes base pueden añadir elementos auxiliares con `tabindex`; el confinamiento debe trabajar con los controles realmente visibles y habilitados.
- Conservar nombres accesibles completos aunque en móvil se oculte parte de una etiqueta visual.

### Reversión

Retirar los encabezados de control, el confinamiento de foco y el registro del elemento de origen; restaurar después las versiones anteriores de JavaScript y CSS indicadas en `index.html`.

---

## Acción 17: reorganizar el panel Herramientas

### Objetivo

Reducir la carga visual del panel Herramientas mediante secciones previsibles, controles alineados y dependencias accesibles, conservando un único estado funcional para cada preferencia.

### Procedimiento

1. Organizar el contenido visible en «Apoyos para la lectura», «Preferencias», «Atajos de teclado» y «Herramientas».
2. Dentro de los apoyos, ordenar «Activar lectura en voz alta», «Resaltado», «Descripción de imágenes» y «Lectura fácil»; separar «Audio y voz» para voz, velocidad y reproducción automática.
3. Diferenciar la activación TTS de la reproducción mediante la descripción «Habilita el modo. Use Reproducir para comenzar».
4. Mantener «Descripción de imágenes» visible e independiente del estado TTS.
5. Deshabilitar «Resaltado» cuando TTS esté inactivo, exponer el grupo como foco accesible y asociar la explicación correspondiente.
6. Mantener la restricción adicional de resaltado por palabra cuando la velocidad sea superior a Normal.
7. Añadir «Reducir movimiento» como interruptor persistente que minimiza animaciones, transiciones y desplazamiento suave.
8. Presentar Glosario como botón de acción, no como interruptor, y conservar el atajo `G`.
9. Ocultar Idioma mientras `es-UY` sea la única opción disponible.
10. Eliminar superficies de tarjeta repetidas y usar separadores entre filas; conservar controles segmentados cuando necesitan espacio horizontal.
11. Calcular la altura del panel respecto de la barra y del reproductor TTS para que el desplazamiento interno nunca quede cubierto.

### Validación

- Confirmar que los encabezados visibles estén en sentence case y que `text-transform` sea `none`.
- Comprobar que «Descripción de imágenes» permanezca visible con TTS encendido y apagado.
- Apagar TTS y verificar que el grupo Resaltado tenga `aria-disabled="true"`, sea enfocable y anuncie su explicación; reactivar TTS y comprobar que vuelve a estar disponible.
- Activar y desactivar «Reducir movimiento»; verificar `aria-checked`, el atributo de estado del documento y una duración de transición mínima.
- Confirmar que Glosario sea un elemento `button` con al menos 44 px de alto.
- Verificar que Idioma y «Español (Uruguay)» no estén visibles.
- Recorrer el panel hasta el final con teclado y comprobar que el desplazamiento interno muestra Glosario.
- Medir el panel con TTS activo: debe terminar antes del reproductor y no tener desbordamiento horizontal.
- Confirmar que abrir el panel no modifique la página actual.

### Resultado obtenido

- El panel muestra cuatro encabezados principales y el subgrupo «Audio y voz», todos en sentence case.
- Las tarjetas repetidas fueron sustituidas por filas y separadores; las superficies de sección son transparentes y sin bordes.
- Resaltado cambia correctamente entre disponible e inactivo con explicación accesible.
- «Reducir movimiento» funciona, persiste y conserva un área táctil de `44 × 44 px`.
- Glosario continúa funcionando como botón de `51 px` de alto; Idioma permanece oculto.
- En la prueba móvil, el panel tuvo desplazamiento interno, cero desbordamiento horizontal y terminó `9 px` antes del reproductor TTS.
- La página permaneció en `6 / 413` durante la validación.

### Riesgos y excepciones

- No clonar controles del runtime: se perderían sus eventos y estados administrados. Reordenar mediante clases y CSS conserva los nodos originales.
- Al actualizar el runtime, revisar los textos usados para identificar filas y la clase de la columna de ajustes.
- No permitir que la restricción por velocidad vuelva a habilitar Resaltado mientras TTS siga apagado.
- Mantener visible la explicación solo durante el estado que la requiere para no sobrecargar el panel.
- Si se añade un segundo idioma, retirar la ocultación y volver a validar el flujo completo de selección.

### Reversión

Retirar la organización y clases del panel, el control personalizado de movimiento reducido y el cálculo de altura; restaurar las versiones anteriores de JavaScript y CSS indicadas en `index.html`.

---

## Acción 18: adaptar la barra y los paneles a móvil

### Objetivo

Conservar la jerarquía, el orden y la accesibilidad de la barra inferior en anchos reducidos, abreviando las etiquetas de forma progresiva sin reducir las áreas táctiles.

### Procedimiento

1. Mantener el orden fijo Índice, Anterior, página actual/total, Siguiente y Herramientas.
2. Conservar áreas táctiles mínimas de `44 × 44 px` y un contador de al menos `16 px` con números tabulares.
3. Entre `30rem` y el corte de escritorio, mostrar completas las etiquetas «Índice» y «Herramientas».
4. Entre `22rem` y `30rem`, mantener «Índice» y abreviar visualmente «Herramientas» como «Herram.».
5. Por debajo de `22rem`, ocultar visualmente esas dos etiquetas como último recurso y conservar los iconos.
6. Mantener siempre los nombres accesibles completos mediante `aria-label`; la abreviatura es únicamente visual.
7. Limitar el ancho de Índice, Herramientas y Glosario en pantallas estrechas para dejar un borde visible y conservar su desplazamiento interno.
8. Conservar la reserva inferior y el área segura del dispositivo para que la barra y el reproductor TTS no cubran contenido ni foco.
9. Versionar CSS y JavaScript en `index.html` para evitar que la caché mantenga la disposición anterior.

### Validación estática

- Confirmar que el DOM mantiene el mismo orden de controles en todos los cortes.
- Comprobar que «Índice» y «Herramientas» conservan sus `aria-label` completos.
- Revisar que ninguna regla móvil reduzca `min-width` o `min-height` por debajo de `2.75rem`.
- Verificar que el contador mantiene `font-size: 1rem` y `font-variant-numeric: tabular-nums`.
- Ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Validación en navegador

- Probar al menos `320`, `375`, `480` y `566 px` de ancho.
- En `320 px`, verificar la variante solo con iconos; en `375 px`, «Índice» y «Herram.»; desde `480 px`, las dos etiquetas completas.
- Confirmar que no existe desplazamiento horizontal y que los cinco controles permanecen en una única fila.
- Medir todos los botones y confirmar un mínimo de `44 × 44 px`.
- Abrir Índice, Herramientas y Glosario; comprobar que dejan un borde visible, tienen desplazamiento interno y no repaginan el libro.
- Con zoom de navegador, recorrer la barra y los paneles con teclado y comprobar que ningún foco queda oculto.

### Resultado obtenido

- Se añadieron dos cortes progresivos: etiqueta abreviada desde `22rem` y etiquetas completas desde `30rem`.
- La variante extrema conserva iconos, orden fijo y nombres accesibles completos.
- Los tamaños táctiles y el contador no fueron reducidos.
- Los paneles laterales dejan al menos `.75rem` de borde visible en anchos de hasta `30rem`.
- Se actualizaron las versiones de `reflow.css` y `reflow-book.js` para invalidar la caché.

### Riesgos y excepciones

- El zoom modifica el ancho CSS efectivo; validar también los cortes con zoom alto, no solo mediante emulación de dispositivo.
- Si se traducen las etiquetas o cambia «Herramientas», revisar la abreviatura visual sin modificar el nombre accesible completo.
- No reducir el área táctil para recuperar espacio: ocultar texto es el último ajuste permitido.
- No cambiar el orden de la cuadrícula según el ancho; la memoria espacial de la barra debe permanecer estable.

### Reversión

Retirar los cortes progresivos y el límite móvil de los paneles, eliminar `data-compact-label` y restaurar las versiones anteriores de JavaScript y CSS indicadas en `index.html`.

---

## Acción 19: limitar el resaltado del glosario a la página visible

### Objetivo

Evitar que «Resaltar palabras» bloquee la navegación o provoque que el navegador marque la página como no disponible en libros extensos.

### Procedimiento

1. No recorrer todos los nodos de texto del libro en cada cambio de página.
2. Tratar cada hijo directo de `#content` como una raíz de contenido importado.
3. Calcular el intervalo visual de cada raíz mediante su primer y último anclaje semántico renderizado (`data-id` o `data-reflow-anchor-id`).
4. Recorrer y medir únicamente las raíces cuyo intervalo contiene la página visible.
5. Mantener el filtrado final por geometría para excluir fragmentos que pertenecen a otra columna de una raíz multipágina.
6. Permitir el recorrido completo solo en vistas breves de una o dos páginas que todavía no expongan anclajes; no usarlo como respaldo para el libro completo.
7. Versionar `reflow-book.js` en `index.html` para invalidar la copia anterior.

### Validación

- Activar «Resaltar palabras» y recorrer varias páginas consecutivas con términos y sin ellos.
- Confirmar que los resaltados pertenecen exclusivamente a la página visible.
- Probar la primera y la última página para detectar errores de límites.
- Abrir el glosario y confirmar que «En esta página» continúa usando el mismo conjunto de texto visible.
- Ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Resultado obtenido

- Antes del cambio, una navegación con resaltado activo demoró aproximadamente `9,7 s`; con el resaltado apagado demoró `1,2 s`.
- Después del cambio, cinco páginas consecutivas con resaltado activo respondieron entre `0,36 s` y `0,39 s`.
- La página 6 conservó nueve términos resaltados y respondió sin congelarse.
- Inicio y final respondieron en aproximadamente `0,25 s` y `0,22 s`, respectivamente.
- La adaptación móvil no era la causa: el bloqueo provenía del recorrido geométrico completo del glosario.

### Riesgos y excepciones

- El contenido textual que deba participar del glosario necesita al menos un anclaje semántico renderizado dentro de su raíz importada.
- Una raíz puede abarcar varias columnas; por eso no basta con comprobar solamente el primer anclaje y se conserva el filtrado final de cada nodo candidato.
- No volver a introducir un respaldo de libro completo cuando no se encuentren raíces en una página ya paginada: es preferible omitir un resaltado transitorio a bloquear toda la interfaz.
- Repetir esta prueba con el glosario activado después de modificar la estructura de importación o la paginación.

### Reversión

Restaurar el recorrido completo de `#content`, retirar `glossaryRootsForVisualPage` y volver a la versión anterior de `reflow-book.js` indicada en `index.html`.

---

## Acción 20: evitar ciclos al montar el panel Herramientas

### Objetivo

Impedir que la apertura de «Herramientas» congele o cierre la página por un ciclo de mutaciones de la interfaz.

### Procedimiento

1. Revisar los `MutationObserver` instalados sobre el contenedor de la interfaz cuando un panel deja de responder sin registrar una excepción de JavaScript.
2. No reescribir `textContent`, atributos ni clases cuando el valor final ya es el correcto.
3. Agrupar las ráfagas de mutaciones del componente base en una sola ejecución mediante `requestAnimationFrame`.
4. Mantener las inserciones personalizadas protegidas por identificadores únicos para no duplicar controles.
5. Versionar `reflow-book.js` en `index.html` para invalidar la copia anterior.

### Validación

- Abrir y cerrar «Herramientas» al menos cinco veces consecutivas.
- Confirmar que el cierre devuelve el foco al botón «Herramientas».
- Comprobar que existe un solo panel y una sola copia de cada grupo personalizado.
- Navegar de página después de cerrar el panel y volver a abrirlo.
- Revisar la consola y ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Resultado obtenido

- El observador ya no reacciona indefinidamente a los cambios de texto que él mismo produce.
- Cinco aperturas consecutivas completaron correctamente; las reaperturas demoraron aproximadamente `1,0–1,2 s` dentro del navegador de prueba.
- El foco volvió al botón «Herramientas» después de cada cierre.
- Permaneció una sola instancia del panel y de los grupos de tamaño de fuente, audio y atajos.

### Riesgos y excepciones

- Toda personalización futura dentro de `#interface-container` debe ser idempotente porque ese árbol continúa observado.
- No ejecutar trabajo pesado directamente por cada registro del observador; conservar la agrupación por cuadro.
- Si el componente base cambia su estructura, revisar selectores y recuentos sin retirar la protección contra ciclos.

### Reversión

Retirar `scheduleSettingsPanelMount` y `setTextContentIfChanged`, restaurar el observador anterior y volver a la versión previa de `reflow-book.js` indicada en `index.html`.

---

## Acción 21: reducir la carga inicial de voces y el trabajo por navegación

### Objetivo

Evitar descargar catálogos TTS que todavía no se usan y eliminar mediciones y actualizaciones duplicadas en cada cambio de página.

### Procedimiento

1. Cargar al inicio únicamente `audios.json` y `timecodes.json` de la voz guardada.
2. Mantener la otra voz visible y cargar su catálogo al seleccionarla por primera vez.
3. Reutilizar la misma promesa si una voz se solicita mientras su descarga continúa.
4. Si la voz inicial falla, intentar la alternativa antes de iniciar el runtime.
5. Calcular una sola vez por repaginación qué columnas contienen actividades y páginas finales.
6. Consultar ese mapa en cada navegación, en lugar de medir nuevamente todos los paneles con `getClientRects()`.
7. Ignorar el evento `scroll` generado por `goToPage` cuando la página calculada ya coincide con el estado confirmado.
8. Actualizar el índice dinámico desde `updateControls` solamente mientras el índice está abierto.
9. Versionar `reflow-book.js` en `index.html`.

### Validación

- Recargar con Valentina seleccionada y confirmar que Mateo permanece disponible.
- Seleccionar Mateo, esperar su carga bajo demanda y regresar a Valentina.
- Reproducir y pausar audio, comprobando archivo, voz y marcas temporales.
- Recorrer al menos diez páginas con el glosario y la lectura en voz alta habilitados.
- Confirmar que una repaginación reconstruye los mapas de actividades y páginas finales.
- Ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Resultado obtenido

- El arranque deja de descargar y analizar aproximadamente `8,4 MB` correspondientes a la voz no seleccionada.
- Mateo se cargó correctamente bajo demanda y Valentina volvió a seleccionarse sin recargar la página.
- La reproducción con Valentina resolvió el archivo esperado y `33` marcas temporales; Pausar respondió correctamente.
- Diez cambios de página consecutivos completaron sin bloqueos ni errores de consola.
- Las 24 actividades se miden al reconstruir la paginación, no en cada pulsación de Anterior o Siguiente.
- El único mensaje de consola restante fue el aviso conocido del runtime al forzar la presentación del contenido después de su espera de seguridad.

### Riesgos y excepciones

- La primera selección de una voz que todavía no se usó depende de que sus dos catálogos puedan descargarse y analizarse.
- No desactivar ni ocultar una voz con estado `idle`: debe seguir disponible para iniciar su carga bajo demanda.
- Reconstruir los mapas de páginas después de cualquier cambio que modifique la geometría del libro.
- Conservar el respaldo secuencial cuando la voz guardada no esté disponible.

### Reversión

Restaurar la carga simultánea de ambos catálogos, retirar `rebuildPageKindCache` y volver a la versión anterior de `reflow-book.js` indicada en `index.html`.

---

## Acción 22: evitar demora y destello al abrir Herramientas

### Objetivo

Mostrar Herramientas únicamente cuando su estructura y valores actuales estén preparados, y evitar trabajo de navegación innecesario durante su apertura.

### Procedimiento

1. Mantener la protección temporal de página para cambios tardíos reales del componente base.
2. Antes de restaurar una página protegida, comparar tanto `state.current` como el `scrollLeft` objetivo.
3. Retornar inmediatamente cuando la columna no se haya movido; no recalcular anclas, controles ni resaltados.
4. Considerar listo el panel de accesibilidad solamente cuando tenga `.reflow-settings-organized`.
5. Exigir también los grupos personalizados de tamaño, voz y velocidad y una opción seleccionada en cada uno.
6. Conservar `reflow-panel-pending` hasta cumplir esas condiciones, aprovechando `visibility: hidden` para impedir el primer pintado incompleto.
7. Versionar `reflow-book.js` en `index.html`.

### Validación

- Abrir y cerrar Herramientas cinco veces consecutivas.
- Confirmar que la página visual no cambia y que el cierre devuelve el foco a Herramientas.
- Verificar en cada apertura que el panel esté organizado y ya no tenga el estado pendiente.
- Probar una velocidad no predeterminada, cerrar, reabrir y confirmar que se muestre seleccionada desde el estado listo.
- Navegar a la página siguiente y regresar después de las pruebas.
- Revisar consola y ejecutar `node --check assets/reflow-book.js` y `git diff --check`.

### Resultado obtenido

- Cinco aperturas consecutivas conservaron la página 7 y devolvieron el foco al botón Herramientas.
- La medición del navegador bajó de aproximadamente `1,9–2,3 s` a `1,8 s` en las reaperturas; la primera apertura quedó en `2,0 s`.
- El panel apareció organizado y con Normal, Valentina y velocidad Normal ya seleccionados.
- La velocidad Rápida persistió al cerrar y reabrir; después se restauró Normal.
- La navegación 7 → 8 → 7 continuó funcionando y no se registraron errores de consola.

### Riesgos y excepciones

- Si el componente base deja de renderizar alguno de los tres grupos requeridos, el panel permanecerá pendiente hasta agotar el respaldo de seguridad existente.
- No retirar los controles de readiness sin reemplazarlos: revelar el panel al detectar solamente un `section` o `switch` reintroduce el destello.
- Conservar los puntos de comprobación tardíos de página; el retorno rápido debe omitir solo el caso en el que no hubo desplazamiento.

### Reversión

Restaurar la comprobación básica de contenido del panel, retirar el retorno rápido de `restorePanelTogglePage` y volver a la versión anterior de `reflow-book.js` indicada en `index.html`.

---

## Acción 23: sincronizar los estados nativos antes de mostrar Herramientas

### Objetivo

Evitar que «Activar lectura en voz alta» y «Resaltado: Palabra» aparezcan desmarcados y se activen después de que Herramientas ya sea visible.

### Procedimiento

1. Capturar el estado efectivo de lectura en voz alta y el modo de resaltado justo antes de abrir Herramientas.
2. No usar como referencia el estado transitorio del panel recién montado, porque el componente base lo inicializa con valores predeterminados.
3. Mantener `reflow-panel-pending` mientras el interruptor de lectura no coincida con la sesión capturada.
4. Mantener también el panel pendiente mientras Palabra/Oración no coincida con `__adtReflowGetWordHighlight()`.
5. Marcar la instancia como `data-reflow-initial-settings-ready="true"` cuando ambas comprobaciones se cumplan.
6. Después del primer pintado listo, permitir cambios del usuario sin volver a ocultar el panel.
7. Versionar `reflow-book.js` en `index.html`.

### Validación

- Abrir Herramientas varias veces con lectura en voz alta y Palabra activadas.
- Confirmar que el panel visible ya tenga ambos estados marcados y no conserve `reflow-panel-pending`.
- Desactivar lectura en voz alta, reabrir y comprobar el estado OFF desde la primera vista lista.
- Volver a activar, reabrir y comprobar el estado ON.
- Restaurar las preferencias originales, revisar página y consola.

### Resultado obtenido

- Tres reaperturas consecutivas mostraron `Lectura en voz alta = true` y `Palabra = true` desde el estado visible listo.
- El caso OFF también apareció correctamente antes de retirar la ocultación preventiva.
- Al reactivar, la siguiente apertura volvió a mostrar ON correctamente.
- La página 7 se conservó y no se registraron errores de consola.

### Riesgos y excepciones

- Capturar el estado antes de solicitar el panel; hacerlo después permite que el valor predeterminado de React contamine la referencia.
- Aplicar la condición estricta solamente al primer pintado de cada instancia. Si se mantiene durante toda la vida del panel, una modificación voluntaria podría ocultarlo.
- Si el runtime deja de exponer `__adtReflowGetWordHighlight`, omitir únicamente esa comparación y conservar la de lectura en voz alta.

### Reversión

Retirar los estados esperados y `data-reflow-initial-settings-ready`, volver al criterio estructural de la Acción 22 y restaurar la versión anterior de `reflow-book.js` indicada en `index.html`.

---

## Acción 24: eliminar la transición visual inicial de los controles

### Objetivo

Evitar que un estado semánticamente correcto termine de animarse después de que Herramientas ya sea visible.

### Procedimiento

1. No limitar la comprobación a `aria-checked`: el interruptor base pinta su estado mediante `data-checked` o `data-unchecked` tanto en el control como en su thumb.
2. Confirmar que Palabra/Oración tenga también las clases visuales activa e inactiva esperadas.
3. Añadir `reflow-settings-first-paint` cuando todos los estados semánticos y visuales coincidan.
4. Desactivar `animation` y `transition` en el panel pendiente y durante ese primer pintado.
5. Retirar la clase después de dos cuadros para que las interacciones posteriores conserven sus animaciones normales.
6. Versionar tanto `reflow.css` como `reflow-book.js`.

### Validación

- Abrir Herramientas con Lectura en voz alta y Palabra activadas.
- Confirmar `aria-checked`, `data-checked`, el thumb y las clases activas antes de considerar el panel listo.
- Repetir con Lectura en voz alta desactivada y comprobar `data-unchecked` en control y thumb.
- Reactivar, reabrir y confirmar el estado visual ON.
- Revisar consola y ejecutar las comprobaciones estáticas.

### Resultado obtenido

- El estado ON apareció con interruptor, thumb y Palabra ya pintados como activos.
- El estado OFF apareció con `data-unchecked` en interruptor y thumb antes de retirar la ocultación.
- Tras reactivar, la apertura volvió a mostrar ON y Palabra con sus clases visuales finales.
- No se registraron errores de consola.

### Riesgos y excepciones

- Las comprobaciones de clases dependen del componente base actual (`bg-background`, `shadow-sm` y `text-muted-foreground`). Revisarlas si cambia el sistema de estilos upstream.
- No mantener las transiciones desactivadas durante toda la vida del panel; la supresión pertenece únicamente al primer pintado.
- Conservar la comprobación semántica además de la visual para no depender solamente de clases CSS.

### Reversión

Retirar `reflow-settings-first-paint`, las comprobaciones visuales y sus reglas CSS, y restaurar las versiones anteriores de `reflow.css` y `reflow-book.js` indicadas en `index.html`.

---

## Acción 25: evitar superposiciones en la opción Resaltado

### Objetivo

Mantener legibles la etiqueta, el selector Palabra/Oración y la explicación de disponibilidad dentro del panel estrecho de Herramientas.

### Procedimiento

1. Tratar la fila Resaltado como una cuadrícula de dos columnas.
2. Mantener la etiqueta y el selector segmentado en la primera línea.
3. Colocar `#reflow-highlight-requirement` en una segunda línea que abarque todo el ancho.
4. Conservar `hidden` como fuente de verdad cuando la lectura en voz alta está activa.
5. Versionar `reflow.css` para evitar que la caché conserve la distribución anterior.

### Validación

- Probar con lectura en voz alta desactivada y medir etiqueta, selector y explicación.
- Confirmar que ninguna intersección tenga superficie mayor que cero.
- Activar lectura en voz alta, reabrir Herramientas y comprobar que la explicación se oculta.
- Verificar que el selector completo permanezca dentro de los límites de la fila.

### Resultado obtenido

- En una fila de `236 px`, el selector recuperó `140,5 px` de ancho y quedó completamente visible.
- La explicación ocupó una segunda línea de `228 px` sin solaparse con la etiqueta ni con el selector.
- Las tres mediciones de superposición dieron `0 px²`.
- En estado activo, la explicación quedó oculta y la fila volvió a una altura compacta de `69 px`.

### Riesgos y excepciones

- La regla depende de las clases `reflow-setting-highlight` y del identificador `reflow-highlight-requirement`; deben conservarse si cambia el componente base.
- No aplicar la cuadrícula a todos los grupos segmentados: otras filas no incluyen una explicación como tercer hijo.

### Reversión

Retirar las reglas específicas de `.reflow-setting-highlight[role="group"]` y restaurar la versión anterior de `reflow.css` indicada en `index.html`.

---

## Acción 26: estabilizar el clic al reaparecer la barra autooculta

### Objetivo

Permitir que los botones de la barra principal, especialmente Herramientas, respondan al primer clic después de reaparecer por proximidad del puntero.

### Procedimiento

1. Mantener la protección que detiene los gestos del lector base sobre la barra personalizada.
2. Antes de detener `pointerdown` o `mousedown`, identificar el botón pulsado en la barra principal o el reproductor.
3. Dar foco programáticamente al botón sin desplazar el documento.
4. Sincronizar inmediatamente la barra para que `:focus-within` la mantenga inmóvil durante toda la secuencia del clic.
5. Versionar `reflow-book.js` para evitar que Chrome conserve el controlador anterior.

### Validación

- Activar Ocultar menús automáticamente.
- Alejar el puntero y confirmar que la barra sale del área visible.
- Acercar el puntero al borde inferior y comprobar que la barra reaparece.
- Pulsar Herramientas una sola vez y verificar que el panel se abre y permanece visible.
- Repetir por teclado para confirmar que no se altera su comportamiento.
- Revisar la consola de Chrome.

### Resultado obtenido

- Antes del cambio, el clic ocultaba la barra y Herramientas permanecía cerrado.
- Después del cambio, la misma secuencia abrió un panel visible de `288 × 418 px` que permaneció abierto tras la espera.
- La activación mediante `Enter` continuó abriendo Herramientas correctamente.
- No se registraron errores de JavaScript.

### Riesgos y excepciones

- El foco programático debe ejecutarse antes de `stopImmediatePropagation`; hacerlo después no evita que el botón se desplace antes de recibir `click`.
- La corrección se limita a botones de `#reflow-pagination` y `#reflow-tts-player` para no modificar el foco de otros controles.

### Reversión

Retirar el bloque `pressedControl` de `preserveTtsPanel` y restaurar la versión anterior de `reflow-book.js` indicada en `index.html`.

---

## Acción 27: activar caché selectiva en el servidor local

### Objetivo

Evitar que cada recarga vuelva a transferir todos los recursos pesados sin permitir que `index.html` o archivos en desarrollo queden desactualizados.

### Procedimiento

1. Servir `index.html` con `Cache-Control: no-cache`.
2. Servir recursos con parámetro `v` mediante `public, max-age=31536000, immutable`.
3. Aplicar una caché corta de una hora a imágenes, medios y fuentes sin versión.
4. Mantener `no-cache` para los demás archivos no versionados.
5. Reiniciar el servidor local después de modificar su política.

### Validación

- Consultar las cabeceras de `index.html`, un JavaScript versionado y una imagen sin versión.
- Confirmar respectivamente `no-cache`, caché inmutable anual y caché de una hora.
- Verificar la sintaxis de `tools/serve-local.js`.

### Resultado obtenido

- `index.html` responde con `Cache-Control: no-cache`.
- `reflow-book.js?v=100-pointer-release-panel-toggle` responde con `public, max-age=31536000, immutable`.
- Las imágenes sin versión responden con `public, max-age=3600`.

### Riesgos y excepciones

- Todo recurso con caché inmutable debe cambiar su parámetro `v` al modificarse.
- Una imagen reemplazada sin cambiar de nombre puede tardar hasta una hora en actualizarse durante desarrollo.
- Esta mejora reduce transferencias repetidas; no elimina el costo de reconstruir y paginar el DOM completo.

### Reversión

Restaurar `Cache-Control: no-store` en `tools/serve-local.js` y reiniciar el servidor.

---

## Acción 28: cerrar Índice y Herramientas con el mismo botón

### Objetivo

Garantizar el ciclo abrir/cerrar mediante el mismo control incluso cuando Chrome no completa `click` después de una secuencia de autoocultado.

### Procedimiento

1. Derivar el menú visible de los paneles realmente renderizados y usarlo para sincronizar `aria-expanded`.
2. En `pointerdown` o `mousedown`, registrar el botón pulsado y mantener estable la barra.
3. En `pointerup` o `mouseup`, abrir, cambiar o cerrar según el botón registrado y el panel visible.
4. Si el navegador genera después el evento `click`, consumirlo para impedir una segunda acción.
5. Mantener el flujo normal de `click` para la activación mediante teclado.
6. Versionar `reflow-book.js`.

### Validación

- Ejecutar con mouse el ciclo Herramientas cerrado → abierto → cerrado.
- Ejecutar con mouse el ciclo Índice cerrado → abierto → cerrado.
- Confirmar `aria-expanded="true"` al abrir y `false` al cerrar.
- Comprobar que no quede ningún diálogo visible y revisar la consola de Chrome.

### Resultado obtenido

- Herramientas completó el ciclo con `open/expanded = true/true` y luego `false/false`.
- Índice completó el mismo ciclo con `true/true` y luego `false/false`.
- El navegador integrado repitió ambos ciclos con pulsaciones físicas; Índice llevó el foco a Cerrar y lo devolvió al control de origen.
- El foco regresó al botón que cerró cada panel.
- Chrome no registró errores de consola.

### Riesgos y excepciones

- La supresión dura solamente `700 ms` y se limita al identificador del botón cuya acción de puntero ya fue atendida.
- Deduplicar las parejas pointer/mouse: los navegadores normales emiten ambas, mientras que algunas automatizaciones del navegador integrado solo entregan los eventos de mouse.
- Ejecutar el cambio al soltar, no al presionar; el runtime puede sobrescribir una escritura realizada durante su propia fase de captura.
- No extender este cierre anticipado a Anterior o Siguiente: esos controles no representan paneles alternables.

### Reversión

Retirar `visibleRuntimeMenu`, `consumePrimaryPointerAction` y la alternancia anticipada de `preserveTtsPanel`; restaurar la versión anterior de `reflow-book.js` indicada en `index.html`.

---

## Acción 29: completar el ciclo de los paneles en Chrome sin depender del puente del runtime

### Objetivo

Garantizar que Índice y Herramientas abran, cierren y vuelvan a abrir aunque el componente base no exponga `__adtReflowSetDockMenu` y aunque la barra se encuentre autooculta.

### Procedimiento

1. Mantener visible la barra principal mientras exista un menú abierto, aunque el foco haya pasado al botón Cerrar del panel.
2. Tratar el puente `__adtReflowSetDockMenu` como una optimización opcional. Si no existe, cerrar pulsando el control original que conserve `aria-pressed="true"`.
3. Capturar en el inicio de la pulsación si la intención era abrir o cerrar, antes de mover el foco.
4. Usar la ruta de liberación solamente cuando el control no estaba enfocado o la barra estaba fuera del área visible; en los demás casos conservar un único flujo de `click`.
5. Mantener ininterrumpida la animación de `1ms` del contenedor para que Base UI complete tanto la entrada oculta como la salida. Durante el primer pintado, desactivar solamente animaciones y transiciones de los controles descendientes; quitar la animación del propio panel reinicia `enter` al revelar y puede bloquear el desmontaje.
6. Incrementar por separado las versiones de `reflow-book.js` y `reflow.css`; los recursos versionados se sirven con caché inmutable.

### Validación

- Recargar Chrome y confirmar la compilación `47-full-book-104`, `document.readyState = complete`, `aria-busy = false` y `document.fonts.status = loaded`.
- Ejecutar Índice cerrado → abierto → cerrado → abierto y comprobar panel visible, `aria-expanded` y desmontaje final.
- Ejecutar Herramientas cerrado → abierto → cerrado y comprobar que ya no conserve `reflow-panel-pending` al mostrarse.
- Confirmar que ambos paneles dejan de estar montados después del cierre y que el foco vuelve al botón de origen.
- Revisar la consola y las cabeceras del servidor.

### Resultado obtenido

- Índice cerró con `expanded/open/mounted = false/false/false` y volvió a abrir con `true/true/true`.
- Herramientas abrió listo con `expanded/open/pending = true/true/false` y cerró con `false/false/false`.
- La prueba se realizó con el puente del runtime ausente, validando expresamente la ruta de respaldo.
- Chrome no registró errores de consola; Atkinson Hyperlegible terminó cargada.

### Riesgos y excepciones

- `animation: none` sobre el propio panel puede reiniciar `enter` al revelar o dejarlo en `data-closed` y `data-ending-style`; aplicarla únicamente a los descendientes durante el primer pintado.
- Cambiar un recurso servido como `immutable` sin cambiar su parámetro `v` mantiene la copia anterior en Chrome.
- Las comprobaciones automáticas deben esperar el montaje del componente base antes de interpretar una apertura como fallida.

### Reversión

Retirar el cierre alternativo por `aria-pressed`, la captura de intención de puntero y la duración de salida de `1ms`; restaurar simultáneamente las versiones anteriores de CSS y JavaScript en `index.html`.

---

## Acción 30: respetar movimiento reducido del sistema y de la configuración

### Objetivo

Mantener instantáneos los cambios de página, respetar automáticamente `prefers-reduced-motion` y permitir que cada lector establezca o restablezca una preferencia manual desde Herramientas.

### Áreas que deben revisarse

- Estado inicial y persistencia de la preferencia de movimiento.
- Cambios en vivo de `prefers-reduced-motion`.
- Animaciones, transiciones, desplazamientos y celebraciones decorativas.
- Reproducción automática al cambiar de página.
- Sincronización con el componente base y versionado de los recursos.

### Procedimiento

1. Interpretar la ausencia de una preferencia guardada como «usar configuración del sistema», no como `false`.
2. Escuchar los cambios de `prefers-reduced-motion` y aplicarlos mientras no exista una elección manual.
3. Permitir activar o desactivar manualmente la reducción y ofrecer «Usar configuración del sistema» para volver al modo automático.
4. Publicar el estado efectivo en `data-reflow-reduce-motion` y sincronizarlo, cuando exista, con el átomo `reduceMotion` del runtime base.
5. Mantener `scroll-behavior: auto` en la paginación y neutralizar las animaciones no esenciales cuando el estado efectivo sea reducido.
6. Consultar la preferencia efectiva antes de lanzar confeti y retirar cualquier confeti ya visible al activarla.
7. Impedir que la reproducción automática inicie narración en un cambio de página con movimiento reducido; no reactivarla automáticamente al abandonar ese modo.
8. Preferir una transición corta de opacidad para el feedback del cuestionario, sin desplazamiento, escala ni rebote.
9. Incrementar las versiones de CSS, runtime y secuencia de actividades porque el servidor trata esos recursos como inmutables.

### Archivos modificados

- `assets/reflow-book.js`
- `assets/quiz-sequence.js`
- `content/reflow.css`
- `index.html`

### Validación estática

- Ejecutar `node --check assets/reflow-book.js`.
- Ejecutar `node --check assets/quiz-sequence.js`.
- Ejecutar `git diff --check`.
- Confirmar que `goToPage` conserva `scrollBehavior = "auto"`.
- Confirmar que confeti y autoplay consultan el estado efectivo.

### Validación en navegador

- Sin preferencia manual, comprobar que Herramientas identifica la fuente como «configuración del sistema».
- Cambiar manualmente el interruptor y confirmar `data-reflow-motion-preference="manual"`.
- Pulsar «Usar configuración del sistema» y confirmar el regreso a `data-reflow-motion-preference="system"`.
- Navegar entre páginas y comprobar que el cambio sigue siendo instantáneo.
- Con reducción activa, validar ausencia de confeti, rebotes, desplazamientos decorativos y arranque automático de narración.
- Abrir y cerrar Índice y Herramientas para comprobar que las transiciones técnicas de montaje siguen completando el ciclo.

### Resultado obtenido

- La compilación `47-full-book-105` cargó completa, con `aria-busy="false"` y `scroll-behavior: auto`.
- El modo automático pasó de movimiento normal a reducido en vivo al cambiar la preferencia emulada del sistema, sin recargar la página.
- El interruptor creó una preferencia manual y «Usar configuración del sistema» eliminó esa excepción y ocultó correctamente el botón.
- La navegación avanzó de «Página 6 de 234» a «Página 7 de 234» de forma instantánea y no inició ningún audio.
- Índice y Herramientas completaron los ciclos abrir/cerrar con reducción activa y terminaron invisibles con `aria-expanded="false"`.
- Una respuesta correcta mostró feedback sin animación espacial y produjo cero capas de confeti.
- La emulación se retiró al finalizar y el libro quedó en modo automático, siguiendo la configuración real del sistema.

### Riesgos y excepciones

- No aplicar `animation: none` al contenedor base de los paneles: necesita una salida técnica de `1ms` para desmontarse correctamente.
- Una elección manual `false` es válida y debe prevalecer sobre el sistema hasta que se pulse «Usar configuración del sistema».
- Desactivar autoplay al solicitar reducción de movimiento no debe reactivarlo después sin una acción explícita de la persona.
- El feedback mediante color u opacidad breve permanece permitido porque no produce movimiento espacial.

### Reversión

Restaurar la lectura booleana anterior de `reducedMotion`, retirar el botón para volver al sistema y recuperar conjuntamente las versiones previas de los tres recursos en `index.html`.

---

## Plantilla para las próximas acciones

Copiar esta estructura al documentar una nueva receta:

```markdown
## Acción N: nombre descriptivo

### Objetivo

### Áreas que deben revisarse

### Procedimiento

### Archivos modificados o eliminados

### Validación estática

### Validación en navegador

### Resultado obtenido

### Riesgos y excepciones

### Reversión
```
