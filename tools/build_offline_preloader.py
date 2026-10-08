#!/usr/bin/env python3
"""Regenera assets/offline-preloader.js a partir del estado actual del repo.

El precargador existe para que el libro funcione abierto como `file://`, donde
el navegador bloquea `fetch` de archivos locales. Su primera linea util es
`if (location.protocol !== "file:") return;`, asi que solo actua en ese caso.

El archivo original lo generaba `tools/build_portable_web_export.py`, que no
esta en el repositorio. Este script hace ese trabajo.

Se preserva intacta la logica del precargador (el wrapper, `lookup()` y el
reemplazo de `window.fetch`) y se regenera **solo** el mapa `INLINE`, que es la
parte con datos.

Formato de los valores, impuesto por el propio manejador:

    var data = INLINE[key];
    var isJson = key.slice(-5) === ".json";
    var body = isJson ? JSON.stringify(data) : data;

Es decir: los `.json` tienen que guardarse como **objeto** (no como texto), y
todo lo demas como string. El archivo original guardaba 224 de 228 valores como
string, lo que hacia que los catalogos llegaran como texto en vez de objeto.

Uso:
    python tools/build_offline_preloader.py            # dry-run
    python tools/build_offline_preloader.py --apply
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRELOADER = ROOT / "assets" / "offline-preloader.js"
HEAD = "var INLINE = {"
TAIL = "var BASE_DIR"


def cierre_mapa(texto: str, inicio: int, limite: int) -> int:
    """Devuelve el indice de la llave que cierra el objeto abierto en `inicio`.

    Respeta cadenas y escapes, de modo que las llaves que aparecen dentro de un
    valor no cuentan. `limite` corta la busqueda antes del wrapper del
    precargador. Devuelve -1 si no encuentra el cierre.
    """
    if inicio < 0 or texto[inicio] != "{":
        return -1
    profundidad = 0
    en_cadena = False
    escape = False
    for pos in range(inicio, min(limite, len(texto))):
        ch = texto[pos]
        if en_cadena:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                en_cadena = False
            continue
        if ch == '"':
            en_cadena = True
        elif ch == "{":
            profundidad += 1
        elif ch == "}":
            profundidad -= 1
            if profundidad == 0:
                return pos
    return -1


def claves_a_inlinear() -> list[tuple[str, Path]]:
    """Devuelve (clave, ruta) de todo lo que el precargador tiene que servir."""
    pares: list[tuple[str, Path]] = []

    # Paginas del libro: index y todas las secciones (pg*_sec*.html y qz*.html)
    for p in sorted(ROOT.glob("*.html")):
        pares.append(("./" + p.name, p))

    # Recursos del lector
    for rel in ("assets/base.bundle.local.js", "assets/config.json"):
        p = ROOT / rel
        if p.exists():
            pares.append(("./" + rel, p))

    for p in sorted((ROOT / "assets" / "interface_translations").rglob("*.json")):
        pares.append(("./" + p.relative_to(ROOT).as_posix(), p))

    # Catalogos de idioma
    i18n = ROOT / "content" / "i18n"
    for lang in sorted(p for p in i18n.iterdir() if p.is_dir()):
        for nombre in (
            "audios.json",
            "glossary.json",
            "images.json",
            "quiz-answers.json",
            "quiz-feedback.json",
            "speech_texts.json",
            "texts.json",
            "videos.json",
        ):
            p = lang / nombre
            if p.exists():
                pares.append(("./" + p.relative_to(ROOT).as_posix(), p))
        tc = lang / "timecode" / "timecode_output.json"
        if tc.exists():
            pares.append(("./" + tc.relative_to(ROOT).as_posix(), tc))
        voices = lang / "voices"
        if voices.is_dir():
            for voz in sorted(v for v in voices.iterdir() if v.is_dir()):
                for nombre in ("audios.json", "timecodes.json"):
                    p = voz / nombre
                    if p.exists():
                        pares.append(("./" + p.relative_to(ROOT).as_posix(), p))

    # Navegacion e indices
    for rel in ("content/navigation/nav.html", "content/pages.json", "content/toc.json"):
        p = ROOT / rel
        if p.exists():
            pares.append(("./" + rel, p))

    # Sin duplicados, en orden estable
    vistos = {}
    for clave, p in pares:
        vistos.setdefault(clave, p)
    return sorted(vistos.items())


def valor_js(p: Path) -> str:
    """Serializa el contenido en el formato que espera el manejador."""
    if p.suffix == ".json":
        # Objeto literal: el manejador le aplica JSON.stringify. Compacto para
        # no inflar el archivo, y con < > escapados por seguridad.
        datos = json.loads(p.read_text(encoding="utf-8"))
        texto = json.dumps(datos, ensure_ascii=True, separators=(",", ":"))
    else:
        texto = p.read_text(encoding="utf-8", errors="replace")
        texto = json.dumps(texto, ensure_ascii=True)
    return texto.replace("<", "\\u003c").replace(">", "\\u003e")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="escribe el archivo")
    ap.add_argument("--out", default=str(PRELOADER))
    args = ap.parse_args()

    if not PRELOADER.exists():
        print(f"no existe {PRELOADER}", file=sys.stderr)
        return 1

    original = PRELOADER.read_text(encoding="utf-8", errors="replace")

    i_head = original.find(HEAD)
    i_tail = original.find(TAIL)
    if i_head < 0 or i_tail < 0:
        print("no se pudo delimitar el mapa INLINE", file=sys.stderr)
        return 1
    i_head += len(HEAD)

    # El cierre del mapa debe ubicarse con un escaneo de profundidad consciente
    # de cadenas. Buscar el patron '"}'' es incorrecto: esa secuencia tambien
    # aparece dentro de los valores escapados ('\"}' dentro de un string), y
    # `rfind` devolvia una posicion interna, de modo que la "cola" conservada
    # arrancaba a mitad de un valor y dejaba el archivo como JS invalido.
    cierre = cierre_mapa(original, i_head - 1, i_tail)
    if cierre < 0:
        print("no se encontro el cierre del mapa INLINE", file=sys.stderr)
        return 1
    cola = original[cierre + 1:]  # desde ";" inclusive

    pares = claves_a_inlinear()
    print(f"archivos a inlinear: {len(pares)}")

    faltantes = [(c, p) for c, p in pares if not p.exists()]
    if faltantes:
        print(f"  ATENCION: {len(faltantes)} rutas no existen")

    entradas = []
    por_tipo = {"json": 0, "texto": 0}
    for clave, p in pares:
        if not p.exists():
            continue
        entradas.append(f'"{clave}":{valor_js(p)}')
        por_tipo["json" if p.suffix == ".json" else "texto"] += 1

    cuerpo = ",\n".join(entradas)
    nuevo = original[:i_head] + "\n" + cuerpo + "\n}" + cola

    print(f"  .json como objeto : {por_tipo['json']}")
    print(f"  texto como string : {por_tipo['texto']}")
    print(f"  tamano antes  : {len(original):,} B")
    print(f"  tamano despues: {len(nuevo):,} B  ({len(nuevo)-len(original):+,})")

    # Comprobaciones antes de escribir
    claves_nuevas = set(re.findall(r'"((?:\./)[^"]{1,200}?)":', nuevo[:nuevo.find(TAIL)]))
    print(f"  claves en el mapa nuevo: {len(claves_nuevas)}")
    secciones = [p.name for p in ROOT.glob("*.html")]
    faltan_sec = [s for s in secciones if f"./{s}" not in claves_nuevas]
    print(f"  secciones en disco: {len(secciones)}  ausentes del mapa: {len(faltan_sec)} {faltan_sec[:5]}")
    esperadas = {c for c, _ in pares}
    huecos = sorted(esperadas - claves_nuevas)
    print(f"  claves esperadas ausentes: {len(huecos)} {huecos[:5]}")

    # El mapa es un objeto JSON valido por construccion; si no parsea, alguna
    # entrada se serializo mal (o la cola conservada invade el mapa). Sin esta
    # comprobacion el archivo se escribia y recien fallaba en el navegador.
    inicio_mapa = nuevo.find(HEAD) + len(HEAD) - 1
    fin_mapa = cierre_mapa(nuevo, inicio_mapa, nuevo.find(TAIL))
    if fin_mapa < 0:
        print("  ERROR: el mapa nuevo no cierra; no se escribe", file=sys.stderr)
        return 1
    try:
        mapa_nuevo = json.loads(nuevo[inicio_mapa:fin_mapa + 1])
    except json.JSONDecodeError as error:
        print(f"  ERROR: el mapa nuevo no es JSON valido ({error}); no se escribe",
              file=sys.stderr)
        return 1
    print(f"  mapa nuevo parsea como objeto con {len(mapa_nuevo)} claves")

    if not args.apply:
        print("\n(dry-run; usar --apply)")
        return 0

    destino = Path(args.out)
    destino.write_text(nuevo, encoding="utf-8")
    print(f"\nescrito {destino.relative_to(ROOT)}")
    r = subprocess.run(["node", "--check", str(destino)], capture_output=True, text=True)
    print("node --check:", "OK" if r.returncode == 0 else r.stderr[:300])
    return 0 if r.returncode == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
