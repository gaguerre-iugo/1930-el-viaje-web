# AGENTS.md — 1930: El viaje

## 📖 ¿Qué es este proyecto?

**1930: El viaje** es un libro digital interactivo y accesible, exportado como aplicación web portable (HTML/CSS/JS). Está diseñado para la **Red Global de Aprendizajes (Ceibal, Uruguay)** como un recurso educativo inclusivo.

El libro cuenta la historia de **1930 — El viaje**, e incluye:
- Texto completo con **Lectura fácil** (adaptación cognitiva)
- **Audios sincronizados** palabra por palabra (TTS con voces uruguayas)
- **Glosario** interactivo con definiciones
- **Cuestionarios** de comprensión (recuperación, interpretación, reflexión)
- **Imágenes** descriptas para accesibilidad
- **SCORM 1.2** para integración con plataformas educativas (LMS)

**Versión actual:** v47 — libro completo (todo el contenido desde la exportación full-book).
**Build ID:** `47-full-book-106`

---

## 🏗️ Estructura del proyecto

```
1930-el-viaje-web-export-v48-full-book/
├── index.html                 ← Punto de entrada principal
├── pg*.html                   ← Páginas del libro (reflow)
├── imsmanifest.xml            ← Manifiesto SCORM 1.2
│
├── assets/
│   ├── reflow-book.js         ← Motor principal del libro (JS reflow)
│   ├── quiz-sequence.js       ← Lógica de cuestionarios
│   ├── scorm.js               ← Integración SCORM
│   ├── offline-preloader.js   ← Precarga para modo offline (file://)
│   ├── config.json            ← Configuración de funcionalidades
│   ├── fonts/                 ← Atkinson Hyperlegible (fuente principal)
│   ├── fonts.css              ← Declaración de fuentes
│   ├── font-validation.js     ← Validación de carga de fuentes
│   ├── libs/fontawesome/      ← Iconos FontAwesome
│   ├── symbols/               ← Símbolos gráficos (ecosistema, biomas, etc.)
│   ├── sounds/                ← Efectos de sonido (quiz, navegación)
│   ├── favicon_io/            ← Favicons multiplataforma
│   ├── interface_translations/← Traducciones de la interfaz
│   ├── tailwind_css.css       ← Estilos base Tailwind
│   ├── base.bundle.min.js     ← Librerías empaquetadas (minified)
│   ├── base.bundle.local.js   ← Librerías empaquetadas (debug)
│   ├── auto-fit.js            ← Ajuste automático de viewport
│   └── reflow-redirect.js     ← Redirección entre páginas reflow
│
├── content/
│   ├── reflow.css             ← Estilos de paginación reflow
│   ├── tailwind_output.css    ← Estilos compilados de Tailwind
│   ├── viewport-layout.css    ← Estilos de layout responsivo
│   ├── navigation/
│   │   └── nav.html           ← Navegación del libro
│   └── i18n/
│       └── es-UY/             ← Único idioma disponible
│           ├── audio/         ← Archivos MP3 (voces Valentina y Mateo)
│           ├── timecode/      ← Sincronización palabra por palabra
│           ├── images.json    ← Descripciones de imágenes
│           └── videos.json    ← Metadatos de video
│
├── images/                    ← Imágenes del libro (portada, ilustraciones)
│
├── tools/                     ← Herramientas de desarrollo y validación
│   ├── integrate_chapter2.py      ← Integración de capítulos
│   ├── generate_dual_uy_voices.py ← Generación de audio TTS dual
│   ├── generate_whisper_timecodes.py ← Timecodes con Whisper
│   ├── normalize_voice_timecodes.py  ← Normalización de timecodes
│   ├── report_voice_mismatches.py ← Reporte de discrepancias de voz
│   ├── validate_v46.py            ← Validador de la v46
│   ├── validate_paragraph_geometry.py ← Validación geométrica de párrafos
│   ├── add_chapter_quizzes.py     ← Generador de cuestionarios
│   ├── composite_cover_edit.py    ← Edición de portada compuesta
│   ├── composite_cover_corner_edit.py ← Edición de esquinas de portada
│   ├── repair_cover_photo_corner_local.py ← Reparación local de portada
│   ├── make_cover_seam_mask.py    ← Máscara de costura de portada
│   ├── make_cover_corner_mask.py  ← Máscara de esquinas de portada
│   ├── blend_cover_seam.py        ← Mezcla de costura de portada
│   └── screen-test/               ← Tests de screenshot con Playwright
│
├── AGENTS.md                  ← Este archivo
├── AUDIT-CHANGELOG-v*.md      ← Changelogs detallados por versión
├── INTEGRATION-MANIFEST.md    ← Manifiesto de integración (v45)
├── LEEME-WEB-EXPORT.txt       ← Instructivo de uso
├── LEEME-V47.txt              ← Notas de la versión 47
├── REFLOW-TYPOGRAPHY-KNOWHOW.md ← Know-how de tipografía reflow
├── REFLOW-NAVIGATION-KNOWHOW.md ← Know-how de navegación reflow
├── TTS-PROSODY-PLAN.md        ← Plan de prosodia TTS
└── cover.png                  ← Miniatura de portada
```

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Formato** | HTML5 semántico + CSS3 + JavaScript (vanilla) |
| **Estilos** | Tailwind CSS (compilado), CSS Grid, Multi-Column Layout |
| **Motor de reflow** | `reflow-book.js` — motor propio de paginación visual |
| **Fuente principal** | Atkinson Hyperlegible (accesibilidad tipográfica) |
| **Interfaz** | FontAwesome 6, SCORM 1.2 Runtime |
| **Audio TTS** | Microsoft Edge TTS (`edge-tts`), voces `es-UY-ValentinaNeural` y `es-UY-MateoNeural` |
| **Timecodes** | Whisper (openai) + normalización propia |
| **Imágenes** | PNG / JPG, composiciones generativas con máscaras locales |
| **Herramientas** | Python 3 (scripts de utilidad), Playwright (tests visuales) |
| **LMS** | SCORM 1.2 (`imsmanifest.xml`) |

---

## 🚀 Cómo ejecutar el proyecto

### Apertura directa (sin servidor)

1. Descomprimir el ZIP completo.
2. Entrar en la carpeta.
3. Abrir `index.html` con doble clic.

> ⚠️ No abrir `index.html` desde la vista previa del ZIP. Debe estar descomprimido.

### Servidor local (para desarrollo)

```bash
python3 -m http.server 5501
```

Luego abrir: `http://127.0.0.1:5501/index.html`

### Publicación

La misma carpeta puede subirse a cualquier servidor web estático. El archivo `imsmanifest.xml` conserva la entrada SCORM 1.2 para plataformas compatibles (LMS como Moodle, Canvas, etc.).

---

## ✅ Cómo verificar / validar

### Validación manual

1. Cargar el libro en servidor local o directamente.
2. Verificar que no haya errores 404 ni mensajes de error en la consola del navegador.
3. Probar navegación entre páginas: el paginador debe funcionar sin saltos.
4. Probar **Lectura fácil**: activar/desactivar desde Configuración.
5. Probar **TTS**: activar desde Configuración, probar Valentina y Mateo.
6. Probar **tamaños de letra**: Normal, Grande, Extra grande.
7. Probar **Mayúsculas**: activar/desactivar.
8. Verificar **cuestionarios** al final de cada capítulo.
9. Verificar **glosario**: palabras resaltadas y definiciones.
10. Verificar portada y páginas ilustradas (alineación texto/imagen).

### Validación con herramientas

Los scripts en `tools/` permiten validaciones específicas:

```bash
# Validar estructura de la v46
python3 tools/validate_v46.py

# Validar geometría de párrafos
python3 tools/validate_paragraph_geometry.py

# Reportar discrepancias entre voces TTS
python3 tools/report_voice_mismatches.py
```

### Tests visuales (Playwright)

```bash
cd tools/screen-test
npm install
npx playwright test
```

---

## 🧠 Funcionalidades clave

### Sistema de reflow (repaginación visual)
El libro no tiene páginas fijas. El motor `reflow-book.js` calcula columnas visuales dinámicamente según:
- Tamaño de letra (Normal / Grande / Extra grande)
- Estado de Lectura fácil (activada/desactivada)
- Estado de Mayúsculas (activada/desactivada)
- Ancho de viewport (responsive)

### Texto a voz (TTS)
- Dos voces uruguayas: **Valentina** (`es-UY-ValentinaNeural`) y **Mateo** (`es-UY-MateoNeural`)
- ~1206 audios + timecodes por voz
- Resaltado palabra por palabra u oración completa
- Velocidades: Lento, Normal, Rápido, Muy rápido

### Lectura fácil
- Adaptación cognitiva del texto
- Oraciones más cortas y vocabulario simplificado
- Activable/desactivable desde Configuración

### Cuestionarios
- Tres dimensiones: recuperación, interpretación y reflexión
- Feedback visual inmediato (✓/✕)
- Fondo turquesa Ceibal (`#16b8ac`)

### Glosario
- Palabras resaltadas en el texto
- Definiciones con audio
- Navegación a la primera aparición en la página

---

## 📦 SCORM

El libro exporta como **SCORM 1.2**. El archivo `imsmanifest.xml` declara todos los recursos. Para integrar en un LMS:
1. Comprimir la carpeta entera como ZIP.
2. Subir al LMS como paquete SCORM.
3. El LMS cargará `index.html` como SCO principal.

---

## 📋 Historial de versiones

| Versión | Contenido |
|---------|-----------|
| v35–v44 | Iteraciones de portada, índices, paneles, TTS, quizzes |
| v45 | Capítulo 1 completo + integración de voces duales |
| v46 | Integración de capítulos 1 y 2 + validaciones |
| v47 | **Libro completo** — capítulos 3 a 8 + páginas finales |

Los cambios detallados están documentados en los archivos `AUDIT-CHANGELOG-v*.md` e `INTEGRATION-MANIFEST.md`.

---

## 🔧 Notas para desarrolladores

- **No modificar** `index.html` ni las páginas `pg*.html` directamente sin entender el sistema de reflow y las dependencias de IDs.
- Los cambios en `reflow-book.js` requieren regenerar los bundles y actualizar el query parameter de versión (`?v=...`) para evitar caché.
- Las herramientas en `tools/` requieren Python 3.10+ con las dependencias listadas al inicio de cada script.
- El directorio `images/` contiene imágenes originales y compuestas. Las compuestas llevan sufijos como `_integrated`, `_repaired`, etc.
- Los audios se generan con `edge-tts`. Para regenerar: `python3 tools/generate_dual_uy_voices.py`.
- La sincronización se genera con Whisper: `python3 tools/generate_whisper_timecodes.py`.

---

## 🎯 Agentes Ceibal

### Modelo activo

El agente actual opera sobre **DeepSeek-V4-Flash** (DeepSeek Harness), corriendo localmente. No está hosteado en Azure ni en ningún servicio externo.

### Azure GPT-4.0 (Ceibal Agent)

El agente **Ceibal** está diseñado para utilizar **Azure GPT-4.0** en tareas especializadas. Está pensado para procesamiento complejo que requiera la infraestructura de Azure.

**Modelo:** Azure GPT-4.0

**Capacidades:**
- Aprovechar capacidades de GPT-4.0 en Azure
- Comprensión contextual avanzada
- Alta confiabilidad para procesamiento complejo