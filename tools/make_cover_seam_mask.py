#!/usr/bin/env python3
"""Build the alpha mask used to reconstruct the erased cover-title seam."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "pg001_cover_art_clean.png"
OUTPUT = ROOT / "tmp" / "imagegen" / "cover-seam-mask.png"
PREVIEW = ROOT / "tmp" / "imagegen" / "cover-seam-mask-preview.png"


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    alpha = Image.new("L", source.size, 255)
    draw = ImageDraw.Draw(alpha)

    # Main join: entirely background above the photographs and raised hand.
    draw.rectangle((0, 282, source.width - 1, 315), fill=0)

    # Continue slightly below the join only through unobstructed background.
    for box in (
        (0, 305, 57, 348),
        (174, 305, 244, 348),
        (382, 305, 610, 348),
        (718, 305, source.width - 1, 348),
    ):
        draw.rectangle(box, fill=0)

    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=5))
    mask = Image.new("RGBA", source.size, (255, 255, 255, 255))
    mask.putalpha(alpha)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    mask.save(OUTPUT, optimize=True)

    overlay = source.copy()
    tint = Image.new("RGBA", source.size, (0, 220, 255, 0))
    tint.putalpha(alpha.point(lambda value: 130 if value < 180 else 0))
    overlay.alpha_composite(tint)
    overlay.save(PREVIEW, optimize=True)

    print(OUTPUT)


if __name__ == "__main__":
    main()
