#!/usr/bin/env python3
"""Report exact offline voice catalogue gaps and lexical mismatches."""

from __future__ import annotations

import json
import re
from pathlib import Path

from validate_v46 import spoken_inventory_text, visual_tokens


ROOT = Path(__file__).resolve().parents[1]
LOCALE = ROOT / "content/i18n/es-UY"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def comparable_tokens(value: object) -> list[str]:
    """Normalize pronunciation aliases before comparing visible word boundaries."""
    normalized = re.sub(r"\buats[aá]p\b", "WhatsApp", str(value), flags=re.I)
    return visual_tokens(normalized)


def main() -> int:
    texts: dict[str, str] = load(LOCALE / "texts.json")
    spoken_text_ids = {
        identifier
        for identifier, display_text in texts.items()
        if str(display_text or "").strip()
    }
    for voice in ("valentina", "mateo"):
        voice_root = LOCALE / "voices" / voice
        audios = load(voice_root / "audios.json")
        timecodes = load(voice_root / "timecodes.json")
        print(f"\n[{voice}]")
        for label, identifiers in (
            ("MISSING_AUDIO", sorted(spoken_text_ids - set(audios))),
            ("MISSING_TIMECODES", sorted(spoken_text_ids - set(timecodes))),
        ):
            print(f"{label} {len(identifiers)}")
            for identifier in identifiers:
                print(f"  {identifier}\t{texts[identifier]!r}")

        mismatches: list[tuple[str, str, str]] = []
        for identifier, display_text in texts.items():
            if identifier not in spoken_text_ids:
                continue
            expected = spoken_inventory_text(identifier, display_text)
            expected_tokens = comparable_tokens(expected)
            actual_tokens = [
                token
                for boundary in (timecodes.get(identifier) or [])
                for token in comparable_tokens(str(boundary.get("text") or ""))
            ]
            if expected_tokens != actual_tokens:
                mismatches.append(
                    (identifier, " ".join(expected_tokens), " ".join(actual_tokens))
                )
        print(f"LEXICAL_MISMATCHES {len(mismatches)}")
        for identifier, expected, actual in mismatches:
            print(f"  {identifier}")
            print(f"    display={texts[identifier]!r}")
            print(f"    expected={expected!r}")
            print(f"    timing={actual!r}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
