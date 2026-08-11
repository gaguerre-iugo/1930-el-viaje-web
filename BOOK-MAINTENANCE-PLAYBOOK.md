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
