#!/usr/bin/env python3
"""Completa el catalogo BASE a partir de los renders de una voz.

El lector resuelve el audio contra el catalogo de voz y, mientras esa carga
asincrona no termina, cae al catalogo base. Si el base no tiene el archivo, el
respaldo sirve audio viejo o un 404.

Este script, para cada id objetivo:
  1. copia el render de la voz elegida a content/i18n/es-UY/audio/
  2. registra el id en el audios.json base con etiqueta de cache-bust
  3. agrega sus word_timestamps en timecode/timecode_output.json
     (formato Whisper del base: {timecodes: [null, {word_timestamps: [...]}]})

Es idempotente y preserva el resto de los archivos byte a byte.

Uso:
    python tools/_basefix.py --source report
    python tools/_basefix.py --source base-dangling
    python tools/_basefix.py --source base-dangling --include-non-quiz
    python tools/_basefix.py --ids qz011_o0 qz011_que
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "content" / "i18n" / "es-UY"
AUDIO = I18N / "audio"
BASE_AUDIOS = I18N / "audios.json"
BASE_TC = I18N / "timecode" / "timecode_output.json"
REPORT = ROOT / "tools" / "quiz-audio-gaps.json"
DEFAULT_TAG = "48-quiz-audio-base"


def dangling_ids(include_non_quiz: bool) -> list[str]:
    cat = json.loads(BASE_AUDIOS.read_text(encoding="utf-8"))
    out = []
    for aid, rel in cat.items():
        if not (AUDIO / rel.split("?")[0]).exists():
            if include_non_quiz or aid.startswith("qz"):
                out.append(aid)
    return sorted(out)


def report_ids() -> list[str]:
    rep = json.loads(REPORT.read_text(encoding="utf-8"))
    ids = rep.get("regenerados_sin_commitear") or rep.get("ids_desactualizados") or []
    if not ids:
        raise SystemExit("el informe no trae ids")
    return sorted(ids)


def replace_object_value(text: str, key: str, value) -> str:
    """Reemplaza el valor de `key` (un objeto) preservando el resto intacto."""
    marker = f'"{key}":'
    start = text.index(marker)
    cursor = text.index("{", start)
    depth, end = 0, None
    for i in range(cursor, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    if end is None:
        raise RuntimeError(f"no se pudo delimitar {key}")
    rendered = json.dumps(value, ensure_ascii=False, indent=2)
    lines = rendered.splitlines()
    block = lines[0] + "\n" + "\n".join("  " + l for l in lines[1:])
    return text[:cursor] + block + text[end:]


def render_entry(key: str, value) -> str:
    rendered = json.dumps(value, ensure_ascii=False, indent=2)
    lines = rendered.splitlines()
    return (
        f'  {json.dumps(key, ensure_ascii=False)}: {lines[0]}\n'
        + "\n".join("  " + l for l in lines[1:])
    )


def whisper_entry(words) -> dict:
    return {
        "timecodes": [
            None,
            {
                "word_timestamps": [
                    {"text": w["text"], "start": w["start"], "end": w["end"]}
                    for w in words
                ]
            },
        ]
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--source", choices=("report", "base-dangling"), default="report")
    p.add_argument("--ids", nargs="*", default=None)
    p.add_argument("--voice", default="valentina")
    p.add_argument("--tag", default=DEFAULT_TAG)
    p.add_argument("--include-non-quiz", action="store_true")
    p.add_argument("--dry-run", action="store_true")
    a = p.parse_args()

    if a.ids:
        ids = sorted(a.ids)
    elif a.source == "base-dangling":
        ids = dangling_ids(a.include_non_quiz)
    else:
        ids = report_ids()

    print(f"ids objetivo: {len(ids)}")

    voz_audios = json.loads(
        (I18N / "voices" / a.voice / "audios.json").read_text(encoding="utf-8")
    )
    voz_tc = json.loads(
        (I18N / "voices" / a.voice / "timecodes.json").read_text(encoding="utf-8")
    )

    # Comprobacion previa: todos deben existir en la voz elegida.
    faltan = [i for i in ids if i not in voz_audios or not voz_tc.get(i)]
    if faltan:
        raise SystemExit(f"sin render en {a.voice}: {faltan[:8]} ({len(faltan)})")
    sin_archivo = [
        i for i in ids if not (I18N / voz_audios[i].split("?")[0]).exists()
    ]
    if sin_archivo:
        raise SystemExit(f"sin archivo MP3 en {a.voice}: {sin_archivo[:8]}")
    print(f"todos presentes en {a.voice} con timecodes")

    if a.dry_run:
        print("dry-run: no se escribio nada")
        return 0

    # --- 1) copiar los MP3 al base ---
    # La fuente se resuelve por el catalogo, no por el id: algunos ids son
    # alias que apuntan al audio compartido de otro id.
    for i in ids:
        origen = I18N / voz_audios[i].split("?")[0]
        shutil.copy2(origen, AUDIO / f"{i}.mp3")
    print(f"MP3 copiados a audio/: {len(ids)}")

    # --- 2) registrar en el audios.json base ---
    atext = BASE_AUDIOS.read_text(encoding="utf-8")
    nuevos, reetiquetados = 0, 0
    for i in ids:
        nueva = f"{i}.mp3?v={a.tag}"
        linea = None
        for l in atext.splitlines():
            if l.strip().startswith(f'"{i}":'):
                linea = l
                break
        if linea is None:
            # no estaba en el mapa: insertar antes del cierre raiz
            stripped = atext.rstrip()
            head = stripped[:-1].rstrip()
            atext = head + ",\n" + f'  "{i}": {json.dumps(nueva, ensure_ascii=False)}\n' + "}\n"
            nuevos += 1
        else:
            # Preservar la coma original: si es la ultima entrada del objeto no
            # lleva, y agregarla produciria un JSON invalido.
            coma = "," if linea.rstrip().endswith(",") else ""
            atext = atext.replace(
                linea,
                f'  "{i}": {json.dumps(nueva, ensure_ascii=False)}{coma}',
                1,
            )
            reetiquetados += 1
    BASE_AUDIOS.write_text(atext, encoding="utf-8")
    print(f"audios.json base: {reetiquetados} reetiquetadas, {nuevos} agregadas")

    # --- 3) timecodes base ---
    tc_text = BASE_TC.read_text(encoding="utf-8")
    presentes = [i for i in ids if f'"{i}":' in tc_text]
    ausentes = [i for i in ids if i not in presentes]
    for i in presentes:
        tc_text = replace_object_value(tc_text, i, whisper_entry(voz_tc[i]))
    if ausentes:
        bloques = [render_entry(i, whisper_entry(voz_tc[i])) for i in ausentes]
        stripped = tc_text.rstrip()
        if not stripped.endswith("}"):
            raise RuntimeError("el timecode base no termina como se esperaba")
        head = stripped[:-1].rstrip()
        if not head.endswith("}"):
            raise RuntimeError("estructura inesperada antes del cierre raiz")
        tc_text = head + ",\n" + ",\n".join(bloques) + "\n}\n"
    BASE_TC.write_text(tc_text, encoding="utf-8")
    print(f"timecodes base: {len(presentes)} reemplazados, {len(ausentes)} insertados")

    json.loads(BASE_AUDIOS.read_text(encoding="utf-8"))
    json.loads(BASE_TC.read_text(encoding="utf-8"))
    print("ambos JSON base siguen siendo validos")
    return 0


if __name__ == "__main__":
    sys.exit(main())
