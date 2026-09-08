#!/usr/bin/env python3
"""Import an ADT Studio voice export into this repo's voices/<key>/ layout.

The ADT export uses a native structure:
  content/i18n/es-UY/audio/<id>.wav            (primary voice)
  content/i18n/es-UY/audio/<id>--secondary.wav (secondary voice)
  content/i18n/es-UY/audio_voices.json         (voices -> {label, audios})

This repo expects, per voice key:
  content/i18n/es-UY/voices/<key>/audio/<id>.mp3
  content/i18n/es-UY/voices/<key>/audios.json   (id -> "voices/<key>/audio/<id>.mp3?v=TAG")
  content/i18n/es-UY/voices/<key>/timecodes.json (id -> [{text,start,end}, ...])

This script transcodes wav->mp3 with ffmpeg and writes audios.json plus an
empty timecodes.json (filled later by the Whisper alignment step).
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

EXPORT = Path(r"C:\Users\germa\Desktop\ADT Voice\content\i18n\es-UY")
REPO_I18N = Path(__file__).resolve().parents[1] / "content" / "i18n" / "es-UY"
TAG = "50-puck-zephyr-pilot"

# ADT export voice slot -> repo voice key
SLOT_TO_KEY = {"primary": "puck", "secondary": "zephyr"}


def main() -> int:
    voices = json.loads((EXPORT / "audio_voices.json").read_text(encoding="utf-8"))
    src_audio = EXPORT / "audio"
    for slot, meta in voices["voices"].items():
        key = SLOT_TO_KEY.get(slot)
        if not key:
            print(f"skip unknown slot {slot}")
            continue
        label = meta.get("label", key)
        out_dir = REPO_I18N / "voices" / key
        out_audio = out_dir / "audio"
        out_audio.mkdir(parents=True, exist_ok=True)
        audios_map = {}
        for audio_id, filename in sorted(meta["audios"].items()):
            src = src_audio / filename
            if not src.exists():
                print(f"MISSING {src}")
                continue
            dst = out_audio / f"{audio_id}.mp3"
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
                 "-ac", "1", "-ar", "24000", "-b:a", "64k", str(dst)],
                check=True,
            )
            audios_map[audio_id] = f"voices/{key}/audio/{audio_id}.mp3?v={TAG}"
        (out_dir / "audios.json").write_text(
            json.dumps(audios_map, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        tc_path = out_dir / "timecodes.json"
        if not tc_path.exists():
            tc_path.write_text("{}", encoding="utf-8")
        print(f"{key} ({label}): {len(audios_map)} clips -> {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
