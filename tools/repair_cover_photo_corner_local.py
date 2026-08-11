"""Repair the tiny clipped photo-frame corner from the original cover source.

The accessible cover is four pixels smaller than the imported JPG because it
uses a two-pixel crop on every edge.  The source photograph corner is intact,
so only a tightly feathered polygon around that corner is transplanted.  This
keeps the prior title-removal repair and every other pixel outside the mask.
"""

from pathlib import Path

from PIL import Image, ImageFilter, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "pg001_im001.jpg"
BASE = ROOT / "images" / "pg001_cover_art_repaired.png"
OUTPUT = ROOT / "images" / "pg001_cover_art_repaired_v2.png"


def main() -> None:
    base = Image.open(BASE).convert("RGB")
    original = Image.open(SOURCE).convert("RGB")
    donor = original.crop((2, 2, original.width - 2, original.height - 2))
    if donor.size != base.size:
        raise ValueError(f"Unexpected cover alignment: {donor.size=} {base.size=}")

    mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(
        [
            (238, 297),
            (252, 288),
            (269, 297),
            (282, 315),
            (274, 329),
            (257, 325),
            (239, 312),
        ],
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(1.25))
    Image.composite(donor, base, mask).save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
