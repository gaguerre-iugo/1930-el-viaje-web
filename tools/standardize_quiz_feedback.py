"""Unifica las devoluciones de las actividades (punto 16 de la revisión UX).

Las 72 devoluciones que quedan viven en dos lugares que tienen que decir lo mismo:
el texto visible en el HTML (`<span data-feedback-audio-id="…_exp">`) y el texto
que se narra en `content/i18n/es-UY/texts.json`. Hoy el HTML dice «No.» y el
catálogo dice «❌ No.»: la misma frase con dos formas.

Criterio único:

- respuesta incorrecta: «Todavía no. <explicación> Elegí otra opción y volvé a
  enviar.»
- respuesta correcta: «Correcto. <explicación>» (ya estaba unificado)
- sin emojis en las devoluciones: lo que se ve es lo que se narra

Además retira del catálogo las devoluciones de actividades que ya no están en el
paquete.

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
TEXTOS = RAIZ / "content" / "i18n" / "es-UY" / "texts.json"

CIERRE = "Elegí otra opción y volvé a enviar."
APERTURA_INCORRECTA = "Todavía no."
APERTURA_CORRECTA = "Correcto."
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\u2190-\u21FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F]"
)
SPAN = re.compile(
    r'(<span[^>]*data-feedback-audio-id="(?P<id>[^"]+)"[^>]*>)(?P<texto>.*?)(</span>)',
    re.S,
)
INICIO_INCORRECTO = re.compile(
    r"^(?:❌\s*)?(?:No\b[.,:]?|Incorrecto\b[.,:]?|Todavía no\b[.,:]?)\s*", re.I
)
INICIO_CORRECTO = re.compile(r"^(?:✅\s*)?(?:Correcto\b[.,:]?|¡?Muy bien!?[.,:]?)\s*", re.I)


def sin_emoji(texto: str) -> str:
    return EMOJI.sub("", texto).strip()


def normalizar(texto: str) -> str:
    """Devuelve el texto unificado de una devolución."""
    limpio = sin_emoji(re.sub(r"\s+", " ", texto)).strip()
    limpio = re.sub(rf"\s*{re.escape(CIERRE)}\s*$", "", limpio).strip()
    incorrecta = bool(INICIO_INCORRECTO.match(limpio))
    if incorrecta:
        resto = INICIO_INCORRECTO.sub("", limpio).strip()
        return f"{APERTURA_INCORRECTA} {resto} {CIERRE}".strip()
    if INICIO_CORRECTO.match(limpio):
        resto = INICIO_CORRECTO.sub("", limpio).strip()
        return f"{APERTURA_CORRECTA} {resto}".strip()
    return limpio


def archivos_de_actividad() -> list[Path]:
    return sorted(
        ruta
        for ruta in RAIZ.glob("*.html")
        if "quiz_sequence" in ruta.read_text(encoding="utf-8")
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="no escribe: sólo informa")
    parser.add_argument("--listar", action="store_true", help="imprime los ids que cambian")
    argumentos = parser.parse_args()

    catalogo = json.loads(TEXTOS.read_text(encoding="utf-8"))
    archivos = archivos_de_actividad()

    cambios: dict[str, str] = {}
    html_nuevo: dict[Path, str] = {}
    vistos: set[str] = set()

    for ruta in archivos:
        contenido = ruta.read_text(encoding="utf-8")

        def reemplazar(coincidencia: re.Match) -> str:
            identificador = coincidencia.group("id")
            vistos.add(identificador)
            nuevo = normalizar(coincidencia.group("texto"))
            if nuevo != re.sub(r"\s+", " ", coincidencia.group("texto")).strip():
                cambios[identificador] = nuevo
            return coincidencia.group(1) + nuevo + coincidencia.group(4)

        html_nuevo[ruta] = SPAN.sub(reemplazar, contenido)

    # El catálogo de narración sigue el mismo criterio y pierde lo obsoleto.
    catalogo_nuevo = dict(catalogo)
    catalogo_cambios: dict[str, str] = {}
    for identificador in list(catalogo_nuevo):
        if not str(identificador).endswith("_exp"):
            continue
        if identificador not in vistos:
            catalogo_cambios[identificador] = "(se retira: la actividad ya no está)"
            del catalogo_nuevo[identificador]
            continue
        nuevo = normalizar(str(catalogo_nuevo[identificador]))
        if nuevo != str(catalogo_nuevo[identificador]):
            catalogo_cambios[identificador] = nuevo
            catalogo_nuevo[identificador] = nuevo

    print(f"actividades: {len(archivos)} · devoluciones: {len(vistos)}")
    print(f"cambian en el HTML: {len(cambios)} · cambian en texts.json: {len(catalogo_cambios)}")

    if argumentos.listar:
        print(json.dumps(cambios, ensure_ascii=False, indent=2))
        return 0

    problemas = []
    for identificador, texto in cambios.items():
        if not texto.startswith((APERTURA_INCORRECTA, APERTURA_CORRECTA)):
            problemas.append(f"{identificador}: no empieza con la apertura acordada")
        if "No." == texto[:3]:
            problemas.append(f"{identificador}: sigue empezando con «No.»")
        if EMOJI.search(texto):
            problemas.append(f"{identificador}: conserva emojis")
    incorrectas = [i for i, t in cambios.items() if t.startswith(APERTURA_INCORRECTA)]
    for identificador in incorrectas:
        if CIERRE not in cambios[identificador]:
            problemas.append(f"{identificador}: le falta el cierre «{CIERRE}»")

    if argumentos.check:
        pendientes = [i for i, t in cambios.items()]
        if pendientes:
            problemas.append(f"{len(pendientes)} devoluciones sin unificar en el HTML")
        if catalogo_cambios:
            problemas.append(f"{len(catalogo_cambios)} entradas del catálogo sin unificar")
        for problema in problemas:
            print(f"  ✗ {problema}")
        if problemas:
            return 1
        print("  ✓ las devoluciones están unificadas y el catálogo coincide")
        return 0

    for ruta, contenido in html_nuevo.items():
        ruta.write_text(contenido, encoding="utf-8")
    TEXTOS.write_text(
        json.dumps(catalogo_nuevo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (RAIZ / "tmp").mkdir(exist_ok=True)
    (RAIZ / "tmp" / "devoluciones_cambiadas.json").write_text(
        json.dumps(
            {
                identificador: texto
                for identificador, texto in cambios.items()
                if texto.startswith(APERTURA_INCORRECTA)
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"  archivos reescritos: {len(html_nuevo)} · catálogo actualizado")
    print("  ids para regenerar audio: tmp/devoluciones_cambiadas.json")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
