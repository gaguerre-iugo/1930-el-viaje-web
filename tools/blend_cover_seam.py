#!/usr/bin/env python3
"""Feather the horizontal join left by removing the original cover title."""

from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "pg001_cover_art_clean.png"
OUTPUT = ROOT / "images" / "pg001_cover_art_blended.png"


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    softened = image.filter(ImageFilter.GaussianBlur(radius=6))
    mask = Image.new("L", image.size, 0)
    pixels = mask.load()

    band_top = 286
    seam = 310
    band_bottom = 338
    peak_alpha = 196
    for y in range(band_top, band_bottom + 1):
        if y <= seam:
            weight = (y - band_top) / max(1, seam - band_top)
        else:
            weight = (band_bottom - y) / max(1, band_bottom - seam)
        alpha = max(0, round(peak_alpha * weight))
        for x in range(image.width):
            pixels[x, y] = alpha

    result = Image.composite(softened, image, mask)
    result.save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
