# Informe auditable — v45-integrated-37

Fecha: 29 de julio de 2026.

## Objetivo

Incorporar Mateo como segundo narrador completo sin exponer una voz parcial,
sin reutilizar las marcas temporales de Valentina y sin alterar el contenido
visible del libro.

## Implementación

- Se sintetizó la voz `es-UY-MateoNeural` para las 1206 unidades semánticas
  definidas por el catálogo base en español de Uruguay.
- Cada unidad cuenta con su MP3 y sus propios límites temporales por palabra.
  Las marcas de Mateo proceden de la síntesis de Mateo; no son una copia de
  las de Valentina.
- `audios.json` conserva las mismas 1206 claves semánticas y resuelve cada una
  hacia `voices/mateo/audio/`.
- El selector de narrador continúa aplicando la regla de disponibilidad
  completa: una voz sólo aparece si sus catálogos de audio y tiempo cubren el
  inventario base íntegro.
- El cambio entre Valentina y Mateo mantiene la página visual y el ID
  semántico actual, y sustituye conjuntamente audio y sincronización.
- Las locuciones asociadas a WhatsApp conservan la grafía visual original y
  usan la pronunciación indicada «uatsap».

## Evidencia reproducible

```sh
.tts-venv/bin/python tools/validate_voice_catalog.py --voice-key valentina
.tts-venv/bin/python tools/validate_voice_catalog.py --voice-key mateo
```

Resultado esperado para cada voz:

- 1206 claves en `audios.json`.
- 1206 claves en `timecodes.json`.
- 1206 archivos MP3 no vacíos.
- Ninguna clave faltante o adicional.
- Marcas temporales ordenadas, no negativas y contenidas en la duración.
- Cobertura textual completa según el normalizador del lector.

## Límite de esta iteración

Mateo utiliza la prosodia estándar de Microsoft Edge TTS. El futuro pipeline
de análisis contextual y control prosódico con Azure o Gemini constituye una
capa independiente: primero producirá un guion oral anotado y luego comparará
variantes sobre un corpus piloto antes de sustituir los catálogos vigentes.
