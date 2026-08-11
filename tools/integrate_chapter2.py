#!/usr/bin/env python3
"""Merge the prepared chapter-2 ADT source into the integrated v46 bundle.

The source restarts glossary IDs at gl001 and its quiz at qz001.  This tool
preserves the existing v45 IDs, deduplicates repeated glossary terms, assigns
new glossary IDs in source order and renames the chapter-2 quiz to qz007. The
intermediate source bundle already reserves qz001–qz006.
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCALE = Path("content/i18n/es-UY")


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, value) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def replace_audio_id(filename: str, old_id: str, new_id: str) -> str:
    clean, separator, query = filename.partition("?")
    name = Path(clean).name
    if old_id != new_id and name.startswith(old_id):
        name = new_id + name[len(old_id) :]
    return name + (separator + query if separator else "")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    source = args.source.resolve()
    if not (source / "content/pages.json").is_file():
        raise SystemExit(f"Invalid chapter-2 source: {source}")

    target_locale = ROOT / LOCALE
    source_locale = source / LOCALE

    target_glossary = load_json(target_locale / "glossary.json")
    source_glossary = load_json(source_locale / "glossary.json")
    existing_glossary_ids = {
        word: f"gl{index:03d}"
        for index, word in enumerate(target_glossary, start=1)
    }
    next_glossary_number = len(target_glossary) + 1
    glossary_id_map: dict[str, str] = {}
    duplicate_glossary_ids: set[str] = set()

    for source_index, (word, entry) in enumerate(source_glossary.items(), start=1):
        old_id = f"gl{source_index:03d}"
        if word in existing_glossary_ids:
            new_id = existing_glossary_ids[word]
            duplicate_glossary_ids.add(old_id)
            merged_variations = list(
                dict.fromkeys(
                    list(target_glossary[word].get("variations", []))
                    + list(entry.get("variations", []))
                )
            )
            target_glossary[word]["variations"] = merged_variations
        else:
            new_id = f"gl{next_glossary_number:03d}"
            next_glossary_number += 1
            existing_glossary_ids[word] = new_id
            target_glossary[word] = entry
        glossary_id_map[old_id] = new_id

    def remap_id(old_id: str) -> str:
        base = old_id[:-4] if old_id.endswith("_def") else old_id
        suffix = "_def" if old_id.endswith("_def") else ""
        if base in glossary_id_map:
            return glossary_id_map[base] + suffix
        if old_id == "qz001" or old_id.startswith("qz001_"):
            return "qz007" + old_id[len("qz001") :]
        return old_id

    def skip_duplicate_glossary(old_id: str) -> bool:
        base = old_id[:-4] if old_id.endswith("_def") else old_id
        return base in duplicate_glossary_ids

    # Import all chapter pages. pg036 lives in the source index because it was
    # the first page of that standalone export.
    shutil.copy2(source / "index.html", ROOT / "pg036_sec001.html")
    for page in sorted(source.glob("pg*_sec001.html")):
        shutil.copy2(page, ROOT / page.name)

    quiz_source = (source / "qz001.html").read_text(encoding="utf-8")
    (ROOT / "qz007.html").write_text(
        quiz_source.replace("qz001", "qz007"),
        encoding="utf-8",
    )

    for image in sorted((source / "images").iterdir()):
        if image.is_file():
            shutil.copy2(image, ROOT / "images" / image.name)

    target_texts = load_json(target_locale / "texts.json")
    source_texts = load_json(source_locale / "texts.json")
    imported_text_ids: list[str] = []
    for old_id, text in source_texts.items():
        if skip_duplicate_glossary(old_id):
            continue
        new_id = remap_id(old_id)
        if new_id in target_texts:
            raise SystemExit(f"Unexpected text collision: {old_id} -> {new_id}")
        target_texts[new_id] = text
        imported_text_ids.append(new_id)
    save_json(target_locale / "texts.json", target_texts)

    target_audio_map = load_json(target_locale / "audios.json")
    source_audio_map = load_json(source_locale / "audios.json")
    source_audio_root = source_locale / "audio"
    target_audio_root = target_locale / "audio"
    for old_id, filename in source_audio_map.items():
        if skip_duplicate_glossary(old_id):
            continue
        new_id = remap_id(old_id)
        new_filename = replace_audio_id(filename, old_id, new_id)
        source_filename = filename.split("?", 1)[0]
        source_audio = source_audio_root / Path(source_filename).name
        if not source_audio.is_file():
            raise SystemExit(f"Missing source audio: {source_audio}")
        shutil.copy2(source_audio, target_audio_root / new_filename.split("?", 1)[0])
        target_audio_map[new_id] = new_filename
    save_json(target_locale / "audios.json", target_audio_map)

    target_timecodes_path = target_locale / "timecode/timecode_output.json"
    source_timecodes_path = source_locale / "timecode/timecode_output.json"
    target_timecodes = load_json(target_timecodes_path)
    source_timecodes = load_json(source_timecodes_path)
    for old_id, timings in source_timecodes.items():
        if skip_duplicate_glossary(old_id):
            continue
        target_timecodes[remap_id(old_id)] = timings
    save_json(target_timecodes_path, target_timecodes)
    save_json(target_locale / "glossary.json", target_glossary)

    target_pages = load_json(ROOT / "content/pages.json")
    source_pages = load_json(source / "content/pages.json")
    existing_sections = {entry["section_id"] for entry in target_pages}
    for entry in source_pages:
        section_id = "qz007" if entry["section_id"] == "qz001" else entry["section_id"]
        if section_id in existing_sections:
            raise SystemExit(f"Unexpected section collision: {section_id}")
        target_pages.append(
            {"section_id": section_id, "href": f"index.html#{section_id}"}
        )
        existing_sections.add(section_id)
    save_json(ROOT / "content/pages.json", target_pages)

    target_toc = load_json(ROOT / "content/toc.json")
    for entry in load_json(source / "content/toc.json"):
        imported = dict(entry)
        imported["href"] = f"index.html#{imported['section_id']}"
        target_toc.append(imported)
    save_json(ROOT / "content/toc.json", target_toc)

    report = {
        "chapter2_sections": len(source_pages),
        "imported_text_ids": len(imported_text_ids),
        "glossary_terms_total": len(target_glossary),
        "glossary_terms_reused": len(duplicate_glossary_ids),
        "glossary_terms_added": len(source_glossary) - len(duplicate_glossary_ids),
        "quiz_remap": "qz001 -> qz007",
    }
    save_json(ROOT / "CHAPTER2-INTEGRATION-REPORT.json", report)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
