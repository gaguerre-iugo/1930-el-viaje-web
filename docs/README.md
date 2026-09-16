# Documentación — 1930: El viaje

Índice de la documentación del proyecto. El libro en sí vive en la raíz
(`index.html` + las páginas `pg*_sec*.html` y `qz*.html`) y en `content/`,
`assets/` e `images/`; acá está todo lo que es documentación de trabajo.

## Guías

| Archivo | Para qué |
|---|---|
| `guias/BOOK-MAINTENANCE-PLAYBOOK.md` | El manual de mantenimiento más completo del proyecto: cómo tocar el reflow, el TTS, los paneles y los bundles, con procedimientos y verificaciones. **Empezar por acá.** |
| `guias/LEEME-WEB-EXPORT.txt` | Instructivo de uso de la exportación web. |
| `guias/LEEME-V47.txt` | Notas de la versión 47. |

## Arquitectura y know-how

| Archivo | Para qué |
|---|---|
| `arquitectura/INTEGRATION-MANIFEST.md` | Manifiesto de la integración de la v45: qué se integró y con qué criterios. |
| `arquitectura/PROJECT-CONTINUITY.md` | Estado del proyecto y continuidad entre iteraciones. |
| `arquitectura/REFLOW-NAVIGATION-KNOWHOW.md` | Cómo funciona la navegación del motor de reflow. |
| `arquitectura/REFLOW-TYPOGRAPHY-KNOWHOW.md` | Criterios tipográficos y de paginación del reflow. |
| `arquitectura/TTS-PROSODY-PLAN.md` | Plan de prosodia para la narración; incluye el límite actual de la interfaz de síntesis. |

## Auditorías y registros

| Archivo | Para qué |
|---|---|
| `auditorias/AUDITORIA-GENERAL.md` | Auditoría medida del repositorio: tamaño, performance, carga, archivos sin uso e higiene. |
| `auditorias/AUDIT-CHANGELOG-v46-integrated.md` | Changelog detallado de la v46. |
| `auditorias/AUDIT-CHANGELOG-v45-*.md` | Changelogs detallados de la v45 (una serie de iteraciones). |
| `auditorias/_TTS-TASK-NOTES.md` | Registro de la tarea de audio (regeneración de locuciones, catálogo base y precargador). Archivo de trabajo, candidato a eliminarse. |

## Fuera de `docs/`

- `../AGENTS.md` — instrucciones para los agentes que trabajan en el
  repositorio. Se queda en la raíz a propósito, porque se lee desde ahí.
- `../html_analysis_report.txt` — salida de `tools/analyze_and_fix_html.py`. Se
  genera en la raíz porque el script la escribe con esa ruta fija.
- `../imsmanifest.xml` — manifiesto SCORM. Tiene que estar en la raíz.
- `../cover.png` — miniatura de portada, sin referencias internas; se deja por
  si la usan catálogos o plataformas externas.

## Herramientas

Los scripts están en `../tools/`. Los más relevantes para el audio y el
mantenimiento:

| Script | Para qué |
|---|---|
| `generate_dual_uy_voices.py` | Genera los catálogos TTS de Valentina y Mateo con Edge TTS. |
| `generate_whisper_timecodes.py` | Sincronización palabra por palabra con Whisper. |
| `build_offline_preloader.py` | Regenera el mapa `INLINE` del precargador para el modo `file://`. |
| `report_quiz_audio_gaps.py` | Audita los audios de los cuestionarios contra los textos vigentes. |
| `serve-local.js` | Servidor local de desarrollo (puerto 5501). |
