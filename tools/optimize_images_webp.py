"""Convierte a WebP las imágenes que el lector usa y actualiza las referencias.

Por qué: el arranque del libro descarga 3,9 MB de imágenes (1,5-2 MB solo para
las primeras páginas). Los JPEG del repositorio ya están comprimidos, así que
re-codificarlos a JPEG no gana nada (a q85 incluso engordan); WebP sí.

Qué hace, por imagen:
  - Sin transparencia: WebP con pérdida a `--quality` (por defecto 82).
  - Con transparencia y más de `--alpha-threshold`: se prueban WebP sin pérdida
    y WebP con pérdida + alfa; se elige el más chico salvo que el sin pérdida
    quede a menos del 25 % (ahí gana la calidad).
  - Con transparencia y chica: WebP sin pérdida.
  - Si el WebP no gana al menos `--min-gain` respecto del original, se deja el
    archivo como está (no se toca la referencia).

Las dimensiones en píxeles NO cambian: la relación de aspecto es lo que la
paginación usa para medir, así que el layout queda idéntico.

Actualiza las referencias `images/<archivo>` en HTML, CSS, JS y XML, incluido
`imsmanifest.xml`. El precargador offline se regenera aparte con
`tools/build_offline_preloader.py` (inlina el HTML de las páginas).

Uso:
    python tools/optimize_images_webp.py                 # simulación, no escribe
    python tools/optimize_images_webp.py --apply         # convierte y actualiza
    python tools/optimize_images_webp.py --apply --delete-originals
"""

import argparse
import io
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from inventory_images import referenced_files  # noqa: E402

SCAN_EXTENSIONS = (".html", ".css", ".js", ".json", ".xml")
SKIP_DIRS = {"venv", "node_modules", "tmp", ".git", "Export", "report", "report-mobile", "__pycache__"}


def encode(image, quality, lossless=False, alpha_quality=None):
    buffer = io.BytesIO()
    options = {"method": 6}
    if lossless:
        options["lossless"] = True
    else:
        options["quality"] = quality
        if alpha_quality is not None and image.mode in ("RGBA", "LA"):
            options["alpha_quality"] = alpha_quality
    image.save(buffer, format="WEBP", **options)
    return buffer.getvalue()


def plan_image(path, quality, alpha_threshold, min_gain, alpha_quality):
    """Devuelve (bytes_webp, motivo) o (None, motivo) si conviene dejarla."""
    original_size = os.path.getsize(path)
    with Image.open(path) as image:
        image.load()
        has_alpha = image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info)
        if has_alpha and original_size <= alpha_threshold:
            data = encode(image, quality, lossless=True)
            return data, "sin pérdida (chica con alfa)"
        if has_alpha:
            lossless = encode(image, quality, lossless=True)
            lossy = encode(image, quality, alpha_quality=alpha_quality or quality)
            if len(lossless) <= len(lossy) * 1.25:
                return lossless, "sin pérdida"
            return lossy, f"con pérdida q{alpha_quality or quality} + alfa"
        data = encode(image, quality)
    if len(data) > original_size * (1 - min_gain):
        return None, f"sin ganancia ({len(data) / 1024:.0f} KB vs {original_size / 1024:.0f} KB)"
    return data, f"con pérdida q{quality}"


def collect_reference_files():
    files = []
    for base, dirs, names in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in names:
            if name.endswith(SCAN_EXTENSIONS):
                path = os.path.join(base, name)
                try:
                    with open(path, "r", encoding="utf-8", errors="ignore") as handle:
                        if "images/" in handle.read():
                            files.append(path)
                except OSError:
                    continue
    return files


def replace_references(old_name, new_name, apply_changes, only_files=None):
    """Reemplaza el nombre de archivo exacto en todos los archivos que lo citan."""
    pattern = re.compile(r"(?<![\w.-])" + re.escape(old_name) + r"(?![\w.-])")
    touched = []
    targets = only_files if only_files is not None else collect_reference_files()
    for path in targets:
        with open(path, "r", encoding="utf-8", errors="ignore") as handle:
            text = handle.read()
        if old_name not in text:
            continue
        updated = pattern.sub(new_name, text)
        if updated == text:
            continue
        touched.append(os.path.relpath(path, ROOT).replace("\\", "/"))
        if apply_changes:
            with open(path, "w", encoding="utf-8", newline="") as handle:
                handle.write(updated)
    return touched


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Escribe los WebP y actualiza referencias")
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--alpha-quality", type=int, default=85)
    parser.add_argument("--alpha-threshold", type=int, default=40 * 1024, help="Bytes por debajo de los cuales el alfa va sin pérdida")
    parser.add_argument("--min-gain", type=float, default=0.10, help="Ganancia mínima para reemplazar (0.10 = 10%)")
    parser.add_argument("--delete-originals", action="store_true", help="Borra los originales reemplazados")
    args = parser.parse_args()

    refs = referenced_files()
    reference_files = collect_reference_files()

    converted = []
    kept = []
    for rel in sorted(refs):
        path = os.path.join(ROOT, rel.replace("/", os.sep))
        if not os.path.exists(path):
            print(f"  FALTA  {rel}")
            continue
        base, ext = os.path.splitext(path)
        if ext.lower() == ".webp":
            continue
        data, reason = plan_image(path, args.quality, args.alpha_threshold, args.min_gain, args.alpha_quality)
        before = os.path.getsize(path)
        if data is None:
            kept.append((rel, before, reason))
            continue
        out = base + ".webp"
        converted.append((rel, os.path.basename(out), before, len(data), reason))
        if args.apply:
            with open(out, "wb") as handle:
                handle.write(data)

    print(f"{'antes':>9} {'después':>9} {'ahorro':>7}  archivo")
    for rel, new_name, before, after, reason in sorted(converted, key=lambda r: r[2] - r[3], reverse=True):
        saving = (1 - after / before) * 100
        print(f"{before / 1024:8.0f}K {after / 1024:8.0f}K {saving:6.0f}%  {rel}  →  {new_name}  ({reason})")
    total_before = sum(r[2] for r in converted)
    total_after = sum(r[3] for r in converted)
    print(
        f"\nconvertidas: {len(converted)} imágenes · {total_before / 1048576:.2f} MB → {total_after / 1048576:.2f} MB"
        f"  ({(1 - total_after / total_before) * 100:.1f}% menos)"
    )
    if kept:
        print(f"\nse dejan como están: {len(kept)}")
        for rel, before, reason in kept:
            print(f"   {before / 1024:8.0f}K  {rel}  ({reason})")

    if not args.apply:
        print("\n(simulación: no se escribió nada. Volvé a correr con --apply)")
        return

    print("\nactualizando referencias:")
    for rel, new_name, *_ in converted:
        old_name = os.path.basename(rel)
        touched = replace_references(old_name, new_name, True, reference_files)
        if touched:
            print(f"   {old_name} → {new_name}: {len(touched)} archivo(s)")

    if args.delete_originals:
        removed = 0
        for rel, *_ in converted:
            path = os.path.join(ROOT, rel.replace("/", os.sep))
            if os.path.exists(path):
                os.remove(path)
                removed += 1
        print(f"\noriginales borrados: {removed} (siguen en el historial de git)")
    else:
        print("\nlos originales quedaron en su lugar (usá --delete-originals para borrarlos)")


if __name__ == "__main__":
    main()
