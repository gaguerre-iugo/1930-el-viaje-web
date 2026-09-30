#!/usr/bin/env python3
"""Audit every book string for characters outside Spanish orthography and emoji.

Background: the glossary shipped two corrupted emoji fields that carried the
Armenian letters "գաղ" instead of a pictograph. audit-charset:allow
The marker that closes the line above is the tool's own opt-out: it must sit on
the same line as the text it exempts. A third corrupted field carried a Han
ideograph, and this tool exists to catch that class of defect anywhere in the
book — a letter from a non-Spanish alphabet (Armenian, Cyrillic, Greek, Hebrew,
Arabic, Han, Hangul, ...) or a stray symbol that is not a valid emoji codepoint.

Exit status is 0 when the book is clean and 1 when blocking findings exist, so it
can be wired into CI or a release checklist. Latin letters Spanish does not use
(a French quotation, for instance) are reported as notes; add --strict to fail on
those too.

Usage:
    python tools/audit_charset.py                 # default book surfaces
    python tools/audit_charset.py --repo          # every text file in the checkout
    python tools/audit_charset.py --include-derived
    python tools/audit_charset.py --strict --json tmp/charset-report.json
    python tools/audit_charset.py path/to/file.json

Any line or JSON string containing "audit-charset:allow" is skipped, so
documentation can quote a defective string verbatim without failing the audit.
--repo is a diagnostic that also walks docs/ and tools/, where IPA transcriptions
and diagram glyphs are intentional; use the default mode as the release gate.
"""

from __future__ import annotations

import argparse
import json
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# --------------------------------------------------------------------------- #
# What the book is allowed to contain
# --------------------------------------------------------------------------- #

# Spanish adds these to the ASCII printable range already accepted below.
SPANISH_EXTRAS = set(
    "áéíóúüñÁÉÍÓÚÜÑ"  # vowels, diaeresis and eñe
    "¡¿"              # inverted opening marks
    "«»"              # angle quotes used in dialogue
    "ºª"              # ordinal indicators
    "–—"              # en dash, em dash
    "…"               # ellipsis
    "“”‘’"            # typographic quotes used in quizzes and dialogue
    "·"               # middle dot: quiz kicker separator ("Pregunta 1 de 3")
    "§"               # section sign, used in documentation cross-references
    "−"               # minus sign, used in documentation tables
    "µ"               # micro sign, unit prefix in technical notes
    "×÷≤≥≈±°²³"       # UI and maths marks (close button, wrong-answer mark)
    "\u00a0"          # non-breaking space
    "\ufeff"          # byte order mark at the head of exported files
)

ALLOWED_CONTROL = set("\n\r\t")

# Emoji blocks the book legitimately uses (pictographs, arrows, flags, dingbats)
# plus the invisible joiners and selectors that compose them.
EMOJI_RANGES: tuple[tuple[int, int], ...] = (
    (0x00A9, 0x00A9),   # ©
    (0x00AE, 0x00AE),   # ®
    (0x203C, 0x203C),   # ‼
    (0x2049, 0x2049),   # ⁉
    (0x2122, 0x2122),   # ™
    (0x2139, 0x2139),   # ℹ
    (0x2190, 0x21FF),   # arrows, incl. ↔ used in composites
    (0x2300, 0x23FF),   # technical, incl. ⌚⏰⏳⏱
    (0x2460, 0x24FF),   # enclosed alphanumerics, incl. ⓘ
    (0x2500, 0x259F),   # box drawing and block elements: documentation diagrams
    (0x25A0, 0x27BF),   # geometric shapes, misc symbols, dingbats, ✂✅✈
    (0x02B0, 0x02FF),   # spacing modifier letters: IPA prosody notes in docs
    (0x2900, 0x297F),   # supplemental arrows
    (0x2B00, 0x2BFF),   # supplemental symbols and arrows, incl. ⬆⬇⭐
    (0x3030, 0x3030),   # 〰
    (0x303D, 0x303D),   # 〽
    (0x3297, 0x3297),   # ㊗
    (0x3299, 0x3299),   # ㊙
    (0x1F000, 0x1FAFF), # pictographs, emoticons, skin tones, regional indicators
    (0xFE00, 0xFE0F),   # variation selectors (️)
    (0x200D, 0x200D),   # zero width joiner
    (0x20E3, 0x20E3),   # combining enclosing keycap
    (0xE0020, 0xE007F), # tag characters (subdivision flags)
)

# Files audited by default: everything a reader can see.
DEFAULT_GLOBS: tuple[str, ...] = (
    "index.html",
    "pg*.html",
    "qz*.html",
    "quiz_final.html",
    "content/pages.json",
    "content/toc.json",
    "content/navigation/nav.html",
    "content/i18n/es-UY/glossary.json",
    "content/i18n/es-UY/texts.json",
    "content/i18n/es-UY/audios.json",
    "content/i18n/es-UY/speech_texts.json",
    "content/i18n/es-UY/images.json",
    "content/i18n/es-UY/videos.json",
    "assets/config.json",
    "assets/reflow-book.js",
    "assets/quiz-sequence.js",
    # The offline preloader embeds a copy of every catalogue, so a defect fixed
    # in content/ but not re-synced here would still reach file:// readers.
    "assets/offline-preloader.js",
    "assets/interface_translations/**/*.json",
)

# Derived from the sources above; agreed only when explicitly requested.
DERIVED_GLOBS: tuple[str, ...] = (
    "content/i18n/es-UY/voices/*/timecodes.json",
    "content/i18n/es-UY/timecode/timecode_output.json",
)

# The offline preloader inlines one giant JSON catalogue on a single line. Scan
# it entry by entry so a finding names the embedded file, not "line 6".
PRELOADER_NAME = "offline-preloader.js"
PRELOADER_INLINE_START = "var INLINE = "
PRELOADER_INLINE_END = "var BASE_DIR"

# Vendored bundles inlined in the preloader: third-party library internals carry
# their own Unicode tables (daggers, ogonek letters, ...) and are not book text.
PRELOADER_VENDORED = frozenset(
    {
        "./assets/base.bundle.local.js",
        "./assets/base.bundle.min.js",
    }
)

# A line (or JSON string) containing this marker is skipped. Documentation that
# has to quote a defective string verbatim uses it, e.g. the changelog entry for
# the fix that removed U+0561/U+0563/U+0572 from two glossary emoji fields.
ALLOW_MARKER = "audit-charset:allow"

# --repo mode: every text file in the checkout, minus generated and vendored trees.
REPO_EXCLUDE_DIRS = frozenset(
    {".git", "venv", "node_modules", "output", "Export", "tmp", "__pycache__"}
)
REPO_TEXT_SUFFIXES = frozenset(
    {
        ".html", ".htm", ".js", ".mjs", ".cjs", ".json", ".css", ".md", ".txt",
        ".xml", ".svg", ".py", ".yml", ".yaml", ".webmanifest", ".jsonc", ".csv",
    }
)


def is_emoji(codepoint: int) -> bool:
    return any(low <= codepoint <= high for low, high in EMOJI_RANGES)


def is_allowed(char: str) -> bool:
    codepoint = ord(char)
    if char in ALLOWED_CONTROL or char in SPANISH_EXTRAS:
        return True
    # ASCII printable: Latin letters, digits, punctuation, space.
    if 0x20 <= codepoint <= 0x7E:
        return True
    # Combining marks: decomposed accents are legitimate in normalized text and
    # in the mark ranges the bundled text libraries carry.
    if unicodedata.category(char).startswith("M"):
        return True
    return is_emoji(codepoint)


def describe(char: str) -> str:
    try:
        return unicodedata.name(char)
    except ValueError:
        return f"U+{ord(char):04X}"


def classify(char: str) -> str:
    """Classify a rejected character.

    ALPHABET      a letter from a non-Latin writing system (Armenian, CJK, ...):
                  the corrupt-emoji defect this tool exists for. Always fatal.
    LATIN_FOREIGN a Latin letter Spanish does not use (French U+00E8, U+00E7, ...).
                  Expected inside quoted foreign dialogue, so reported as a note
                  and only fatal under --strict.
    SYMBOL        a symbol outside both the Spanish set and the emoji ranges.
    """
    if not unicodedata.category(char).startswith("L"):
        return "SYMBOL"
    if unicodedata.name(char, "").startswith("LATIN"):
        return "LATIN_FOREIGN"
    return "ALPHABET"


def line_of(raw_lines: list[str], needle: str) -> int:
    for number, line in enumerate(raw_lines, start=1):
        if needle in line:
            return number
    return 0


def scan_string(
    value: str,
    location: str,
    findings: list[dict[str, object]],
    raw_lines: list[str] | None = None,
) -> None:
    if ALLOW_MARKER in value:
        return
    for offset, char in enumerate(value):
        if is_allowed(char):
            continue
        findings.append(
            {
                "location": location,
                "index": offset,
                "char": char,
                "codepoint": f"U+{ord(char):04X}",
                "name": describe(char),
                "kind": classify(char),
                "context": value[max(0, offset - 30) : offset + 30],
                "line": line_of(raw_lines, char) if raw_lines else 0,
            }
        )


def walk_json(node: object, path: str, findings: list[dict], raw_lines: list[str]) -> None:
    if isinstance(node, str):
        scan_string(node, path or "<root>", findings, raw_lines)
    elif isinstance(node, dict):
        for key, child in node.items():
            scan_string(str(key), f"{path}.{key} (key)", findings, raw_lines)
            walk_json(child, f"{path}.{key}", findings, raw_lines)
    elif isinstance(node, list):
        for index, child in enumerate(node):
            walk_json(child, f"{path}[{index}]", findings, raw_lines)


def scan_json_file(path: Path) -> list[dict]:
    raw = path.read_text(encoding="utf-8")
    raw_lines = raw.splitlines()
    findings: list[dict] = []
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # Fall back to a plain text scan so a broken export still reports.
        scan_text_file(path, findings)
        return findings
    walk_json(data, "", findings, raw_lines)
    return findings


def scan_text_file(path: Path, findings: list[dict]) -> None:
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if ALLOW_MARKER in line:
            continue
        for column, char in enumerate(line, start=1):
            if is_allowed(char):
                continue
            findings.append(
                {
                    "location": f"line {number}",
                    "index": column,
                    "char": char,
                    "codepoint": f"U+{ord(char):04X}",
                    "name": describe(char),
                    "kind": classify(char),
                    "context": line.strip()[:80],
                    "line": number,
                }
            )


def scan_preloader(path: Path) -> list[dict]:
    """Audit each file embedded in the offline preloader's INLINE catalogue."""
    raw = path.read_text(encoding="utf-8")
    start = raw.find(PRELOADER_INLINE_START)
    end = raw.find(PRELOADER_INLINE_END, start)
    findings: list[dict] = []
    if start < 0 or end < 0:
        scan_text_file(path, findings)
        return findings

    payload = raw[start + len(PRELOADER_INLINE_START) : end].strip().rstrip(";").strip()
    try:
        catalog = json.loads(payload)
    except json.JSONDecodeError:
        scan_text_file(path, findings)
        return findings

    for relative, value in catalog.items():
        if relative in PRELOADER_VENDORED:
            continue
        if isinstance(value, str):
            scan_string(value, f"inlined {relative}", findings)
        elif isinstance(value, (dict, list)):
            walk_json(value, f"inlined {relative}", findings, [])
    return findings


def collect_targets(patterns: tuple[str, ...]) -> list[Path]:
    targets: list[Path] = []
    for pattern in patterns:
        if any(token in pattern for token in "*?["):
            targets.extend(sorted(ROOT.glob(pattern)))
        else:
            candidate = ROOT / pattern
            if candidate.is_file():
                targets.append(candidate)
    # De-duplicate while keeping a stable order.
    seen: set[Path] = set()
    unique: list[Path] = []
    for target in targets:
        if target not in seen:
            seen.add(target)
            unique.append(target)
    return unique


def collect_repo_targets() -> list[Path]:
    """Every text file in the checkout, minus generated and vendored trees."""
    targets: list[Path] = []
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in REPO_TEXT_SUFFIXES:
            continue
        if any(part in REPO_EXCLUDE_DIRS for part in path.relative_to(ROOT).parts):
            continue
        targets.append(path)
    return targets


def main(argv: list[str] | None = None) -> int:
    # Findings include emoji, which the default Windows console codepage cannot print.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", help="explicit files to audit")
    parser.add_argument(
        "--include-derived",
        action="store_true",
        help="also audit generated timecode files (large, derived from texts.json)",
    )
    parser.add_argument("--json", dest="json_out", help="write the full report as JSON")
    parser.add_argument(
        "--repo",
        action="store_true",
        help="audit every text file in the checkout (docs, tools, pages, data)",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="also fail on Latin letters Spanish does not use (French quotes, ...)",
    )
    args = parser.parse_args(argv)

    if args.paths:
        targets = [Path(p) if Path(p).is_absolute() else (ROOT / p) for p in args.paths]
        targets = [t for t in targets if t.is_file()]
    elif args.repo:
        targets = collect_repo_targets()
    else:
        patterns = DEFAULT_GLOBS + (DERIVED_GLOBS if args.include_derived else ())
        targets = collect_targets(patterns)

    report: dict[str, list[dict]] = {}
    for target in targets:
        if not target.is_file():
            continue
        if target.name == PRELOADER_NAME:
            findings = scan_preloader(target)
        elif target.suffix.lower() == ".json":
            findings = scan_json_file(target)
        else:
            findings = []
            scan_text_file(target, findings)
        if not findings:
            continue
        try:
            label = str(target.relative_to(ROOT))
        except ValueError:
            label = str(target)
        report[label.replace("\\", "/")] = findings

    counted = [item for findings in report.values() for item in findings]
    total = len(counted)
    alphabets = sum(1 for item in counted if item["kind"] == "ALPHABET")
    symbols = sum(1 for item in counted if item["kind"] == "SYMBOL")
    latin_foreign = sum(1 for item in counted if item["kind"] == "LATIN_FOREIGN")
    blocking = alphabets + symbols

    print(f"Audited {len(targets)} file(s) under {ROOT}")
    if not report:
        print("OK - no characters outside Spanish orthography and the emoji ranges.")
        return 0

    for name, findings in report.items():
        print(f"\n{name}  ({len(findings)} finding(s))")
        for item in findings:
            where = item["location"]
            if item["line"]:
                where = f"{where} -> line {item['line']}"
            print(
                f"  [{item['kind']}] {item['codepoint']} {item['name']!r} "
                f"in {where}\n      ...{item['context']}..."
            )

    print(
        f"\nTOTAL {total} finding(s) in {len(report)} file(s): "
        f"{alphabets} foreign alphabet, {symbols} stray symbol, "
        f"{latin_foreign} foreign Latin letter."
    )
    if latin_foreign and not args.strict:
        print(
            "Foreign Latin letters are usually legitimate quotations in another "
            "language; review them visually, or re-run with --strict to fail on them."
        )

    if args.json_out:
        out = Path(args.json_out)
        if not out.is_absolute():
            out = ROOT / out
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(
            json.dumps(
                {
                    "root": str(ROOT),
                    "files": report,
                    "total": total,
                    "alphabet": alphabets,
                    "symbol": symbols,
                    "latin_foreign": latin_foreign,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"JSON report: {out}")

    if blocking or (args.strict and latin_foreign):
        return 1
    print("OK - only reviewed foreign-language quotations remain.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
