#!/usr/bin/env python3
"""Regenera en lote los audios de quiz desactualizados y aplica cache-bust
quirurgico: solo cambia la etiqueta ?v= de los ids objetivo.

El generador del repo reescribe audios.json y timecodes.json completos con una
unica etiqueta, lo que invalidaria los ~10.000 audios de cada voz. Por eso este
script trabaja en dos fases:

    # 1) respaldar los catalogos vigentes (incluye fixes previos sin commitear)
    python tools/_batch_tts.py --phase backup

    # 2) (correr el generador del repo para los ids objetivo)

    # 3) restaurar los catalogos y reemplazar SOLO los ids objetivo
    python tools/_batch_tts.py --phase inject

Uso:
    python tools/_batch_tts.py --phase backup
    python tools/_batch_tts.py --phase inject --tag 48-quiz007-fix
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICES = ("valentina", "mateo")
BACKUP = ROOT / "tools" / "_catalog_backup"
GAPS = ROOT / "tools" / "quiz-audio-gaps.json"


def rel_paths() -> dict[str, dict[str, str]]:
    return {
        v: {
            "audios": f"content/i18n/es-UY/voices/{v}/audios.json",
            "timecodes": f"content/i18n/es-UY/voices/{v}/timecodes.json",
        }
        for v in VOICES
    }


EXPLICIT_IDS: list[str] = []


def target_ids() -> list[str]:
    if EXPLICIT_IDS:
        return sorted(EXPLICIT_IDS)
    report = json.loads(GAPS.read_text(encoding="utf-8"))
    ids = (report.get("regenerados_sin_commitear")
           or report.get("ids_desactualizados") or [])
    if not ids:
        raise SystemExit("el informe no trae ids; usar --ids")
    return sorted(ids)


def read_head(rel: str) -> str:
    return subprocess.run(
        ["git", "show", f"HEAD:{rel}"], cwd=ROOT, capture_output=True, text=True,
        encoding="utf-8", check=True,
    ).stdout


def do_backup() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    for voice, files in rel_paths().items():
        for kind, rel in files.items():
            src = ROOT / rel
            dest = BACKUP / f"{voice}_{kind}.json"
            shutil.copy2(src, dest)
            print(f"respaldado {rel} -> {dest.relative_to(ROOT)}")


def replace_json_value(text: str, key: str, value) -> str:
    """Reemplaza el valor de `key` preservando el resto del archivo intacto."""
    marker = f'"{key}":'
    start = text.index(marker)
    cursor = text.index("[", start)
    depth = 0
    end = None
    for i in range(cursor, len(text)):
        if text[i] == "[":
            depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    if end is None:
        raise RuntimeError(f"no se pudo delimitar {key}")
    rendered = json.dumps(value, ensure_ascii=False, indent=2)
    rendered = "\n".join("  " + line for line in rendered.splitlines()).lstrip()
    return text[:cursor] + rendered + text[end:]


def render_entry(key: str, value) -> str:
    """Renderiza una entrada nueva con la indentacion del archivo."""
    rendered = json.dumps(value, ensure_ascii=False, indent=2)
    lines = rendered.splitlines()
    return (
        f'  {json.dumps(key, ensure_ascii=False)}: {lines[0]}\n'
        + "\n".join("  " + l for l in lines[1:])
    )


def do_inject(tag: str) -> int:
    ids = target_ids()
    if not BACKUP.exists():
        raise SystemExit("falta el respaldo; corre primero --phase backup")

    # 1) Capturar los valores recien generados, antes de restaurar.
    generado: dict[str, dict] = {}
    for voice, files in rel_paths().items():
        audios = json.loads((ROOT / files["audios"]).read_text(encoding="utf-8"))
        timecodes = json.loads((ROOT / files["timecodes"]).read_text(encoding="utf-8"))
        generado[voice] = {
            i: {"ruta": audios.get(i), "tc": timecodes.get(i)} for i in ids
        }
        faltan = [i for i in ids if not generado[voice][i]["ruta"] or not generado[voice][i]["tc"]]
        if faltan:
            raise SystemExit(f"{voice}: sin generar -> {faltan}")

    # 2) Restaurar los catalogos respaldados.
    for voice, files in rel_paths().items():
        for kind, rel in files.items():
            shutil.copy2(BACKUP / f"{voice}_{kind}.json", ROOT / rel)

    # 3) Inyectar solo los ids objetivo. Los ids pueden ser nuevos (no estar en
    #    el catalogo restaurado), en cuyo caso se insertan en lugar de reemplazar.
    for voice, files in rel_paths().items():
        # audios.json: una linea por id
        apath = ROOT / files["audios"]
        atext = apath.read_text(encoding="utf-8")
        reemplazados, agregados = 0, 0
        for i in ids:
            nueva = generado[voice][i]["ruta"]
            base, _, _ = nueva.partition("?v=")
            nueva = f"{base}?v={tag}-{voice}"
            linea = None
            for l in atext.splitlines():
                if l.strip().startswith(f'"{i}":'):
                    linea = l
                    break
            if linea is not None:
                # Preservar la coma original: la ultima entrada del objeto no
                # lleva, y agregarla produciria un JSON invalido.
                coma = "," if linea.rstrip().endswith(",") else ""
                atext = atext.replace(
                    linea,
                    f'  "{i}": {json.dumps(nueva, ensure_ascii=False)}{coma}',
                    1,
                )
                reemplazados += 1
            else:
                stripped = atext.rstrip()
                head = stripped[:-1].rstrip()
                atext = (head + ",\n" +
                         f'  "{i}": {json.dumps(nueva, ensure_ascii=False)}\n' + "}\n")
                agregados += 1
        apath.write_text(atext, encoding="utf-8")

        # timecodes.json: bloque multilinea por id
        tpath = ROOT / files["timecodes"]
        ttext = tpath.read_text(encoding="utf-8")
        existentes = [i for i in ids if f'"{i}":' in ttext]
        nuevos = [i for i in ids if i not in existentes]
        for i in existentes:
            ttext = replace_json_value(ttext, i, generado[voice][i]["tc"])
        if nuevos:
            bloques = [
                render_entry(i, generado[voice][i]["tc"]) for i in nuevos
            ]
            stripped = ttext.rstrip()
            head = stripped[:-1].rstrip()
            ttext = head + ",\n" + ",\n".join(bloques) + "\n}\n"
        tpath.write_text(ttext, encoding="utf-8")

        print(f"{voice}: audios.json {reemplazados} reemplazadas / {agregados} agregadas; "
              f"timecodes {len(existentes)} reemplazados / {len(nuevos)} insertados")

    # 4) Verificacion: contra HEAD deben diferir todos los ids objetivo; contra
    # el respaldo, solo los que efectivamente cambiaron en este lote (los que ya
    # estaban corregidos antes no cambian). Nunca debe haber claves ajenas.
    print("\n== verificacion ==")
    ok = True
    for voice, files in rel_paths().items():
        for kind, rel in files.items():
            now = json.loads((ROOT / rel).read_text(encoding="utf-8"))
            head = json.loads(read_head(rel))
            backup = json.loads((BACKUP / f"{voice}_{kind}.json").read_text(encoding="utf-8"))
            dif_head = sorted(k for k in head if head[k] != now.get(k))
            dif_backup = sorted(k for k in backup if backup[k] != now.get(k))
            inesperados = [k for k in dif_backup if k not in ids]
            # Un id objetivo puede ser nuevo (no estar en HEAD ni en el respaldo):
            # lo que importa es que quede presente y que no se toque nada ajeno.
            faltantes = [i for i in ids if i not in now]
            nuevos = [
                i for i in ids
                if i not in backup and i not in head
            ]
            print(f"  {voice}/{kind}: claves={len(now)} objetivos={len(ids)} "
                  f"nuevos={len(nuevos)} ajenas={len(inesperados)} faltantes={len(faltantes)}")
            if inesperados or faltantes:
                ok = False
                if inesperados:
                    print(f"     ATENCION claves ajenas: {inesperados[:5]}")
                if faltantes:
                    print(f"     ATENCION ids ausentes: {faltantes[:5]}")
    if ok:
        print("  todo correcto: sin claves ajenas y todos los ids presentes")
    return 0 if ok else 1


def main() -> int:
    global EXPLICIT_IDS
    p = argparse.ArgumentParser()
    p.add_argument("--phase", required=True, choices=("backup", "inject", "list"))
    p.add_argument("--tag", default="48-quiz007-fix")
    p.add_argument("--ids", nargs="*", default=None,
                   help="ids explicitos, en lugar de leerlos del informe")
    a = p.parse_args()
    if a.ids:
        EXPLICIT_IDS = list(a.ids)
    if a.phase == "list":
        print("\n".join(target_ids()))
        return 0
    if a.phase == "backup":
        do_backup()
        return 0
    return do_inject(a.tag)


if __name__ == "__main__":
    sys.exit(main())
