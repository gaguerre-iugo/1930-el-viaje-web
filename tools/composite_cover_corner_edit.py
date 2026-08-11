#!/usr/bin/env python3
"""Composite only the generated photograph-corner repair onto the cover."""

from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "pg001_cover_art_repaired.png"
GENERATED = ROOT / "output" / "imagegen" / "pg001-photo-corner-gpt-image-2.png"
MASK = ROOT / "tmp" / "imagegen" / "cover-photo-corner-mask.png"
OUTPUT = ROOT / "images" / "pg001_cover_art_repaired_v2.png"


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    generated = Image.open(GENERATED).convert("RGBA")
    generated = generated.resize(source.size, Image.Resampling.LANCZOS)
    protected_alpha = Image.open(MASK).convert("RGBA").getchannel("A")
    edit_alpha = ImageChops.invert(protected_alpha)
    repaired = Image.composite(generated, source, edit_alpha)
    repaired.save(OUTPUT, optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
