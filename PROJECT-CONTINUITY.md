# Estado para retomar el trabajo

Última actualización: 12 de agosto de 2026.

## Última operación completada

Se completaron los puntos 1 y 2 del análisis de la barra inferior permanente: crear un reproductor TTS flotante y diferenciar «Activar lectura en voz alta» de «Reproducir».

## Implementación realizada

- La barra principal conserva Índice, Anterior, contador, Siguiente y Herramientas.
- El reproductor TTS contiene Audio anterior, Reproducir/Pausar, Audio siguiente, Voz y velocidad y Detener.
- Se reutiliza el puente de audio existente; no se creó un segundo elemento `Audio`.
- Pausar conserva la sesión y el reproductor; Detener los cierra y devuelve el foco al contenido.
- Los controles admiten navegación con flechas y mantienen nombres accesibles en móvil.
- Activar la preferencia prepara una sesión pausada; el audio comienza solamente al pulsar «Reproducir».
- La receta general y los errores encontrados están documentados en las acciones 14 y 15 de `BOOK-MAINTENANCE-PLAYBOOK.md`.

## Último cambio aplicado

La reserva inferior se estaba calculando incorrectamente porque JavaScript interpretaba `2.5rem` como `2.5px`. Se añadió la conversión de `rem` a píxeles y se fijó una franja estable de `4rem` para evitar que el reproductor cubra texto o foco.

Este último ajuste quedó aplicado y validado en navegador.

Al retomar se añadió `tools/serve-local.js`, un servidor estático local con caché desactivada para repetir las pruebas de forma consistente. Se inicia con `node tools/serve-local.js`.

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
- Se ejecutaron las comprobaciones:

   ```powershell
   node --check assets/reflow-book.js
   git diff --check
   ```

Las comprobaciones estáticas de `assets/reflow-book.js` y `tools/serve-local.js` pasan.

## Estado de Git

Los cambios no se han comiteado ni subido. Antes de confirmar, revisar conjuntamente las modificaciones previas de EVA y las de este reproductor en:

- `assets/reflow-book.js`
- `content/reflow.css`
- `index.html`
- `BOOK-MAINTENANCE-PLAYBOOK.md`
- `PROJECT-CONTINUITY.md`
- `tools/serve-local.js`

## Trabajo posterior acordado

Continuar con el siguiente bloque del documento de requisitos: mejorar cierre, retroceso y devolución del foco en los paneles. Después quedan reorganizar Herramientas y revisar la adaptación móvil. Los radios EVA continúan pendientes.
