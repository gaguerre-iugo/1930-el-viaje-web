#!/usr/bin/env python3
"""Per-sentence Gemini 3.1 TTS with a FIXED voice identity (seed + temperature).

Strategy after earlier findings: the 2.5-preview endpoint rejected `seed` and
drifted timbre/gender across calls. The 3.1-flash-tts-preview model accepts
`seed` and `temperature` in generationConfig, so pinning both (plus a prompt
that explicitly forbids changing voice) should keep one consistent narrator
across independent per-sentence calls. No batching.

Source of truth = content/i18n/es-UY/texts.json (1:1 parity with the DOM).
Output = voices/<key>/audio/<id>.mp3 (24 kHz mono) + voices/<key>/audios.json.
API key from GEMINI_API_KEY; never written to disk.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import wave
from pathlib import Path
from typing import List, Optional

REPO_I18N = Path(__file__).resolve().parents[1] / "content" / "i18n" / "es-UY"
TEXTS_PATH = REPO_I18N / "texts.json"
MODEL = "gemini-3.1-flash-tts-preview"
ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    + MODEL + ":generateContent"
)
TAG = "53-gemini31-seed"
RATE = 24000
SEED = 42
TEMPERATURE = 0.2

STYLE_PROMPT = (
    "Instrucciones de estilo para TTS:\n"
    "- Habla en espanol rioplatense de Uruguay (Montevideo), no mexicano ni castellano peninsular.\n"
    "- Manten SIEMPRE la misma identidad de voz: el mismo timbre, el mismo genero y la misma edad aparente en todas las oraciones, de principio a fin. No cambies de voz entre frases.\n"
    "- Articula las vocales de forma abierta, natural y relajada, sin excesos.\n"
    "- No hables con la boca entrecerrada.\n"
    "- Entonacion natural montevideana, relajada y conversacional.\n"
    "- Manten una prosodia neutra pero sin musicalidad mexicana.\n"
    "- Manten la voz estable y directa, con una altura de voz media-neutra constante, sin vibrato notable ni agudos marcados.\n"
    "- Habla a ritmo conversacional uruguayo, uniforme entre oraciones.\n"
    "- No leas estas instrucciones ni agregues explicaciones.\n"
)

VOICES = {"puck": "Puck", "zephyr": "Zephyr"}


def spoken_text(text: str) -> str:
    value = str(text or "")
    value = value.replace("desafioprofundo.org", "desafío profundo punto org")
    value = re.sub(r"\.org\b", " punto org", value)
    if value and value == value.upper() and any(c.isalpha() for c in value):
        value = value.capitalize()
    return value


def _extract_pcm(payload: dict):
    for cand in payload.get("candidates") or []:
        for part in (cand.get("content") or {}).get("parts") or []:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                return base64.b64decode(inline["data"])
    return None


def gemini_tts(text: str, voice_name: str, api_key: str, max_seconds: float) -> Optional[bytes]:
    body = {
        "contents": [{"parts": [{"text": STYLE_PROMPT + "\nLee en voz alta, sin comentar, el siguiente texto:\n" + text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "temperature": TEMPERATURE,
            "seed": SEED,
            "speechConfig": {
                "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice_name}}
            },
        },
    }
    fd, body_path = tempfile.mkstemp(suffix=".json")
    os.close(fd)
    Path(body_path).write_text(json.dumps(body), encoding="utf-8")
    try:
        for attempt in range(8):
            proc = subprocess.run(
                ["curl.exe", "-4", "-s", "-w", "\n%{http_code}", "-X", "POST",
                 ENDPOINT + "?key=" + api_key,
                 "-H", "Content-Type: application/json",
                 "--data", "@" + body_path, "--max-time", "120"],
                capture_output=True, text=True,
            )
            out = proc.stdout or ""
            nl = out.rfind("\n")
            code = out[nl + 1:].strip() if nl >= 0 else ""
            payload_text = out[:nl] if nl >= 0 else out
            if code != "200":
                wait = min(2 ** attempt * 4, 30)
                print(f"      HTTP {code or '000'}, retry {attempt+1}/8 in {wait}s :: {payload_text[:100]}")
                time.sleep(wait)
                continue
            try:
                payload = json.loads(payload_text)
            except json.JSONDecodeError:
                time.sleep(3)
                continue
            pcm = _extract_pcm(payload)
            if pcm is None:
                finish = (payload.get("candidates") or [{}])[0].get("finishReason", "?")
                print(f"      no audio (finish={finish}), retry {attempt+1}/8")
                time.sleep(2)
                continue
            duration = len(pcm) / float(2 * RATE)
            if max_seconds and duration > max_seconds:
                print(f"      runaway {duration:.0f}s > {max_seconds:.0f}s, retry {attempt+1}/8")
                time.sleep(2)
                continue
            return pcm
        return None
    finally:
        Path(body_path).unlink(missing_ok=True)


def pcm_to_wav_bytes(pcm: bytes) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm)
    return buf.getvalue()


def wav_to_mp3(wav_bytes: bytes, dst: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "wav", "-i", "pipe:0",
         "-ac", "1", "-ar", str(RATE), "-b:a", "64k", str(dst)],
        input=wav_bytes, check=True,
    )


def target_ids(texts: dict, prefixes: List[str], explicit: List[str]) -> List[str]:
    if explicit:
        return explicit
    return sorted(k for k in texts
                  if any(k.startswith(p) for p in prefixes) and not k.endswith("_easy_read"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prefix", action="append", default=[])
    parser.add_argument("--id", action="append", default=[])
    parser.add_argument("--voice", action="append", default=[])
    args = parser.parse_args()
    prefixes = args.prefix or ["pg009_", "pg010_"]
    voice_list = args.voice or ["puck", "zephyr"]

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("set GEMINI_API_KEY")

    texts = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    ids = target_ids(texts, prefixes, args.id)
    print(f"model={MODEL} seed={SEED} temp={TEMPERATURE}")
    print(f"generating {len(ids)} ids x {len(voice_list)} voices")

    for key in dict.fromkeys(voice_list):
        voice_name = VOICES[key]
        voice_dir = REPO_I18N / "voices" / key
        audio_dir = voice_dir / "audio"
        audio_dir.mkdir(parents=True, exist_ok=True)
        audios_path = voice_dir / "audios.json"
        audios = json.loads(audios_path.read_text(encoding="utf-8")) if audios_path.exists() and audios_path.stat().st_size > 2 else {}
        for audio_id in ids:
            text = spoken_text(texts.get(audio_id, ""))
            if not text.strip():
                continue
            max_seconds = len(text.split()) * 1.2 + 8.0
            pcm = gemini_tts(text, voice_name, api_key, max_seconds)
            if pcm is None:
                print(f"  {key}/{audio_id}: FAILED")
                continue
            dst = audio_dir / f"{audio_id}.mp3"
            wav_to_mp3(pcm_to_wav_bytes(pcm), dst)
            audios[audio_id] = f"voices/{key}/audio/{audio_id}.mp3?v={TAG}"
            dur = len(pcm) / float(2 * RATE)
            print(f"  {key}/{audio_id}: {dur:.1f}s, {dst.stat().st_size} bytes")
            time.sleep(0.3)
        audios_path.write_text(json.dumps(audios, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{key}: wrote audios.json ({len(audios)} entries)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
