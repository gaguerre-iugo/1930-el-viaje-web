# Catálogo TTS — Valentina

- Voz: `es-UY-ValentinaNeural`.
- Generador: `tools/generate_dual_uy_voices.py`.
- Inventario esperado: las 9962 claves de `content/i18n/es-UY/texts.json`.
- Audio: MP3 mono de 24 kHz dentro de `audio/`; tres claves de lectura
  fácil sin texto usan un WAV silencioso mínimo.
- Sincronización: límites reales por palabra en `timecodes.json`.
- Resolución del lector: `audios.json` usa rutas relativas desde `es-UY`.
- Validación vigente: 9962 IDs, cero faltantes y cobertura completa.

El generador es incremental. Para completar o reparar solamente archivos
faltantes:

```sh
.tts-venv/bin/python tools/generate_dual_uy_voices.py \
  --voice valentina --missing-only --concurrency 4
```

Validación reproducible:

```sh
.tts-venv/bin/python tools/normalize_voice_timecodes.py --voice valentina --check
.tts-venv/bin/python tools/validate_v46.py
```

La síntesis envía el texto al servicio externo de Microsoft y debe ejecutarse
únicamente con autorización explícita. No se envían imágenes.

Los textos visibles conservan la grafía «WhatsApp». Los audios de introducción
y continuación usan la indicación fonética «uatsap».

En los chats, `🐒` permanece como un único glifo visible y se sintetiza como
«emolli de un mono». Sus cuatro palabras se alinean con el mismo glifo para
mantener correcto el resaltado.
