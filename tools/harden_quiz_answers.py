#!/usr/bin/env python3
"""Endurece las actividades del punto 5.

Antes: cada opcion traia `data-explanation-id`, el banco `.quiz-explanation-bank`
con la devolucion completa (incluida la correcta, que empieza con «Correcto.») y
la clave de correccion vivia en `quiz-answers.json` como booleanos planos.

Ahora:
  1. se quita del HTML el banco de devoluciones y el `data-explanation-id`;
  2. la devolucion pasa a `content/i18n/es-UY/quiz-feedback.json`, que el motor
     pide recien al enviar la respuesta;
  3. la clave de correccion pasa a `content/i18n/es-UY/quiz-answers.json` como
     hash por opcion (no booleanos), y el motor la resuelve en memoria.

Uso:
    python tools/harden_quiz_answers.py            # dry-run
    python tools/harden_quiz_answers.py --apply
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "content" / "i18n" / "es-UY"
ANSWERS = I18N / "quiz-answers.json"
FEEDBACK = I18N / "quiz-feedback.json"

# Mismo algoritmo y sal que reflow-book.js (deterrente, no seguridad).
SALT = "1930-quiz-5"


def fnv1a32(text: str) -> str:
    value = 0x811C9DC5
    for byte in text.encode("utf-8"):
        value ^= byte
        value = (value * 0x01000193) & 0xFFFFFFFF
    return format(value, "08x")


def option_hash(option_key: str) -> str:
    return fnv1a32(SALT + "|" + option_key)


BANK_BLOCK = re.compile(
    r'\n\s*<div class="quiz-explanation-bank"[^>]*>.*?</div>', re.DOTALL
)
EXPLANATION_ID = re.compile(r'\s+data-explanation-id="[^"]*"')
BANK_SPAN = re.compile(
    r'<span data-feedback-audio-id="([^"]+)"[^>]*>(.*?)</span>', re.DOTALL
)
OPTION = re.compile(
    r'<label class="quiz-option"[^>]*data-explanation-id="([^"]+)"[^>]*>'
    r'.*?<input type="radio"[^>]*value="([^"]+)"',
    re.DOTALL,
)


def activity_files() -> list[Path]:
    return sorted(
        path
        for path in ROOT.glob("*.html")
        if re.match(r"^(qz\d+|quiz_final)\.html$", path.name)
    )


def build() -> tuple[dict, dict, dict[str, str]]:
    answers_plain = json.loads(ANSWERS.read_text(encoding="utf-8"))
    hashed: dict[str, list[str]] = {}
    feedback: dict[str, dict] = {}
    rewritten: dict[str, str] = {}

    for path in activity_files():
        raw = path.read_text(encoding="utf-8")
        activity = path.stem

        bank = {audio_id: text.strip() for audio_id, text in BANK_SPAN.findall(raw)}
        options = OPTION.findall(raw)

        fb_map: dict[str, dict] = {}
        correct_hashes: list[str] = []
        for explanation_id, option_key in options:
            text = bank.get(explanation_id, "")
            fb_map[option_key] = {"text": text, "audio": explanation_id}
            if answers_plain.get(activity, {}).get(option_key):
                correct_hashes.append(option_hash(option_key))
        if fb_map:
            feedback[activity] = fb_map
        if correct_hashes:
            hashed[activity] = sorted(correct_hashes)

        cleaned = BANK_BLOCK.sub("", raw)
        cleaned = EXPLANATION_ID.sub("", cleaned)
        rewritten[path.name] = cleaned

    return hashed, feedback, rewritten


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    hashed, feedback, rewritten = build()
    total_correct = sum(len(v) for v in hashed.values())
    total_feedback = sum(len(v) for v in feedback.values())
    print(f"actividades: {len(rewritten)}")
    print(f"   respuestas correctas hasheadas: {total_correct}")
    print(f"   devoluciones movidas al archivo : {total_feedback}")
    print(f"   ejemplos de hash: {list(hashed.values())[0][:2] if hashed else []}")

    if not args.apply:
        print("\n(dry-run; usar --apply)")
        return 0

    ANSWERS.write_text(
        json.dumps({"version": 2, "quizzes": hashed}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    FEEDBACK.write_text(
        json.dumps(feedback, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    for name, text in rewritten.items():
        (ROOT / name).write_text(text, encoding="utf-8")
    print("escrito quiz-answers.json, quiz-feedback.json y los 8 HTML")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
