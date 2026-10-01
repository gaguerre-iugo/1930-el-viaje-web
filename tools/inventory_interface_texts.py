"""Inventario de textos de interfaz y detección de formas no voseantes (punto 7).

Junta:

- las 144 claves de `assets/interface_translations/interface_translations.json`,
  que es el catálogo que resuelve el runtime;
- los textos propios del motor (`assets/reflow-book.js`) que ve el lector.

Y marca los que están en **usted** («Use», «Active», «Seleccione»…) o en **tuteo**
(«Toca», «Elige», «Puedes»…) en lugar de voseo («Usá», «Activá», «Elegí»,
«Podés»).

Uso:

    python3 tools/inventory_interface_texts.py            # informe
    python3 tools/inventory_interface_texts.py --json     # para procesar
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CATALOGO = (
    RAIZ / "assets" / "interface_translations" / "es-UY" / "interface_translations.json"
)
MOTOR = RAIZ / "assets" / "reflow-book.js"

# Formas que delatan usted o tuteo. Se listan explícitamente para no marcar
# palabras del relato por parecido.
USTED = [
    "Use", "Active", "Seleccione", "Puede", "Habilite", "Ingrese", "Presione",
    "Elija", "Toque", "Desplace", "Escriba", "Marque", "Desactive", "Verifique",
    "Consulte", "Espere", "Continúe", "Cambie", "Ajuste", "Elija", "Vuelva",
    "Intente", "Recuerde", "Tenga", "Haga", "Cierre", "Abra",
]
TUTEO = [
    "Toca", "Elige", "Puedes", "Habilita", "Activa", "Selecciona", "Usa",
    "Desliza", "Escribe", "Marca", "Desactiva", "Verifica", "Consulta",
    "Espera", "Continúa", "Cambia", "Ajusta", "Vuelve", "Intenta", "Recuerda",
    "Ten", "Haz", "Cierra", "Abre", "Arrastra", "Presiona", "Ingresa",
]
PATRON_USTED = re.compile(r"\b(" + "|".join(USTED) + r")\b")
PATRON_TUTEO = re.compile(r"\b(" + "|".join(TUTEO) + r")\b")
# Voseo correcto: imperativos y presentes terminados en -á, -é, -í, -ás, -és, -ís.
PATRON_VOSEO = re.compile(r"\b\w+(?:á|é|í|ás|és|ís)\b")


def clasificar(texto: str) -> str:
    if not isinstance(texto, str) or len(texto.strip()) < 3:
        return "neutro"
    if PATRON_USTED.search(texto):
        return "usted"
    if PATRON_TUTEO.search(texto):
        return "tuteo"
    return "neutro"


def textos_del_motor() -> list[tuple[str, str]]:
    """Literales visibles del motor: cadenas con espacios y letras acentuadas."""
    fuente = MOTOR.read_text(encoding="utf-8")
    encontrados: list[tuple[str, str]] = []
    for numero, linea in enumerate(fuente.splitlines(), start=1):
        for cadena in re.findall(r"'([^'\\]{12,})'|\"([^\"\\]{12,})\"", linea):
            texto = (cadena[0] or cadena[1]).strip()
            if not re.search(r"[áéíóúñ¿¡]", texto) and " " not in texto:
                continue
            encontrados.append((f"reflow-book.js:{numero}", texto))
    return encontrados


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="salida para procesar")
    parser.add_argument(
        "--check",
        action="store_true",
        help="falla si queda algún texto sin voseo (no modifica nada)",
    )
    argumentos = parser.parse_args()

    catalogo = json.loads(CATALOGO.read_text(encoding="utf-8"))
    filas = []
    for clave, valor in catalogo.items():
        if not isinstance(valor, str):
            continue
        filas.append(
            {
                "origen": f"interface_translations.json · {clave}",
                "texto": valor,
                "clase": clasificar(valor),
            }
        )
    for origen, texto in textos_del_motor():
        clase = clasificar(texto)
        if clase != "neutro":
            filas.append({"origen": origen, "texto": texto, "clase": clase})

    pendientes = [fila for fila in filas if fila["clase"] != "neutro"]

    # El tutorial quedó como estaba por decisión editorial: no se reescribe, pero
    # sí se informa aparte para que no se pierda de vista.
    del_tutorial = [fila for fila in pendientes if "tutorial" in fila["origen"]]
    pendientes = [fila for fila in pendientes if "tutorial" not in fila["origen"]]

    if argumentos.json:
        print(json.dumps(pendientes, ensure_ascii=False, indent=2))
        return 0

    if argumentos.check:
        print(f"textos de interfaz revisados: {len(filas)}")
        print(f"  del tutorial (se dejan como están): {len(del_tutorial)}")
        for fila in pendientes:
            print(f"  ✗ [{fila['clase']}] {fila['origen']}: {fila['texto'][:80]}")
        if pendientes:
            print(f"  quedan {len(pendientes)} textos sin voseo")
            return 1
        print("  ✓ todos los textos de interfaz están en voseo")
        return 0

    print(f"textos de interfaz revisados: {len(filas)}")
    print(f"  en usted: {sum(1 for f in filas if f['clase'] == 'usted')}")
    print(f"  en tuteo: {sum(1 for f in filas if f['clase'] == 'tuteo')}")
    print(f"  neutros:  {sum(1 for f in filas if f['clase'] == 'neutro')}")
    print("\npara pasar a voseo:")
    for fila in pendientes:
        marca = "USTED" if fila["clase"] == "usted" else "TUTEO"
        print(f"  [{marca}] {fila['origen']}\n      {fila['texto'][:110]}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
