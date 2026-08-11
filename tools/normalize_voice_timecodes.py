#!/usr/bin/env python3
"""Normalize synthesizer boundaries to the reader's visible word inventory.

Microsoft may emit one WordBoundary for a short phrase (for example,
``julio de 1930``). The reader highlights visible lexical tokens, so keeping
that phrase as one timestamp forces the upstream runtime to discard the exact
boundaries and estimate all words uniformly. This tool expands phrase
boundaries without changing their total interval and verifies full coverage
for both offline voices.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCALE = ROOT / "content/i18n/es-UY"
TOKEN_RE = re.compile(r"[^\W_]+(?:[’'-][^\W_]+)*", re.UNICODE)
QUESTION_MARK_ASSETS = {
    "pg176177_n0006",
    "pg176177_n0006_easy_read",
    "pg176177_n0011",
    "pg176177_n0011_easy_read",
}


def tokens(value: str) -> list[str]:
    return TOKEN_RE.findall(str(value or ""))


def split_boundary(boundary: dict[str, object]) -> list[dict[str, object]]:
    parts = tokens(str(boundary.get("text") or ""))
    if len(parts) <= 1:
        return [dict(boundary)]
    start = float(boundary.get("start") or 0)
    end = float(boundary.get("end") or start)
    duration = max(0, end - start)
    weights = [max(1.0, math.pow(len(part), 0.8)) for part in parts]
    total_weight = sum(weights)
    output: list[dict[str, object]] = []
    cursor = start
    consumed = 0.0
    for index, (part, weight) in enumerate(zip(parts, weights)):
        consumed += weight
        part_end = end if index == len(parts) - 1 else start + duration * consumed / total_weight
        output.append(
            {
                "text": part,
                "start": round(cursor, 4),
                "end": round(max(cursor, part_end), 4),
            }
        )
        cursor = part_end
    return output


def collapse(boundaries: list[dict[str, object]], text: str) -> dict[str, object]:
    return {
        "text": text,
        "start": round(float(boundaries[0]["start"]), 4),
        "end": round(float(boundaries[-1]["end"]), 4),
    }


def normalize_asset(
    asset_id: str,
    display_text: str,
    source: list[dict[str, object]],
) -> list[dict[str, object]]:
    expanded = [part for boundary in source for part in split_boundary(boundary)]
    expected = tokens(display_text)

    # These two cover texts intentionally use a spoken expansion. Collapse
    # the spoken units onto the one or two visual targets they represent.
    if asset_id == "pg001_n0002" and expanded:
        return [collapse(expanded, expected[0])]
    if asset_id == "pg001_n0004" and len(expanded) == 4 and len(expected) == 2:
        return [
            collapse(expanded[:2], expected[0]),
            collapse(expanded[2:], expected[1]),
        ]

    # These graphic ornaments contain no lexical visual token, but they are
    # intentionally spoken as "Signos de interrogación". Keep the complete
    # spoken interval attached to the original visible ornament.
    if asset_id in QUESTION_MARK_ASSETS and expanded:
        return [collapse(expanded, display_text)]

    lexical_indexes = [
        index for index, boundary in enumerate(expanded)
        if tokens(str(boundary.get("text") or ""))
    ]
    if len(lexical_indexes) != len(expected):
        raise ValueError(
            f"{asset_id}: {len(expected)} visible words but "
            f"{len(lexical_indexes)} lexical boundaries"
        )
    for index, visible_token in zip(lexical_indexes, expected):
        expanded[index]["text"] = visible_token
    return expanded


def repair_zero_durations(boundaries: list[dict[str, object]]) -> list[dict[str, object]]:
    """Give zero-duration conjunctions a minimal visible interval.

    Edge occasionally reports a correct start but no duration for a very
    short word. Playback tracking uses starts, so we preserve that timestamp
    and end the interval before the next word whenever possible.
    """
    repaired = [dict(boundary) for boundary in boundaries]
    for index, boundary in enumerate(repaired):
        start = float(boundary.get("start") or 0)
        end = float(boundary.get("end") or 0)
        if end > start:
            continue
        next_start = (
            float(repaired[index + 1].get("start") or 0)
            if index + 1 < len(repaired)
            else start + 0.04
        )
        candidate = min(start + 0.04, next_start) if next_start > start else start + 0.02
        boundary["end"] = round(max(start + 0.01, candidate), 4)
    return repaired


def write_json_atomic(path: Path, value: object) -> None:
    temporary = path.with_suffix(path.suffix + ".part")
    temporary.write_text(
        json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    os.replace(temporary, path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", action="append", choices=("valentina", "mateo"))
    parser.add_argument(
        "--asset-prefix",
        action="append",
        help="Normalize only asset IDs beginning with this prefix (repeatable).",
    )
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    texts: dict[str, str] = json.loads((LOCALE / "texts.json").read_text(encoding="utf-8"))
    voices = args.voice or ["valentina", "mateo"]
    for voice in voices:
        path = LOCALE / "voices" / voice / "timecodes.json"
        catalogue: dict[str, list[dict[str, object]]] = json.loads(
            path.read_text(encoding="utf-8")
        )
        normalized: dict[str, list[dict[str, object]]] = dict(catalogue)
        selected_texts = {
            asset_id: display_text
            for asset_id, display_text in texts.items()
            if not args.asset_prefix
            or any(asset_id.startswith(prefix) for prefix in args.asset_prefix)
        }
        expanded_assets = 0
        for asset_id, display_text in selected_texts.items():
            source = catalogue.get(asset_id)
            if source is None:
                raise SystemExit(f"{voice}: missing timecodes for {asset_id}")
            result = repair_zero_durations(
                normalize_asset(asset_id, display_text, source)
            )
            normalized[asset_id] = result
            if len(result) != len(source):
                expanded_assets += 1
        if not args.check:
            write_json_atomic(path, dict(sorted(normalized.items())))
        print(
            f"{voice}: assets={len(normalized)} selected={len(selected_texts)} "
            f"expanded={expanded_assets} "
            f"mode={'check' if args.check else 'write'}"
        )


if __name__ == "__main__":
    main()
