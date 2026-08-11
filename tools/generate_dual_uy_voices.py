#!/usr/bin/env python3
"""Generate complete offline Valentina and Mateo TTS catalogues.

Audio and word boundaries are stored per voice so the reader can switch
narrator without an API key or network connection at playback time.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import wave
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
LOCALE_ROOT = ROOT / "content" / "i18n" / "es-UY"
TEXTS_PATH = LOCALE_ROOT / "texts.json"
BASE_AUDIO_MAP_PATH = LOCALE_ROOT / "audios.json"
VOICES = {
    "valentina": "es-UY-ValentinaNeural",
    "mateo": "es-UY-MateoNeural",
}
SPOKEN_OVERRIDES = {
    "whatsapp_chat_intro": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_intro_historical": (
        "Ventana de chat de Uatsáp con estética antigua."
    ),
    "whatsapp_chat_intro_v31": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_intro_v33": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_continuation_v45": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_intro_pg020": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_intro_pg021": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_intro_pg029": "Ventana de chat de Uatsáp.",
    "whatsapp_chat_intro_pg070": "Ventana de chat de Uatsáp.",
    "pg001_n0002": "mil novecientos treinta",
    "pg001_n0004": "desafío profundo punto org",
    "pg001_n0004_easy_read": "desafío profundo punto org",
    "pg027_n0024": "Se trata de una maqueta del Titánik.",
    "pg027_n0024_easy_read": "Es una maqueta del Titánik.",
    "qz001_o0": "Una maqueta del Titánik, el famoso transatlántico.",
    "qz003_que": (
        "¿Cuál de éstas situaciones muestra que el acoso digital afecta a "
        "Javier, aunque intente ignorarlo?"
    ),
    "pg029_n0018_emoji01": "Emolli de mono.",
    "pg029_n0018_emoji01_easy_read": "Emolli de mono.",
    "pg069_n0009": "Emolli de cara gritando de miedo.",
    "pg069_n0009_easy_read": "Emolli de cara gritando de miedo.",
    "pg069_n0019_emoji01": "Emolli de cara haciendo una mueca.",
    "pg069_n0019_emoji01_easy_read": "Emolli de cara haciendo una mueca.",
    "pg068_im002": "Emolli de cara sonriente con lentes de sol.",
    "pg069_im002": "Emolli de cara gritando de miedo.",
    "pg070_im002": "Emolli de calavera.",
    "pg176177_n0006": "Signos de interrogación.",
    "pg176177_n0006_easy_read": "Signos de interrogación.",
    "pg176177_n0011": "Signos de interrogación.",
    "pg176177_n0011_easy_read": "Signos de interrogación.",
}

# Estos identificadores describen apariciones distintas de la misma locución.
# Cada voz reutiliza un único audio moderno y sus mismas marcas de tiempo.
WHATSAPP_SHARED_AUDIO_ALIASES = {
    "whatsapp_chat_intro_v31": "whatsapp_chat_intro",
    "whatsapp_chat_intro_v33": "whatsapp_chat_intro",
    "whatsapp_chat_continuation_v45": "whatsapp_chat_intro",
    "whatsapp_chat_intro_pg020": "whatsapp_chat_intro",
    "whatsapp_chat_intro_pg021": "whatsapp_chat_intro",
    "whatsapp_chat_intro_pg029": "whatsapp_chat_intro",
    "whatsapp_chat_intro_pg070": "whatsapp_chat_intro",
}


def canonical_audio_id(asset_id: str) -> str:
    return WHATSAPP_SHARED_AUDIO_ALIASES.get(asset_id, asset_id)

EMOJI_BOUNDARY_ASSETS: set[str] = set()


def spoken_text(asset_id: str, text: str) -> str:
    value = SPOKEN_OVERRIDES.get(asset_id, text)
    # INSTRUCCIÓN FONÉTICA OBLIGATORIA PARA EL TTS:
    # pronunciar «UatsÁP», con la ÚNICA sílaba tónica al final («sáp»).
    # Nunca enviar la grafía comercial «WhatsApp»: Edge la pronuncia
    # «uÁtsap», desplazando incorrectamente el acento a la primera sílaba.
    # Tampoco agregar una /e/ final: debe terminar exactamente en /p/.
    return re.sub(r"^[✅❌]\s*", "", value).strip()


async def synthesize(
    voice_key: str,
    voice_name: str,
    asset_id: str,
    text: str,
    semaphore: asyncio.Semaphore,
    missing_only: bool,
    existing_timings: dict[str, list[dict[str, float | str]]],
) -> tuple[str, list[dict[str, float | str]]]:
    voice_root = LOCALE_ROOT / "voices" / voice_key
    narration = spoken_text(asset_id, text)
    silent = not narration
    extension = ".wav" if silent else ".mp3"
    destination = voice_root / "audio" / f"{asset_id}{extension}"
    temporary = destination.with_suffix(extension + ".part")
    if (
        missing_only
        and destination.exists()
        and destination.stat().st_size > 0
        and asset_id in existing_timings
    ):
        print(f"skip {destination.relative_to(ROOT)}")
        return asset_id, existing_timings[asset_id]

    destination.parent.mkdir(parents=True, exist_ok=True)
    if silent:
        # A few Easy Read IDs intentionally suppress their source sentence.
        # Store a short local WAV and no word boundaries; sending an empty
        # string to Edge correctly yields no stream and must not be retried.
        temporary.unlink(missing_ok=True)
        with wave.open(str(temporary), "wb") as audio_file:
            audio_file.setnchannels(1)
            audio_file.setsampwidth(2)
            audio_file.setframerate(24_000)
            audio_file.writeframes(bytes(int(24_000 * 0.12) * 2))
        os.replace(temporary, destination)
        print(destination.relative_to(ROOT))
        return asset_id, []
    async with semaphore:
        for attempt in range(5):
            timings: list[dict[str, float | str]] = []
            try:
                temporary.unlink(missing_ok=True)
                with temporary.open("wb") as audio_file:
                    communicate = edge_tts.Communicate(
                        narration,
                        voice_name,
                        boundary="WordBoundary",
                    )
                    async for chunk in communicate.stream():
                        if chunk["type"] == "audio":
                            audio_file.write(chunk["data"])
                        elif chunk["type"] == "WordBoundary":
                            start = float(chunk["offset"]) / 10_000_000
                            duration = float(chunk["duration"]) / 10_000_000
                            boundary_text = str(chunk["text"])
                            if boundary_text.casefold() == "whatsapp":
                                boundary_text = "Uatsáp"
                            timings.append(
                                {
                                    "text": boundary_text,
                                    "start": round(start, 4),
                                    "end": round(start + duration, 4),
                                }
                            )
                if not temporary.exists() or temporary.stat().st_size == 0:
                    raise RuntimeError("empty audio response")
                if asset_id in EMOJI_BOUNDARY_ASSETS and len(timings) >= 4:
                    # Keep the visible emoji as one semantic highlighting unit,
                    # while its audio explicitly says “emolli de un mono”.
                    visible_prefix = text.split("🐒", 1)[0]
                    prefix_word_count = len(re.findall(r"\w+", visible_prefix))
                    emoji_start = timings[prefix_word_count]["start"]
                    emoji_end = timings[-1]["end"]
                    timings = timings[:prefix_word_count] + [
                        {"text": "🐒", "start": emoji_start, "end": emoji_end}
                    ]
                os.replace(temporary, destination)
                print(destination.relative_to(ROOT))
                return asset_id, timings
            except Exception:
                temporary.unlink(missing_ok=True)
                if attempt == 4:
                    raise
                await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"could not generate {asset_id}")


async def generate_voice(
    voice_key: str,
    selected_assets: set[str] | None,
    missing_only: bool,
    concurrency: int,
    version: str,
) -> None:
    texts: dict[str, str] = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    base_audio_map: dict[str, str] = json.loads(
        BASE_AUDIO_MAP_PATH.read_text(encoding="utf-8")
    )
    voice_root = LOCALE_ROOT / "voices" / voice_key
    timings_path = voice_root / "timecodes.json"
    existing_timings = (
        json.loads(timings_path.read_text(encoding="utf-8"))
        if timings_path.exists()
        else {}
    )
    unknown = sorted((selected_assets or set()) - set(texts))
    if unknown:
        raise SystemExit("Unknown asset ids: " + ", ".join(unknown))
    if selected_assets is not None:
        selected_assets = {canonical_audio_id(asset_id) for asset_id in selected_assets}
    assets = {
        asset_id: text
        for asset_id, text in texts.items()
        if selected_assets is None or asset_id in selected_assets
    }

    semaphore = asyncio.Semaphore(max(1, concurrency))
    merged_timings = dict(existing_timings)

    def write_checkpoint() -> None:
        """Publish only complete files, so interrupted runs stay playable."""
        audio_root = voice_root / "audio"
        completed_ids = {
            path.stem
            for pattern in ("*.mp3", "*.wav")
            for path in audio_root.glob(pattern)
            if path.stat().st_size > 0 and path.stem in texts
        }
        audio_map = {
            asset_id: (
                f"voices/{voice_key}/audio/{asset_id}"
                f"{'.wav' if not spoken_text(asset_id, texts[asset_id]) else '.mp3'}"
                f"?v={version}-{voice_key}"
            )
            for asset_id in texts
            if asset_id in completed_ids and asset_id in merged_timings
        }
        for alias_id, source_id in WHATSAPP_SHARED_AUDIO_ALIASES.items():
            if source_id in completed_ids and source_id in merged_timings:
                audio_map[alias_id] = (
                    f"voices/{voice_key}/audio/{source_id}.mp3"
                    f"?v={version}-{voice_key}"
                )
                merged_timings[alias_id] = merged_timings[source_id]

        voice_root.mkdir(parents=True, exist_ok=True)
        (voice_root / "audios.json").write_text(
            json.dumps(audio_map, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        timings_path.write_text(
            json.dumps(merged_timings, ensure_ascii=False, separators=(",", ":")) + "\n",
            encoding="utf-8",
        )

    asset_items = sorted(assets.items())
    batch_size = 120
    for start in range(0, len(asset_items), batch_size):
        batch = asset_items[start:start + batch_size]
        results = await asyncio.gather(
            *(
                synthesize(
                    voice_key,
                    VOICES[voice_key],
                    asset_id,
                    text,
                    semaphore,
                    missing_only,
                    merged_timings,
                )
                for asset_id, text in batch
            )
        )
        merged_timings.update(dict(results))
        write_checkpoint()
        print(
            f"checkpoint {voice_key}: "
            f"{min(start + len(batch), len(asset_items))}/{len(asset_items)}"
        )

    if not asset_items:
        write_checkpoint()
    print(voice_root.relative_to(ROOT))


async def main_async(args: argparse.Namespace) -> None:
    for voice_key in args.voice or list(VOICES):
        await generate_voice(
            voice_key,
            set(args.asset) if args.asset else None,
            args.missing_only,
            args.concurrency,
            args.version,
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", action="append", choices=sorted(VOICES))
    parser.add_argument("--asset", action="append")
    parser.add_argument("--missing-only", action="store_true")
    parser.add_argument("--concurrency", type=int, default=4)
    parser.add_argument("--version", default="45-final-2")
    args = parser.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
