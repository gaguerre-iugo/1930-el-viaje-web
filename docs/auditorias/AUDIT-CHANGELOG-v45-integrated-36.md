# Informe auditable — v45 integrada 36

Fecha: 29 de julio de 2026  
Alcance: controles TTS pausados, semántica de reproducción automática y
ajustes menores de Índice/Glosario.

## 1. Anterior y Siguiente con el audio pausado

### Síntoma

Después de pausar y cambiar de página, Audio anterior o Audio siguiente
podían volver a la portada.

### Causa

La navegación descartaba correctamente el audio obsoleto, pero `stop()`
reiniciaba el índice interno del runtime en cero. Ese cero se interpretaba
erróneamente como una posición real en el libro.

### Solución

Si no hay elemento activo ni último índice semántico válido, el control toma
como base la primera unidad TTS de la página visual actual. Desde allí:

- Anterior llega a la última unidad de la página precedente.
- Siguiente llega a la segunda unidad de la página actual.
- Si la página sólo contiene una unidad, Siguiente continúa legítimamente en
  la página posterior.
- Al pulsar Anterior/Siguiente, la pausa manual deja de estar activa porque el
  propio paso constituye una orden explícita de reproducción.

### Verificación

- Sin posición en página 8, Anterior resolvió base `30`, resultado `29` y
  navegó a página 7; el índice interno del runtime era el cero obsoleto.
- Sin posición en página 7, Siguiente resolvió base `27`, resultado `28` y
  permaneció en página 7.

## 2. Reproducción automática

La función estaba limitada al montaje inicial y se había vuelto casi
redundante después de integrar el inicio directo desde Texto a voz.

Ahora significa: con Texto a voz habilitado, si la narración está inactiva y
el usuario cambia de página, comienza en la primera unidad de la nueva página.
Una pausa manual tiene prioridad absoluta y nunca se reactiva por navegar.

## 3. Interfaz

- «Lista de páginas» pasa a llamarse «Páginas».
- El encabezado del Glosario separa «Resaltar palabras» 16 px del título,
  sin aumentar el panel ni reducir Verdana.

## 4. Archivos modificados

- `assets/reflow-book.js`
- `assets/interface_translations/es-UY/interface_translations.json`
- `content/reflow.css`
- `assets/config.json`
- `index.html`
- manifiesto, playbook y know-how.
