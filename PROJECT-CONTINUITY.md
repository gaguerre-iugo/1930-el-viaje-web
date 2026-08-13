# Estado para retomar el trabajo

Última actualización: 13 de agosto de 2026.

## Última operación completada

Se completaron los puntos 1, 2, 3, 4 y 5 del análisis de la barra inferior permanente: crear un reproductor TTS flotante, diferenciar «Activar lectura en voz alta» de «Reproducir», añadir cierre y control completo del foco, reorganizar Herramientas y adaptar progresivamente la interfaz a móvil.

## Implementación realizada

- La barra principal conserva Índice, Anterior, contador, Siguiente y Herramientas.
- El reproductor TTS contiene Audio anterior, Reproducir/Pausar, Audio siguiente, Voz y velocidad y Detener.
- Se reutiliza el puente de audio existente; no se creó un segundo elemento `Audio`.
- Pausar conserva la sesión y el reproductor; Detener los cierra y devuelve el foco al contenido.
- Los controles admiten navegación con flechas y mantienen nombres accesibles en móvil.
- Activar la preferencia prepara una sesión pausada; el audio comienza solamente al pulsar «Reproducir».
- Índice y Herramientas incorporan cierre explícito; Glosario incorpora cierre y regreso a Herramientas.
- `Tab` queda dentro del panel abierto, `Escape` lo cierra y el foco vuelve al control de origen.
- Herramientas se organiza en Apoyos para la lectura, Preferencias, Atajos de teclado y Herramientas, con Audio y voz como subgrupo.
- Resaltado queda deshabilitado y explicado cuando TTS está apagado; Descripción de imágenes permanece independiente.
- Se añadió una preferencia funcional para reducir movimiento y se evitó que el panel quede detrás del reproductor TTS.
- Reducir movimiento ahora hereda automáticamente `prefers-reduced-motion`, sigue sus cambios en vivo y admite una elección manual reversible mediante «Usar configuración del sistema».
- El estado efectivo desactiva confeti, movimiento decorativo y autoplay entre páginas, mientras los cambios de página permanecen instantáneos.
- Se normalizaron los estados normal, `hover`, foco, pulsado, seleccionado, deshabilitado, carga, error y éxito en la interfaz del lector.
- Las voces publican carga, error y éxito mediante estado semántico y mensaje visible; las palabras del glosario publican la definición abierta mediante `aria-expanded`.
- Las opciones deshabilitadas y el feedback enfocado de actividades incorporan señales de borde y forma que no dependen solamente del color.
- En móvil, las etiquetas se mantienen completas cuando caben, «Herramientas» pasa visualmente a «Herram.» en el corte intermedio y solo se oculta el texto en anchos extremos.
- Los nombres accesibles completos, el orden fijo, las áreas táctiles de 44 px y el contador de 16 px se conservan en todos los cortes.
- Índice, Herramientas y Glosario dejan un borde visible en pantallas estrechas y mantienen desplazamiento interno.
- El resaltado del glosario limita ahora sus mediciones a las raíces de contenido que cubren la página visible; ya no recorre las 413 páginas en cada navegación.
- La apertura de Herramientas ya no entra en un ciclo de mutaciones: las actualizaciones son idempotentes y se agrupan en un solo cuadro de renderizado.
- El inicio carga solo el catálogo de la voz seleccionada; la segunda voz se prepara bajo demanda.
- La navegación reutiliza mapas de actividades y páginas finales y omite la actualización duplicada producida por su propio evento `scroll`.
- Herramientas permanece oculto hasta que su estructura y selecciones actuales están listas; la protección de página ya no recalcula cuando no hubo desplazamiento.
- Lectura en voz alta y Resaltado esperan además sus estados efectivos antes del primer pintado de Herramientas.
- El primer pintado valida también los marcadores y clases visuales y suprime las transiciones iniciales de 150 ms.
- La receta general y los errores encontrados está documentada en las acciones 14 a 24 de `BOOK-MAINTENANCE-PLAYBOOK.md`.

## Último cambio aplicado

La reserva inferior se estaba calculando incorrectamente porque JavaScript interpretaba `2.5rem` como `2.5px`. Se añadió la conversión de `rem` a píxeles y se fijó una franja estable de `4rem` para evitar que el reproductor cubra texto o foco.

Este último ajuste quedó aplicado y validado en navegador.

Al retomar se añadió `tools/serve-local.js`, un servidor estático local que se inicia con `node tools/serve-local.js`. Ahora revalida `index.html`, conserva durante un año los recursos versionados y usa una caché corta para imágenes y medios sin versión.

El punto 5 añadió cortes móviles a `22rem` y `30rem`, una abreviatura únicamente visual para Herramientas y un ancho seguro para los paneles laterales. Las versiones quedaron en `reflow.css?v=66-progressive-mobile-toolbar` y `reflow-book.js?v=87-progressive-mobile-toolbar`.

Tras ese commit se detectó que «Resaltar palabras» podía aparentar un crash: `textNodesForVisualPage` recorría y medía todo el libro en cada página. Se añadió un filtro por raíces importadas y se versionó el runtime como `reflow-book.js?v=88-page-scoped-glossary-scan`.

También se corrigió un bloqueo al abrir Herramientas. El `MutationObserver` del panel reaccionaba a reescrituras de texto realizadas por su propia función de montaje; ahora solo cambia valores distintos, agrupa las notificaciones con `requestAnimationFrame` y el runtime se versionó como `reflow-book.js?v=89-idempotent-tools-panel`.

La optimización siguiente redujo a una sola voz la carga inicial de catálogos TTS y dejó la alternativa disponible bajo demanda. Además, las páginas de actividades y cierre se cachean por repaginación y el runtime evita repetir `updateControls` para el `scroll` que él mismo genera. La versión vigente es `reflow-book.js?v=90-selective-tts-and-page-cache`.

La apertura de Herramientas se estabilizó exigiendo el panel organizado y sus selecciones antes de hacerlo visible. La restauración defensiva de página retorna de inmediato cuando no hubo movimiento. La versión vigente pasó a `reflow-book.js?v=91-stable-tools-first-paint`.

Después se amplió el criterio de primer pintado para comparar Lectura en voz alta y Palabra/Oración con el estado real capturado antes de abrir. La versión vigente es `reflow-book.js?v=92-synchronized-tools-state`.

El destello restante provenía de las transiciones visuales del componente base, no de valores incorrectos. Ahora se validan `data-checked/data-unchecked`, thumb y clases segmentadas, y las transiciones se desactivan solo durante el primer pintado.

La explicación de disponibilidad de Resaltado estaba participando como tercer elemento de una fila flexible: medía `358 px`, comprimía el selector a `4 px` y superponía los textos. La fila ahora usa una cuadrícula específica, con la explicación en una segunda línea.

Con Ocultar menús automáticamente, la protección de gestos detenía `pointerdown` antes de que el botón pulsado recibiera foco. La barra podía volver a ocultarse y mover Herramientas antes de que llegara `click`. Ahora el control se enfoca y la barra se sincroniza antes de detener el gesto del lector base.

Chrome y el navegador integrado podían completar una parte de la secuencia del puntero pero omitir `click` cuando la barra cambiaba de estado. La solución vigente captura la intención al iniciar la pulsación, usa una liberación de respaldo solo cuando el control estaba desenfocado o autooculto y conserva el flujo normal de clic para controles estables. El cierre ya no depende del puente del runtime: puede activar el control original con `aria-pressed="true"`. La animación de `1ms` del contenedor permanece ininterrumpida para el ciclo de Base UI; la protección del primer pintado desactiva únicamente las transiciones de los controles internos, evitando el parpadeo al revelar Herramientas. Las versiones vigentes son `reflow.css?v=72-stable-tools-first-paint` y `reflow-book.js?v=108-first-press-release-fallback`.

El tratamiento de movimiento se actualizó después: la compilación es `47-full-book-105` y las versiones vigentes pasan a `reflow.css?v=73-effective-reduced-motion`, `reflow-book.js?v=109-effective-reduced-motion` y `quiz-sequence.js?v=7-effective-reduced-motion`.

La normalización de estados de interacción eleva la compilación a `47-full-book-106` y las versiones vigentes pasan a `reflow.css?v=75-normalized-interaction-states` y `reflow-book.js?v=110-normalized-interaction-states`; la secuencia de actividades permanece en `quiz-sequence.js?v=7-effective-reduced-motion`.

## Validación realizada

- La barra principal presenta únicamente Índice, Anterior, contador, Siguiente y Herramientas.
- Al activar TTS desde Herramientas, el panel se cierra y el foco llega a Reproducir/Pausar.
- Reproducir, Pausar, Audio anterior, Audio siguiente, Voz y velocidad y Detener responden correctamente.
- Los cambios de audio mientras la sesión está pausada no reanudan la reproducción.
- Las flechas desplazan el foco entre los controles del reproductor.
- Detener oculta el reproductor y devuelve el foco al contenido.
- Mostrar u ocultar el reproductor no cambia el total de páginas dentro del mismo tamaño de ventana.
- En móvil, todos los botones medidos tienen al menos `44 × 44 px` y conservan nombres accesibles.
- En escritorio (`1280 × 800`) y móvil (`566 × 698`) no se detectó contenido detrás del reproductor.
- Una recarga con la preferencia TTS activa pero pausada no produjo nuevos errores ni advertencias de reproducción automática.
- Una espera de 20 segundos tras la recarga confirmó que una repaginación tardía tampoco inicia audio: el reproductor conserva «Reproducir» y `aria-pressed="false"`.
- El foco inicial llega a «Cerrar» en Índice y Herramientas y a «Volver a Herramientas» en Glosario.
- `Tab` y `Shift+Tab` permanecen dentro del diálogo; el cierre explícito y `Escape` restauran el foco.
- Volver desde Glosario abre Herramientas con foco en su acceso «Glosario».
- Abrir Glosario con `G` y cerrarlo devuelve el foco al control de origen.
- Los nuevos controles miden al menos `44 × 44 px`, existe un solo diálogo a la vez y la página permanece en `7 / 413`.
- Los encabezados de Herramientas usan sentence case y no aplican transformación CSS.
- Glosario sigue siendo un botón de `51 px`; Idioma permanece oculto mientras solo existe `es-UY`.
- En móvil, Herramientas tiene desplazamiento interno, cero desbordamiento horizontal y termina antes del reproductor TTS.
- La revisión estática del punto 5 confirma el orden fijo, nombres accesibles completos y mínimos de 44 px; queda pendiente repetir su comprobación visual en `320`, `375`, `480` y `566 px` cuando la pestaña del navegador integrado recargue el servidor local.
- Con el glosario resaltado, la navegación bajó de aproximadamente `9,7 s` a `0,36–0,39 s` en cinco páginas consecutivas; la página 6 conservó nueve resaltados y los extremos del libro respondieron en menos de `0,3 s`.
- Herramientas se abrió y cerró cinco veces sin bloquear la página, sin duplicar controles y devolviendo el foco a su botón en cada cierre; las reaperturas respondieron en aproximadamente `1,0–1,2 s`.
- Mateo se cargó al solicitarlo y el regreso a Valentina reprodujo audio con el archivo correcto y 33 marcas temporales. Diez páginas consecutivas navegaron sin errores.
- Cinco aperturas de Herramientas conservaron página y foco; las reaperturas bajaron a unos `1,8 s` y un valor no predeterminado apareció correctamente al volver a abrir.
- Lectura en voz alta y Palabra aparecieron marcadas en tres reaperturas; también se verificaron los estados OFF y ON sin destellos ni errores.
- Los estados ON y OFF se comprobaron además en sus marcadores visuales; interruptor, thumb y Palabra estaban en su estado final antes de mostrar el panel.
- En Resaltado, etiqueta, selector y explicación tienen `0 px²` de intersección; el selector permanece dentro de una fila de `236 px` tanto con lectura activa como inactiva.
- En Chrome, Herramientas abre al primer clic después de reaparecer la barra autooculta y el panel permanece visible; la activación por teclado sigue funcionando.
- En Chrome, Índice y Herramientas completan con mouse los ciclos `false → true → false` tanto en visibilidad como en `aria-expanded`, sin errores de consola.
- En el navegador integrado, Índice y Herramientas completan también los ciclos `false → true → false` con pulsaciones físicas; el foco de Índice se restaura correctamente.
- La preferencia de movimiento distingue fuente automática y manual, ofrece regreso al sistema y publica el estado efectivo para las actividades y el runtime base.
- Con reducción activa, la paginación conserva desplazamiento instantáneo, el confeti se omite y la narración no se inicia automáticamente al cambiar de página.
- La revisión estática de los estados confirma señales no cromáticas para deshabilitado, carga, error y éxito, además de foco reforzado para el feedback de actividades.
- En navegador se verificaron `hover` y foco de pestaña, apariencia deshabilitada de Resaltado, confirmación de voz, expansión y devolución de foco del glosario y foco visible del feedback correcto.
- Las cabeceras verificadas son `no-cache` para `index.html`, caché inmutable anual para recursos versionados y una hora para imágenes sin versión.
- Se ejecutaron las comprobaciones:

   ```powershell
   node --check assets/reflow-book.js
   git diff --check
   ```

Las comprobaciones estáticas de `assets/reflow-book.js` y `tools/serve-local.js` pasan.

## Estado de Git

Los puntos 1 a 5 están comiteados y subidos en `ebc2f59e`. Las correcciones de rendimiento del glosario, Herramientas, voces y navegación todavía no están comiteadas y afectan a:

- `assets/reflow-book.js`
- `content/reflow.css`
- `index.html`
- `BOOK-MAINTENANCE-PLAYBOOK.md`
- `PROJECT-CONTINUITY.md`
- `tools/serve-local.js`

## Trabajo posterior acordado

Completar la comprobación visual del punto 5 en los cuatro anchos acordados y continuar con la unificación de iconos del documento. Los radios EVA continúan pendientes.
