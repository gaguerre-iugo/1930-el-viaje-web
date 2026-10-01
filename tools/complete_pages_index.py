"""Completa content/pages.json con las secciones que el libro monta y no listaba.

El motor arma el orden con su propia lista (`var sections = [...]` en
assets/reflow-book.js), y `pages.json` es el índice que leen el runtime, el índice
del lector y las herramientas. Tres secciones se veían en el libro sin figurar
acá: las últimas de «Sobre el libro» (créditos, agradecimientos y colofón).

No se agrega `pg224_collaborators`: esa página la construye el motor en tiempo de
ejecución y no tiene archivo de origen, así que no es una sección de contenido.

Se agregan al final, en el orden en que el libro las muestra, y el script es
idempotente: si ya están, no hace nada.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINAS = RAIZ / "content" / "pages.json"
AGREGAR = [
    "pg225_sec001",
    "pg226_sec001",
    "pg227_sec001",
]


def main() -> int:
    actual = json.loads(PAGINAS.read_text(encoding="utf-8"))
    # `pg224_collaborators` no es una sección de contenido: la genera el motor.
    deseado = [entrada for entrada in actual if entrada["section_id"] != "pg224_collaborators"]
    existentes = {entrada["section_id"] for entrada in deseado}
    for seccion in AGREGAR:
        if seccion not in existentes:
            deseado.append({"section_id": seccion, "href": f"index.html#{seccion}"})
    if deseado == actual:
        print(f"sin cambios: pages.json ya está al día ({len(actual)} entradas)")
        return 0
    PAGINAS.write_text(
        json.dumps(deseado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"entradas: {len(actual)} → {len(deseado)}")
    print(f"últimas cinco: {', '.join(e['section_id'] for e in deseado[-5:])}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
