# 📦 Export Instructions — 1930: El viaje

> **Propósito:** Empaquetar el libro interactivo "1930 — El viaje" para publicación en **AWS S3** (Static Website Hosting).
>
> **Versión del libro:** v48 — full-book
> **Build ID:** `47-full-book-106`
> **Última actualización:** 2026-09-23

---

## 📋 ¿Qué incluye esta exportación?

La exportación contiene **solo los archivos necesarios para servir el libro** en un hosting web estático. Se excluyen herramientas de desarrollo, entornos Python, documentación interna y archivos temporales.

### Estructura destino (AWS S3)

```
📁 sitio/                            ← Bucket raíz en S3
├── index.html                       ← Punto de entrada principal
├── pg*.html                         ← ~214 páginas del libro
├── qz*.html                         ← ~14 cuestionarios
├── quiz_final.html                  ← Cuestionario final
├── imsmanifest.xml                  ← Manifiesto SCORM 1.2
│
├── assets/
│   ├── reflow-book.js               ← Motor principal de paginación
│   ├── quiz-sequence.js             ← Lógica de cuestionarios
│   ├── scorm.js                     ← Integración SCORM
│   ├── offline-preloader.js         ← Precarga offline (file://)
│   ├── config.json                  ← Configuración de funcionalidades
│   ├── fonts.css                    ← Declaración de fuentes
│   ├── font-validation.js           ← Validación de fuentes
│   ├── tailwind_css.css             ← Estilos Tailwind
│   ├── auto-fit.js                  ← Ajuste automático de viewport
│   ├── reflow-redirect.js           ← Redirección entre páginas
│   ├── base.bundle.min.js           ← Librerías minificadas
│   ├── base.bundle.local.js         ← Librerías debug
│   ├── base.bundle.min.js.map       ← Source map
│   ├── fonts/                       ← Atkinson Hyperlegible (.woff2)
│   ├── libs/fontawesome/            ← Iconos FontAwesome
│   ├── symbols/                     ← Símbolos gráficos
│   ├── sounds/                      ← Efectos de sonido
│   ├── favicon_io/                  ← Favicons
│   └── interface_translations/      ← Traducciones UI
│
├── content/
│   ├── reflow.css                   ← Estilos de paginación
│   ├── tailwind_output.css          ← Estilos compilados
│   ├── viewport-layout.css          ← Layout responsivo
│   ├── pages.json                   ← Metadatos de páginas
│   ├── toc.json                     ← Tabla de contenidos
│   ├── navigation/
│   │   └── nav.html                 ← Barra de navegación
│   └── i18n/
│       └── es-UY/
│           ├── texts.json           ← Textos de interfaz
│           ├── speech_texts.json    ← Textos para TTS
│           ├── glossary.json        ← Definiciones del glosario
│           ├── images.json          ← Descripciones de imágenes
│           ├── videos.json          ← Metadatos de video
│           ├── audios.json          ← Metadatos de audio
│           ├── audio/               ← Audios de cuestionarios (MP3)
│           ├── timecode/
│           │   └── timecode_output.json  ← Sincronización TTS
│           └── voices/
│               ├── valentina/
│               │   ├── audios.json       ← Manifiesto de voz
│               │   └── audio/            ← ~10.129 MP3 (Valentina)
│               └── mateo/
│                   ├── audios.json       ← Manifiesto de voz
│                   └── audio/            ← ~10.129 MP3 (Mateo)
│
└── images/                           ← Imágenes del libro (~75 archivos)
    ├── pg001_cover_art_clean.png
    ├── pg001_im001.jpg
    ├── pg003_im002.png
    ├── ... (todas las ilustraciones)
    └── pg224_collaborators_black.png
```

---

## 🚀 Cómo exportar

### Opción 1: Script automatizado (recomendado)

```powershell
# Desde la raíz del repositorio
.\Export\export-to-aws.ps1
```

Esto copia todos los archivos necesarios a `Export/sitio/`.

### Opción 2: Manual (sin PowerShell)

1. Crear carpeta `Export/sitio/` (o el nombre que uses en el bucket)
2. Copiar manualmente siguiendo la estructura de arriba
3. **No incluir:** `venv/`, `tools/`, `docs/`, `tmp/`, `output/`, `__pycache__/`, `*.pyc`, `.github/`, `CHAPTER2-INTEGRATION-REPORT.json`, `cover.png`, scripts Python sueltos en la raíz

---

## ☁️ Publicación en AWS S3

### Prerrequisitos
- Cuenta de AWS con acceso a S3
- AWS CLI instalado y configurado (`aws configure`)
- Un bucket S3 creado para el sitio web estático

### Crear el bucket (una sola vez)

```bash
# Crear bucket (el nombre debe ser único global)
aws s3 mb s3://1930-el-viaje --region us-east-1

# Habilitar Static Website Hosting
aws s3 website s3://1930-el-viaje \
  --index-document index.html \
  --error-document index.html

# Configurar política de acceso público (Bucket Policy)
```

### Política de bucket recomendada

Crear archivo `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::1930-el-viaje/*"
    }
  ]
}
```

```bash
aws s3api put-bucket-policy --bucket 1930-el-viaje --policy file://bucket-policy.json
```

### Subir el contenido

```bash
# Opción 1: Subida completa (recomendada para la primera vez)
aws s3 sync Export/sitio/ s3://1930-el-viaje/

# Opción 2: Subida con caché configurado (mejor rendimiento)
aws s3 sync Export/sitio/ s3://1930-el-viaje/ \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.json"

aws s3 sync Export/sitio/ s3://1930-el-viaje/ \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --include "*.json"
```

> 💡 Los archivos MP3 de voz (TTS) rara vez cambian entre versiones. Conviene subirlos con `--exclude "*.mp3"` si solo actualizás contenido.

### Configurar CloudFront (CDN) — opcional pero recomendado

```bash
# Crear distribución CloudFront para HTTPS y mejor latencia
aws cloudfront create-distribution \
  --origin-domain-name 1930-el-viaje.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

---

### Despliegue con GitHub Actions

Agregar este workflow en `.github/workflows/deploy-to-aws.yml`:

```yaml
name: Deploy to AWS S3

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate export
        shell: pwsh
        run: .\Export\export-to-aws.ps1

      - name: Sync to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: >
            --acl public-read
            --cache-control "public, max-age=31536000, immutable"
            --exclude "*.html" --exclude "*.json"
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: "Export/sitio"
```

---

## ✅ Checklist post-publicación

- [ ] Cargar `http://1930-el-viaje.s3-website-us-east-1.amazonaws.com/index.html` — ¿carga sin errores?
- [ ] O vía CloudFront: `https://dxxxxxxxxxxxxx.cloudfront.net/index.html`
- [ ] Consola del navegador — ¿sin errores 404 ni CORS?
- [ ] Navegación entre páginas — ¿funciona el paginador?
- [ ] TTS (Voces Valentina/Mateo) — ¿reproducen?
- [ ] Lectura fácil — ¿se activa/desactiva?
- [ ] Glosario — ¿palabras resaltadas y definiciones?
- [ ] Cuestionarios — ¿funcionan y dan feedback?
- [ ] Imágenes — ¿se ven correctamente?
- [ ] Fuentes — ¿Atkinson Hyperlegible cargó bien?
- [ ] SCORM — si se despliega en LMS, ¿el manifiesto es válido?
- [ ] Responsive — ¿se ve bien en mobile, tablet y desktop?

---

## 🔄 Próximas versiones

Cuando llegue una nueva versión del libro (ej: v49):

1. Ejecutar `.\Export\export-to-aws.ps1` para regenerar `Export/sitio/`.
2. Revisar qué cambió: HTML nuevos, config.json, timecodes, imágenes.
3. Subir a S3:

```bash
# Actualización rápida (solo archivos modificados)
aws s3 sync Export/sitio/ s3://1930-el-viaje/
```

---

## 📦 SCORM

Si necesitas el paquete SCORM 1.2 para LMS:

```powershell
Compress-Archive -Path "Export/sitio/*" -DestinationPath "1930-el-viaje-scorm.zip"
```

Luego subir `1930-el-viaje-scorm.zip` como paquete SCORM al LMS.

---

## 🧹 Mantenimiento

- Los audios TTS (~471 MB, ~20.000 archivos) son la mayor parte del peso.
- AWS S3 Standard tiene un costo aprox. de **~$0.023/GB/mes** (~$12/mes por 536 GB).
- Si usas CloudFront, el costo de salida de datos es adicional (~$0.085/GB).
- Para reducir costos, considera excluir una de las dos voces si solo usas una en producción.
- Usar `--exclude "*.mp3"` en el sync cuando solo actualices contenido (no voces).