#!/usr/bin/env python3
"""Generate the chapter 3–8 assessment sections and register their text."""

from __future__ import annotations

import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEXTS_PATH = ROOT / "content/i18n/es-UY/texts.json"

QUIZZES = [
    {
        "chapter": 3,
        "section": "qz010",
        "questions": [
            (
                "recuperación de información explícita",
                "¿Quién defiende a Javier cuando el Loro y sus compañeros lo atacan?",
                [
                    ("El Rumano.", False, "No. El Rumano ayuda a Javier en 1930, pero no interviene en este ataque del Loro."),
                    ("Federica.", True, "Correcto. Federica aparece, enfrenta al grupo y ayuda a Javier a ponerse de pie."),
                    ("Tomassino.", False, "No. Tomassino permanece en 1930 y no está presente cuando ocurre el ataque."),
                ],
            ),
            (
                "interpretación e inferencia",
                "¿Por qué Federica propone revisar los recortes del altillo después de escuchar a Javier?",
                [
                    ("Porque quiere venderlos por internet.", False, "No. Federica no piensa en vender los recortes."),
                    ("Porque espera encontrar pruebas o una explicación de lo que le ocurrió a Javier.", True, "Correcto. Federica toma en serio el relato y busca en los recortes una clave que permita comprender el viaje."),
                    ("Porque necesita preparar una tarea de Geografía.", False, "No. La búsqueda se relaciona con el viaje en el tiempo, no con una tarea de clase."),
                ],
            ),
            (
                "reflexión y evaluación",
                "¿Qué conducta de Federica demuestra mejor que es una amiga confiable?",
                [
                    ("Escucha un relato increíble sin burlarse y ayuda a buscar evidencias.", True, "Correcto. Federica combina confianza, escucha y una búsqueda razonada de pruebas."),
                    ("Se interesa solamente por conocer a los gemelos.", False, "No. Su curiosidad por los gemelos no es la mejor prueba de apoyo a Javier."),
                    ("Decide que Javier está loco antes de revisar lo ocurrido.", False, "No. Aunque considera distintas posibilidades, no lo descalifica ni lo abandona."),
                ],
            ),
        ],
    },
    {
        "chapter": 4,
        "section": "qz013",
        "questions": [
            (
                "recuperación de información explícita",
                "¿Qué descubre Federica al investigar a la mujer que dice ser Josephine Baker?",
                [
                    ("Que es una impostora.", True, "Correcto. Los datos históricos que encuentra Federica no coinciden con el relato de la mujer del barco."),
                    ("Que viaja para jugar el Mundial.", False, "No. Josephine Baker no integra ninguna selección de fútbol."),
                    ("Que es pariente del capitán.", False, "No. La investigación no establece ningún parentesco con el capitán."),
                ],
            ),
            (
                "interpretación e inferencia",
                "¿Por qué Javier cuida la batería del celular durante el viaje?",
                [
                    ("Porque quiere usarlo solamente para sacar fotografías.", False, "No. Las fotografías son útiles, pero no son la razón principal."),
                    ("Porque el celular le permite mantener el contacto con Federica a través del tiempo.", True, "Correcto. Sin una forma segura de cargarlo, conservar la batería es esencial para recibir información desde 2030."),
                    ("Porque teme que el capitán le cobre por usarlo.", False, "No. El capitán desconoce ese aparato y no puede cobrarle por su uso."),
                ],
            ),
            (
                "reflexión y evaluación",
                "¿Qué acción muestra mejor cómo la investigación histórica orienta las decisiones de los personajes?",
                [
                    ("Federica compara fechas y datos de Josephine Baker antes de advertir a Javier.", True, "Correcto. La verificación de fuentes convierte una sospecha en información útil para actuar."),
                    ("Javier esconde el celular cada vez que alguien pasa cerca.", False, "No. Esa acción lo protege, pero no depende de una investigación histórica."),
                    ("Los gemelos observan el mar desde la cubierta.", False, "No. Contemplar el mar no aporta evidencia para resolver el conflicto."),
                ],
            ),
        ],
    },
    {
        "chapter": 5,
        "section": "qz016",
        "questions": [
            (
                "recuperación de información explícita",
                "¿Quién les advierte que existe un plan para asesinar al rey Carol II?",
                [
                    ("El Rumano.", True, "Correcto. El Rumano les transmite la advertencia y les pide que hablen con el capitán."),
                    ("El cocinero.", False, "No. El cocinero los alimenta, pero no les entrega esa información."),
                    ("Jules Rimet.", False, "No. Jules Rimet no es quien descubre ni comunica el plan."),
                ],
            ),
            (
                "interpretación e inferencia",
                "¿Por qué los jóvenes deciden contarle al capitán lo que saben?",
                [
                    ("Porque es la persona con autoridad para proteger al rey y actuar dentro del barco.", True, "Correcto. El peligro es urgente y el capitán puede movilizar a la tripulación."),
                    ("Porque quieren que los deje manejar el Conte Verde.", False, "No. Nunca pretenden dirigir el barco."),
                    ("Porque desean recibir una recompensa económica.", False, "No. Actúan para evitar el crimen, no para ganar dinero."),
                ],
            ),
            (
                "reflexión y evaluación",
                "¿Qué hecho confirma con más fuerza que la advertencia sobre la conspiración era verdadera?",
                [
                    ("La tripulación detiene a los implicados y el rey continúa con vida.", True, "Correcto. Las detenciones y la seguridad del rey confirman que el peligro era real."),
                    ("Javier se queda sin batería en el celular.", False, "No. La falta de batería aumenta la tensión, pero no prueba la conspiración."),
                    ("Antonella se esconde debajo de una mesa.", False, "No. Su miedo es comprensible, pero no constituye una prueba."),
                ],
            ),
        ],
    },
    {
        "chapter": 6,
        "section": "qz019",
        "questions": [
            (
                "recuperación de información explícita",
                "¿Qué nombre usa Federica para presentarse ante Tomassino y Antonella?",
                [
                    ("Vanja.", True, "Correcto. Federica elige el nombre Vanja y dice que tiene antepasados rusos."),
                    ("Josephine.", False, "No. Josephine es otra pasajera del Conte Verde."),
                    ("Rosario.", False, "No. Rosario es la madre de Javier."),
                ],
            ),
            (
                "interpretación e inferencia",
                "¿Por qué Javier y Federica inventan un nombre, un origen y un acento para ella?",
                [
                    ("Para que pueda mezclarse con los pasajeros de 1930 sin revelar de dónde viene.", True, "Correcto. La identidad inventada reduce el riesgo de que sus palabras y su procedencia despierten sospechas."),
                    ("Para participar en una obra de teatro del barco.", False, "No. La representación no forma parte de un espectáculo."),
                    ("Para convencer al capitán de que le venda un pasaje.", False, "No. Federica no intenta comprar un pasaje."),
                ],
            ),
            (
                "reflexión y evaluación",
                "¿Qué dificultad de viajar al pasado se hace más evidente con la llegada de Federica?",
                [
                    ("Adaptar la ropa, el lenguaje y la conducta para no alterar la historia.", True, "Correcto. Federica debe controlar lo que dice y cómo actúa para parecer una joven de la época."),
                    ("Aprender a conducir un transatlántico moderno.", False, "No. Ninguno de los jóvenes conduce el barco."),
                    ("Encontrar conexión a internet en cada camarote.", False, "No. El desafío central no es conectarse a internet, sino ocultar que vienen del futuro."),
                ],
            ),
        ],
    },
    {
        "chapter": 7,
        "section": "qz022",
        "questions": [
            (
                "recuperación de información explícita",
                "¿Qué peligro logran evitar los jóvenes y sus aliados?",
                [
                    ("El secuestro de Josephine y el desvío del Conte Verde.", True, "Correcto. La conspiración buscaba anular a Josephine y apartar al barco de su rumbo."),
                    ("Una tormenta que iba a hundir el barco.", False, "No. El conflicto principal no es una tormenta."),
                    ("La cancelación de un partido entre Francia y México.", False, "No. Ese partido no se disputa a bordo."),
                ],
            ),
            (
                "interpretación e inferencia",
                "¿Por qué el capitán amenaza al Káiser con hacerle beber los líquidos encontrados?",
                [
                    ("Para obligarlo a revelar que conoce el plan y quebrar su falsa inocencia.", True, "Correcto. El miedo del Káiser ante las botellitas demuestra que sabe qué contienen."),
                    ("Para celebrar que el barco sigue su rumbo.", False, "No. Los líquidos no son bebidas de celebración."),
                    ("Para curarlo de una enfermedad del viaje.", False, "No. El capitán sabe que forman parte de la conspiración."),
                ],
            ),
            (
                "reflexión y evaluación",
                "¿Qué explica mejor que el plan para salvar a Josephine tenga éxito?",
                [
                    ("La cooperación entre los jóvenes, Josephine, el Rumano, el capitán y la tripulación.", True, "Correcto. Cada participante aporta información, valentía o autoridad para detener a los conspiradores."),
                    ("La suerte de que los conspiradores abandonen el barco por sí solos.", False, "No. Los responsables son descubiertos y detenidos mediante un plan."),
                    ("La decisión de Javier de actuar completamente solo.", False, "No. El resultado depende del trabajo en equipo."),
                ],
            ),
        ],
    },
    {
        "chapter": 8,
        "section": "qz025",
        "questions": [
            (
                "recuperación de información explícita",
                "¿Qué les deja Federica a Tomassino y Antonella antes de despedirse?",
                [
                    ("Su celular y un cable para cargarlo.", True, "Correcto. Federica espera que así puedan seguir enviándose mensajes a través del tiempo."),
                    ("La medalla que recibió Javier.", False, "No. Javier conserva la medalla y la dedica al tío Arturo."),
                    ("Un pasaje de regreso a Francia.", False, "No. Los gemelos deben continuar hacia Peñarol."),
                ],
            ),
            (
                "interpretación e inferencia",
                "¿Por qué los gemelos y los amigos describen de manera distinta el puerto de Montevideo?",
                [
                    ("Porque están contemplando el mismo lugar desde 1930 y desde 2030 al mismo tiempo.", True, "Correcto. Cada pareja percibe las construcciones y los sonidos de su propia época."),
                    ("Porque una niebla cubre la mitad del puerto.", False, "No. La diferencia no se debe al clima."),
                    ("Porque Tomassino y Antonella nunca habían visto barcos.", False, "No. Los gemelos llevan días viajando en el Conte Verde."),
                ],
            ),
            (
                "reflexión y evaluación",
                "¿Qué idea resume mejor la despedida de los cuatro jóvenes?",
                [
                    ("La amistad puede unir personas separadas por un siglo y transformar lo que cada una comprende de su historia.", True, "Correcto. La aventura crea un vínculo que supera la distancia temporal y cambia a los cuatro."),
                    ("Los viajes solo tienen valor cuando producen una recompensa material.", False, "No. El valor principal está en los vínculos, el aprendizaje y la memoria compartida."),
                    ("Conocer el pasado impide volver a disfrutar el presente.", False, "No. Javier y Federica regresan con una comprensión más profunda de su presente."),
                ],
            ),
        ],
    },
]


def quiz_html(quiz: dict) -> str:
    chapter = quiz["chapter"]
    section = quiz["section"]
    articles = []
    base_number = int(section[2:])
    dimension_labels = [
        "Recuperación de información explícita",
        "Interpretación e inferencia",
        "Reflexión y evaluación",
    ]
    for offset, (dimension, question, options) in enumerate(quiz["questions"]):
        qid = f"qz{base_number + offset:03d}"
        option_html = []
        bank_html = []
        for index, (option, correct, explanation) in enumerate(options):
            option_html.append(
                f'''              <label class="quiz-option" data-correct="{str(correct).lower()}" data-explanation-id="{qid}_o{index}_exp">
                <input type="radio" name="{qid}" value="{qid}_o{index}">
                <span class="quiz-option-text" data-id="{qid}_o{index}">{html.escape(option)}</span>
              </label>'''
            )
            bank_html.append(
                f'              <span data-feedback-audio-id="{qid}_o{index}_exp">{html.escape(explanation)}</span>'
            )
        articles.append(
            f'''        <article class="quiz-panel" data-quiz-id="{qid}"
          data-reading-dimension="{dimension}"
          aria-labelledby="{qid}-question">
          <div class="quiz-card">
            <p class="quiz-kicker">Comprensión lectora · Pregunta {offset + 1} de 3</p>
            <p class="quiz-dimension">{dimension_labels[offset]}</p>
            <p class="quiz-question" id="{qid}-question" data-id="{qid}_que">{html.escape(question)}</p>
            <div class="quiz-options" role="radiogroup" aria-labelledby="{qid}-question">
{chr(10).join(option_html)}
            </div>
            <div class="quiz-actions"><button class="quiz-submit" type="button" disabled>Enviar</button></div>
            <div class="quiz-feedback" tabindex="-1" role="status" aria-live="polite" aria-hidden="true"></div>
            <div class="quiz-explanation-bank" aria-hidden="true">
{chr(10).join(bank_html)}
            </div>
          </div>
        </article>'''
        )
    return f'''<!DOCTYPE html>
<html lang="es-UY">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Comprensión lectora — Capítulo {chapter}</title>
  <meta name="title-id" content="{section}" />
  <meta name="page-section-id" content="{22 + chapter}" />
  <link href="./content/tailwind_output.css" rel="stylesheet">
  <link href="./content/viewport-layout.css" rel="stylesheet">
  <link href="./assets/libs/fontawesome/css/all.min.css" rel="stylesheet">
  <link href="./assets/fonts.css" rel="stylesheet">
</head>
<body class="min-h-screen flex items-center justify-center">
  <main class="w-full">
    <h1 class="sr-only" id="page-heading">Comprensión lectora del capítulo {chapter}</h1>
    <div id="content" class="container content mx-auto max-w-6xl bg-white opacity-0">
      <section data-section-type="quiz_sequence" data-section-id="{section}"
        aria-label="Comprensión lectora del capítulo {chapter}: tres preguntas">

{chr(10).join(articles)}
      </section>
    </div>
  </main>

  <div class="relative z-50" id="interface-container"></div>
  <div class="relative z-50" id="nav-container"></div>
  <script src="./assets/reflow-redirect.js"></script>
  <script src="./assets/offline-preloader.js"></script>
  <script src="./assets/scorm.js"></script>
  <script src="./assets/base.bundle.local.js"></script>
</body>
</html>
'''


def main() -> None:
    texts = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    for quiz in QUIZZES:
        (ROOT / f"{quiz['section']}.html").write_text(quiz_html(quiz), encoding="utf-8")
        base_number = int(quiz["section"][2:])
        for offset, (_, question, options) in enumerate(quiz["questions"]):
            qid = f"qz{base_number + offset:03d}"
            texts[f"{qid}_que"] = question
            for index, (option, correct, explanation) in enumerate(options):
                texts[f"{qid}_o{index}"] = option
                prefix = "✅ Correcto. " if correct else "❌ No. "
                body = explanation
                if body.startswith("Correcto. "):
                    body = body[len("Correcto. "):]
                elif body.startswith("No. "):
                    body = body[len("No. "):]
                texts[f"{qid}_o{index}_exp"] = prefix + body
    TEXTS_PATH.write_text(
        json.dumps(texts, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
