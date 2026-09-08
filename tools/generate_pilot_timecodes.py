#!/usr/bin/env python3
"""Generate word-level timecodes for imported ADT voices using faster-whisper.

The ADT Studio export ships audio but an empty timecode_output.json (Gemini does
not return word boundaries). This transcribes each imported clip, aligns the
recognized (spoken) words to this repo's displayed text (texts.json) and writes
voices/<key>/timecodes.json in the runtime's flat format:

    { "<audioId>": [ {"text": ..., "start": ..., "end": ...}, ... ] }

Alignment reuses the same difflib strategy as generate_whisper_timecodes.py so
that spoken expansions (e.g. "dos mil quince") map onto a single displayed token
("2015").
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import unicodedata
from pathlib import Path
from typing import List, Optional, Sequence, Tuple

from faster_whisper import WhisperModel

REPO_I18N = Path(__file__).resolve().parents[1] / "content" / "i18n" / "es-UY"
TEXTS_PATH = REPO_I18N / "texts.json"
WORD_PATTERN = re.compile(r"\w+(?:['\u2019-]\w+)*", re.UNICODE)


def words(text: str) -> List[str]:
    return WORD_PATTERN.findall(str(text or ""))


def normalized(token: str) -> str:
    decomposed = unicodedata.normalize("NFKD", token.casefold())
    return "".join(c for c in decomposed if not unicodedata.combining(c))


def recognized_words(segments) -> List[dict]:
    output: List[dict] = []
    for segment in segments:
        for item in segment.words or []:
            start = float(item.start)
            end = max(start + 0.02, float(item.end))
            tokens = words(item.word)
            if not tokens:
                continue
            weights = [max(1, len(normalized(t))) for t in tokens]
            total = sum(weights)
            cursor = start
            for index, token in enumerate(tokens):
                nxt = end if index == len(tokens) - 1 else cursor + ((end - start) * weights[index] / total)
                output.append({"text": token, "start": round(cursor, 3), "end": round(max(cursor + 0.02, nxt), 3)})
                cursor = nxt
    return output


def distribute(expected: Sequence[str], start: float, end: float) -> List[Tuple[float, float]]:
    if not expected:
        return []
    end = max(start + (0.02 * len(expected)), end)
    weights = [max(1, len(normalized(t))) for t in expected]
    total = sum(weights)
    cursor = start
    spans: List[Tuple[float, float]] = []
    for index, weight in enumerate(weights):
        nxt = end if index == len(weights) - 1 else cursor + ((end - start) * weight / total)
        spans.append((cursor, max(cursor + 0.02, nxt)))
        cursor = nxt
    return spans


def align_to_expected(expected: Sequence[str], recognized: Sequence[dict]) -> List[dict]:
    if not expected:
        return []
    if not recognized:
        return []
    expected_norm = [normalized(t) for t in expected]
    recognized_norm = [normalized(item["text"]) for item in recognized]
    matcher = difflib.SequenceMatcher(a=expected_norm, b=recognized_norm, autojunk=False)
    spans: List[Optional[Tuple[float, float]]] = [None] * len(expected)
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            for ei, ri in zip(range(i1, i2), range(j1, j2)):
                spans[ei] = (recognized[ri]["start"], recognized[ri]["end"])
        elif tag == "replace" and i2 > i1 and j2 > j1:
            start = recognized[j1]["start"]
            end = recognized[j2 - 1]["end"]
            for offset, span in enumerate(distribute(expected[i1:i2], start, end)):
                spans[i1 + offset] = span
        elif tag == "insert" and j2 > j1:
            insert_start = recognized[j1]["start"]
            insert_end = recognized[j2 - 1]["end"]
            if i1 > 0 and spans[i1 - 1] is not None:
                prev = spans[i1 - 1]
                spans[i1 - 1] = (prev[0], max(prev[1], insert_end))
            elif i1 < len(spans) and spans[i1] is not None:
                fol = spans[i1]
                spans[i1] = (min(insert_start, fol[0]), fol[1])
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
    output: List[dict] = []
    last_start = -0.02
    for token, span in zip(expected, spans):
        start = max(0.0, float(span[0]))
        if start <= last_start:
            start = last_start + 0.02
        end = max(start + 0.02, float(span[1]))
        output.append({"text": token, "start": round(start, 3), "end": round(end, 3)})
        last_start = start
    return output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", action="append", default=["puck", "zephyr"])
    parser.add_argument("--model", default="small")
    args = parser.parse_args()

    texts = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    print(f"loading faster-whisper model '{args.model}' (cpu/int8)...")
    model = WhisperModel(args.model, device="cpu", compute_type="int8")

    for key in dict.fromkeys(args.voice):
        voice_dir = REPO_I18N / "voices" / key
        audios = json.loads((voice_dir / "audios.json").read_text(encoding="utf-8"))
        timecodes = {}
        for audio_id in sorted(audios):
            mp3 = voice_dir / "audio" / f"{audio_id}.mp3"
            expected = words(texts.get(audio_id, ""))
            if not expected or not mp3.exists():
                continue
            segments, _info = model.transcribe(str(mp3), language="es", word_timestamps=True)
            recognized = recognized_words(segments)
            aligned = align_to_expected(expected, recognized)
            if aligned:
                timecodes[audio_id] = aligned
            print(f"  {key}/{audio_id}: {len(aligned)} words")
        (voice_dir / "timecodes.json").write_text(
            json.dumps(timecodes, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"{key}: wrote {len(timecodes)} entries -> {voice_dir / 'timecodes.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
