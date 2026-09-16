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
