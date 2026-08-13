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
- En móvil, las etiquetas se mantienen completas cuando caben, «Herramientas» pasa visualmente a «Herram.» en el corte intermedio y solo se oculta el texto en anchos extremos.
- Los nombres accesibles completos, el orden fijo, las áreas táctiles de 44 px y el contador de 16 px se conservan en todos los cortes.
- Índice, Herramientas y Glosario dejan un borde visible en pantallas estrechas y mantienen desplazamiento interno.
- La receta general y los errores encontrados están documentados en las acciones 14, 15, 16, 17 y 18 de `BOOK-MAINTENANCE-PLAYBOOK.md`.

## Último cambio aplicado

La reserva inferior se estaba calculando incorrectamente porque JavaScript interpretaba `2.5rem` como `2.5px`. Se añadió la conversión de `rem` a píxeles y se fijó una franja estable de `4rem` para evitar que el reproductor cubra texto o foco.

Este último ajuste quedó aplicado y validado en navegador.

Al retomar se añadió `tools/serve-local.js`, un servidor estático local con caché desactivada para repetir las pruebas de forma consistente. Se inicia con `node tools/serve-local.js`.

El punto 5 añadió cortes móviles a `22rem` y `30rem`, una abreviatura únicamente visual para Herramientas y un ancho seguro para los paneles laterales. Las versiones quedaron en `reflow.css?v=66-progressive-mobile-toolbar` y `reflow-book.js?v=87-progressive-mobile-toolbar`.

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
- Se ejecutaron las comprobaciones:

   ```powershell
   node --check assets/reflow-book.js
   git diff --check
   ```

Las comprobaciones estáticas de `assets/reflow-book.js` y `tools/serve-local.js` pasan.

## Estado de Git

Los puntos 1 a 4 están comiteados y subidos en `136ae7f2`. El punto 5 se preparó como un cambio independiente que afecta a:

- `assets/reflow-book.js`
- `content/reflow.css`
- `index.html`
- `BOOK-MAINTENANCE-PLAYBOOK.md`
- `PROJECT-CONTINUITY.md`

## Trabajo posterior acordado

Completar la comprobación visual del punto 5 en el navegador integrado y continuar con el siguiente punto del documento. Los radios EVA continúan pendientes.
