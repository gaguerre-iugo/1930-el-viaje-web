# Informe auditable — v45 integrada 35

Fecha: 28 de julio de 2026  
Alcance: pronunciación de WhatsApp, igualdad de altura en Lectura fácil con
mayúsculas y primer catálogo TTS completo con Valentina.

## 1. Pronunciación de WhatsApp

- La grafía visible y accesible continúa siendo «WhatsApp».
- Los audios de entrada dicen «Ventana de chat de uatsap».
- La segunda tarjeta dice «Continuación de la conversación de uatsap».
- Los tres IDs históricos de introducción apuntan a la misma locución nueva.

## 2. Composición del altillo

### Causa

Lectura fácil preservaba correctamente el interlineado `1.55`, pero centraba
la altura natural del bloque. Al activar mayúsculas, las unidades semánticas
ganaban líneas y la diferencia vertical se hacía visualmente evidente.

### Solución

En Lectura fácil + Mayúsculas no se estiran las líneas. La caja lateral toma
la altura medida de la imagen y distribuye el espacio restante **entre ideas
semánticas**, mediante flex. Las líneas internas mantienen `1.55`.

### Evidencia

En la ventana de prueba, imagen/texto midieron respectivamente:

- Normal: 373/373 px.
- Grande: 450/450 px.
- Extra grande: 500/500 px.
- Regresión sin Lectura fácil: 373/373 px en Normal.

## 3. Voz Valentina

- Voz externa: `es-UY-ValentinaNeural`.
- Inventario fuente: 1206 IDs.
- Resultado: 1206 MP3 y 1206 entradas de marcas temporales.
- Validación: cero archivos vacíos; cobertura textual completa; marcas
  ordenadas; rutas existentes; último límite dentro del audio.
- El selector muestra solamente Valentina porque es el único catálogo
  completo. Mateo permanece oculto hasta que se genere y valide.
- El lector resuelve audio y marcas desde
  `content/i18n/es-UY/voices/valentina/`.

La generación fue autorizada expresamente. Se envió texto, no imágenes.

## 4. Herramientas reproducibles

- `tools/generate_voice_catalog.py`: generación incremental y reanudable.
- `tools/validate_voice_catalog.py`: inventario, cobertura, orden temporal,
  duración y rutas.
- `content/i18n/es-UY/voices/valentina/README.md`: comando y política de uso.

## 5. Archivos principales modificados

- `assets/reflow-book.js`
- `content/reflow.css`
- `content/i18n/es-UY/audios.json`
- `content/i18n/es-UY/voices/valentina/*`
- `assets/config.json`
- `index.html`
- documentos de manifiesto, playbook y know-how.
