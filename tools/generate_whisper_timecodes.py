#!/usr/bin/env python3
"""Generate real word timestamps for an ADT bundle with MLX Whisper.

The source export for this chapter contains audio but an empty
``timecode_output.json``.  This tool transcribes each existing clip without
changing it, aligns Whisper's word boundaries to the exact localized text and
writes the structure expected by the ADT runtime.

MLX Whisper and its model are intentionally external runtime dependencies. A
typical invocation is::

    HF_HOME=/tmp/huggingface-cache \
    PYTHONPATH=/tmp/mlx-whisper-runtime \
      python3 tools/generate_whisper_timecodes.py
"""

from __future__ import annotations

import argparse
import difflib
import json
import math
import os
import subprocess
import tempfile
import unicodedata
import wave
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple
from urllib.parse import unquote

import numpy as np
import regex


ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "content" / "i18n" / "es-UY"
TEXTS_PATH = I18N / "texts.json"
AUDIO_MAP_PATH = I18N / "audios.json"
AUDIO_DIR = I18N / "audio"
OUTPUT_PATH = I18N / "timecode" / "timecode_output.json"
WORD_PATTERN = regex.compile(
    r"[\p{L}\p{N}\p{M}]+(?:[’'-][\p{L}\p{N}\p{M}]+)*"
)


def words(text: str) -> List[str]:
    return WORD_PATTERN.findall(str(text or ""))


def normalized(token: str) -> str:
    decomposed = unicodedata.normalize("NFKD", token.casefold())
    return "".join(char for char in decomposed if not unicodedata.combining(char))


def resolve_audio_file(mapped_name: str) -> Path:
    clean_name = unquote(str(mapped_name).split("?", 1)[0].split("#", 1)[0])
    return AUDIO_DIR / clean_name


def decode_audio(audio_path: Path, wav_path: Path) -> np.ndarray:
    wav_path.unlink(missing_ok=True)
    subprocess.run(
        [
            "/usr/bin/afconvert",
            str(audio_path),
            str(wav_path),
            "-f",
            "WAVE",
            "-d",
            "LEI16@16000",
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    with wave.open(str(wav_path), "rb") as source:
        if source.getnchannels() != 1 or source.getsampwidth() != 2:
            raise RuntimeError(f"Unsupported decoded format: {audio_path}")
        samples = np.frombuffer(source.readframes(source.getnframes()), dtype="<i2")
    return samples.astype(np.float32) / 32768.0


def recognized_words(result: dict) -> List[dict]:
    output: List[dict] = []
    for segment in result.get("segments", []):
        for item in segment.get("words", []) or []:
            start = float(item.get("start", 0.0))
            end = float(item.get("end", start))
            tokens = words(item.get("word", ""))
            if not tokens or not math.isfinite(start) or not math.isfinite(end):
                continue
            end = max(start + 0.02, end)
            weights = [max(1, len(normalized(token))) for token in tokens]
            total = sum(weights)
            cursor = start
            for index, token in enumerate(tokens):
                next_cursor = end if index == len(tokens) - 1 else (
                    cursor + ((end - start) * weights[index] / total)
                )
                output.append(
                    {
                        "text": token,
                        "start": round(cursor, 3),
                        "end": round(max(cursor + 0.02, next_cursor), 3),
                    }
                )
                cursor = next_cursor
    return output


def distribute(
    expected: Sequence[str],
    start: float,
    end: float,
) -> List[Tuple[float, float]]:
    if not expected:
        return []
    end = max(start + (0.02 * len(expected)), end)
    weights = [max(1, len(normalized(token))) for token in expected]
    total = sum(weights)
    cursor = start
    spans: List[Tuple[float, float]] = []
    for index, weight in enumerate(weights):
        next_cursor = end if index == len(weights) - 1 else (
            cursor + ((end - start) * weight / total)
        )
        spans.append((cursor, max(cursor + 0.02, next_cursor)))
        cursor = next_cursor
    return spans


def align_to_expected(expected: Sequence[str], recognized: Sequence[dict]) -> List[dict]:
    if not expected or not recognized:
        return []

    expected_norm = [normalized(token) for token in expected]
    recognized_norm = [normalized(item["text"]) for item in recognized]
    matcher = difflib.SequenceMatcher(a=expected_norm, b=recognized_norm, autojunk=False)
    spans: List[Optional[Tuple[float, float]]] = [None] * len(expected)

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            for expected_index, recognized_index in zip(range(i1, i2), range(j1, j2)):
                item = recognized[recognized_index]
                spans[expected_index] = (item["start"], item["end"])
            continue

        if tag == "replace" and i2 > i1 and j2 > j1:
            start = recognized[j1]["start"]
            end = recognized[j2 - 1]["end"]
            for offset, span in enumerate(distribute(expected[i1:i2], start, end)):
                spans[i1 + offset] = span
            continue

        if tag == "insert" and j2 > j1:
            insert_start = recognized[j1]["start"]
            insert_end = recognized[j2 - 1]["end"]
            if i1 > 0 and spans[i1 - 1] is not None:
                previous = spans[i1 - 1]
                spans[i1 - 1] = (previous[0], max(previous[1], insert_end))
            elif i1 < len(spans) and spans[i1] is not None:
                following = spans[i1]
                spans[i1] = (min(insert_start, following[0]), following[1])

    speech_start = float(recognized[0]["start"])
    speech_end = float(recognized[-1]["end"])
    cursor = 0
    while cursor < len(spans):
        if spans[cursor] is not None:
            cursor += 1
            continue
        run_start = cursor
        while cursor < len(spans) and spans[cursor] is None:
            cursor += 1
        run_end = cursor
        left = spans[run_start - 1][1] if run_start > 0 and spans[run_start - 1] else speech_start
        right = spans[run_end][0] if run_end < len(spans) and spans[run_end] else speech_end
        for offset, span in enumerate(distribute(expected[run_start:run_end], left, right)):
            spans[run_start + offset] = span

    # The player switches words using their start times. Preserve Whisper's
    # starts wherever possible and only separate duplicate timestamps.
    output: List[dict] = []
    last_start = -0.02
    for token, span in zip(expected, spans):
        assert span is not None
        start = max(0.0, float(span[0]))
        if start <= last_start:
            start = last_start + 0.02
        end = max(start + 0.02, float(span[1]))
        output.append(
            {"text": token, "start": round(start, 3), "end": round(end, 3)}
        )
        last_start = start
    return output


def timecode_entry(timestamps: Sequence[dict]) -> dict:
    return {"timecodes": [None, {"word_timestamps": list(timestamps)}]}


def selected_ids(
    all_ids: Iterable[str],
    requested: Sequence[str],
    prefixes: Sequence[str],
) -> List[str]:
    available = set(all_ids)
    if not requested:
        return sorted(
            asset_id
            for asset_id in available
            if not prefixes or any(asset_id.startswith(prefix) for prefix in prefixes)
        )
    requested_set = set(requested)
    missing = requested_set.difference(available)
    if missing:
        raise SystemExit("Unknown audio id(s): " + ", ".join(sorted(missing)))
    return sorted(requested_set)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", action="append", default=[], help="Align one ID (repeatable).")
    parser.add_argument(
        "--prefix",
        action="append",
        default=[],
        help="When no --id is supplied, align only IDs with this prefix (repeatable).",
    )
    parser.add_argument(
        "--model",
        default="mlx-community/whisper-tiny",
        help="Local MLX model path or Hugging Face repository.",
    )
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    parser.add_argument(
        "--merge",
        action="store_true",
        help="Preserve existing entries in the output while updating selected IDs.",
    )
    args = parser.parse_args()

    import mlx_whisper

    texts: Dict[str, str] = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    audio_map: Dict[str, str] = json.loads(AUDIO_MAP_PATH.read_text(encoding="utf-8"))
    ids = selected_ids((key for key in audio_map if key in texts), args.id, args.prefix)
    output: Dict[str, dict] = {}
    if args.merge and args.output.exists():
        output = json.loads(args.output.read_text(encoding="utf-8"))
    failures: List[str] = []

    with tempfile.TemporaryDirectory(prefix="adt-timecodes-") as temporary:
        wav_path = Path(temporary) / "clip.wav"
        for index, asset_id in enumerate(ids, start=1):
            expected = words(texts[asset_id])
            audio_path = resolve_audio_file(audio_map[asset_id])
            if not expected or not audio_path.exists():
                failures.append(asset_id)
                continue
            try:
                audio = decode_audio(audio_path, wav_path)
                result = mlx_whisper.transcribe(
                    audio,
                    path_or_hf_repo=args.model,
                    language="es",
                    initial_prompt=texts[asset_id],
                    condition_on_previous_text=False,
                    temperature=0.0,
                    word_timestamps=True,
                    verbose=None,
                )
                recognized = recognized_words(result)
                aligned = align_to_expected(expected, recognized)
                if len(aligned) != len(expected):
                    raise RuntimeError("word count mismatch")
                output[asset_id] = timecode_entry(aligned)
                print(f"[{index}/{len(ids)}] {asset_id}: {len(aligned)} words", flush=True)
            except Exception as error:
                failures.append(asset_id)
                print(f"[{index}/{len(ids)}] {asset_id}: ERROR {error}", flush=True)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(output)} entries to {args.output}")
    if failures:
        print("Unaligned IDs: " + ", ".join(failures))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
