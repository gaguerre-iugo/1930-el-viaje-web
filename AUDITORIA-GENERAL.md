# Auditoría general — 1930: El viaje

Fecha: 2026-09-16 · Alcance: contenido, performance, carga, archivos sin uso e higiene del repositorio.
Todo lo que sigue está medido sobre el árbol de trabajo, no estimado.

---

## 1. Resumen ejecutivo

| Métrica | Valor |
|---|---|
| Peso total del proyecto | **2.536 MB** |
| Peso del paquete publicado (sin `.git`, `tools`, `tmp`, `output`) | **1.314 MB** |
| Peso del historial `.git` | **1.174 MB** (46 % del total) |
| Peticiones al abrir el libro | **250** |
| Transferencia en la primera carga | **4,46 MB** |
| Transferencia con caché caliente | **82 KB** |

Los tres titulares:

1. **El paquete pesa 1,3 GB**, de los cuales 1,26 GB son audio. Es mucho para subir a un LMS.
2. **El catálogo base pesa 768 MB y está al 96 % a 192 kbps**, el doble que las voces. Bajarlo a 96 kbps ahorraría ~384 MB sin cambiar la locución.
3. **214 páginas de sección cargan un JS de 25,8 MB sin la protección** que sí tiene `index.html`.

---

## 2. Tamaño

### 2.1 Por directorio

| Directorio | MB | Archivos |
|---|---|---|
| `content/` | 1.266,4 | 30.451 |
| `assets/` | 31,5 | 47 |
| `venv/` | 24,4 | 1.934 |
| `tools/` | 21,5 | 225 |
| `images/` | 13,0 | 75 |
| `tmp/` | 1,8 | 4 |
| `output/` | 1,2 | 1 |
| raíz (HTML y docs) | 3,0 | 238 |
| **`.git/`** | **1.173,7** | — |

### 2.2 Desglose del audio (el 96 % del contenido)

| Catálogo | Archivos | Peso | Bitrate |
|---|---|---|---|
| Base (`content/i18n/es-UY/audio/`) | 10.151 | **768 MB** | **96 % a 192 kbps** |
| `voices/valentina/audio/` | 10.096 | 242 MB | 100 % a 96 kbps |
| `voices/mateo/audio/` | 10.096 | 228 MB | 100 % a 96 kbps |
| Timecodes (3 archivos) | 3 | 19,3 MB | — |

El catálogo base **no es redundante**: comparando por duración (independiente del
bitrate), en una muestra de 400 ids el 90 % tiene **narrador propio**, distinto de
Valentina y de Mateo. Solo el 10 % coincide con alguna de las dos voces.

O sea: no se puede deduplicar. Pero sí se puede **re-encodear a 96 kbps**, que es
la misma calidad que ya usan las voces.

### 2.3 Archivos más pesados

| Peso | Archivo |
|---|---|
| 25,8 MB | `assets/offline-preloader.js` |
| 8,0 MB | `voices/valentina/timecodes.json` |
| 8,0 MB | `voices/mateo/timecodes.json` |
| 3,6 MB | `assets/base.bundle.min.js.map` |
| 3,3 MB | `content/i18n/es-UY/timecode/timecode_output.json` |
| 2,1 MB | `images/pg216217_spread_integrated_v3.png` |

---

## 3. Performance y carga (medido en navegador)

Carga de `index.html` por HTTP en local:

| Métrica | Primera carga | Con caché |
|---|---|---|
| Peticiones | **250** | 250 |
| Transferencia | **4,46 MB** | 82 KB |
| DOMContentLoaded | 134 ms | — |
| `load` | 134 ms | 125 ms |

Composición de las 250 peticiones: **196 `fetch`**, 43 `img`, 7 `link`, 4 `script`.

### 3.1 Observaciones

- **196 `fetch`**: el motor descarga **las 213 secciones HTML completas** más los
  catálogos al abrir el libro. Es por diseño (necesita todo el texto para paginar),
  pero son 250 peticiones: en una red con latencia alta, el tiempo de carga se
  explica más por la cantidad de peticiones que por los bytes.
- **Assets sin minificar**: `reflow-book.js` 514 KB y `reflow.css` 200 KB se sirven
  sin minificar. Juntos son **714 KB**, el 16 % de la primera carga. Minificados
  bajarían a ~250 KB.
- **43 imágenes sin `loading="lazy"`**: todas se piden en la primera carga. Varias
  pesan entre 70 y 170 KB.
- **La caché funciona bien**: la segunda carga baja de 4,46 MB a 82 KB.

### 3.2 El preloader offline: 25,8 MB con una protección desigual

`assets/offline-preloader.js` incrusta los catálogos y las 213 secciones dentro
del propio JS, para que el libro funcione abierto como `file://`. Su primera
línea útil es:

```js
if (location.protocol !== "file:") return;
```

Y ahí está el problema:

| Página | Cómo lo carga | ¿Protegido? |
|---|---|---|
| `index.html` | `if (protocol === "file:") document.write(...)` | **Sí** |
| Las 214 páginas `pg*_sec*.html` y `qz*.html` | `<script src="...">` directo, sin `defer` | **No** |

En las secciones, `reflow-redirect.js` es el primer script y hace
`location.replace("./index.html#...")`. Pero el navegador **ya alcanzó a iniciar
la descarga de los 25,8 MB** antes de que la navegación se confirme y la cancele.

Consecuencia: si alguien abre una sección directamente (marcador, enlace profundo,
o el propio `reflow-redirect`), se dispara una descarga de 25,8 MB que se aborta a
medias. En una red lenta eso puede retrasar la redirección de forma perceptible.

**Arreglo**: agregar el mismo gate a las 214 páginas, o mover el preloader a un
`<script>` inyectado condicionalmente. Es un cambio de una línea por archivo,
automatizable.

---

## 4. Archivos sin uso

### 4.1 Sin ninguna referencia en todo el repositorio

| Archivo | Peso |
|---|---|
| `images/pg216217_spread_integrated_v3.png` | 2,14 MB |
| `images/pg001_cover_art_clean_radial.png` | 1,10 MB |
| `images/pg216217_spread_integrated_v2.jpg` | 0,83 MB |
| `images/pg216217_spread_integrated.jpg` | 0,77 MB |
| `images/pg016017_im004.jpg` | 0,13 MB |
| `images/pg016017_im002.jpg` | 0,13 MB |
| `images/pg216217_im002.jpg` | 0,12 MB |
| `images/pg005_im002.png` | 0,10 MB |
| `images/pg036037_im004.jpg` | 0,07 MB |
| `images/pg036037_im002.jpg` | 0,06 MB |
| `images/pg020_im002.png` | 1,5 KB |
| `images/pg021_im002.png` | 1,4 KB |
| **Total** | **5,2 MB** |

Cuatro de ellos son **duplicados exactos** de archivos que sí se usan:

```
pg016017_im002.jpg  ==  pg016_im002.jpg
pg016017_im004.jpg  ==  pg017_im002.jpg
pg036037_im002.jpg  ==  pg036_im002.jpg
pg036037_im004.jpg  ==  pg037_im002.jpg
```

### 4.2 Carpetas y artefactos

| Elemento | Peso | Nota |
|---|---|---|
| `assets/symbols/` (10 PNG) | 1,0 MB | **0 menciones de `symbols/` en todo el repo** |
| `assets/base.bundle.min.js.map` | 3,59 MB | Solo lo referencia `base.bundle.min.js` |
| `assets/base.bundle.min.js` | 0,71 MB | **Nada lo carga en runtime**: el motor hace `fetch` de `base.bundle.local.js` |
| `tmp/imagegen/` (4 archivos) | 1,8 MB | Máscaras y previews de portada, **trackeados** |
| `output/imagegen/` (1 archivo) | 1,15 MB | Imagen generada de portada, **trackeada** |
| `content/i18n/es-UY/audio/pg117_im002_continuation.m4a` | — | Sin referencias |
| **Total** | **~8,3 MB** | |

Cuidado con dos que **no** hay que borrar sin verificar antes:

- `assets/tailwind_css.css` (7,8 KB): 0 referencias, pero es la **fuente** de la
  que se compila `tailwind_output.css`.
- `assets/base.bundle.min.js`: hoy no lo carga nadie, pero el
  `BOOK-MAINTENANCE-PLAYBOOK.md` lo menciona como artefacto a mantener en sincronía.
  Puede ser el bundle de una exportación de producción que no está cableada.

### 4.3 Huérfanos de audio

Ya auditados antes: **94 archivos en `audio/`** que ninguna entrada referencia.
Se decidió dejarlos, porque 50 están declarados en `imsmanifest.xml` (SCORM) y el
resto aparecen en el snapshot incrustado de `offline-preloader.js`.

---

## 5. Higiene del repositorio

### 5.1 `venv/` está trackeado en git

**1.540 archivos, 24,4 MB** versionados. Un entorno virtual nunca debería estarlo,
y además hace que cada `pip install` ensucie `git status` (nos pasó al instalar
`edge-tts`).

### 5.2 No hay `.gitignore` en la raíz

El único del proyecto está en `tools/screen-test/` (ignora `node_modules`).
Debería haber uno en la raíz con al menos: `venv/`, `__pycache__/`, `tmp/`,
`output/`, `node_modules/`, `*.pyc`.

### 5.3 El historial pesa 1,17 GB

Casi la mitad del proyecto. Es consecuencia de haber versionado el audio en varias
iteraciones. Reducirlo requiere reescribir historia (`git filter-repo`), lo que
rompe los hashes ya publicados — no lo recomiendo salvo necesidad real.

### 5.4 Cuatro versiones distintas declaradas

| Dónde | Valor |
|---|---|
| `index.html` → `reflow-book.js?v=` | `129-activity-progress` |
| `assets/config.json` → `bundleVersion` | `57-activity-progress` |
| `AGENTS.md` → Build ID | `47-full-book-106` |
| Nombre de la carpeta | `v48` |
| `offline-preloader.js` en `index.html` | `?v=68-activity-progress` |
| `offline-preloader.js` en las secciones | `?v=48-sentence-case` |

Dificulta saber qué build está desplegado.

---

## 6. Prioridades sugeridas

Ordenadas por relación impacto / esfuerzo.

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | Re-encodear el catálogo base de 192 a 96 kbps | **−384 MB** | Medio (script + verificación) |
| 2 | Gatear `offline-preloader.js` en las 214 secciones | Evita descargas de 25,8 MB | Bajo (automatizable) |
| 3 | Borrar los 12 archivos sin referencia | −5,2 MB | Bajo |
| 4 | Borrar `assets/symbols/`, `tmp/`, `output/` | −3,8 MB | Bajo |
| 5 | Minificar `reflow-book.js` y `reflow.css` | −460 KB en la 1.ª carga | Medio (requiere build) |
| 6 | `git rm -r --cached venv/` + `.gitignore` | Higiene | Bajo |
| 7 | Unificar las versiones declaradas | Mantenibilidad | Bajo |
| 8 | Revisar `base.bundle.min.js` y su `.map` | −4,3 MB si no se usan | Bajo (requiere confirmar) |
| 9 | `loading="lazy"` en las imágenes fuera de pantalla | Mejora la 1.ª carga | Bajo |
| 10 | Endurecer el motor: esperar el catálogo de voz | Elimina la carrera | Medio (toca el motor) |

### Sobre el punto 1, con una advertencia

Re-encodear de 192 a 96 kbps es una **transcodificación con pérdida** (lossy → lossy).
El resultado sería equivalente en calidad a las voces, que ya están a 96 kbps, pero
no es la misma calidad que un render nativo a 96. La alternativa —re-sintetizar el
base— cambiaría el narrador, porque el base tiene voz propia en el 90 % de los ids y
**no está documentado con qué voz ni servicio se generó**. Eso habría que resolverlo
antes.

---

## 7. Lo que está bien

Para no dejar solo lo negativo:

- **La caché es efectiva**: 4,46 MB → 82 KB en la segunda carga.
- **`index.html` sí protege el preloader offline** con el gate de protocolo.
- **El audio es lazy**: los catálogos de voz (~9 MB) se cargan recién al activar la
  narración, no al abrir el libro.
- **Los catálogos están íntegros**: 0 referencias colgadas y 0 descuadres entre
  timecodes y textos, tras el trabajo de esta sesión.
- **Ninguna petición fallida** en la carga medida (0 errores HTTP, 0 de consola).
