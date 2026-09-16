# NOTAS TEMPORALES — regeneración de audios de cuestionarios

> Archivo de trabajo. **Eliminar cuando termine la tarea**, junto con el resto
> de los artefactos listados abajo. No forma parte del libro.

## Problema

El commit `ab833c31` ("Sync quiz options with runtime translations", 2026-09-09)
cambió 28 textos de cuestionarios, pero sus audios nunca se regeneraron: seguían
siendo los del commit inicial (`3583f830`, 2026-08-11). El resultado era que el
lector reproducía la locución vieja mientras en pantalla se leía la nueva.

Ejemplo reportado por el usuario: `qz007_o2` mostraba «Convenciendo a los
pasajeros de colaborar.» pero el audio decía «Llamando por celular.»

> Nota: el commit `15824ee9` **no** es el culpable de esto. Ese cambió 26 textos
> de lectura fácil ("1" → "un/una"), 0 de quiz.

## Alcance ejecutado

28 ids de quiz × 2 voces = **56 audios**, en 7 cuestionarios:

| Cuestionario | Ids |
|---|---|
| qz007 | `_o0`, `_o0_exp`, `_o2`, `_o2_exp` |
| qz010 | `_o2`, `_o2_exp` |
| qz013 | `_o1`, `_o1_exp`, `_o2`, `_o2_exp` |
| qz016 | `_o1`, `_o1_exp`, `_o2`, `_o2_exp` |
| qz019 | `_o1`, `_o1_exp`, `_o2`, `_o2_exp` |
| qz022 | `_o0_exp`, `_o1`, `_o1_exp`, `_o2`, `_o2_exp` |
| qz025 | `_o0_exp`, `_o1`, `_o1_exp`, `_o2`, `_o2_exp` |

Solo opciones y retroalimentaciones. Ningún texto de pregunta (`_que`).

## Etiqueta de cache-bust

Los 28 ids pasaron de `47-uatsap-final-stress-{voz}` a
**`48-quiz007-fix-{voz}`**. Las otras 9.962 entradas de `audios.json` de cada
voz conservan su etiqueta original: el cache-bust es quirúrgico, no fuerza la
redescarga de los ~10.000 audios del catálogo.

## Cómo se hizo

El generador del repo (`tools/generate_dual_uy_voices.py`) tiene dos
características que obligaron a un rodeo:

1. `--missing-only` **no** sirve: salta el archivo si ya existe, aunque el texto
   haya cambiado. Hubo que regenerar sin ese flag.
2. `write_checkpoint()` reescribe `audios.json` y `timecodes.json` **completos**
   con una única etiqueta `?v=`, lo que habría invalidado todo el catálogo.
3. El generador reescribe `timecodes.json` en formato compacto, cambiando el
   formato de 7,8 MB a 4,5 MB.

Por eso el flujo fue: respaldar catálogos → generar con `--asset` → restaurar el
respaldo → inyectar **solo** los 28 bloques, preservando el resto byte a byte.

Comandos:

```powershell
# 1) respaldo de los catálogos vigentes
venv\Scripts\python.exe tools\_batch_tts.py --phase backup

# 2) generación (28 ids × 2 voces)
$ids = venv\Scripts\python.exe tools\_batch_tts.py --phase list
$a = @(); foreach ($i in $ids) { $a += "--asset"; $a += $i }
venv\Scripts\python.exe tools/generate_dual_uy_voices.py `
  --voice valentina --voice mateo @a --version 48-quiz007-fix --concurrency 4

# 3) restauración + inyección quirúrgica
venv\Scripts\python.exe tools\_batch_tts.py --phase inject --tag 48-quiz007-fix
```

## Resultado

- 56 archivos MP3 regenerados (1.430 KB, 122,3 s de audio en total).
- 4 catálogos actualizados: `audios.json` y `timecodes.json` de cada voz.
- `git diff` del libro: **60 archivos**, 1.714 inserciones / 1.234 borrados.
- En `audios.json`: exactamente **28 líneas** por voz.

### Comprobaciones

| Control | Resultado |
|---|---|
| `edge-tts 7.2.8` con `es-UY-ValentinaNeural` / `es-UY-MateoNeural` | OK, **sin clave de API** |
| Reproducibilidad (2 corridas del mismo id) | byte-idénticas |
| MP3 válidos (parseo de frames MPEG, 96 kbps / 24 kHz) | 56/56, 0 problemas |
| Claves en los catálogos | 10.000 intactas por voz |
| Claves ajenas modificadas | **0** |
| Etiqueta nueva aplicada | 28/28 por voz |
| Palabras del timecode vs texto vigente | **0 descuadres** |
| MP3 faltantes / timecodes vacíos | 0 / 0 |
| `report_quiz_audio_gaps.py` | **0 audios desactualizados** |
| Servido por HTTP en `127.0.0.1:5501` | etiqueta y tamaño nuevos, 28/28 |

Sobre duración: los timecodes terminan algo después que el MP3 (ratio 1,36 en
`qz007_o2`). No es truncamiento — es reproducible al byte y la mediana del
catálogo ya existente es 1,41, así que entra en el comportamiento normal.

## Artefactos agregados al repo — BORRAR AL TERMINAR

### 1. Dependencias instaladas en `venv/` (el venv está trackeado en git)

`venv\Scripts\python.exe -m pip install edge-tts`:

| Paquete | Versión |
|---|---|
| edge-tts | 7.2.8 |
| aiohttp | 3.14.3 |
| aiosignal | 1.4.0 |
| aiohappyeyeballs | 2.7.1 |
| async-timeout | 5.0.1 |
| attrs | 26.1.0 |
| certifi | 2026.7.22 |
| frozenlist | 1.8.0 |
| idna | 3.19 |
| multidict | 6.8.0 |
| propcache | 0.5.4 |
| tabulate | 0.10.0 |
| yarl | 1.25.1 |

Aparecen como no trackeados bajo `venv/Lib/site-packages/` y `venv/Scripts/`.
Limpieza:

```
venv\Scripts\python.exe -m pip uninstall -y edge-tts aiohttp aiosignal aiohappyeyeballs async-timeout attrs certifi frozenlist idna multidict propcache tabulate yarl
git status --short venv
```

### 2. Scripts y salidas

| Archivo | Qué es | ¿Conservar? |
|---|---|---|
| `tools/_batch_tts.py` | respaldo + inyección quirúrgica para las voces | reutilizable |
| `tools/_basefix.py` | completa el catálogo base (MP3 + catálogo + timecodes) | reutilizable |
| `tools/report_quiz_audio_gaps.py` | auditoría de audios vs textos | reutilizable |
| `tools/quiz-audio-gaps.json` | informe de la auditoría | reutilizable |
| `_TTS-TASK-NOTES.md` | este archivo | borrar |

## HALLAZGO POSTERIOR: el catálogo base también hay que corregirlo

Tras regenerar las voces, el usuario reportó que en `#qz007` la opción en
pantalla decía «Solicitando ayuda al capitán.» pero la voz decía «Comprando un
pasaje.». Verificado en navegador y a nivel de datos.

### Por qué ocurre

`assets/reflow-book.js` resuelve el audio así:

```js
function ttsVoiceFilename(audioId) {
  var catalogue = ttsVoiceCatalogs[state.ttsVoice] || ttsVoiceCatalogs.valentina;
  return catalogue.audios[effectiveId] ||
    (window.__adtReflowAudioFiles && window.__adtReflowAudioFiles[effectiveId]) || null;
}
```

Intenta el catálogo de **voz** y, si no lo tiene, cae al catálogo **base**
(`window.__adtReflowAudioFiles` → `content/i18n/es-UY/audio/`).

La carga del catálogo de voz es perezosa y **asíncrona**:
`ensureTtsVoiceCatalog()` dispara el fetch al activar la lectura en voz alta,
pero la reproducción arranca enseguida, sin esperarlo. En esa ventana los ids
se resuelven contra el base.

Además `window.__adtReflowReadQuizFeedback()` (la retroalimentación del quiz)
usa la misma función, así que también cae al base.

### Prueba

Sonda Playwright en `index.html#qz007`: las peticiones fueron

```
/content/i18n/es-UY/audio/qz007_que.mp3     <- base
/content/i18n/es-UY/audio/qz007_o0.mp3      <- base, audio VIEJO
/content/i18n/es-UY/audio/qz007_o1.mp3      <- base
```

`peticionesCatalogoVoz: []` — el catálogo de voz no se pidió nunca.

Timecodes base de los 4 ids de qz007, que delatan el texto viejo:

| id | texto vigente | palabras del timecode base |
|---|---|---|
| `qz007_o0` | Solicitando ayuda al capitán. | **Comprando un pasaje** |
| `qz007_o0_exp` | No. Aunque Javier interactúa con el capitán… | **No Javier no tenía pasaje…** |
| `qz007_o2` | Convenciendo a los pasajeros de colaborar. | **Llamando por celular** |
| `qz007_o2_exp` | No. Aunque Javier logra convencer… | **No Javier conserva el celular…** |

### Estado del catálogo base para los 28 ids

| Situación | Cantidad |
|---|---|
| Con archivo MP3 (audio viejo servible) | **4** — los de qz007 |
| Registrados en `audios.json` pero **sin archivo** (404) | **24** |
| Con `word_timestamps` base utilizables | 4 (los mismos, con el texto viejo) |

Es decir: para 4 ids el base sirve audio viejo, y para 24 sirve un 404. En ambos
casos el lector queda mal mientras el catálogo de voz no esté cargado.

Formato del timecode base (estilo Whisper), distinto del de las voces:

```json
"pg003_n0002": { "timecodes": [null, { "word_timestamps": [ {"text": "...", "start": 0, "end": 1.26} ] } ] }
```

### Solución aplicada (`tools/_basefix.py`)

Se completó el catálogo base para los 28 ids, usando el render de **Valentina**
(coherente con el base previo: `qz007_o0` y `qz007_o2` ya eran idénticos al
render de Valentina en HEAD):

1. Copia de `voices/valentina/audio/<id>.mp3` → `audio/<id>.mp3`.
2. Registro en el `audios.json` base con etiqueta `?v=48-quiz-audio-base`.
3. `word_timestamps` en `timecode/timecode_output.json`, en el formato Whisper
   del base (`{timecodes: [null, {word_timestamps: [...]}]}`).

Resultado verificado:

| Control | Antes | Después |
|---|---|---|
| Base con MP3 servible | 4 | **28** |
| Base con 404 | 24 | **0** |
| Base con timecodes utilizables | 4 (texto viejo) | **28 (texto vigente)** |
| `qz007_o0.mp3` base | 12.528 B («Comprando un pasaje») | 16.272 B («Solicitando ayuda al capitán») |
| Claves ajenas modificadas | — | **0** en ambos JSON |
| Timecodes base vs voz | — | idénticos, 0 descuadres |

Prueba en navegador tras el arreglo (`index.html#qz007`): el timecode de
`qz007_o0` devuelve «Solicitando ayuda al capitán» y las peticiones van a
`voices/valentina/audio/qz007_o0.mp3?v=48-quiz007-fix-valentina`. El audio que
todavía sale del base (por ejemplo `qz007_que`, el primero de la cola, que se
resuelve antes de que termine de cargar el catálogo de voz) también es correcto.

## SEGUNDO LOTE: los 102 ids colgados de quiz del base

Primer commit del trabajo: `416b6c4f` («Regenera los audios de quiz
desactualizados y completa el catálogo base»), 92 archivos, pusheado a
`origin/master`.

Después se completó el resto de las referencias colgadas de quiz del base.

### Lo importante: no hizo falta generar TTS

Comprobado antes de tocar nada: los 102 ids **ya existían en las dos voces**
con audio y timecodes correctos (0 ausentes, 0 sin archivo, 0 sin timecodes,
0 descuadres de palabras contra el texto vigente). Sus textos nunca cambiaron,
así que su audio siempre estuvo bien: lo único roto era el **base**.

Por eso el arreglo fue puramente de datos, sin red ni `edge-tts`:

```
venv\Scripts\python.exe tools/_basefix.py --source base-dangling
```

Resultado: 102 MP3 copiados a `audio/`, 102 entradas reetiquetadas en el
`audios.json` base con `?v=48-quiz-audio-base`, 102 `word_timestamps`
insertados.

### Verificación

| Control | Resultado |
|---|---|
| Colgadas de quiz en el base | **102 → 0** |
| MP3 idénticos al render de Valentina | 130/130 (los 28 + los 102) |
| Timecodes base idénticos a los de la voz | 130/130 |
| Descuadres de palabras vs texto vigente | **0** |
| Claves ajenas modificadas en los 2 JSON base | **0** |
| HTTP de muestras | 200 con tamaño real |
| `report_quiz_audio_gaps.py` | **0 desactualizados** |

Claves: `audios.json` 10.102 (sin cambios de conteo), `timecode_output.json`
2.140 → 2.242.

### Las 14 no-quiz: también cerradas

Commit `4fb85126` («Completa el catálogo base: 116 locuciones sin respaldo»),
119 archivos, pusheado a `origin/master`.

Ninguna necesitó síntesis nueva: los 116 ya tenían audio y timecodes
correctos en las voces. Solo había que llevarlos al base.

Un detalle que costó un intento: `whatsapp_chat_intro_pg070` es un **alias**
que apunta al audio compartido `whatsapp_chat_intro.mp3`, así que no tiene
archivo propio. El origen hay que resolverlo por el catálogo, no por el
nombre del id. Corregido en `_basefix.py`.

### Resultado final del catálogo base

| Control | Resultado |
|---|---|
| Referencias colgadas | **0** (eran 140 al empezar) |
| Entradas con `?v=48-quiz-audio-base` | 144 (28 + 102 + 14) |
| MP3 idénticos a su origen (alias resuelto) | 144/144 |
| Timecodes base idénticos a los de la voz | 144/144 |
| Claves preexistentes modificadas | **0** en ambos JSON |
| Muestras por HTTP | 200 con tamaño real |
| `report_quiz_audio_gaps.py` | **0 desactualizados** |

Claves: `audios.json` 10.102 · `timecode_output.json` 2.140 → 2.256.

Quedan 93 archivos huérfanos en `audio/` (existen pero ninguna entrada los
referencia). Son preexistentes, inofensivos y no se tocaron.

## TERCER LOTE: audios de las páginas de cierre

Commit `33f32eee` («Genera los audios de las páginas de cierre en ambas
voces»), 152 archivos, pusheado a `origin/master`.

### Corrección de un diagnóstico mío anterior

Había dicho que las páginas de cierre (pg225 Créditos, pg226
Agradecimientos) **no tenían audio y quedaban excluidas de la narración**.
Era **incorrecto**: el catálogo base **ya tenía** las 74 entradas y sus MP3
(estaban en HEAD), y como el motor solo agrega a la cola los elementos cuyo
id existe en el catálogo base, **sí se narraban**.

Lo que faltaba era el audio **por voz**. El efecto real: esas páginas se
leían siempre con la voz del respaldo, ignorando el narrador elegido. Eso
es lo que se corrigió.

### Trabajo

- 74 ids × 2 voces = **148 MP3** generados con Edge TTS, con audio y marcas
  de palabra en la misma pasada.
- `audios.json` y `timecodes.json` de cada voz: 10.000 → **10.074** claves.
- Etiqueta `?v=48-closing-pages-<voz>` solo en las 74 nuevas; las 10.000
  preexistentes conservan la suya.
- El **catálogo base no se tocó**, por decisión de alcance y porque ya
  estaba correcto.

### Verificación

| Control | Resultado |
|---|---|
| Ids presentes en ambas voces | 74/74 |
| Con la etiqueta nueva | 74/74 |
| Claves ajenas modificadas | **0** en ambos JSON |
| MP3 faltantes | 0 |
| Descuadres palabra/texto | 1 (`pg225_n0102`, ver abajo) |
| Navegador en `#pg225_sec001` | pide `voices/valentina/audio/pg225_*.mp3?v=48-closing-pages-valentina` |

`pg225_n0102` («Embajador de desafioprofundo.org»): Edge agrupa el dominio
en **una sola unidad de habla** (1,49 s), consistente con leerlo como
dominio. No es un error; el resaltado cubriría el dominio completo.

### Incidente durante el trabajo

Dos fallos propios, ambos corregidos:

1. `_batch_tts.py` no contemplaba ids **nuevos**: intentaba reemplazar
   entradas inexistentes y fallaba. Se le agregó inserción y `--ids`.
2. `_basefix.py` agregaba una **coma final** al reemplazar una entrada, y
   `pg226_n0012` es la última del mapa, así que dejó el `audios.json` base
   con un JSON inválido. Se restauró desde HEAD y se corrigió el script
   para preservar la coma original.

### Corrección posterior: el audio base era otro narrador

Commit `4391f2e5` («Sustituye el audio base de las páginas de cierre por el
narrador correcto»), 76 archivos, pusheado.

El usuario reportó que en esas páginas no se oía a Valentina ni a Mateo.
**Tenía razón**, y el motivo era el catálogo base:

- El audio base de los 74 ids **no era Valentina ni Mateo**: era otra
  locución, y a **192 kbps** en lugar de los 96 kbps del resto del libro
  (introducida al integrar las páginas en `393868ba`).
- Importaba porque el lector cae al base mientras el catálogo de voz carga
  de forma asíncrona: en esas páginas el **primer ítem** de la narración
  salía del base, así que se oía al otro narrador aunque estuviera elegida
  Valentina. En una red lenta la ventana es de varios segundos.
- Al haber respetado el alcance «solo las 2 voces» del lote anterior, dejé
  el respaldo con la voz equivocada. Ese fue el error de criterio.

Cómo se comprobó que el base era otra voz (el hash no sirve, porque el
bitrate distinto cambia los bytes; la **duración** sí es independiente del
bitrate):

| id | base | valentina | mateo |
|---|---|---|---|
| `pg225_n0002` | **1,68 s** | 1,39 s | 1,32 s |
| `pg225_n0007` | **0,74 s** | 0,94 s | 0,94 s |

Ratio base/valentina entre 0,72 y 1,65 en los 74 ids, imposible para la
misma voz. En un id control donde el base *sí* es Valentina
(`pg027_n0024`) el ratio da 1,000 exacto.

Y que los 148 archivos generados **sí** son Valentina y Mateo, por
re-síntesis del mismo texto (0,0 % de diferencia de duración, 8/8).

Solución: copiar el render de Valentina a `audio/`, reetiquetar con
`?v=48-closing-pages` y agregar los `word_timestamps` que faltaban.
Verificado: 74/74 MP3 y timecodes idénticos a los de la voz, 0 claves
ajenas, 0 colgadas, bitrate normalizado de 192 a 96 kbps.

## PRUEBA DE CONCEPTO: eliminar el audio del catálogo base (opción B)

**Estado: implementada y validada. Sin borrar nada.** El cambio está sin
commitear en `assets/reflow-book.js` (+30 líneas) y el `?v=` de `index.html`.

### Por qué el base es necesario (y qué no lo es)

El runtime descarga `content/i18n/es-UY/audios.json` **por su cuenta** (función
`Rj()` en `bundle.local.js`, que hace `r.set(ny, a.audios)`) y arma la cola de
narración con sus claves. Por eso `reflow-book.js` intercepta ese fetch: los
ids que no estén en ese mapa **nunca se leen**. Eso es estructural y no se puede
quitar sin tocar el runtime.

Lo que **sí** es prescindible es el **audio**: de los 773 MB de `audio/`,
**764 MB (99 %)** corresponden a ids que también están en los dos catálogos de
voz. Los 29 restantes tienen texto vacío en `texts.json`.

### El cambio

En `installReflowDataAdapter`, después de los overrides, se reescribe cada id
del mapa base para que apunte al archivo del narrador elegido:

```js
var vozMapa = await (await inheritedFetch(
  "./content/i18n/es-UY/voices/" + state.ttsVoice + "/audios.json?v=..."
)).json();
Object.keys(data).forEach(function (id) {
  if (vozMapa[id]) data[id] = vozMapa[id];
});
```

El motor ya soporta rutas `voices/` en el mapa (tres lugares comprueban
`filename.indexOf("voices/") === 0`).

### Verificación en navegador

| Página | Audio | De voz | De base |
|---|---|---|---|
| portada | 4 | 4 | 0 |
| quiz `#qz007` | 4 | 4 | 0 |
| créditos `#pg225_sec001` | 7 | 7 | 0 |
| agradecimientos `#pg226_sec001` | 7 | 7 | 0 |
| chat WhatsApp `#pg069_sec001` | 6 | 6 | 0 |
| lectura fácil `#pg022_sec001` | 5 | 5 | 0 |
| `#pg071` / `#pg152` (residuos) | 4 / 2 | 4 / 2 | 0 |
| **con Mateo** `#pg225_sec001` | 5 | **5 de Mateo** | 0 |

Mapa: **10.074 de 10.074** ids del catálogo de voz reescritos (**100 %**).
Quedan 29 rutas base. 0 errores y 0 peticiones fallidas.

Cubre las cuatro rutas de audio: quiz, cierre, WhatsApp y lectura fácil. Y el
cambio de narrador funciona: los 5 audios de la prueba con Mateo salieron de
`voices/mateo/`, 0 del base.

### Lo único que queda pendiente

Los 29 ids con texto vacío. Son residuos de la exportación que el motor **vacía
a propósito** (`data.pg113_n0002_easy_read = ""` + `suppressBlankCatalogueResidues`),
así que no son contenido narrable. Pero en `#pg113_sec001` **sí se pidió**
`audio/pg113_n0002.mp3`: hoy se reproducen ~2 s de audio viejo para un fragmento
que está vaciado y oculto. Borrar el base lo volvería silencio (más correcto),
aunque conviene quitarlos del mapa o apuntarlos a un silencio para no depender
de un 404.

### Costo

El adaptador pasa a descargar `voices/<voz>/audios.json` (**1.032.918 B**) al
arrancar, cuando antes se difería a la primera narración. A cambio, 764 MB
dejan de ser necesarios.

### Antes de borrar, falta

1. Decidir qué hacer con los 29 residuos (quitarlos del mapa o apuntarlos a silencio).
2. Reaplicar el rewrite si el usuario cambia de narrador (hoy no hace falta
   porque el catálogo de voz gana, pero conviene dejarlo explícito).
3. Centralizar el `?v=` que quedó duplicado en la URL.
4. Probar `file://`, donde el precargador sirve el `audios.json` desde memoria.
5. Bumpear el `?v=` al commitear.

## OPCIÓN B IMPLEMENTADA: el audio del catálogo base se elimina

### Los 29 residuos: resueltos

Se quitaron del mapa base (10.102 → 10.073 claves). Son fragmentos cuyo texto
está vacío en `texts.json` y que el motor ya vacía y oculta a propósito
(`suppressBlankCatalogueResidues`). Al quitarlos del mapa dejan de encolarse, y
se termina el efecto de que sonara audio viejo para un fragmento invisible.

### El borrado: 762 MB

Se borraron 10.036 archivos de `content/i18n/es-UY/audio/` (762 MB), es decir
todos los referenciados por el mapa base. Se conservaron:

- los **15 declarados en `imsmanifest.xml`** (SCORM), para no desincronizar el paquete;
- los **123 huérfanos**, por decisión previa.

`audio/` pasó de 773 MB a **11 MB**.

### El cambio en el motor

En `installReflowDataAdapter`, el mapa base se reapunta al narrador elegido
mediante `rewriteBaseAudioMapToVoice()`, que también se invoca al cargar el
catálogo de voz (así sigue un cambio de narrador). La etiqueta de versión de los
catálogos de voz quedó centralizada en `ttsVoiceCatalogVersion`.

### Verificación

| Escenario | Resultado |
|---|---|
| Mapa base | 10.074 claves, **100 % apuntando a las voces**, 0 en base |
| 7 páginas por HTTP (quiz, cierre, WhatsApp, lectura fácil, residuos) | 0 peticiones al base, 0 fallidas |
| Cambio de narrador a Mateo | 7 de 8 de Mateo, 0 del base |
| `file://` | arranca y narra, ver abajo |

## El precargador offline: dos bugs preexistentes, arreglados

Al verificar `file://` el usuario reportó «No fue posible preparar el libro
reflowable». **No lo causó el borrado**: era un defecto previo, y había dos.

### Bug 1: le faltaban secciones

El precargador inlinea las páginas del libro, y el lector hace `Promise.all`
sobre **todas** (`reflow-book.js`, línea 11180): si una falla, no arranca.
Inlineaba 197 de 200 secciones — le faltaban exactamente las tres de cierre
(`pg225/226/227_sec001.html`), agregadas en `393868ba` (11 sep) **después** de
generarse el precargador, que nunca se regeneró. Por eso `file://` estaba roto
desde 3 días antes de este trabajo.

### Bug 2: los catálogos iban como texto

El manejador hace:

```js
var isJson = key.slice(-5) === ".json";
var body = isJson ? JSON.stringify(data) : data;
```

o sea que los `.json` deben guardarse como **objeto**. El archivo guardaba
**224 de 228 valores como string**, incluidos `audios.json`, `texts.json` y los
catálogos de voz: `JSON.stringify(texto)` los devolvía doblemente escapados, y
el lector recibía un string en vez de un objeto.

### Bug 3 (de paso): codificación

`pg225_sec001.html` tenía un byte Latin-1 suelto (`Cr\xe9ditos` en vez de UTF-8).
Reparado.

### El generador: `tools/build_offline_preloader.py`

El original (`tools/build_portable_web_export.py`) no está en el repositorio, así
que se escribió uno. Preserva intacta la lógica del precargador (el wrapper,
`lookup()` y el reemplazo de `window.fetch`) y regenera **solo** el mapa
`INLINE`, con el formato correcto: **objetos** para los `.json` y strings para
el resto. Además serializa los JSON compactos, así que el archivo **baja de
24,6 a 15,6 MB**.

```
venv\Scripts\python.exe tools/build_offline_preloader.py          # dry-run
venv\Scripts\python.exe tools/build_offline_preloader.py --apply
```

Inlinea 231 archivos: `index.html`, las 215 páginas, el bundle, los catálogos,
la navegación y los índices.

### Verificación de `file://` tras el arreglo

| Página | Audio | De voz | De base |
|---|---|---|---|
| portada | 3 | 3 | 0 |
| texto pg100 | 3 | 3 | 0 |
| quiz qz007 | 4 | 4 | 0 |
| créditos pg225 | 5 | 5 | 0 |
| agradecimientos pg226 | 4 | 4 | 0 |
| glosario | 4 | 4 | 0 |

4.463 elementos compuestos, 0 peticiones fallidas. Los únicos avisos son de
fuentes (`Access to font ... from origin`), una restricción conocida de `file://`
que no afecta al libro.

## Resultado en tamaño

| | Antes | Ahora |
|---|---|---|
| `content/i18n/es-UY/audio/` | 773 MB | **11 MB** |
| `assets/offline-preloader.js` | 24,6 MB | **15,6 MB** |
| Repo sin `.git` | 1.362 MB | **591 MB** |

## Trabajo pendiente (no hecho, a decisión del usuario)

1. **26 locuciones de lectura fácil** (`pg022`…`pg214`) cambiadas en `15824ee9`
   por "1" → "un/una". **Decisión tomada: no hacer nada.** Se comprobó que Edge
   pronuncia el dígito igual que la palabra: sintetizar el texto nuevo produce
   el mismo tamaño y los mismos timecodes. El cambio fue ortográfico.
2. **94 archivos huérfanos** en `audio/`: existen pero ninguna entrada los
   referencia. **Decisión tomada: dejarlos.** 50 están declarados en
   `imsmanifest.xml` (SCORM) y otros tantos aparecen en el snapshot incrustado
   de `offline-preloader.js`, así que borrarlos exigiría podar el manifiesto y
   regenerar el precargador. Solo 1 no tiene ninguna referencia.
3. **`offline-preloader.js` desactualizado**: incrusta una copia de los
   catálogos con las etiquetas viejas (0 menciones de `48-quiz-audio-base`,
   20.000 de `47-uatsap`). Funciona porque se conservaron los nombres de
   archivo, pero conviene regenerarlo.
4. **Endurecer el motor** (opcional): la carrera del catálogo de voz. En la
   prueba de las páginas de cierre se vio de nuevo: el primer ítem
   (`pg225_n0002`) salió del base y el resto de la voz.
5. **Limpiar los artefactos temporales** (ver la sección de arriba): `venv/`
   con edge-tts, los scripts `_`-prefijados y estas notas.

## Commits de esta tarea

| Commit | Contenido |
|---|---|
| `416b6c4f` | Regenera los 28 audios de quiz desactualizados y completa el base para ellos |
| `4fb85126` | Completa el catálogo base: 116 locuciones sin respaldo (102 de quiz + 14) |
| `33f32eee` | Genera los audios de las páginas de cierre en ambas voces (148 MP3) |
| `4391f2e5` | Sustituye el audio base de las páginas de cierre por el narrador correcto |

Los cuatro pusheados a `origin/master`. La corrección de voces previa fue `bebb4e17`.
