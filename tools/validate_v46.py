#!/usr/bin/env python3
"""Static integrity checks for the integrated intro + chapters 1 and 2 bundle."""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCALE = ROOT / "content/i18n/es-UY"
SECTION_RE = re.compile(r'<section\b[^>]*\bdata-section-id="([^"]+)"')
QUIZ_RE = re.compile(r'<section\b[^>]*\bdata-id="(qz\d+)"')
DATA_ID_RE = re.compile(r'\bdata-id="([^"]+)"')
QUIZ_PANEL_RE = re.compile(r'\bdata-quiz-id="(qz\d+)"')
QUIZ_ARTICLE_RE = re.compile(
    r'<article\b[^>]*\bdata-quiz-id="(qz\d+)"[^>]*>(.*?)</article>',
    re.DOTALL,
)
LOCAL_REF_RE = re.compile(r'\b(?:src|href)="([^"]+)"')
RUNTIME_ENTRY_RE = re.compile(r'\["([^"]+)",\s*"([^"]+)"\]')
VISUAL_TOKEN_RE = re.compile(
    r"[^\W_]+(?:[’'-][^\W_]+)*|[🐒😬😱]|¿\?|[=/&]",
    re.UNICODE,
)
TIMELESS_NARRATION_CUES = {
    "whatsapp_chat_continuation_v45",
    "whatsapp_chat_intro",
    "whatsapp_chat_intro_v33",
}

# These IDs intentionally keep a visual emoji (or the conventional written
# label "Emoji") while their recorded narration uses the locally requested
# pronunciation "Emolli" plus a useful spoken description.
SPOKEN_INVENTORY_OVERRIDES = {
    "pg029_n0018_emoji01": "Emolli de mono.",
    "pg029_n0018_emoji01_easy_read": "Emolli de mono.",
    "pg068_im002": "Emolli de cara sonriente con lentes de sol.",
    "pg069_n0009": "Emolli de cara gritando de miedo.",
    "pg069_n0009_easy_read": "Emolli de cara gritando de miedo.",
    "pg069_n0019_emoji01": "Emolli de cara haciendo una mueca.",
    "pg069_n0019_emoji01_easy_read": "Emolli de cara haciendo una mueca.",
    "pg070_im002": "Emolli de calavera.",
}


def spoken_inventory_text(text_id: str, display_text: str) -> str:
    """Return the intentional spoken form used to validate word timings."""
    explicit = SPOKEN_INVENTORY_OVERRIDES.get(text_id)
    if explicit is not None:
        return explicit
    if display_text == "Ventana de chat de WhatsApp.":
        return "Ventana de chat de uatsáp."
    if display_text == "Ventana de chat de WhatsApp con estética antigua.":
        return "Ventana de chat de uatsáp con estética antigua."
    return display_text


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def visual_tokens(value: str) -> list[str]:
    return [
        unicodedata.normalize("NFC", token).casefold()
        for token in VISUAL_TOKEN_RE.findall(str(value or ""))
    ]


def comparable_spoken_tokens(value: str) -> list[str]:
    """Treat the requested spoken form “uatsáp” as the visible brand name."""
    normalized = re.sub(r"\buats[aá]p\b", "WhatsApp", str(value or ""), flags=re.I)
    return visual_tokens(normalized)


def portable_sources() -> set[Path]:
    sources = set(ROOT.glob("*.html"))
    sources.update(ROOT.glob("assets/**/*.json"))
    sources.update(ROOT.glob("content/**/*.json"))
    sources.update(
        {
            ROOT / "content/navigation/nav.html",
            ROOT / "assets/base.bundle.local.js",
        }
    )
    return {path for path in sources if path.is_file()}


def validate_portable_preloader(errors: list[str]) -> int:
    path = ROOT / "assets/offline-preloader.js"
    source = path.read_text(encoding="utf-8")
    start_marker = "  var INLINE = "
    end_marker = ";\n  var BASE_DIR"
    try:
        start = source.index(start_marker) + len(start_marker)
        end = source.index(end_marker, start)
        inline = json.loads(source[start:end])
    except (ValueError, json.JSONDecodeError) as error:
        fail(f"offline-preloader.js has an invalid INLINE payload: {error}", errors)
        return 0
    expected = {"./" + path.relative_to(ROOT).as_posix() for path in portable_sources()}
    missing = sorted(expected - set(inline))
    if missing:
        fail(f"offline preloader is missing {len(missing)} portable resources", errors)
    return len(inline)


def validate_voice(
    voice: str,
    texts: dict[str, str],
    errors: list[str],
) -> dict[str, int]:
    # Empty strings are structural markers used by the paginator, not spoken
    # content.  Requiring MP3/timecode entries for them produced 32 false
    # "missing audio" failures per voice and one false lexical mismatch.
    text_ids = {
        text_id
        for text_id, display_text in texts.items()
        if str(display_text or "").strip()
    }
    root = LOCALE / "voices" / voice
    audios = load_json(root / "audios.json")
    timecodes = load_json(root / "timecodes.json")
    audio_root = root / "audio"
    missing_map = sorted(text_ids - set(audios))
    missing_timecodes = sorted(text_ids - set(timecodes))
    missing_files = sorted(
        text_id
        for text_id, filename in audios.items()
        if not (audio_root / Path(filename.split("?", 1)[0]).name).is_file()
        or (audio_root / Path(filename.split("?", 1)[0]).name).stat().st_size == 0
    )
    if missing_map:
        fail(f"{voice}: {len(missing_map)} text IDs without audio mapping", errors)
    if missing_timecodes:
        fail(f"{voice}: {len(missing_timecodes)} text IDs without timecodes", errors)
    if missing_files:
        fail(f"{voice}: {len(missing_files)} mapped audio files missing or empty", errors)
    timing_count_mismatches = []
    invalid_timing_sequences = []
    for text_id, display_text in texts.items():
        if text_id not in text_ids:
            continue
        boundaries = timecodes.get(text_id) or []
        visible_inventory = comparable_spoken_tokens(
            spoken_inventory_text(text_id, display_text)
        )
        timing_inventory = [
            token
            for boundary in boundaries
            for token in comparable_spoken_tokens(str(boundary.get("text") or ""))
        ]
        if visible_inventory != timing_inventory:
            timing_count_mismatches.append(text_id)
        previous_start = -1.0
        for boundary in boundaries:
            start = float(boundary.get("start") or 0)
            end = float(boundary.get("end") or 0)
            if start < 0 or end <= start or start < previous_start:
                invalid_timing_sequences.append(text_id)
                break
            previous_start = start
    if timing_count_mismatches:
        fail(
            f"{voice}: {len(timing_count_mismatches)} texts differ from their lexical timing inventory",
            errors,
        )
    if invalid_timing_sequences:
        fail(
            f"{voice}: {len(invalid_timing_sequences)} invalid timing sequences",
            errors,
        )
    return {
        "audio_mappings": len(audios),
        "timecodes": len(timecodes),
        "missing_audio_mappings": len(missing_map),
        "missing_timecodes": len(missing_timecodes),
        "missing_audio_files": len(missing_files),
        "timing_count_mismatches": len(timing_count_mismatches),
        "invalid_timing_sequences": len(invalid_timing_sequences),
    }


def main() -> int:
    errors: list[str] = []
    pages = load_json(ROOT / "content/pages.json")
    toc = load_json(ROOT / "content/toc.json")
    texts = load_json(LOCALE / "texts.json")
    images = load_json(LOCALE / "images.json")
    audios = load_json(LOCALE / "audios.json")
    timecodes = load_json(LOCALE / "timecode/timecode_output.json")
    glossary = load_json(LOCALE / "glossary.json")

    section_ids = [entry["section_id"] for entry in pages]
    if len(section_ids) != len(set(section_ids)):
        fail("content/pages.json contains duplicate section IDs", errors)

    chapter_two = [
        "pg036_sec001",
        "pg037_sec001",
        *[f"pg{page:03d}_sec001" for page in range(39, 58)],
        "qz007",
    ]
    missing_sections = sorted(set(chapter_two) - set(section_ids))
    if missing_sections:
        fail(f"Chapter 2 sections absent from pages.json: {missing_sections}", errors)

    toc_ids = {entry["section_id"] for entry in toc}
    if "pg037_sec001" not in toc_ids:
        fail("Chapter 2 is absent from the table of contents", errors)

    chapter_two_quiz_source = (ROOT / "qz007.html").read_text(encoding="utf-8")
    chapter_two_quizzes = QUIZ_PANEL_RE.findall(chapter_two_quiz_source)
    if chapter_two_quizzes != ["qz007", "qz008", "qz009"]:
        fail(
            "Chapter 2 quizzes must be qz007, qz008 and qz009 in reading-dimension order",
            errors,
        )
    for quiz_id, source in QUIZ_ARTICLE_RE.findall(chapter_two_quiz_source):
        option_count = len(re.findall(r'\bclass="quiz-option"', source))
        correct_count = len(re.findall(r'\bdata-correct="true"', source))
        if option_count != 3 or correct_count != 1:
            fail(
                f"{quiz_id}: expected 3 options and exactly 1 correct answer",
                errors,
            )

    section_files: dict[str, Path] = {}
    for section_id in section_ids:
        if section_id == "pg001_sec001":
            filename = "index.html"
        elif section_id == "quiz_final":
            filename = "quiz_final.html"
        else:
            filename = f"{section_id}.html"
        path = ROOT / filename
        if not path.is_file():
            fail(f"Missing section file: {filename}", errors)
            continue
        section_files[section_id] = path
        source = path.read_text(encoding="utf-8")
        found = SECTION_RE.findall(source) + QUIZ_RE.findall(source)
        expected = "qz007" if section_id == "qz007" else section_id
        if expected not in found:
            fail(f"{filename} does not declare section {expected}", errors)

    runtime_source = (ROOT / "assets/reflow-book.js").read_text(encoding="utf-8")
    runtime_start = runtime_source.index("var sections = [")
    runtime_end = runtime_source.index("];", runtime_start) + 2
    runtime_sections = RUNTIME_ENTRY_RE.findall(runtime_source[runtime_start:runtime_end])
    expected_runtime_sections = [
        (section_id, section_files[section_id].name)
        for section_id in section_ids
        if section_id in section_files
    ]
    if runtime_sections != expected_runtime_sections:
        fail("Runtime section order/files differ from content/pages.json", errors)

    for path in section_files.values():
        source = path.read_text(encoding="utf-8")
        for reference in LOCAL_REF_RE.findall(source):
            clean = reference.split("?", 1)[0].split("#", 1)[0]
            if not clean or clean.startswith(("data:", "http:", "https:", "mailto:", "javascript:")):
                continue
            if not (ROOT / clean).resolve().is_file():
                fail(f"{path.name}: missing local reference {reference}", errors)

    text_ids = set(texts)
    known_content_ids = text_ids | set(images) | set(section_ids)
    for section_id, path in section_files.items():
        unknown_ids = sorted(
            set(DATA_ID_RE.findall(path.read_text(encoding="utf-8")))
            - known_content_ids
        )
        if unknown_ids:
            fail(f"{path.name}: unknown data IDs {unknown_ids}", errors)

    for label, mapping in (("base audio", audios), ("base timecodes", timecodes)):
        missing = sorted(text_ids - set(mapping) - (TIMELESS_NARRATION_CUES if label == "base timecodes" else set()))
        if missing:
            fail(f"{label}: {len(missing)} text IDs missing", errors)

    base_audio_root = LOCALE / "audio"
    missing_base_files = [
        text_id
        for text_id, filename in audios.items()
        if not (base_audio_root / Path(filename.split("?", 1)[0]).name).is_file()
        or (base_audio_root / Path(filename.split("?", 1)[0]).name).stat().st_size == 0
    ]
    if missing_base_files:
        fail(f"base audio: {len(missing_base_files)} mapped files missing or empty", errors)

    glossary_ids = {f"gl{index:03d}" for index in range(1, len(glossary) + 1)}
    glossary_text_ids = {
        text_id[:-4] if text_id.endswith("_def") else text_id
        for text_id in text_ids
        if re.fullmatch(r"gl\d{3}(?:_def)?", text_id)
    }
    if glossary_ids != glossary_text_ids:
        fail("Glossary order and glNNN text IDs are inconsistent", errors)

    voice_results = {
        voice: validate_voice(voice, texts, errors)
        for voice in ("valentina", "mateo")
    }
    report = {
        "sections": len(section_ids),
        "chapter2_sections": len(chapter_two),
        "chapter2_quizzes": len(chapter_two_quizzes),
        "toc_entries": len(toc),
        "text_ids": len(texts),
        "glossary_terms": len(glossary),
        "base_audio_mappings": len(audios),
        "base_timecodes": len(timecodes),
        "portable_resources": validate_portable_preloader(errors),
        "voices": voice_results,
        "errors": errors,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
