# Informe auditable — v45 integrada 34

Fecha: 28 de julio de 2026  
Alcance: navegación TTS del chat dividido y diagnóstico de la composición del
altillo en Lectura fácil + Mayúsculas + Extra grande.

## 1. Salto transitorio desde el chat a la última página

### Síntoma

Al terminar la primera tarjeta del chat, la narración mostraba durante unos
tres segundos la página final de cuestionarios y luego regresaba a la segunda
tarjeta.

### Causa

La cola de audio estaba en el orden correcto. El problema era geométrico: el
anuncio invisible «Continuación de la conversación de WhatsApp» se pintaba
como un fragmento de un píxel en la última columna del contenedor
multicolumna. Además, el rango de resaltado de ese mismo texto repetía el
cálculo incorrecto aunque el elemento principal ya hubiera sido corregido.

### Cambio

- El elemento invisible hereda, para paginación, la geometría completa de la
  segunda tarjeta.
- Los `Range` de resaltado cuyo ancestro es ese anuncio heredan la misma
  geometría.
- El mapa estable de páginas TTS valida la geometría sustituta antes de
  registrar el elemento.

### Verificación

Escenario: Lectura fácil ON, Mayúsculas ON, Extra grande y reproducción desde
la primera tarjeta. En una traza de 30 segundos, la página permaneció en
`47 / 66` durante 19 segundos y pasó directamente a `48 / 66` desde el segundo
20. No apareció `66 / 66`.

## 2. Diferencia de contenido lateral entre minúsculas y mayúsculas

### Diagnóstico

El bloque fácil `pg031_n0006` contiene tres oraciones separadas por saltos de
línea, pero conserva un solo ID y un solo audio. En minúsculas entra entero
junto a la imagen; en mayúsculas + Extra grande sus líneas adicionales hacen
que el bloque completo exceda la altura disponible. El algoritmo lo mueve
entero porque partirlo invalidaría su unidad de sincronización.

### Decisión conservada

- No se reduce la fuente ni el interlineado.
- No se recorta ni se deforma la imagen.
- No se divide artificialmente un audio existente.
- Las tres oraciones continúan en la página posterior en esa combinación.

Se agregaron atributos `data-reflow-attic-*` con ancho, altura y cantidad de
unidades laterales/desbordadas para facilitar futuras auditorías. Una futura
granularización del TTS por oración permitiría un corte más fino sin perder
sincronía.

## 3. Archivos modificados

- `assets/reflow-book.js`
- `assets/config.json`
- `index.html`
- `INTEGRATION-MANIFEST.md`
- `REFLOW-NAVIGATION-KNOWHOW.md`
- `REFLOW-TYPOGRAPHY-KNOWHOW.md`
- `REFLOW-PLAYBOOK.md`

