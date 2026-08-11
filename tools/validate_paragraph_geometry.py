#!/usr/bin/env python3
"""Compare registered reflow paragraph starts with PDF first-line indents."""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]


def normalized(text: str) -> str:
    text = unicodedata.normalize("NFKC", text).lower()
    # Editorial ellipses are sometimes simplified when the accessible text is
    # transcribed. They do not change the paragraph boundary.
    text = text.replace("…", "").replace("...", "")
    return re.sub(r"\s+", " ", text).strip()


def registered_ids(runtime: str, variable: str) -> set[str]:
    match = re.search(
        rf"var\s+{re.escape(variable)}\s*=\s*\[(.*?)\n\s*\];",
        runtime,
        re.DOTALL,
    )
    if not match:
        raise ValueError(f"paragraph table {variable!r} was not found")
    return set(re.findall(r'"(pg\d+_n\d+)"', match.group(1)))


def infer_starts(
    pdf_path: Path,
    texts: dict[str, str],
    start_page: int,
    end_page: int,
    indent_threshold: float,
) -> tuple[set[str], list[dict[str, object]]]:
    inferred: set[str] = set()
    unresolved: list[dict[str, object]] = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_number in range(start_page, end_page + 1):
            page = pdf.pages[page_number - 1]
            words = [
                word
                for word in page.extract_words(
                    use_text_flow=True,
                    keep_blank_chars=False,
                )
                if word["top"] < page.height - 45
            ]
            lines: dict[float, list[dict[str, object]]] = {}
            for word in words:
                lines.setdefault(round(float(word["top"]), 1), []).append(word)
            visible_lines = [
                (top, line_words)
                for top, line_words in sorted(lines.items())
                if " ".join(str(word["text"]) for word in line_words).strip()
            ]
            if not visible_lines:
                continue
            baseline = min(
                min(float(word["x0"]) for word in line_words)
                for _, line_words in visible_lines
            )
            page_items = [
                (text_id, text)
                for text_id, text in texts.items()
                if re.fullmatch(rf"pg{page_number:03d}_n\d+", text_id)
            ]
            for top, line_words in visible_lines:
                x0 = min(float(word["x0"]) for word in line_words)
                if x0 - baseline < indent_threshold:
                    continue
                line = " ".join(str(word["text"]) for word in line_words).strip()
                line_key = normalized(line)
                candidates = []
                for text_id, text in page_items:
                    text_key = normalized(text)
                    length = min(32, len(line_key), len(text_key))
                    if length >= 4 and line_key[:length] == text_key[:length]:
                        candidates.append(text_id)
                if len(candidates) == 1:
                    inferred.add(candidates[0])
                elif candidates:
                    # Repeated all-caps labels inside reconstructed chats are
                    # interface metadata, not prose paragraph starts.
                    if len(line) <= 12 and line.upper() == line:
                        continue
                    unresolved.append(
                        {
                            "page": page_number,
                            "top": top,
                            "x0": round(x0, 1),
                            "line": line,
                            "candidates": candidates,
                        }
                    )
    return inferred, unresolved


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True)
    parser.add_argument(
        "--variable",
        default="chapterTwoParagraphStarts",
        help="JavaScript variable containing the registered data IDs",
    )
    parser.add_argument("--indent-threshold", type=float, default=8.0)
    args = parser.parse_args()

    runtime = (ROOT / "assets/reflow-book.js").read_text(encoding="utf-8")
    texts = json.loads(
        (ROOT / "content/i18n/es-UY/texts.json").read_text(encoding="utf-8")
    )
    listed = registered_ids(runtime, args.variable)
    inferred, unresolved = infer_starts(
        args.pdf,
        texts,
        args.start,
        args.end,
        args.indent_threshold,
    )
    report = {
        "pages": [args.start, args.end],
        "registered": len(listed),
        "inferred": len(inferred),
        "inferred_not_registered": sorted(inferred - listed),
        "registered_not_inferred": sorted(listed - inferred),
        "unresolved": unresolved,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return int(bool(
        report["inferred_not_registered"]
        or report["registered_not_inferred"]
        or unresolved
    ))


if __name__ == "__main__":
    sys.exit(main())
