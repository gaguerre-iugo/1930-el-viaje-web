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
