"""Unifica y verifica las devoluciones de las actividades (punto 16).

Desde el punto 5 las devoluciones ya no viajan en el HTML: el texto visible vive
en `content/i18n/es-UY/quiz-feedback.json` y el narrado en
`content/i18n/es-UY/texts.json` (claves `<opción>_exp`). Este control revisa que
los dos digan lo mismo y sigan el criterio.

Criterio único:

- respuesta incorrecta: «Considerá que <explicación> Elegí otra opción y volvé a
  enviar.» (la explicación arranca en minúscula salvo nombre propio y, si empieza
  con «aunque», lleva coma después de «que»)
- respuesta correcta: «Correcto. <explicación>»
- sin emojis en las devoluciones: lo que se ve es lo que se narra

Uso:

    python3 tools/standardize_quiz_feedback.py --check
    python3 tools/standardize_quiz_feedback.py            # aplica
    python3 tools/standardize_quiz_feedback.py --listar   # ids y textos nuevos (para el audio)
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
I18N = RAIZ / "content" / "i18n" / "es-UY"
FEEDBACK = I18N / "quiz-feedback.json"
TEXTOS = I18N / "texts.json"

CIERRE = "Elegí otra opción y volvé a enviar."
APERTURA_INCORRECTA = "Considerá que"
APERTURA_INCORRECTA_COMA = "Considerá que,"
APERTURA_CORRECTA = "Correcto."
# Nombres propios que, tras «Considerá que», conservan la mayúscula inicial.
PROPIOS = {"Javier", "Federica", "Natalia", "Josephine", "Anastasia"}
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\u2190-\u21FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F]"
)
INICIO_INCORRECTO = re.compile(
    r"^(?:❌\s*)?(?:No\b[.,:]?|Incorrecto\b[.,:]?|Todavía no\b[.,:]?)\s*", re.I
)
INICIO_CORRECTO = re.compile(r"^(?:✅\s*)?(?:Correcto\b[.,:]?|¡?Muy bien!?[.,:]?)\s*", re.I)
INICIO_NUEVO = re.compile(r"^Considerá\s+que\b[.,:]?\s*", re.I)


def sin_emoji(texto: str) -> str:
    return EMOJI.sub("", texto).strip()


def normalizar(texto: str) -> str:
    """Devuelve el texto unificado de una devolución."""
    limpio = sin_emoji(re.sub(r"\s+", " ", texto)).strip()
    limpio = re.sub(rf"\s*{re.escape(CIERRE)}\s*$", "", limpio).strip()
    # Ya está en el criterio nuevo: se respeta tal cual, porque puede traer
    # ajustes editoriales puntuales (coma tras «que», punto y coma, sujeto
    # explícito) que no se pueden reconstruir desde el texto viejo.
    if INICIO_NUEVO.match(limpio):
        return f"{limpio} {CIERRE}".strip()
    if INICIO_INCORRECTO.match(limpio):
        resto = INICIO_INCORRECTO.sub("", limpio).strip()
        if re.match(r"^aunque\b", resto, re.I):
            resto = "aunque " + resto[len("aunque"):].lstrip()
            return f"{APERTURA_INCORRECTA_COMA} {resto} {CIERRE}".strip()
        primera = resto.split(" ", 1)[0]
        if primera not in PROPIOS:
            resto = resto[0].lower() + resto[1:]
        return f"{APERTURA_INCORRECTA} {resto} {CIERRE}".strip()
    if INICIO_CORRECTO.match(limpio):
        resto = INICIO_CORRECTO.sub("", limpio).strip()
        return f"{APERTURA_CORRECTA} {resto}".strip()
    return limpio


def texto_visible(entrada) -> str | None:
    if isinstance(entrada, dict) and "text" in entrada:
        return str(entrada["text"])
    if isinstance(entrada, str):
        return entrada
    return None


def cargar() -> tuple[dict, dict, dict[str, str]]:
    """Devuelve (feedback, catálogo, {clave_exp: texto visible})."""
    feedback = json.loads(FEEDBACK.read_text(encoding="utf-8"))
    catalogo = json.loads(TEXTOS.read_text(encoding="utf-8"))
    visible: dict[str, str] = {}
    for opciones in feedback.values():
        for opcion, entrada in opciones.items():
            texto = texto_visible(entrada)
            if texto is not None:
                visible[f"{opcion}_exp"] = texto
    return feedback, catalogo, visible


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="no escribe: sólo informa")
    parser.add_argument("--listar", action="store_true", help="imprime los ids que cambian")
    argumentos = parser.parse_args()

    feedback, catalogo, visible = cargar()

    problemas: list[str] = []
    cambios_visible: dict[str, str] = {}
    for identificador, texto in visible.items():
        nuevo = normalizar(texto)
        if nuevo != texto:
            cambios_visible[identificador] = nuevo
        if EMOJI.search(texto):
            problemas.append(f"{identificador}: conserva emojis")
        if texto.startswith(APERTURA_INCORRECTA) and CIERRE not in texto:
            problemas.append(f"{identificador}: le falta el cierre «{CIERRE}»")
        if not texto.startswith((APERTURA_INCORRECTA, APERTURA_CORRECTA)):
            problemas.append(f"{identificador}: no empieza con la apertura acordada")

    cambios_catalogo: dict[str, str] = {}
    for identificador in list(catalogo):
        if not str(identificador).endswith("_exp"):
            continue
        if identificador not in visible:
            cambios_catalogo[identificador] = "(se retira: la actividad ya no está)"
            continue
        actual = str(catalogo[identificador])
        nuevo = normalizar(actual)
        if nuevo != actual or nuevo != visible[identificador]:
            cambios_catalogo[identificador] = visible[identificador]

    print(f"devoluciones visibles: {len(visible)} · en el catálogo: "
          f"{sum(1 for k in catalogo if str(k).endswith('_exp'))}")
    print(f"cambian en quiz-feedback.json: {len(cambios_visible)} · "
          f"cambian en texts.json: {len(cambios_catalogo)}")

    if argumentos.listar:
        print(json.dumps(cambios_visible or cambios_catalogo, ensure_ascii=False, indent=2))
        return 0

    if argumentos.check:
        for identificador in cambios_visible:
            problemas.append(f"{identificador}: el texto visible no sigue el criterio")
        for identificador in cambios_catalogo:
            problemas.append(f"{identificador}: el catálogo no coincide con lo visible")
        for problema in problemas:
            print(f"  ✗ {problema}")
        if problemas:
            return 1
        print("  ✓ las devoluciones están unificadas y los dos catálogos coinciden")
        return 0

    if cambios_visible:
        for opciones in feedback.values():
            for opcion, entrada in opciones.items():
                clave = f"{opcion}_exp"
                if clave in cambios_visible and isinstance(entrada, dict):
                    entrada["text"] = cambios_visible[clave]
        FEEDBACK.write_text(
            json.dumps(feedback, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    if cambios_catalogo:
        catalogo_nuevo = dict(catalogo)
        for identificador in list(catalogo_nuevo):
            if identificador in cambios_catalogo:
                if cambios_catalogo[identificador].startswith("(se retira"):
                    del catalogo_nuevo[identificador]
                else:
                    catalogo_nuevo[identificador] = cambios_catalogo[identificador]
        TEXTOS.write_text(
            json.dumps(catalogo_nuevo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

    (RAIZ / "tmp").mkdir(exist_ok=True)
    (RAIZ / "tmp" / "devoluciones_cambiadas.json").write_text(
        json.dumps(cambios_visible or cambios_catalogo, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print("  quiz-feedback.json y texts.json actualizados")
    print("  ids para regenerar audio: tmp/devoluciones_cambiadas.json")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
