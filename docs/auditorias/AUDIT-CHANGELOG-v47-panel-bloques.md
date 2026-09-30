# Cambio de mantenimiento — panel de Herramientas en tres bloques y atajos nuevos

## Alcance

Reorganización del panel de **Configuración** (botón *Herramientas*) y de los
atajos de teclado del libro. No cambia el texto del libro, ni la paginación, ni
el reproductor TTS. Complementa el ajuste anterior
(`AUDIT-CHANGELOG-v47-menu-herramientas.md`), que ya ocultaba las filas de audio
con la lectura en voz alta apagada.

## 1. Reproducción automática debajo del interruptor

En el bloque de audio, **Reproducción automática** pasó de ser la última fila a
quedar inmediatamente debajo de **Activar lectura en voz alta**, seguida por
**Voz del narrador**, **Velocidad** y **Resaltado**.

## 2. Tres bloques con título

| Bloque | Filas, en orden |
|---|---|
| **Leer** | Glosario · Tamaño de letra (con sus cuatro opciones) · Lectura fácil · Descripción de imágenes |
| **Escuchar** | Activar lectura en voz alta · Reproducción automática · Voz del narrador · Velocidad · Resaltado |
| **Pantalla** | Reducir movimiento · Ocultar menús automáticamente |

Las cuatro secciones anteriores (*Apoyos para la lectura*, *Preferencias*,
*Comportamiento* y *Herramientas*) quedaron disueltas dentro de esos tres
bloques, y el subtítulo **Audio y voz** se eliminó porque el bloque *Escuchar*
ya cumple esa función.

## 3. Atajos de teclado

Antes: letras sueltas **X** (índice), **A** (Herramientas) y **G** (glosario),
con la lista ocupando 248 px dentro del panel.

Ahora:

- **Alt+I** abre el índice, **Alt+H** abre Herramientas, **Alt+G** abre el
  glosario y **Alt+A** muestra la ayuda de atajos. **Esc** sigue cerrando el
  panel abierto.
- **Ninguna letra suelta hace nada.** Es el punto 2.1.4 de WCAG 2.1 (*Character
  Key Shortcuts*): un atajo que depende de una tecla de carácter sola tiene que
  poder desactivarse, reasignarse o funcionar sólo con el foco puesto. Se
  resolvió con modificador (`Alt`), que además no cuesta altura en el panel.
  Las teclas `X` y `A` que registra el runtime se anulan en fase de captura
  sobre `window`, que corre antes que sus manejadores.
- La lista se mudó a una **ayuda propia**: el diálogo se abre con `Alt+A` o con
  el enlace **Atajos de teclado [Alt+A]** al pie del panel. Es un
  `role="dialog"` con `aria-modal`, foco inicial en el botón de cierre, `Esc`
  para cerrar, cierre al tocar el fondo y devolución del foco al cerrar.
- La ayuda lista **cinco** entradas: `Alt+I`, `Alt+H`, `Alt+G`, `Alt+A` y `Esc`.
  En la revisión se sacaron de la lista las dos entradas de navegación por
  páginas (*Pasar de página* con las flechas e *Ir a la primera o a la última
  página* con Inicio/Fin), que no formaban parte del índice anterior de atajos,
  y la línea que explicaba el uso de `Alt`. Las teclas de página siguen
  funcionando como siempre: nunca fueron un atajo documentado en el panel, sólo
  se habían agregado a esta lista.

Los combos `Alt+Shift` que anuncia el tutorial **no están implementados** (no lo
estaban antes de este cambio): ver *Pendientes*.

## 4. El panel entra sin scroll con la voz apagada

Medido en Chromium con la voz apagada:

| Pantalla | Antes | Ahora |
|---|---|---|
| 1366 × 900 | 1172 px de contenido, con scroll | 745 px, termina en **828** de 900, sin scroll interno |
| 1920 × 1080 | — | termina en **1008** de 1080, sin scroll interno |

De dónde salió el alto:

- La sección **Atajos de teclado** salió del panel (248 px) y en su lugar queda
  un enlace de una línea.
- Las secciones y las tarjetas se **aplanaron** (`display: contents`): se fueron
  sus paddings y los bordes de tarjeta apilados, y el panel quedó como una lista
  con tres títulos y separadores de una hairline.
- El subtítulo **Audio y voz** se eliminó.
- Densidad: padding de fila `.75rem → .5rem`, textos de ayuda `.9rem`, opciones
  de tamaño de letra con `gap` y padding mínimos.
- **Los textos de ayuda no se tocaron** (decisión de la revisión): siguen
  completos. Las áreas táctiles se mantienen en el mínimo de 2.75rem (44 px) que
  exige el manual.

Con la lectura en voz alta encendida el panel sí necesita scroll: aparecen
cuatro filas más (voz, velocidad, resaltado y reproducción automática). El
objetivo acordado era el estado apagado.

## Implementación

- `assets/reflow-book.js`
  - `settingsBlocks`, `ensureSettingsBlockTitles()` y `ensureShortcutsLink()`
    insertan los tres títulos y el enlace de ayuda. Son nodos propios: el
    runtime puede volver a montar el panel y se reinsertan en cada montaje.
  - `installKeyboardShortcuts()` — anulación de letras sueltas, atajos con
    `Alt` (leídos por `event.code`, para que funcionen en cualquier
    distribución de teclado) y el diálogo de ayuda.
  - `organizeSettingsPanel()` ya no crea el subtítulo *Audio y voz*, y el botón
    del glosario declara `aria-keyshortcuts="Alt+G"`.
- `content/reflow.css` — aplanado, títulos de bloque, valores de `order` por
  bloque, densidad, enlace al pie y estilos de la ayuda.
- `index.html` — parámetros de caché a
  `reflow.css?v=97-bloques-y-atajos` y `reflow-book.js?v=140-bloques-y-atajos`.

**Por qué `order` y no mover nodos:** las filas de *Lectura fácil*,
*Descripción de imágenes*, *Activar lectura en voz alta*, *Reproducción
automática*, *Resaltado* y *Ocultar menús* las renderiza el runtime de React. Al
reagruparlas en tres bloques habría que reparentarlas, y React falla al
desmontar un nodo que ya no está donde lo dejó (`removeChild` sobre otro padre).
Con `display: contents` sobre las secciones y las tarjetas, esas filas pasan a
ser ítems del mismo flujo flex y se ubican con `order`, sin tocar el DOM.

**Limitación conocida:** el orden visual no coincide con el orden del DOM, así
que el recorrido de tabulación sigue el orden del DOM. Es la misma técnica que
el panel ya usaba para ordenar las filas de lectura, ahora llevada a los tres
bloques.

## Verificación

`tools/screen-test/verify-tools-panel.mjs` (reemplaza y amplía
`verify-tts-menu.mjs`, que verificaba sólo la regla de las filas de audio):

```powershell
node tools/serve-local.js
node tools/screen-test/verify-tools-panel.mjs --url http://127.0.0.1:5501/index.html
node tools/screen-test/verify-tools-panel.mjs --url http://127.0.0.1:5501/index.html --viewport 1920x1080
```

Comprueba, contra el DOM real: orden de los tres bloques, filas de audio ocultas
y visibles según el interruptor, reproducción automática debajo del interruptor,
alto del panel contra el viewport sin scroll interno (1366 × 900 y
1920 × 1080), letras sueltas inertes, `Alt+I/H/G` abriendo cada panel, `Alt+A`
abriendo la ayuda como diálogo modal con el foco en el cierre y la lista exacta
de cinco atajos —sin la nota sobre `Alt`—, y `Esc` cerrándola. Ambas corridas
terminan en `OK: el panel y los atajos cumplen las reglas`, sin errores de
consola.

Capturas: `tmp/panel-bloques.png`, `tmp/panel-tts-encendida.png` y
`tmp/ayuda-atajos.png` (`tmp/` está fuera del control de versiones).

## Pendientes y decisiones

- **El tutorial no existe en esta exportación** (decisión: dejarlo como está).
  Los textos `tutorial-*`, el flag `showTutorial` y las animaciones
  `tutorialPopIn`/`pulseBorder` son restos del runtime ADT: el módulo de
  tutorial no viene en este bundle, así que nadie los muestra ni los anuncia.
  Se comprobó que `base.bundle.local.js`, `base.bundle.min.js` y
  `reflow-book.js` tienen **cero** referencias a `tutorial`, `showTutorial` y
  "Bienvenido al libro". Esos textos anuncian `Alt+Shift+A/X/Z`, que tampoco
  existen (no respondían antes de este cambio); sólo volverían a importar si el
  runtime recupera el tutorial.
- **`bundleVersion` y `reflowBuild`** siguen sin subir, por el costo de invalidar
  los catálogos de voz (unos 9 MB por voz).
- **`pg036_sec001.html`** es una página suelta heredada con parámetros de caché
  viejos; recibe los cambios de CSS por compartir archivo, pero no se tocó.
