"""Detalles tipográficos del contenido (punto 23).

Tres arreglos, todos verificables:

1. Puntos suspensivos: `...` → `…` (3 casos).
2. Rangos de fecha: `(1877 - 1929` y `(1916 - ?)` → con guion sin espacios, que es
   la convención en español.
3. Encabezados de página para lectores de pantalla: 20 páginas anunciaban el
   nombre del archivo PDF (`1930-el-viaje---PDF--1--21`). Se reemplazan por el
   título del capítulo que ya conoce el motor, o por una descripción del tipo de
   página. También se corrige el `<title>` del documento, que es el que muestra la
   pestaña del navegador.
"""

from __future__ import annotations

import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MOTOR = RAIZ / "assets" / "reflow-book.js"
NOMBRE_ARCHIVO = "1930-el-viaje---PDF--1--21"


def capitulos_del_motor() -> dict[str, str]:
    """Lee la tabla de capítulos por página que usa el contador del motor."""
    texto = MOTOR.read_text(encoding="utf-8")
    inicio = texto.find("chapterProgressGroupFallback")
    if inicio < 0:
        return {}
    fragmento = texto[inicio : inicio + 20000]
    mapa: dict[str, str] = {}
    for pagina, grupo in re.findall(r'"(pg\d{3})"\s*:\s*"([^"]+)"', fragmento):
        mapa[pagina] = grupo
    return mapa


def titulo_de(ruta: Path, capitulos: dict[str, str]) -> str:
    """Título del encabezado para una página dada."""
    pagina = ruta.name.split("_")[0]
    capitulo = capitulos.get(pagina)
    if capitulo:
        return capitulo
    contenido = ruta.read_text(encoding="utf-8", errors="replace")
    if 'data-section-type="separator"' in contenido:
        return "Separador de capítulo"
    if "<img" in contenido:
        return "Página ilustrada"
    return "Página del libro"


def main() -> int:
    capitulos = capitulos_del_motor()
    print(f"capítulos en la tabla del motor: {len(capitulos)}")

    cambios = {"puntos": 0, "fechas": 0, "encabezados": 0, "titulos": 0}
    paginas = sorted(RAIZ.glob("pg*.html"))

    for ruta in paginas:
        original = ruta.read_text(encoding="utf-8", errors="replace")
        texto = original

        # 1 · puntos suspensivos
        nuevo, cuantos = re.subn(r"\.\.\.(?!\.)", "…", texto)
        cambios["puntos"] += cuantos
        texto = nuevo

        # 2 · rangos de fecha: guion sin espacios alrededor
        nuevo, cuantos = re.subn(r"\((\d{4})\s+[-–—]\s+(\d{4}|\?)\)", r"(\1-\2)", texto)
        cambios["fechas"] += cuantos
        texto = nuevo

        # 3 · encabezado de página para lectores de pantalla
        if f'id="page-heading">{NOMBRE_ARCHIVO}<' in texto:
            titulo = titulo_de(ruta, capitulos)
            texto = texto.replace(
                f'<h1 class="sr-only" id="page-heading">{NOMBRE_ARCHIVO}</h1>',
                f'<h1 class="sr-only" id="page-heading">{titulo}</h1>',
            )
            if NOMBRE_ARCHIVO in texto:
                texto = texto.replace(
                    f'id="page-heading">{NOMBRE_ARCHIVO}<',
                    f'id="page-heading">{titulo}<',
                )
                cambios["encabezados"] += 1
            elif f'id="page-heading">{titulo}<' in texto:
                cambios["encabezados"] += 1

        # 4 · título del documento (pestaña del navegador)
        if f"<title>{NOMBRE_ARCHIVO}</title>" in texto:
            texto = texto.replace(
                f"<title>{NOMBRE_ARCHIVO}</title>",
                f"<title>{titulo_de(ruta, capitulos)} · 1930: El viaje</title>",
            )
            cambios["titulos"] += 1

        if texto != original:
            ruta.write_text(texto, encoding="utf-8")

    print(f"  puntos suspensivos: {cambios['puntos']}")
    print(f"  rangos de fecha: {cambios['fechas']}")
    print(f"  encabezados de página: {cambios['encabezados']}")
    print(f"  títulos de documento: {cambios['titulos']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
