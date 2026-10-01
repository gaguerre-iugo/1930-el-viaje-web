"""Extrae las respuestas de las actividades a un archivo aparte.

Las actividades llevan la clave de corrección en el propio HTML: en el atributo
`data-correct` de cada opción y, en algunos archivos, también en
`data-correct-answers` sobre la sección. Eso deja la respuesta a la vista en el
código fuente de la lección (Ctrl+U, copiar y pegar, o cualquier lectura del
markup).

Este script:

1. lee las secciones `activity_quiz` de los archivos de actividad;
2. escribe `content/i18n/es-UY/quiz-answers.json` con el mapa
   `sección → { opción: esCorrecta }`, en orden de documento;
3. quita `data-correct` y `data-correct-answers` del HTML.

Uso:

    python3 tools/extract_quiz_answers.py --check     # sólo informa diferencias
    python3 tools/extract_quiz_answers.py             # escribe el JSON y limpia

`--check` no modifica nada: sirve para verificar que el HTML ya está limpio y
que el JSON coincide con lo que había (integración continua).

El libro es offline: esto es disuasión, no seguridad. Cualquiera con las
herramientas del navegador puede leer el JSON. Lo que evita es que la respuesta
viaje dentro del HTML de la lección.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "content" / "i18n" / "es-UY" / "quiz-answers.json"

SECCION = re.compile(
    r"<section\b[^>]*data-section-type=\"(?:activity_quiz|quiz_sequence)\"[^>]*>",
    re.S | re.I,
)
ATRIBUTO_ID = re.compile(r"data-(?:section-)?id=\"([^\"]+)\"")
ATRIBUTO_RESPUESTAS = re.compile(r"\s+data-correct-answers='([^']*)'")
ATRIBUTO_CORRECTA = re.compile(r"\s+data-correct=\"(true|false)\"")
# Las etiquetas de opción no siempre tienen los atributos en el mismo orden.
ETIQUETA = re.compile(r"<label\b[^>]*>", re.S | re.I)
ITEM = re.compile(r"data-activity-item=\"([^\"]+)\"")
CORRECTA = re.compile(r"data-correct=\"(true|false)\"")
# Las actividades del export no llevan `data-activity-item` en la etiqueta: la
# opción se identifica por su input o por el id de su devolución (`qz007_o0_exp`).
EXPLICACION = re.compile(r"data-explanation-id=\"([^\"]+)\"")
INPUT_VALOR = re.compile(r"<input\b[^>]*value=\"([^\"]+)\"", re.S | re.I)


def archivos_de_actividad() -> list[Path]:
    archivos = []
    for ruta in sorted(RAIZ.glob("*.html")):
        texto = ruta.read_text(encoding="utf-8")
        if "activity_quiz" in texto or "quiz_sequence" in texto:
            archivos.append(ruta)
    return archivos


def clave_de_etiqueta(etiqueta: str) -> str | None:
    item = ITEM.search(etiqueta)
    if item:
        return item.group(1)
    explicacion = EXPLICACION.search(etiqueta)
    if explicacion:
        return re.sub(r"_exp$", "", explicacion.group(1))
    valor = INPUT_VALOR.search(etiqueta)
    if valor:
        return valor.group(1)
    return None


def respuestas_de_seccion(seccion: str) -> dict[str, bool]:
    """Mapa opción → es correcta, en orden de documento."""
    respuestas: dict[str, bool] = {}
    atributo = ATRIBUTO_RESPUESTAS.search(seccion)
    if atributo:
        try:
            crudo = json.loads(html.unescape(atributo.group(1)))
        except json.JSONDecodeError:
            crudo = {}
        for clave, valor in crudo.items():
            respuestas[str(clave)] = bool(valor)
    for etiqueta in ETIQUETA.findall(seccion):
        correcta = CORRECTA.search(etiqueta)
        if not correcta:
            continue
        clave = clave_de_etiqueta(etiqueta)
        if clave:
            respuestas.setdefault(clave, correcta.group(1) == "true")
    return respuestas


def extraer() -> tuple[dict[str, dict[str, bool]], list[Path]]:
    catalogo: dict[str, dict[str, bool]] = {}
    archivos = archivos_de_actividad()
    for ruta in archivos:
        texto = ruta.read_text(encoding="utf-8")
        secciones = list(SECCION.finditer(texto))
        for indice, apertura in enumerate(secciones):
            identificador = ATRIBUTO_ID.search(apertura.group(0))
            if not identificador:
                continue
            # El contenido va desde esta apertura hasta la próxima sección de
            # actividad, así no importa cuántas secciones anidadas haya.
            fin = secciones[indice + 1].start() if indice + 1 < len(secciones) else len(texto)
            respuestas = respuestas_de_seccion(texto[apertura.start() : fin])
            if respuestas:
                catalogo[identificador.group(1)] = respuestas
    return catalogo, archivos


def limpiar(texto: str) -> tuple[str, int]:
    limpio, respuestas_quitadas = ATRIBUTO_RESPUESTAS.subn("", texto)
    limpio, opciones_quitadas = ATRIBUTO_CORRECTA.subn("", limpio)
    return limpio, respuestas_quitadas + opciones_quitadas


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="no escribe: sólo informa")
    argumentos = parser.parse_args()

    catalogo, archivos = extraer()
    opciones = sum(len(respuestas) for respuestas in catalogo.values())
    print(f"actividades: {len(catalogo)} · opciones con respuesta: {opciones} · archivos: {len(archivos)}")

    # Cuántos atributos hay todavía en el HTML.
    restantes = 0
    for ruta in archivos:
        texto = ruta.read_text(encoding="utf-8")
        restantes += len(ATRIBUTO_CORRECTA.findall(texto))
        restantes += len(ATRIBUTO_RESPUESTAS.findall(texto))
    print(f"atributos de respuesta todavía en el HTML: {restantes}")

    esperado = json.dumps(catalogo, ensure_ascii=False, indent=2) + "\n"
    actual = DESTINO.read_text(encoding="utf-8") if DESTINO.exists() else ""

    if argumentos.check:
        problemas = []
        # Después de la migración el HTML no debe llevar ninguna respuesta.
        if restantes:
            problemas.append(f"quedan {restantes} atributos de respuesta en el HTML")
        # Y lo que todavía esté en el HTML tiene que coincidir con el JSON.
        try:
            guardado = json.loads(actual) if actual else {}
        except json.JSONDecodeError:
            guardado = {}
            problemas.append("content/i18n/es-UY/quiz-answers.json no es JSON válido")
        for actividad, respuestas in catalogo.items():
            if actividad not in guardado:
                problemas.append(f"{actividad} tiene respuestas en el HTML y no está en el JSON")
            elif guardado[actividad] != respuestas:
                problemas.append(f"{actividad}: el JSON no coincide con el HTML")
        faltantes = [clave for clave in guardado if clave not in catalogo]
        if restantes == 0 and faltantes:
            print(f"  · el JSON cubre {len(guardado)} actividades (el HTML ya no aporta ninguna)")
        for problema in problemas:
            print(f"  ✗ {problema}")
        if problemas:
            return 1
        print(f"  ✓ HTML limpio · el JSON cubre {len(guardado)} actividades y {sum(len(v) for v in guardado.values())} opciones")
        return 0

    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(esperado, encoding="utf-8")
    print(f"escrito: {DESTINO.relative_to(RAIZ)}")

    limpiados = 0
    for ruta in archivos:
        texto = ruta.read_text(encoding="utf-8")
        limpio, quitados = limpiar(texto)
        if quitados:
            ruta.write_text(limpio, encoding="utf-8")
            limpiados += 1
            print(f"  limpiado: {ruta.name} ({quitados} atributos)")
    print(f"archivos limpiados: {limpiados}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
