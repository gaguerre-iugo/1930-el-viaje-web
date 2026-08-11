# Informe auditable — v45 integrada 33

Fecha: 28 de julio de 2026  
Alcance: ritmo de Lectura fácil en la composición del altillo y locución de
continuación para el chat dividido.

## 1. Texto excesivamente separado junto a la imagen

### Síntoma

Con Lectura fácil y Mayúsculas, las frases a la derecha de la imagen del
altillo ocupaban toda su altura mediante espacios verticales exagerados. La
palabra «manojo» podía quedar aislada en un renglón.

### Causa

La igualación exacta imagen–párrafo, apropiada para el párrafo editorial
estándar, se aplicaba también a las unidades independientes de Lectura fácil.
En la combinación observada elevaba el interlineado efectivo de unos 31 px a
más de 62 px.

### Cambio

- En lectura estándar se conserva la igualdad exacta de bordes.
- En Lectura fácil se conserva el interlineado accesible `1,55` y el grid
  centra el bloque de altura natural junto a la imagen.
- Un espacio no separable de presentación mantiene unido «un manojo»; no se
  modifica el texto fuente, el texto accesible ni el audio.

### Verificación

Se comprobó Mayúsculas + Lectura fácil en Normal y Extra grande. Las frases
mantienen un ritmo uniforme, «UN MANOJO» queda unido y no hay texto por encima
o debajo de la imagen.

## 2. Locución de continuación del chat

### Requisito

Cuando el chat de WhatsApp se divide en dos páginas, la segunda debe comenzar
con la locución «Continuación de la conversación de WhatsApp».

### Cambio

- Se agregó una unidad semántica invisible al comienzo de la segunda tarjeta.
- Su `data-id` y su entrada en la cola TTS existen únicamente cuando concurren
  Lectura fácil + Mayúsculas + tamaño Grande o Extra grande.
- La unidad se inserta inmediatamente antes del primer mensaje de la segunda
  tarjeta.
- Se reutilizó la locución rioplatense ya validada en el capítulo 5.
- Al volver a un chat único, se quitan el ID narrable y el elemento de la cola
  para que no se anuncie una continuación inexistente.

### Verificación

- Grande y Extra grande, combinación de división: `data-id` presente, elemento
  visible para tecnología asistiva y `data-reflow-tts-queued="true"`.
- Normal o configuración sin división: `data-id` ausente, elemento oculto y
  `data-reflow-tts-queued="false"`.
- El anuncio no agrega texto visible sobre la ventana de chat.

## 3. Página visual 24 en tamaño Normal

La sensación de mayor separación no proviene del algoritmo anterior. Esa
página usa interlineado fijo `1,55` y un margen de `0,85 rem` entre cuatro
párrafos editoriales originales. No hay estiramiento dinámico ni imagen que
se esté intentando igualar. Se conserva sin cambios hasta recibir una decisión
de estilo.

## 4. Archivos modificados

- `assets/reflow-book.js`
- `assets/config.json`
- `index.html`
- `content/i18n/es-UY/audios.json`
- `content/i18n/es-UY/texts.json`
- `content/i18n/es-UY/audio/whatsapp_chat_continuation_es-UY.mp3`
- documentos de know-how y manifiesto.

