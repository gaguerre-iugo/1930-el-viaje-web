"""Convierte a SVG los íconos del set de EVA que llegan como PNG.

El set se exporta en PNG (ocho tamaños por ícono) y este repositorio necesita SVG:
los íconos se embeben en `reflow-book.js` para que hereden `currentColor` y no
sumen pedidos. El trazado se hace sobre el PNG de 100 px y se normaliza al
`viewBox` de 24 que usa la interfaz (punto 24).

Uso:

    python3 tools/trace_eva_icons.py --carpeta "C:\\ruta\\a\\Eva" --check
    python3 tools/trace_eva_icons.py --carpeta "C:\\ruta\\a\\Eva"
    python3 tools/trace_eva_icons.py --inyectar        # sólo reembebe en el motor

`--check` sólo informa qué archivos cambiarían. `--inyectar` reescribe el bloque
de íconos embebidos de `assets/reflow-book.js` leyendo los SVG ya trazados, así
que no necesita la carpeta del export.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "assets" / "icons"

# Ícono de destino → archivo fuente del export (el de 100 px).
FUENTES = {
    "eva-menu.svg": "size=eva-icon-size-0-112.png",
    "eva-gear.svg": "size=eva-icon-size-0-91.png",
    "eva-close.svg": "size=eva-icon-size-0-2.png",
    "eva-play.svg": "size=eva-icon-size-0-4.png",
    "eva-pause.svg": "size=eva-icon-size-0-41.png",
}

LADO = 24


def trazar(ruta: Path) -> tuple[str, int]:
    """Devuelve el path SVG en la grilla de 24 y la cantidad de nodos."""
    with Image.open(ruta) as original:
        imagen = original.convert("RGBA")
        ancho, alto = imagen.size
        alfa = imagen.split()[3]
        # potracer toma como figura los valores bajos de la máscara, así que se
        # invierte el alfa: medido contra el PNG de origen, la máscara invertida
        # reproduce el glifo con 98,8 % de coincidencia y la directa con 0,4 %.
        datos = (np.array(alfa) <= 128).astype(bool)

    trazo = potrace.Bitmap(datos)
    camino = trazo.trace()
    escala = LADO / max(ancho, alto)
    partes: list[str] = []

    for curva in camino:
        # Punto de arranque de la curva.
        inicio = curva.start_point
        partes.append(f"M{inicio.x * escala:.3f} {inicio.y * escala:.3f}")
        for segmento in curva:
            if segmento.is_corner:
                punto = segmento.c
                partes.append(f"L{punto.x * escala:.3f} {punto.y * escala:.3f}")
                fin = segmento.end_point
                partes.append(f"L{fin.x * escala:.3f} {fin.y * escala:.3f}")
            else:
                control_a = segmento.c1
                control_b = segmento.c2
                fin = segmento.end_point
                partes.append(
                    f"C{control_a.x * escala:.3f} {control_a.y * escala:.3f} "
                    f"{control_b.x * escala:.3f} {control_b.y * escala:.3f} "
                    f"{fin.x * escala:.3f} {fin.y * escala:.3f}"
                )
        partes.append("Z")

    nodos = sum(1 for curva in camino for _ in curva)
    return " ".join(partes), nodos


def envolver(nombre: str, path: str, nodos: int) -> str:
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" '
        'fill="currentColor" aria-hidden="true">\n'
        f"  <!-- Trazado del set de EVA ({FUENTES[nombre]}), normalizado al\n"
        f"       viewBox de 24 que usa la interfaz. {nodos} nodos. -->\n"
        f'  <path fill-rule="evenodd" d="{path}"/>\n'
        "</svg>\n"
    )


MOTOR = RAIZ / "assets" / "reflow-book.js"
INICIO = "/* eva-icons:start"
FIN = "/* eva-icons:end */"

# Clave en el motor → archivo de assets/icons.
CLAVES = {
    "menu": "eva-menu.svg",
    "gear": "eva-gear.svg",
    "close": "eva-close.svg",
    "play": "eva-play.svg",
    "pause": "eva-pause.svg",
    "stop": "eva-stop.svg",
    "prev": "eva-prev.svg",
    "next": "eva-next.svg",
}


def path_de_svg(ruta: Path) -> str:
    """Extrae el atributo `d` del primer path del archivo."""
    import re

    contenido = ruta.read_text(encoding="utf-8")
    coincidencia = re.search(r'd="([^"]+)"', contenido)
    return coincidencia.group(1) if coincidencia else ""


def inyectar_en_motor() -> None:
    """Reescribe el bloque de íconos embebidos de reflow-book.js."""
    texto = MOTOR.read_text(encoding="utf-8")
    inicio = texto.find(INICIO)
    fin = texto.find(FIN)
    if inicio < 0 or fin < 0:
        print("  ✗ no se encontraron los marcadores eva-icons en reflow-book.js")
        return
    fin += len(FIN)

    lineas = [
        INICIO + " — bloque generado por tools/trace_eva_icons.py --inyectar.",
        "     No editar a mano: los trazados salen de los SVG de assets/icons/ y se",
        "     verifican con tools/screen-test/verify-eva-icons.mjs. */",
        "  var uiFilledIcons = {",
    ]
    for clave, archivo in CLAVES.items():
        ruta = DESTINO / archivo
        if not ruta.exists():
            print(f"  ✗ falta {archivo} para la clave {clave}")
            return
        lineas.append(f"    {clave}:")
        lineas.append(f'      "{path_de_svg(ruta)}",')
    lineas.append("  };")
    lineas.append("  function uiIconFilled(name) {")
    lineas.append('    var path = uiFilledIcons[name] || "";')
    lineas.append("    return (")
    lineas.append(
        "      '<svg class=\"reflow-toolbar-svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" ' +"
    )
    lineas.append("      'aria-hidden=\"true\" focusable=\"false\">' +")
    lineas.append("      '<path fill-rule=\"evenodd\" d=\"' + path + '\"/></svg>'")
    lineas.append("    );")
    lineas.append("  }")
    lineas.append("  /* Para la verificación automatizada (verify-ui-icons.mjs). */")
    lineas.append("  window.__adtReflowIconPaths = uiFilledIcons;")
    lineas.append(FIN)

    MOTOR.write_text(texto[:inicio] + "\n".join(lineas) + texto[fin:], encoding="utf-8")
    print(f"  motor actualizado: {len(CLAVES)} íconos embebidos")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--carpeta",
        help="carpeta con el export de EVA (necesaria para trazar; no para --inyectar)",
    )
    parser.add_argument("--check", action="store_true", help="no escribe: sólo informa")
    parser.add_argument(
        "--inyectar",
        action="store_true",
        help="además, reescribe el bloque de íconos embebidos de assets/reflow-book.js",
    )
    argumentos = parser.parse_args()

    carpeta = Path(argumentos.carpeta) if argumentos.carpeta else None
    if carpeta is not None and not carpeta.is_dir():
        print(f"no existe la carpeta: {carpeta}")
        return 1
    if carpeta is None and not argumentos.inyectar:
        print("indicá --carpeta para trazar, o --inyectar para reembeber")
        return 1

    pendientes = 0
    for nombre, fuente in FUENTES.items():
        if carpeta is None:
            break
        ruta = carpeta / fuente
        if not ruta.exists():
            print(f"  ✗ falta {fuente}")
            pendientes += 1
            continue
        path, nodos = trazar(ruta)
        contenido = envolver(nombre, path, nodos)
        destino = DESTINO / nombre
        anterior = destino.read_text(encoding="utf-8") if destino.exists() else ""
        estado = "igual" if anterior == contenido else "cambia"
        print(f"  {nombre:<16} {nodos:>4} nodos · {len(path):>5} caracteres de path · {estado}")
        if anterior != contenido and not argumentos.check:
            destino.write_text(contenido, encoding="utf-8")

    if argumentos.inyectar and not argumentos.check:
        inyectar_en_motor()
    elif argumentos.inyectar:
        print("  (--check: no se inyecta)")

    if pendientes:
        return 1
    print("listo" if not argumentos.check else "(dry-run; usar sin --check)")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
