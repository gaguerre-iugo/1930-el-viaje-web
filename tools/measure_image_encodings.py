"""Mide el peso que tendría cada imagen con distintas codificaciones.

No modifica nada: abre cada imagen referenciada, la recodifica en memoria y
compara tamaños. Sirve para elegir el formato y la calidad antes de tocar el
libro.

Uso:
    python tools/measure_image_encodings.py
    python tools/measure_image_encodings.py --limit 20
"""

import argparse
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys_path = os.path.join(ROOT, "tools")
import sys

sys.path.insert(0, sys_path)
from inventory_images import referenced_files  # noqa: E402


def size_of(image, fmt, **options):
    buffer = io.BytesIO()
    if fmt == "JPEG" and image.mode not in ("RGB", "L"):
        image = image.convert("RGB")
    if fmt == "WEBP" and image.mode == "P":
        image = image.convert("RGBA" if "transparency" in image.info else "RGB")
    image.save(buffer, format=fmt, **options)
    return buffer.tell()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="Solo las N más pesadas")
    args = parser.parse_args()

    refs = referenced_files()
    files = []
    for rel in refs:
        path = os.path.join(ROOT, rel.replace("/", os.sep))
        if os.path.exists(path):
            files.append((os.path.getsize(path), rel, path))
    files.sort(reverse=True)
    if args.limit:
        files = files[: args.limit]

    header = f"{'actual':>8} {'jpg q85':>8} {'jpg q80':>8} {'webp q85':>9} {'webp q80':>9} {'webp q75':>9}  archivo"
    print(header)
    totals = {"actual": 0, "jpg85": 0, "jpg80": 0, "webp85": 0, "webp80": 0, "webp75": 0}
    for size, rel, path in files:
        with Image.open(path) as img:
            img.load()
            has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
            jpg85 = jpg80 = webp85 = webp80 = webp75 = 0
            if not has_alpha:
                jpg85 = size_of(img, "JPEG", quality=85, optimize=True, progressive=True)
                jpg80 = size_of(img, "JPEG", quality=80, optimize=True, progressive=True)
            webp85 = size_of(img, "WEBP", quality=85, method=6)
            webp80 = size_of(img, "WEBP", quality=80, method=6)
            webp75 = size_of(img, "WEBP", quality=75, method=6)
        totals["actual"] += size
        totals["jpg85"] += jpg85 or size
        totals["jpg80"] += jpg80 or size
        totals["webp85"] += webp85
        totals["webp80"] += webp80
        totals["webp75"] += webp75
        alpha = "A" if has_alpha else " "
        print(
            f"{size / 1024:8.0f} {jpg85 / 1024:8.0f} {jpg80 / 1024:8.0f} {webp85 / 1024:9.0f} {webp80 / 1024:9.0f} {webp75 / 1024:9.0f} {alpha} {rel}"
        )

    print()
    for key, label in [
        ("actual", "actual"),
        ("jpg85", "JPEG q85 progresivo"),
        ("jpg80", "JPEG q80 progresivo"),
        ("webp85", "WebP q85"),
        ("webp80", "WebP q80"),
        ("webp75", "WebP q75"),
    ]:
        total = totals[key]
        delta = (total / totals["actual"] - 1) * 100
        print(f"  {label:<22} {total / 1048576:6.2f} MB   {delta:+6.1f}%  (los PNG con transparencia quedan como están)")


if __name__ == "__main__":
    main()
