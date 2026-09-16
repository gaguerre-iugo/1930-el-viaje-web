# Navegación en libros reflowables: mecánica y diagnóstico

## Las tres coordenadas que no deben mezclarse

Este export tiene tres sistemas distintos:

1. **Página fuente**: posición de la sección en `content/pages.json`.
2. **Página visual**: columna horizontal que el navegador genera después de
   aplicar ancho de pantalla, tipografía, tamaño de letra y lectura fácil.
3. **Entrada del índice**: título semántico identificado por `chapter_id` en
   `content/toc.json`.

No existe una relación 1:1 entre página fuente y página visual. Una sección
fuente puede ocupar varias páginas visuales, compartir una página con la
sección siguiente o quedar integrada en una composición sin caja propia.

## Evidencia de la versión 38

| Página fuente | Sección | Páginas visuales ocupadas |
|---:|---|---|
| 1 | `pg001` | 1 |
| 2 | `pg009` | 2–3 |
| 3 | `pg010` | 3–4 |
| 4 | `pg011` | 4–5 |
| 5 | `pg013` | 6–7 |
| 6 | `pg014` | 7–8 |
| 7 | `pg015` | 8–9 |
| 8 | `pg016` | integrada en la portada de capítulo |
| 9 | `pg017` | 10 |
| 10 | `pg019` | 11 |
| 11 | `pg020` | 11–13 |
| 12 | `pg021` | 13–14 |
| 13 | `pg022` | 14–15 |
| 14 | `pg023` | 15–17 |
| 15 | `pg024` | 17–19 |
| 16 | `pg025` | 19–20 |
| 17 | `pg026` | 20–21 |
| 18 | `pg027` | 21–23 |
| 19 | `pg028` | 23–24 |
| 20 | `quiz_final` | 25–27 |

Por eso el algoritmo anterior enviaba el botón 16 a la página visual 19 y
los botones 10 y 11 a la misma página visual 11: trataba el índice del
manifiesto fuente como si fuera un número visual.

## Regla de implementación

- La lista de páginas se construye con `state.total`, que es la cantidad real
  de columnas visuales.
- El botón `N` navega directamente a `goToPage(N - 1)`. Nunca consulta la
  sección fuente número `N`.
- Cada título del índice navega al elemento visible indicado por `chapter_id`.
  No navega al principio de su `section_id`, porque allí puede haber texto de
  continuación perteneciente al título anterior.
- Los grupos de la lista se delimitan con la página visual de cada
  `chapter_id`. En este capítulo los comienzos son 1, 2, 4, 6 y 10.
- La lista se reconstruye después de cualquier repaginación. No se deben
  guardar números visuales fijos en el manifiesto.

## Cálculo de página visual

Después de completar el layout:

```text
posición absoluta = scrollLeft + rect.left - contentRect.left
página visual      = floor(posición absoluta / ancho del viewport)
```

Se usan únicamente cajas pintadas (`getClientRects()` con ancho y alto
positivos). Los anclajes de tamaño cero no sirven como destino.

## Validación para integrar el libro completo

1. Cada entrada de `toc.json` debe tener un `chapter_id` único y visible.
2. La cantidad de botones del listado debe coincidir con la cantidad visual
   mostrada en `N / total`.
3. Los botones deben contener la secuencia visual completa `1…total`.
4. El botón `N` debe dejar el estado del paginador exactamente en `N / total`.
5. Los comienzos de grupo deben coincidir con la página pintada del título.
6. Repetir la prueba después de cambiar ancho, tamaño de letra y lectura fácil.
7. Buscar por número o título no debe alterar el destino almacenado en cada
   botón.
8. Abrir o cerrar el panel no debe cambiar `scrollWidth`, `scrollLeft` ni el
   rectángulo de `#content`.

Cuando aparece un corrimiento creciente —por ejemplo 10→11 o 16→19— debe
diagnosticarse primero como mezcla de coordenadas, no corregirse con una tabla
manual de excepciones.

## Sincronización con TTS durante navegación explícita

El reproductor puede completar una devolución de React correspondiente al
elemento anterior después de que el usuario ya pulsó Siguiente. Si esa
devolución vuelve a calcular la página desde el audio, la interfaz parece
rebotar hacia atrás aunque `goToPage()` haya elegido correctamente el destino.

La solución es mantener un bloqueo transitorio asociado exclusivamente a la
página elegida por el usuario:

- mientras se busca la entrada de audio de la nueva página, se ignoran
  callbacks de elementos que no ocupen esa página;
- cuando comienza el elemento correcto, el bloqueo se libera tras un margen
  breve;
- el bloqueo tiene un vencimiento de seguridad y nunca se usa para impedir el
  avance automático ordinario de la narración.

Este mecanismo es especialmente importante después de repaginar por
mayúsculas o tamaño de letra, porque las referencias de audio sobreviven al
cambio mientras sus páginas visuales cambian.

## Carrera entre desplazamiento animado y estado de página

Un control de página discreto no debe usar `scrollTo(..., behavior: "smooth")`.
Durante la animación, el evento `scroll` observa columnas intermedias y puede
reescribir `state.current` antes del siguiente clic. Con Lectura fácil y
Mayúsculas el efecto se vuelve visible porque la repaginación cambia las
fronteras y el usuario parece quedar encerrado en una página.

Regla reutilizable:

- asignar `scrollLeft` de forma atómica para Anterior, Siguiente, teclado e
  índice;
- calcular Anterior/Siguiente desde `round(scrollLeft / viewportWidth)`, no
  desde una copia de estado que pudo quedar desfasada durante la repaginación;
- reservar el desplazamiento animado para gestos continuos que no cambian un
  número de página discreto.

## Localizar términos en un documento multicolumna

`scrollIntoView({block: "center"})` trabaja en coordenadas de scroll continuo y
puede dejar un destino entre dos columnas. Para un libro paginado se debe:

1. obtener los `getClientRects()` del término;
2. convertir su coordenada horizontal absoluta en índice de página;
3. navegar con `goToPage(indice)`;
4. actualizar el ancla semántica antes de cerrar el panel;
5. reconciliar una sola vez después de que el popover restaure el foco.

## Un gesto físico debe equivaler a una página

En un trackpad, un único movimiento no produce un solo evento. El navegador
recibe una secuencia con componentes `deltaX` y `deltaY`, seguida por eventos
de inercia. Si el paginador intercepta sólo el eje vertical, el eje horizontal
puede desplazar nativamente el contenedor mientras la aplicación también llama
a `goToPage()`. Los dos sistemas compiten y aparentan un rebote.

Regla reutilizable:

- cuando comienza un gesto, apropiarse de ambos ejes con `preventDefault()`;
- acumular la magnitud dominante hasta un umbral antes de cambiar de página;
- permitir como máximo un avance o retroceso durante el gesto;
- mantener un cerrojo hasta un período breve sin eventos —260 ms funciona en
  la ventana verificada— para absorber la inercia;
- desactivar desplazamiento suave y `overscroll` en el contenedor paginado.

La prueba debe usar diagonales y gestos fuertes, no solamente una rueda de
ratón que emite eventos discretos.

## Anclas para páginas formadas sólo por componentes

Una página puede contener únicamente una tarjeta de chat, una imagen, un quiz
u otro componente atómico y no tener un `data-id` de oración visible. En ese
caso, preservar «el primer texto visible» conserva accidentalmente el ancla de
la página anterior.

Todo componente capaz de ocupar una columna por sí solo debe exponer un
`data-reflow-anchor-id` único. El cálculo de ancla visual debe consultar tanto
`data-id` como `data-reflow-anchor-id`, y la repaginación debe poder localizar
ambos.

## TTS habilitado no significa TTS activo

El interruptor puede permanecer habilitado después de detener o pausar la
lectura. Un elemento TTS antiguo no debe seguir gobernando la página visible:

- al navegar manualmente con TTS habilitado pero inactivo, limpiar el elemento
  de seguimiento antes de reconciliar;
- al activar la lectura desde Configuración, elegir primero el elemento de la
  página visual actual;
- conservar el bloqueo transitorio sólo mientras realmente se busca o
  reproduce el nuevo audio.

Esta distinción evita que una devolución tardía del reproductor revierta una
navegación válida.

## Anuncios semánticos para componentes divididos

Si un chat único se divide condicionalmente en dos tarjetas, la segunda página
necesita contexto audible. El anuncio no debe existir sólo como texto oculto:
debe ocupar la posición correcta dentro de la cola TTS.

Regla reutilizable:

- insertar el anuncio antes del primer mensaje de la segunda tarjeta;
- agregar su `data-id` y su ítem TTS únicamente mientras el componente esté
  realmente dividido;
- retirar ambos al volver a una sola tarjeta;
- mantener el anuncio visualmente oculto y reutilizar un audio validado;
- reconciliar también la cola ya montada, porque agregar un `data-id` después
  de iniciar el runtime no garantiza que éste vuelva a inventariarlo.

### Geometría de anuncios invisibles en multicolumna

Un texto `sr-only` puede conservar un rectángulo pintado de un píxel. En un
contenedor multicolumna ese rectángulo no necesariamente queda en la misma
columna que su componente visible y no debe usarse para seguir el TTS.

La función que resuelve páginas debe reconocer tanto el elemento oculto como
los `Range` de resaltado cuyo ancestro sea ese elemento, y sustituirlos por el
wrapper visible que introducen. Corregir sólo el elemento no alcanza: el
resaltador puede volver a navegar usando la geometría del rango.

## Catálogos completos de voces TTS

Una voz del selector no es sólo un nombre: requiere un catálogo de rutas y un
catálogo temporal con exactamente el inventario semántico del libro.

Regla reutilizable:

- generar un MP3 por cada clave de `audios.json`, incluidos glosario, lectura
  fácil, cuestionarios y anuncios de componentes;
- capturar `WordBoundary` del mismo servicio y la misma síntesis;
- validar cobertura textual concatenada: el proveedor puede agrupar varias
  palabras en un límite aunque siga cubriendo toda la locución;
- comprobar orden de tiempos, duración, rutas, archivos no vacíos y conteos;
- exponer en la interfaz sólo las voces que aprobaron el inventario completo;
- al cambiar de narrador, conservar el ID semántico y la página actuales, pero
  sustituir juntos el MP3 y el catálogo temporal: las marcas de una voz no se
  reutilizan para otra;
- versionar los JSON y MP3 para evitar mezclar catálogos nuevos con cachés.

En la versión 45, Valentina y Mateo implementan el mismo inventario de 1206
IDs con alineaciones independientes. Esta simetría permite que el selector
cambie la voz sin alterar el orden de lectura ni la navegación visual.

La pronunciación puede usar una variante fonética sin modificar la grafía
visible. En este libro, «WhatsApp» permanece escrito correctamente y se
sintetiza como «uatsap».

## Controles relativos cuando no existe una posición TTS

Pausar y navegar puede exigir `stop()` para eliminar el ancla obsoleta. El
runtime reinicia entonces su índice React en cero, pero ese valor no representa
la portada elegida por el usuario.

Anterior/Siguiente debe resolver en este orden:

1. elemento resaltado activo;
2. último índice semántico confirmado por `beforePlayback`;
3. primera unidad que ocupa la página visual actual.

El desplazamiento `-1/+1` se aplica después de reconstruir esa base. Así, sin
posición, Anterior llega al cierre de la página anterior y Siguiente a la
segunda unidad de la página actual.

## Autoplay y pausa son estados distintos

Reproducción automática puede iniciar una página nueva cuando Texto a voz está
habilitado pero inactivo. No puede reanudar una pausa manual. La prioridad es:

1. pausa manual: permanecer pausado;
2. audio activo: alinear y continuar;
3. audio inactivo + autoplay: comenzar en la nueva página;
4. audio inactivo sin autoplay: permanecer inactivo.

## Restauraciones tardías frente a una navegación explícita

La restauración inicial de hash, Lectura fácil o preferencias puede disparar
reconciliaciones diferidas cientos de milisegundos después de que el lector ya
pulsó Siguiente. Si esas reconciliaciones siguen usando el ancla inicial,
parece que una página atómica —por ejemplo un chat— “rebota” hacia atrás.

Una orden visual explícita debe adquirir prioridad hasta que ocurra una nueva
orden semántica:

- Siguiente, Anterior, rueda o teclado fijan la página visual solicitada;
- callbacks de layout o restauración no pueden reemplazarla;
- abrir una entrada del índice, localizar glosario, cambiar tamaño/LF o iniciar
  TTS libera el cerrojo porque establece una nueva ancla semántica;
- la prueba debe esperar más que todos los temporizadores de restauración y
  verificar que la página permanezca estable, no sólo observar el primer frame.
