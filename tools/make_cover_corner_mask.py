#!/usr/bin/env python3
"""Build a small alpha mask for the damaged upper corner of the tilted photo."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "pg001_cover_art_repaired.png"
OUTPUT = ROOT / "tmp" / "imagegen" / "cover-photo-corner-mask.png"
PREVIEW = ROOT / "tmp" / "imagegen" / "cover-photo-corner-mask-preview.png"


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    alpha = Image.new("L", source.size, 255)
    draw = ImageDraw.Draw(alpha)

    # Only the broken apex and a few surrounding pixels needed to continue
    # the black outline, cream paper border and maroon tunnel background.
    draw.rounded_rectangle((232, 282, 288, 340), radius=8, fill=0)
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=4))

    mask = Image.new("RGBA", source.size, (255, 255, 255, 255))
    mask.putalpha(alpha)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    mask.save(OUTPUT, optimize=True)

    overlay = source.copy()
    tint = Image.new("RGBA", source.size, (0, 220, 255, 0))
    tint.putalpha(alpha.point(lambda value: 140 if value < 180 else 0))
    overlay.alpha_composite(tint)
    overlay.save(PREVIEW, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
