"""Detalles tipográficos del contenido (revisión UX, punto 23).

Busca en las páginas del libro:

- comillas que no son las del libro: rectas (") o simples ('), y comillas
  tipográficas mezcladas con españolas («»);
- guiones y puntos suspensivos mal formados (-- en lugar de —, ... en lugar de …);
- espacios dobles y espacios antes de signos de puntuación;
- saltos de línea duros dentro de un párrafo (`<br>`), que en un libro reflowable
  cortan mal cuando cambia el ancho de columna.

Uso:

    python3 tools/audit_typo.py             # informe
    python3 tools/audit_typo.py --check     # falla si hay algo (para validaciones)
    python3 tools/audit_typo.py --ejemplos 12
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINAS = sorted(RAIZ.glob("pg*.html"))

# Cada patrón: nombre, expresión y explicación.
PATRONES = [
    ("comilla recta doble", re.compile(r'"'), "usar «» o “” según el libro"),
    ("comilla recta simple", re.compile(r"'"), "usar ‘ ’ o ’"),
    ("comillas inglesas", re.compile(r"[“”]"), "el libro usa «»"),
    ("comilla simple tipográfica", re.compile(r"[‘’]"), "revisar si corresponde"),
    ("guion doble", re.compile(r"(?<!-)--(?!-)"), "usar — (raya)"),
    ("puntos suspensivos", re.compile(r"\.\.\."), "usar …"),
    ("espacio doble", re.compile(r"[^\s>] {2,}[^\s<]"), "un solo espacio"),
    ("espacio antes de puntuación", re.compile(r"\s+[,;.!?]"), "sin espacio previo"),
    ("salto duro", re.compile(r"<br\s*/?>"), "en reflow corta mal"),
    ("espacio duro", re.compile(r"&nbsp;|\u00a0"), "revisar si es necesario"),
]


def texto_de(ruta: Path) -> str:
    """Devuelve sólo el texto visible: sin marcado, estilos ni scripts.

    Los primeros conteos estaban dominados por las comillas de los atributos HTML,
    así que el análisis tiene que mirar el contenido, no el marcado.
    """
    crudo = ruta.read_text(encoding="utf-8", errors="replace")
    # Fuera el contenido que no se ve.
    crudo = re.sub(r"<script\b.*?</script>", " ", crudo, flags=re.DOTALL | re.IGNORECASE)
    crudo = re.sub(r"<style\b.*?</style>", " ", crudo, flags=re.DOTALL | re.IGNORECASE)
    # La cabecera no se muestra en el libro.
    crudo = re.sub(r"<head\b.*?</head>", " ", crudo, flags=re.DOTALL | re.IGNORECASE)
    # Los cortes de línea del marcado no son texto: se marcan aparte.
    crudo = re.sub(r"<br\s*/?>", " \u0001 ", crudo, flags=re.IGNORECASE)
    # Las etiquetas cortan el texto: se reemplazan por un salto (si no, dos
    # etiquetas contiguas parecerían un espacio doble).
    texto = re.sub(r"<[^>]+>", "\n", crudo)
    return texto.replace("\u0001", "<br>")


def analizar(limite_ejemplos: int) -> tuple[int, int]:
    total = 0
    print("=== Detalles tipográficos por patrón ===")
    for nombre, patron, sugerencia in PATRONES:
        paginas: list[tuple[str, int]] = []
        ejemplos: list[str] = []
        for ruta in PAGINAS:
            texto = texto_de(ruta)
            encontrados = list(patron.finditer(texto))
            if not encontrados:
                continue
            paginas.append((ruta.name, len(encontrados)))
            if len(ejemplos) < limite_ejemplos:
                for coincidencia in encontrados[: max(1, limite_ejemplos - len(ejemplos))]:
                    inicio = max(0, coincidencia.start() - 40)
                    contexto = texto[inicio : coincidencia.end() + 40].replace("\n", " ")
                    ejemplos.append(f"{ruta.name}: …{contexto.strip()}…")
        cantidad = sum(cantidad for _, cantidad in paginas)
        total += cantidad
        if not cantidad:
            continue
        print(f"\n{nombre}: {cantidad} en {len(paginas)} páginas · {sugerencia}")
        for archivo, cuenta in paginas[:6]:
            print(f"    {archivo}: {cuenta}")
        for ejemplo in ejemplos[:limite_ejemplos]:
            print(f"      · {ejemplo[:150]}")
    return total, len(PAGINAS)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="falla si hay algo")
    parser.add_argument("--ejemplos", type=int, default=6, help="ejemplos por patrón")
    argumentos = parser.parse_args()

    if not PAGINAS:
        print("no se encontraron páginas pg*.html")
        return 1

    total, paginas = analizar(argumentos.ejemplos)
    print(f"\npáginas analizadas: {paginas}")
    print(f"coincidencias totales: {total}")
    if argumentos.check and total:
        print("FALLA: hay detalles tipográficos pendientes")
        return 1
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
