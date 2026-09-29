"""Genera comparaciones visuales original vs WebP para elegir la calidad.

Recorta la imagen al ancho en que el libro la pinta (~551 px) y arma una tira
con el original, WebP q85 y WebP q80, más un recorte al 100% de un detalle.

Uso:
    python tools/compare_image_quality.py images/pg216217_spread_integrated_v4.jpg images/chapter1_cover.jpg
"""

import io
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tmp")
RENDERED_WIDTH = 551


def webp_bytes(image, quality):
    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=quality, method=6)
    return buffer.getvalue()


def strip(path, rendered_width=RENDERED_WIDTH, qualities=(85, 80)):
    with Image.open(path) as img:
        img = img.convert("RGBA") if img.mode in ("RGBA", "LA", "P") else img.convert("RGB")
        scale = rendered_width / img.width
        small = img.resize((rendered_width, max(1, round(img.height * scale))), Image.LANCZOS)
        # Recorte al 100% sobre la zona central, donde se ven los artefactos finos.
        crop_w = min(360, img.width)
        crop_h = min(260, img.height)
        left = max(0, (img.width - crop_w) // 2)
        top = max(0, (img.height - crop_h) // 2)
        detail = img.crop((left, top, left + crop_w, top + crop_h))

        variants = [("original", None)]
        for quality in qualities:
            variants.append((f"webp q{quality}", webp_bytes(img, quality)))

        panels = []
        labels = []
        details = []
        for label, data in variants:
            if data is None:
                panels.append(small)
                details.append(detail)
                labels.append(f"{label} {os.path.getsize(path) / 1024:.0f} KB")
            else:
                decoded = Image.open(io.BytesIO(data))
                decoded.load()
                decoded = decoded.convert(small.mode)
                panels.append(decoded.resize(small.size, Image.LANCZOS))
                details.append(decoded.crop((left, top, left + crop_w, top + crop_h)))
                labels.append(f"{label} {len(data) / 1024:.0f} KB")

        gap = 12
        width = sum(p.width for p in panels) + gap * (len(panels) - 1)
        detail_width = sum(d.width for d in details) + gap * (len(details) - 1)
        width = max(width, detail_width)
        small_height = max(p.height for p in panels)
        detail_height = max(d.height for d in details)
        canvas = Image.new("RGB", (width, 22 + small_height + 26 + 22 + detail_height), "#ffffff")
        x = 0
        for panel in panels:
            canvas.paste(panel.convert("RGB"), (x, 22))
            x += panel.width + gap
        x = 0
        for item in details:
            canvas.paste(item.convert("RGB"), (x, 22 + small_height + 26 + 22))
            x += item.width + gap
        return canvas, labels


def main():
    os.makedirs(OUT, exist_ok=True)
    only = [a for a in sys.argv[1:] if a.startswith("--qualities=")]
    qualities = (85, 80)
    if only:
        qualities = tuple(int(q) for q in only[0].split("=", 1)[1].split(","))
    paths = [a for a in sys.argv[1:] if not a.startswith("--qualities=")]
    for rel in paths:
        path = os.path.join(ROOT, rel)
        if not os.path.exists(path):
            print("no existe:", rel)
            continue
        canvas, labels = strip(path, qualities=qualities)
        name = os.path.splitext(os.path.basename(rel))[0]
        out = os.path.join(OUT, f"calidad-{name}.png")
        canvas.save(out)
        print(f"{out}  ({' | '.join(labels)})")


if __name__ == "__main__":
    main()
