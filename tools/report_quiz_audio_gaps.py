#!/usr/bin/env python3
"""Audita los audios de los cuestionarios frente a sus textos vigentes.

Responde: que locuciones de quiz quedaron desactualizadas porque el texto
cambio despues de generar el audio, y en que catalogo vive cada una.

Detecta tres problemas distintos:

1. AUSENTE       — el texto existe pero no hay MP3 resoluble en ningun catalogo.
2. SIN_CATALOGO  — el MP3 existe en disco pero no esta registrado en audios.json.
3. DESACTUALIZADO — el MP3 se genero antes del ultimo cambio de texto.

Uso:
    python tools/report_quiz_audio_gaps.py
    python tools/report_quiz_audio_gaps.py --json tools/quiz-audio-gaps.json
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "content" / "i18n" / "es-UY"
VOICES = ("valentina", "mateo")
TEXTS_REL = "content/i18n/es-UY/texts.json"


def git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, encoding="utf-8"
    )
    return result.stdout if result.returncode == 0 else ""


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def texts_at(rev: str) -> dict:
    out = git("show", f"{rev}:{TEXTS_REL}")
    return json.loads(out) if out.strip() else {}


def dirty_paths() -> set[str]:
    """Rutas modificadas en el arbol de trabajo respecto de HEAD.

    Sin esto, un audio regenerado pero todavia sin commitear seguiria leyendose
    con la fecha de su ultimo commit y se reportaria como desactualizado.
    """
    out = git("diff", "--name-only", "HEAD")
    return {line.strip() for line in out.splitlines() if line.strip()}


def last_touch_map() -> dict[str, tuple[str, str]]:
    """Ruta -> (sha, fecha) del ultimo commit que la toco, en un solo pase."""
    out = git(
        "log",
        "--format=C|%h|%ad",
        "--date=short",
        "--name-only",
        "--",
        "content/i18n/es-UY/audio",
        "content/i18n/es-UY/voices",
    )
    mapping: dict[str, tuple[str, str]] = {}
    current: tuple[str, str] | None = None
    for line in out.splitlines():
        if line.startswith("C|"):
            _, sha, date = line.split("|", 2)
            current = (sha, date)
        elif line.strip() and current:
            mapping.setdefault(line.strip(), current)
    return mapping


# Un id de locucion siempre lleva sufijo (_que, _oN, _oN_exp). El id desnudo
# qzNNN identifica el contenedor del cuestionario en el HTML, no un texto.
QUIZ_ASSET_RE = re.compile(r"^qz\d{3}_")


def quiz_ids() -> set[str]:
    """IDs de locucion de quiz declarados en texts.json o en los qz*.html."""
    ids = {k for k in load_json(I18N / "texts.json") if k.startswith("qz")}
    for path in sorted(ROOT.glob("qz*.html")):
        raw = path.read_text(encoding="utf-8")
        found = re.findall(r'data-id="(qz[0-9]{3}[^"]*)"', raw)
        found += re.findall(r'data-feedback-audio-id="(qz[0-9]{3}[^"]*)"', raw)
        ids.update(i for i in found if QUIZ_ASSET_RE.match(i))
    return {i for i in ids if QUIZ_ASSET_RE.match(i)}


def attribute_changes() -> dict[str, tuple[str, str, str, str | None]]:
    """id -> (sha, fecha, asunto, texto_previo) del commit que introdujo el vigente."""
    now = load_json(I18N / "texts.json")
    log = git("log", "--format=%H|%P|%ad|%s", "--date=short", "--", TEXTS_REL).splitlines()
    attribution: dict[str, tuple[str, str, str, str | None]] = {}
    for line in log:
        parts = line.split("|", 3)
        if len(parts) < 4:
            continue
        sha, parents, date, subject = parts
        parent = parents.split()[0] if parents.strip() else None
        before = texts_at(parent) if parent else {}
        after = texts_at(sha)
        for key, value in after.items():
            if key in attribution:
                continue
            if before.get(key) != value and now.get(key) == value:
                attribution[key] = (sha[:8], date, subject, before.get(key))
    return attribution


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", default="tools/quiz-audio-gaps.json")
    parser.add_argument(
        "--all",
        action="store_true",
        help="audita todas las locuciones del libro, no solo las de quiz",
    )
    args = parser.parse_args()

    texts = load_json(I18N / "texts.json")
    catalogs = {"base": load_json(I18N / "audios.json")}
    roots = {"base": I18N / "audio"}
    for voice in VOICES:
        catalogs[voice] = load_json(I18N / "voices" / voice / "audios.json")
        roots[voice] = I18N

    attribution = attribute_changes()
    touched = last_touch_map()
    dirty = dirty_paths()
    scope = set(texts) if args.all else quiz_ids()
    rows = []
    for qid in sorted(scope):
        text = texts.get(qid)
        audio = {}
        for name, catalog in catalogs.items():
            rel_entry = catalog.get(qid)
            target = (roots[name] / rel_entry.split("?")[0]) if rel_entry else None
            sha, date = (None, None)
            sin_commitear = False
            if target:
                rel = target.relative_to(ROOT).as_posix()
                sha_date = touched.get(rel)
                if sha_date:
                    sha, date = sha_date
                sin_commitear = rel in dirty
            audio[name] = {
                "registrado": qid in catalog,
                "archivo_existe": bool(target and target.exists()),
                "ultimo_commit": sha,
                "fecha": date,
                "modificado_sin_commitear": sin_commitear,
            }
        attr = attribution.get(qid)
        regenerado = any(a["modificado_sin_commitear"] for a in audio.values())
        stale = bool(
            attr
            and not regenerado
            and any(
                a["fecha"] and a["fecha"] < attr[1] for a in audio.values()
            )
        )
        rows.append(
            {
                "id": qid,
                "texto": text,
                "texto_previo": attr[3] if attr else None,
                "quiz": qid[:5],
                "tipo": "_que" if qid.endswith("_que") else "_exp" if qid.endswith("_exp") else "_opcion",
                "cambio_texto": {
                    "commit": attr[0],
                    "fecha": attr[1],
                    "asunto": attr[2],
                } if attr else None,
                "desactualizado": stale,
                "audios": audio,
            }
        )

    resolubles = [r for r in rows if any(a["archivo_existe"] for a in r["audios"].values())]
    sin_catalogo = [
        r["id"] for r in rows
        if any(a["archivo_existe"] and not a["registrado"] for a in r["audios"].values())
    ]
    desactualizados = [r for r in rows if r["desactualizado"]]
    regenerados = [
        r["id"] for r in rows
        if any(a["modificado_sin_commitear"] for a in r["audios"].values())
    ]

    por_quiz: dict[str, int] = {}
    for r in desactualizados:
        por_quiz[r["quiz"]] = por_quiz.get(r["quiz"], 0) + 1

    report = {
        "total_ids_quiz": len(rows),
        "textos_con_cambio_registrado": sum(1 for r in rows if r["cambio_texto"]),
        "audios_desactualizados": len(desactualizados),
        "ids_desactualizados": [r["id"] for r in desactualizados],
        "regenerados_sin_commitear": regenerados,
        "desactualizados_por_quiz": por_quiz,
        "archivos_a_regenerar_por_voz": len(desactualizados) * len(VOICES),
        "audios_sin_registro_en_catalogo": sin_catalogo,
        "sin_audio_resoluble": [r["id"] for r in rows if r not in resolubles],
        "detalle": rows,
    }

    out = ROOT / args.json
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"IDs de quiz                 : {len(rows)}")
    print(f"Con cambio de texto posterior: {report['textos_con_cambio_registrado']}")
    print(f"Audios desactualizados      : {report['audios_desactualizados']}")
    print(f"Regenerados sin commitear   : {len(regenerados)}")
    print(f"Archivos a regenerar        : {report['archivos_a_regenerar_por_voz']} ({len(VOICES)} voces)")
    print(f"Sin audio resoluble         : {len(report['sin_audio_resoluble'])}")
    print(f"Sin registro en catalogo    : {len(sin_catalogo)}")
    if por_quiz:
        print("\nPor cuestionario:")
        for quiz, count in sorted(por_quiz.items()):
            print(f"  {quiz}: {count}")
    print(f"\nInforme -> {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
