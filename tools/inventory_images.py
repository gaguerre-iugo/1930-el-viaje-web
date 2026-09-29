"""Inventario de las imágenes que el libro usa de verdad.

Escanea el HTML, el CSS, el JS y los JSON del lector buscando referencias a
`images/...`, y reporta tamaño, dimensiones y peso de cada archivo referenciado.
Los que no aparecen son variantes históricas que el lector no pide.

Uso:
    python tools/inventory_images.py
    python tools/inventory_images.py --csv tmp/imagenes.csv
"""

import argparse
import csv
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Hace falta Pillow: python -m pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCAN_EXTENSIONS = (".html", ".css", ".js", ".json", ".xml")
IMAGE_REFERENCE = re.compile(r"images/[A-Za-z0-9_\-./]+\.(?:jpg|jpeg|png|webp|gif|svg)", re.IGNORECASE)
# Hay imágenes que el lector referencia por nombre suelto y arma la ruta en JS
# (por ejemplo el mapa de portadas integradas + "images/" + nombre). Buscarlas
# por nombre es lo único que las encuentra.
BARE_IMAGE = re.compile(r"(?<![\w/.-])([A-Za-z0-9_\-]+\.(?:jpg|jpeg|png|webp|gif|svg))", re.IGNORECASE)
SKIP_DIRS = {"venv", "node_modules", "tmp", ".git", "Export", "report", "report-mobile", "__pycache__"}
# Para los nombres sueltos solo se miran archivos del lector: la documentación
# menciona imágenes en prosa y no debe arrastrar conversiones.
BARE_SCAN_EXTENSIONS = (".html", ".css", ".js", ".json", ".xml")


def referenced_files():
    """Devuelve {ruta_relativa: [archivos que la referencian]}."""
    found = {}
    images_dir = os.path.join(ROOT, "images")
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if not name.endswith(SCAN_EXTENSIONS):
                continue
            path = os.path.join(base, name)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as handle:
                    text = handle.read()
            except OSError:
                continue
            relative_owner = os.path.relpath(path, ROOT).replace("\\", "/")
            for match in IMAGE_REFERENCE.finditer(text):
                rel = match.group(0).replace("\\", "/")
                found.setdefault(rel, set()).add(relative_owner)
            if not name.endswith(BARE_SCAN_EXTENSIONS) or relative_owner.startswith("docs/"):
                continue
            for match in BARE_IMAGE.finditer(text):
                candidate = "images/" + match.group(1)
                if os.path.exists(os.path.join(images_dir, match.group(1))):
                    found.setdefault(candidate, set()).add(relative_owner)
    return found


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", help="Escribe el inventario en un CSV")
    args = parser.parse_args()

    refs = referenced_files()
    rows = []
    for rel in sorted(refs):
        path = os.path.join(ROOT, rel.replace("/", os.sep))
        if not os.path.exists(path):
            rows.append({"archivo": rel, "bytes": 0, "ancho": 0, "alto": 0, "modo": "FALTA", "referencias": len(refs[rel])})
            continue
        size = os.path.getsize(path)
        try:
            with Image.open(path) as image:
                width, height = image.size
                mode = image.mode
        except Exception:
            width = height = 0
            mode = "?"
        rows.append({"archivo": rel, "bytes": size, "ancho": width, "alto": height, "modo": mode, "referencias": len(refs[rel])})

    total = sum(r["bytes"] for r in rows)
    print(f"imágenes referenciadas por el libro: {len(rows)}")
    print(f"peso total: {total / 1048576:.2f} MB\n")
    print(f"{'KB':>8}  {'ancho':>6} {'alto':>6} {'ratio':>6}  archivo")
    for row in sorted(rows, key=lambda r: -r["bytes"]):
        ratio = f"{row['ancho'] / row['alto']:.3f}" if row["alto"] else "-"
        print(f"{row['bytes'] / 1024:8.0f}  {row['ancho']:6d} {row['alto']:6d} {ratio:>6}  {row['archivo']}")

    # Archivos presentes que nadie referencia
    used = {r["archivo"] for r in rows}
    all_files = []
    for base, dirs, files in os.walk(os.path.join(ROOT, "images")):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if name.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg")):
                rel = os.path.relpath(os.path.join(base, name), ROOT).replace("\\", "/")
                all_files.append(rel)
    unused = sorted(set(all_files) - used)
    unused_bytes = sum(os.path.getsize(os.path.join(ROOT, f.replace("/", os.sep))) for f in unused)
    print(f"\nsin referencias en el lector: {len(unused)} archivos · {unused_bytes / 1048576:.2f} MB")
    for rel in unused:
        print(f"   {os.path.getsize(os.path.join(ROOT, rel.replace('/', os.sep))) / 1024:8.0f} KB  {rel}")

    if args.csv:
        os.makedirs(os.path.dirname(os.path.join(ROOT, args.csv)), exist_ok=True)
        with open(os.path.join(ROOT, args.csv), "w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=["archivo", "bytes", "ancho", "alto", "modo", "referencias"])
            writer.writeheader()
            writer.writerows(rows)
        print(f"\ninventario escrito en {args.csv}")


if __name__ == "__main__":
    main()
