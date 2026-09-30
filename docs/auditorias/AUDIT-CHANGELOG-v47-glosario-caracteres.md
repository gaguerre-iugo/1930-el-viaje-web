# Cambio de mantenimiento — caracteres ajenos al español en el glosario

## Alcance

Revisión de **todos los textos del libro** en busca de caracteres fuera del
español y fuera del rango de emojis, a partir de un defecto visible en el
glosario. No cambia la estructura del libro ni la paginación: es una corrección
de datos más la herramienta que la audita.

## Defecto

Dos entradas del glosario mostraban tres letras armenias donde debía haber un
emoji:

| Entrada | Antes | Después |
|---|---|---|
| `espía` | `🕶️ գաղ` <!-- audit-charset:allow --> | `🕶️` |
| `espionaje` | `🕵️ գաղ👀` <!-- audit-charset:allow --> | `🕵️👀` |

Los caracteres eran **U+0563, U+0561 y U+0572** — tres letras armenias —
repetidas en los dos campos `emoji`.

La misma revisión encontró un tercer caso del mismo tipo, invisible hasta ahora:

| Entrada | Antes | Después |
|---|---|---|
| `fugitivo` | `🏃逃⚠️` <!-- audit-charset:allow --> | `🏃⚠️` |

En este caso el carácter ajeno era **U+9003**, un ideograma chino.

El campo `emoji` lo consume el glosario del *bundle*
(`assets/base.bundle.local.js`), que lo pinta en la lista de términos y en las
tarjetas de definición; `reflow-book.js` no lo usa. Por eso el defecto se veía
en el panel **Glosario**.

## Cambios

- `content/i18n/es-UY/glossary.json` — se quitaron los caracteres ajenos de los
  tres campos `emoji`. Los 638 términos y todas las definiciones quedan igual.
- `assets/offline-preloader.js` — el precargador embebe el glosario completo
  para el modo `file://`, así que se resincronizó con
  `node tools/sync_offline_preloader.js`. Se comparó el catálogo `INLINE` antes
  y después: **la única entrada que cambió fue `./content/i18n/es-UY/glossary.json`**.
  El archivo pasa `node --check`.
- `tools/audit_charset.py` — herramienta nueva (ver abajo).

## Herramienta de auditoría

`tools/audit_charset.py` recorre los textos del libro y reporta todo carácter
que no sea español ni emoji válido.

```bash
python tools/audit_charset.py              # superficies del libro (puerta de release)
python tools/audit_charset.py --repo       # todo el checkout, incluidos docs/ y tools/
python tools/audit_charset.py --include-derived   # + timecodes generados
python tools/audit_charset.py --strict     # falla también por letras latinas ajenas
python tools/audit_charset.py --json tmp/charset-report.json
```

Criterios:

- **Permitido**: ASCII imprimible, los caracteres propios del español
  (`áéíóúüñÁÉÍÓÚÜÑ¡¿«»ºª`), puntuación tipográfica (`–—…“”‘’·`), signos de uso
  corriente (`§−µ×÷≤≥≈±°²³`), marcas diacríticas combinantes y los bloques de
  emoji que el libro usa (pictogramas, flechas, banderas, dingbats, selectores de
  variación, ZWJ, tonos de piel).
- **`ALPHABET`** — letra de otro alfabeto (armenio, cirílico, griego, hebreo,
  árabe, han, hangul). Es el defecto que originó esta revisión: **siempre falla**.
- **`SYMBOL`** — símbolo fuera del español y de los emojis. **Falla.**
- **`LATIN_FOREIGN`** — letra latina que el español no usa (la `e` con acento
  grave del francés, por ejemplo). Se informa como observación y solo falla con
  `--strict`, porque las citas en otro idioma son contenido legítimo.
- Cualquier línea (o valor JSON) que contenga `audit-charset:allow` se omite,
  para que la documentación pueda citar el defecto textualmente. En tablas de
  Markdown conviene escribirlo como `<!-- audit-charset:allow -->`, que no se ve
  al renderizar.

El precargador se audita **entrada por entrada** del catálogo `INLINE`, de modo
que un hallazgo nombra el archivo embebido (por ejemplo
`inlined ./content/i18n/es-UY/glossary.json.espía.emoji`) y no «línea 6». Las
librerías de terceros embebidas (`base.bundle.local.js`, `base.bundle.min.js`)
se omiten: sus tablas Unicode internas no son texto del libro.

## Resultado de la auditoría

Sobre las superficies del libro (229 archivos): **0 caracteres de alfabetos
ajenos**. Quedan dos conjuntos de hallazgos, ninguno de ellos un defecto nuevo
del glosario:

1. **Cita en francés** — `pg164_n0004` y su variante de lectura fácil contienen
   `l’orchestre roumain, qui interprétera des pièces populaires de ce pays` <!-- audit-charset:allow -->
   (habla un personaje). Las cuatro apariciones (textos, las dos voces y el
   precargador) son correctas y se informan como `LATIN_FOREIGN`.
2. **`content/i18n/es-UY/timecode/timecode_output.json`** — archivo heredado del
   pipeline de voz única, con **13 entradas de 2330** dañadas. Los caracteres
   ajenos aparecen donde el texto vigente empieza una línea o donde hay marcas de
   tapa: `Ą` U+0104, `È` U+00C8, `‖` U+2016, `„` U+201E y `†` U+2020. <!-- audit-charset:allow -->
   Ninguna coincide ya con el texto visible. El lector **no lo descarga**: el
   pipeline activo usa `voices/{valentina,mateo}/timecodes.json`. Sí viaja dentro
   del precargador offline, donde ocupa unos 3,5 MB.

   Queda pendiente decidir si se corrige o si se saca del paquete offline.

## Verificación realizada

- `glossary.json` parsea y conserva 638 términos, todos con `emoji`.
- Los tres campos corregidos contienen exactamente `🕶️`, `🕵️👀` y `🏃⚠️`.
- El catálogo embebido del precargador se reparsea y la única diferencia contra
  el estado anterior es la entrada del glosario.
- `node --check assets/offline-preloader.js` sin errores.
- `python tools/audit_charset.py` no reporta ningún carácter de alfabeto ajeno.

No se pudo hacer la comprobación visual con navegador en este entorno: el
sandbox bloquea el pipe de depuración de Chromium (`spawn EPERM`). La
verificación visual queda pendiente y puede hacerse con
`node tools/screen-test/run.mjs --viewport fhd-1920x1080-dpr1`, abriendo el
panel **Glosario** y buscando `espía` y `espionaje`.
