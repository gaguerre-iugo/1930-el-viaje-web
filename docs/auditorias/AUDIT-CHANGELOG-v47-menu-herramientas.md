# Cambio de mantenimiento — menú de Herramientas y lectura en voz alta

## Alcance

Ajuste del panel de **Configuración** (el que abre el botón *Herramientas*), en
la sección **Apoyos para la lectura**. No cambia el texto del libro, ni la
paginación, ni el reproductor TTS.

## Regla nueva

Con **Activar lectura en voz alta** apagado, estas filas ya no se muestran:

| Fila | Antes | Ahora |
|---|---|---|
| **Resaltado** (Palabra / Oración) | visible y deshabilitada | oculta |
| **Voz del narrador** (Valentina / Mateo) | visible | oculta |
| **Velocidad** (Lenta / Normal / Rápida / Muy rápida) | visible | oculta |
| **Reproducción automática** | visible | oculta |
| Encabezado **Audio y voz** | visible | oculto |

Al encender la lectura en voz alta vuelven a aparecer todas, en el mismo orden.
Las tres filas que no dependen del audio —**Lectura fácil**, **Activar lectura en
voz alta** y **Descripción de imágenes**— se ven siempre.

Antes el panel dejaba los controles a la vista pero inservibles: el Resaltado y
la Velocidad quedaban deshabilitados y el Resaltado mostraba la leyenda *"Active
Lectura en voz alta para utilizar el resaltado."*. Con las filas ocultas esa
leyenda ya no tiene dónde mostrarse: queda en el código como respaldo del estado
deshabilitado, pero no se ve.

## Implementación

- `assets/reflow-book.js`
  - `readAloudDependentRows()` y `syncReadAloudDependentRows()` (dentro de
    `createFontControls`) reúnen las cinco filas y las ocultan o las muestran
    según `readAloudSettingIsEnabled()`.
  - `syncHighlightAvailability()` —que ya se ejecutaba al abrir el panel y ante
    cada cambio del interruptor— ahora empieza llamando a ese sincronizador, así
    que la regla se aplica en el mismo ciclo que el estado del audio.
  - `settingsRow()` busca cada fila por la clase que ya le ponía
    `organizeSettingsPanel` (`reflow-setting-highlight`,
    `reflow-setting-autoplay`, ...) y, si no está, por el texto de la etiqueta.
  - `updateTtsVoiceControls()` **ya no fuerza visible** la fila de Voz
    (`selector.hidden = false`): era justamente lo que volvía a mostrarla cuando
    se cargaba un catálogo de voz. Ahora delega en el sincronizador.
  - Si el foco estaba dentro de una fila que se oculta, pasa al interruptor de
    *Activar lectura en voz alta* (leer el foco **antes** de ocultar, porque al
    pasar a `display:none` el navegador lo devuelve al `body`).
- `content/reflow.css` — `.reflow-setting-tts-hidden { display: none !important }`.
  Hacen falta los dos mecanismos: el atributo `hidden` (semántica y árbol de
  accesibilidad) y la clase con `!important` (las filas traen clases de Tailwind
  que le ganan a la regla del navegador para `[hidden]`).
- `index.html` — se subieron los dos parámetros de caché:
  `reflow.css?v=95-menu-tts-condicional` y
  `reflow-book.js?v=138-menu-tts-condicional`.

El runtime cierra el panel cuando se activa la lectura en voz alta, así que la
regla se comprueba al reabrirlo: el sincronizador vuelve a correr por el
observador de mutaciones del panel y deja las filas visibles.

## Verificación

Prueba nueva y repetible: `tools/screen-test/verify-tools-panel.mjs`
(Playwright + Chromium, documentada en `tools/screen-test/README.md`; en el
cambio siguiente se amplió para cubrir también los bloques y los atajos).

```powershell
node tools/serve-local.js                 # en otra terminal
node tools/screen-test/verify-tools-panel.mjs --url http://127.0.0.1:5599/index.html
```

Mide la visibilidad real (`getClientRects()` + `display`) de las cinco filas en
tres estados —apagado, encendido y vuelta a apagar— y falla si alguna no
coincide. Resultado de la corrida de hoy:

```
=== Lectura en voz alta APAGADA ===      === Lectura en voz alta ENCENDIDA ===
  Resaltado: oculto                        Resaltado: visible
  Encabezado Audio y voz: oculto           Encabezado Audio y voz: visible
  Voz: oculto                              Voz: visible
  Velocidad: oculto                        Velocidad: visible
  Reproducción automática: oculto          Reproducción automática: visible
  Lectura fácil: visible                   Lectura fácil: visible
  Activar lectura en voz alta: visible     Activar lectura en voz alta: visible
  Descripción de imágenes: visible         Descripción de imágenes: visible

consola: sin errores
OK: la regla se cumple
```

Capturas de los dos estados: `tmp/menu-tts-off.png` y `tmp/menu-tts-on.png`
(`tmp/` está fuera del control de versiones).

También se revisó que el script siga parseando: `node --check assets/reflow-book.js`.

## Pendientes y decisiones

- **Ninguna pista cuando está apagado**: hoy las opciones simplemente no están.
  Si se quiere orientar al lector, se puede agregar una línea bajo el interruptor
  del tipo *"Activá la lectura en voz alta para elegir voz y velocidad"*.
- **`pg036_sec001.html`** es una página suelta heredada que carga
  `reflow.css?v=50-sentence-case` y `reflow-book.js` sin parámetro. Recibe este
  cambio (mismo archivo), pero su parámetro de caché quedó viejo; no se tocó
  porque es una página fuera del recorrido del libro.
- **Identificadores de build**: `assets/config.json` (`bundleVersion`) y
  `reflowBuild` en `assets/reflow-book.js` quedaron como estaban. Subirlos
  invalida también los catálogos de voz (unos 9 MB por voz), así que es una
  decisión de publicación.
