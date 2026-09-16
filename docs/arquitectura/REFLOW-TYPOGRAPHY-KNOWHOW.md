# Know-how de tipografía y repaginación reflow

Este documento registra mecanismos reutilizables descubiertos al incorporar
mayúsculas, tamaños de letra, Lectura fácil y resaltado TTS en la versión 44.
El objetivo es prevenir desfasajes al procesar el libro completo.

## Modelo mental

La unidad real de página no es el archivo HTML ni el folio importado: es una
columna visual de `#content`. Cualquier cambio en ancho de glifos, altura de
línea, espaciado, contenido o indivisibilidad puede cambiar el número y la
posición de esas columnas.

`text-transform: uppercase` no modifica los nodos de texto, pero sí sus
métricas visibles. Verdana en mayúsculas suele ocupar más ancho; por eso un
texto con el mismo número de caracteres puede ganar líneas y páginas.

Lectura fácil sí reemplaza contenido y agrega saltos o listas. Su estado debe
detectarse después de que el runtime terminó de montar o restaurar sus
preferencias. Un cálculo anterior mide el texto equivocado.

## Causas estructurales observadas

1. **Doble avance de columna.** Un bloque de altura completa con
   `break-inside: avoid-column` ya pasa a la columna siguiente cuando no cabe.
   Si además tiene `break-before: column`, Chromium puede primero apartarlo
   por falta de espacio y luego aplicar el salto forzado. El resultado es una
   página completamente vacía.

2. **Bloques indivisibles mayores que el espacio disponible.** Una cadena de
   frases con `break-inside: avoid-column` puede pasar entera a la página
   siguiente y dejar allí solo un cierre breve. No es contenido perdido: es
   una decisión de fragmentación.

3. **Distribución basada en estados fijos.** Decidir cuántos párrafos caben al
   lado de una imagen con reglas como «Normal = todos; Grande = ninguno» falla
   al sumar mayúsculas, Lectura fácil, otro viewport o nuevas métricas de
   fuente. Si el lateral supera la altura de página, el grid se fragmenta y
   sus textos pueden pintarse sobre la columna de continuación.

4. **Montaje asíncrono.** React puede mostrar primero el cascarón de un panel
   —por ejemplo, solo Buscar— y montar sus opciones en el cuadro siguiente.
   Dimensionar o revelar el panel antes de comprobar que su contenido está
   listo produce el falso requisito de un segundo clic.

5. **Texto vivo sobre arte.** Una portada puede verse bien en caja mixta y
   desbordarse al pasar a mayúsculas aunque la imagen no cambie. El texto vivo
   necesita una caja segura propia para cada transformación tipográfica.

6. **Resaltado TTS.** Los `span` temporales del resaltado no deben cambiar
   `display`, márgenes, altura de línea ni orden. La transformación de caja se
   aplica por CSS al contenedor para conservar texto fuente, timecodes y
   nombres accesibles.

7. **Estados duplicados en controles equivalentes.** El interruptor Texto a
   voz y el reproductor pueden modificar la misma función desde componentes
   React diferentes. Si cada uno conserva su propio booleano, el audio puede
   detenerse mientras la interfaz sigue en ON, o continuar después de apagar
   el interruptor. Ambos deben escribir en un único átomo compartido y cada
   transición terminal debe ejecutar también la operación multimedia real.

8. **Identificadores de audio confundidos con párrafos.** En el export fuente,
   cada oración puede estar en un `p[data-id]` distinto para permitir audio y
   resaltado, mientras que el `div` padre representa el párrafo editorial.
   Forzar cada `data-id` a `inline-block` convierte por accidente las oraciones
   en renglones separados. En modo estándar deben fluir `inline` dentro del
   wrapper original; Lectura fácil puede volver a separarlas.

9. **Duplicación responsive de contenido vivo.** Algunos chats traen una copia
   absoluta para escritorio y otra copia flex para móvil, ambas con los mismos
   `data-id`. Aunque una esté oculta visualmente, el runtime puede encontrar dos
   textos, reproducirlos dos veces o asociar el resaltado al nodo equivocado.
   La salida reflow debe reconstruir una sola estructura semántica y adaptable.

10. **Altura de página confundida con altura de imagen.** En una composición
   lateral, limitar el texto por la altura disponible de la página permite que
   sobrepase el borde inferior de una imagen más baja. La referencia correcta
   es el rectángulo renderizado de la imagen después de cargar y escalar.

11. **Wrappers importados con sangrías acumulativas.** Un párrafo puede declarar
   `text-align: left` y seguir desplazado porque uno de sus `div` ancestros
   conserva `margin-left`, `padding-left` o posicionamiento del PDF. La
   normalización debe cubrir toda la cadena de wrappers de la sección afectada.

12. **Edición generativa más amplia que la máscara.** Un modelo puede reconstruir
   correctamente el fondo y, aun así, reinterpretar detalles fuera de la zona
   solicitada. Para reparaciones conservadoras, la salida generada funciona como
   fuente y se compone localmente sobre el original usando la máscara inversa;
   así las invariantes externas quedan garantizadas píxel por píxel.

13. **Disponibilidad de una función no equivale a su estado inicial.** En la
   configuración, `features.easyRead: true` habilita el control de Lectura
   fácil; no significa que el modo arranque encendido. El estado inicial real
   vive en `easyReadMode` y es `false`. Desactivar la feature elimina el control
   en lugar de conservarlo visible y apagado.

14. **La fuente original puede ser el mejor donante para una reparación.** Si
   una edición de portada daña un detalle pequeño que sigue intacto en el JPG
   importado, primero hay que verificar alineación, recorte y dimensiones. Un
   trasplante local con máscara mínima conserva mejor el arte que una nueva
   generación completa y hace reproducible la corrección.

15. **Las excepciones de paginación caducan al cambiar las métricas.** Un
   `break-before` agregado para Verdana puede crear un huérfano o una página
   artificial al migrar a Atkinson. Después de cambiar fuente, tamaño o ancho
   de medida hay que volver a justificar cada excepción o eliminarla.

16. **Firmas y créditos requieren vínculo semántico mínimo.** Una firma breve
   no debe agruparse con todo el párrafo anterior, porque produciría grandes
   huecos; basta unirla con la oración inmediatamente precedente dentro de un
   wrapper indivisible.

17. **Un elemento TTS puede ocupar más de una página.** Elegir siempre el
   primer fragmento hace que la navegación rebote hacia atrás. Si la página
   actual pertenece a los rectángulos del elemento sincronizado, debe
   conservarse como destino preferido.

18. **El feedback modifica la altura útil del cuestionario.** Una tarjeta con
   `overflow: hidden` y alturas mínimas válidas antes de responder puede cortar
   el resultado después. Al evaluarse, se debe retirar la acción redundante,
   compactar espacios de interfaz y dejar que el feedback mida su altura real.

19. **No exponer controles sin sus recursos.** El selector de voz sólo se
   monta visualmente cuando ambos catálogos de audio y timecodes están
   disponibles. Un control deshabilitado pero aparentemente activo comunica
   una capacidad inexistente.

20. **La velocidad condiciona la granularidad útil del resaltado.** A ritmos
   Rápido y Muy rápido el seguimiento por palabra resulta visualmente inestable
   aunque los tiempos sean correctos. Se debe forzar Oración, deshabilitar
   Palabra y restituir su disponibilidad al volver a Lento o Normal.

21. **Un panel puede tener más de una estructura completa.** El glosario usa
   una vista de lista y otra de definición. La lógica de “contenido listo” debe
   reconocer ambas; exigir siempre pestañas y `tabpanel` oculta legítimamente
   la ficha de una palabra y deja el control en un estado aparentemente roto.

22. **Los wrappers semánticos pueden fragmentar el resaltado TTS.** Un término
   del glosario inserta un `span` dentro de una oración. Si el rango de TTS se
   calcula por nodo de texto, la oración queda cortada en tres segmentos. Se
   necesita un mapa textual lógico que concatene los nodos y proyecte después
   el rango sobre el DOM real.

23. **`\b` no es un límite lingüístico Unicode en JavaScript.** Palabras como
   «canjeó» pueden coincidir sólo hasta «canje». Los límites del glosario deben
   excluir explícitamente letras, números y marcas Unicode con `\p{L}`,
   `\p{N}` y `\p{M}`.

24. **Contener no equivale a igualar alturas.** Mover oraciones hasta que el
   lateral no sobrepase una imagen evita desbordamientos, pero no alinea ambos
   bordes. Para igualarlos hay que medir las líneas visuales reales y distribuir
   su interlineado sobre el alto renderizado de la imagen, sin alterar fuente o
   ancho.

25. **Una columna sin oración puede perder su identidad.** Las tarjetas de
   chat divididas pueden formar páginas completas sin un `data-id` textual
   ordinario. La repaginación necesita anclas explícitas de componente para no
   heredar el ancla anterior.

26. **La igualdad geométrica puede contradecir Lectura fácil.** Distribuir un
   párrafo editorial hasta los bordes de una imagen es válido si se ajusta
   moderadamente su interlineado. En Lectura fácil, donde las ideas ya están
   separadas, el mismo cálculo puede duplicar el interlineado y destruir su
   agrupación perceptiva. En ese modo se conserva `1,55` y se centra el bloque
   natural; la igualdad exacta queda reservada al modo estándar.

27. **Una transformación tipográfica puede volver visible una diferencia de
   altura sin que exista desbordamiento.** En Lectura fácil, centrar el bloque
   natural era legible, pero no cumplía la igualdad solicitada. La solución no
   es estirar el interlineado de cada frase: primero se preservan las unidades
   semánticas y, si la igualdad exacta no es compatible con ellas, se garantiza
   al menos la coincidencia de los bordes superiores.

## Reglas de implementación

- Conservar siempre la capitalización editorial del texto fuente. Si se retira
  una preferencia persistente, eliminar también su estado guardado para que no
  sobreviva de forma invisible entre versiones.
- Repaginar preservando un ancla semántica después de cambiar fuente, caja o
  Lectura fácil.
- En composiciones ilustradas, restaurar el orden fuente y mover únicamente
  los últimos párrafos hasta que la altura renderizada entre en el espacio
  disponible. Medir el DOM; no inferirlo por cantidad de caracteres.
- Evitar `break-before` en componentes de altura completa que ya son
  indivisibles. Mantener `break-after` cuando se necesite cerrar la página.
- Agrupar frases por sentido, pero permitir fragmentación si el grupo puede
  superar una página. Para cierres aislados, mover también el bloque semántico
  anterior en la combinación donde la medición demuestra el problema.
- Detectar Lectura fácil después del montaje inicial y volver a reconciliarla
  tras restauraciones tardías del runtime.
- Mantener los wrappers TTS tipográficamente transparentes.
- Cuando Lectura fácil deba igualar una imagen, usar una columna flex con
  `space-between` entre ideas y conservar `line-height: 1.55` dentro de ellas.
- Ocultar un panel parcial hasta que estén presentes sus controles mínimos;
  revelarlo recién entonces y conservar su altura natural compacta.
- Sincronizar controles equivalentes de forma bidireccional: Play activa el
  estado compartido, Detener lo desactiva, ON ejecuta `play()` y OFF ejecuta
  `stop()`. Pausa sigue siendo un estado distinto y no debe confundirse con
  OFF.
- Versionar las URLs de CSS, JavaScript y fragmentos HTML para evitar que el
  Live Server mezcle código nuevo con recursos cacheados.
- Tratar el wrapper fuente como frontera de párrafo y los `data-id` hijos como
  unidades de sincronización. Preservar ambas capas en vez de fusionarlas.
- En componentes responsive, exigir unicidad global de cada `data-id`; la
  adaptación debe resolverse con CSS o una composición DOM única, nunca con
  copias ocultas.
- Medir la altura real de la imagen con `getBoundingClientRect()` y mover el
  excedente del lateral a la continuación hasta que ambos bordes verticales
  queden contenidos.
- Cuando una imagen quede sola por la estructura fuente, reconstruir un único
  grid semántico con el bloque de texto contiguo; no duplicar ni resumir texto.
- Para eliminar sangrías heredadas, normalizar alineación, margen, padding e
  indentación en todos los ancestros importados de la sección, no sólo en `p`.
- En reparaciones raster localizadas, conservar el original, generar un archivo
  nuevo y componer únicamente el área de máscara antes de actualizar la
  referencia del libro.
- Construir los rangos de TTS sobre una secuencia lógica de texto que atraviese
  wrappers editoriales. Durante la reproducción, el amarillo debe sobreponerse
  al verde del glosario; al avanzar, se retira la clase temporal y reaparece el
  estado verde original.
- Usar límites Unicode para las coincidencias de glosario y verificar palabras
  con tildes al inicio, en el medio y al final.
- Cuando se solicite igualdad vertical entre imagen y texto, restaurar primero
  el orden fuente, retirar el excedente, medir líneas con `Range` y ajustar sólo
  el interlineado. Repetir la medición hasta que la diferencia sea menor a un
  píxel.
- Antes de igualar alturas, distinguir párrafo editorial de unidades de
  Lectura fácil. No superar el interlineado accesible previsto para llenar
  espacio decorativo. Si una expresión breve queda huérfana, usar una unión de
  presentación —por ejemplo, espacio no separable— sin reescribir texto ni
  desalinear el audio.

## Matriz mínima de validación

Probar, como mínimo, estas seis combinaciones en la misma ventana:

| Tamaño | Lectura fácil OFF | Lectura fácil ON |
| --- | --- | --- |
| Normal | Sí | Sí |
| Grande | Sí | Sí |
| Extra grande | Sí | Sí |

En cada combinación verificar:

- cero columnas sin elementos visibles;
- cero intersecciones entre rectángulos de bloques hermanos;
- ningún rectángulo por encima o debajo del área útil;
- página ilustrada contenida y texto lateral alineado por el borde superior;
- portada, chats y cuestionarios;
- cambio de página con TTS pausado;
- resaltado por palabra y por oración;
- índice y página activa después de repaginar.
- amarillo TTS continuo a través de términos verdes y restauración del verde
  al cambiar de palabra u oración;
- palabras acentuadas completas en el glosario;
- diferencia entre bordes superiores de imagen y texto inferior a un píxel;
- igualdad de los bordes inferiores sólo cuando pueda lograrse sin inventar
  texto, partir párrafos ni alterar el interlineado accesible.

Los números de página son resultados, no identificadores estables. Las
pruebas automáticas deben guardar también el primer `data-id` visible de cada
columna; así un cambio legítimo de paginación no se confunde con contenido
perdido o navegación equivocada.

## Diagnóstico rápido

1. Registrar tamaño, caja, Lectura fácil, viewport, total de columnas y ancla.
2. Inventariar por columna los `data-id`, sus rectángulos y sus ancestros.
3. Para una página vacía, inspeccionar el último bloque anterior y el primero
   posterior: `break-before`, `break-after`, `break-inside` y altura.
4. Para un solapamiento, comparar rectángulos de hermanos y revisar si un
   bloque indivisible se fragmentó de todos modos por ser demasiado alto.
5. Para un fragmento aislado, identificar el grupo semántico y comprobar si
   fue desplazado entero por `avoid-column`.
6. Repetir después de dos cuadros de animación y después de la restauración
   tardía de Lectura fácil, fuentes e imágenes.

## Componentes indivisibles que crecen por transformaciones tipográficas

`break-inside: avoid-column` no puede impedir la fragmentación si el propio
componente supera la altura de la columna. Para chats, tarjetas y otros
componentes de interfaz se debe recuperar espacio antes de tocar la fuente:

1. ampliar el ancho útil de los globos para reducir saltos de línea;
2. reducir sólo `gap`, `padding`, márgenes e interlineado del componente;
3. comprobar que `getClientRects().length === 1` y que su altura sea menor que
   la altura de página;
4. conservar intacto el tamaño tipográfico accesible.

En el chat de `pg029`, esta estrategia mantiene los seis mensajes juntos con
Lectura fácil y tamaño Extra grande.

Cuando el chat se divide en dos tarjetas por una combinación de alto riesgo,
cada tarjeta debe recibir además un ancla semántica propia. La indivisibilidad
resuelve el layout; el ancla resuelve la identidad de la nueva página visual.

Si dos subgrupos semánticos caben por separado pero el componente completo no
es estable en todas las transformaciones, es preferible una división
condicional determinista. Los wrappers pueden usar `display: contents` en las
combinaciones normales y convertirse en tarjetas indivisibles, separadas por
`break-before: column`, sólo en las combinaciones de alto riesgo. No se debe
duplicar texto, IDs ni audio.

## Próxima automatización sugerida

Crear un validador que recorra la matriz, genere un inventario JSON por
columna y falle ante páginas vacías, intersecciones, desbordamientos o cambios
de orden de `data-id`. Ese validador, este documento y las funciones de
redistribución serán la base de la futura skill del libro completo.

## Umbrales bruscos causados por unidades semánticas largas

Una diferencia grande entre minúsculas y mayúsculas puede provenir de una
sola unidad indivisible, no de una regla tipográfica incorrecta. Si un
`data-id` contiene varias oraciones y comparte un único audio, al superar por
poco la altura disponible debe moverse entero; el resultado visual parece un
salto mucho mayor que el crecimiento real.

Antes de cambiar fuente, ancho o imagen:

1. contar los hijos directos que el algoritmo considera movibles;
2. inspeccionar si alguno contiene varios `<br>` o varias oraciones;
3. comparar su ID con `texts.json`, `audios.json` y los timecodes;
4. preservar la unidad si no se granularizan conjuntamente texto, audio y
   sincronización.

Las métricas de ancho, alto y unidades laterales/desbordadas deben exponerse
como atributos de auditoría para reproducir el diagnóstico sin estimaciones
visuales.

## Ancho fijo y paneles sin solapamiento

- El ancho exterior de lectura no debe depender del tamaño tipográfico ni de
  Lectura fácil. Reservar en escritorio el ancho real máximo de los paneles a
  ambos lados y conservar una página CSS de `100vw` evita repaginaciones al
  abrirlos.
- Texto, chats y grids de imagen/texto comparten esa misma caja exterior. Los
  párrafos de texto solo pueden limitar su medida interna a `65–75ch`.
- Si el viewport físico no permite panel + lectura útil, el panel debe actuar
  como modal y ocultar temporalmente el libro; superponerlo sobre texto visible
  no es una solución accesible.
- La eliminación de un modo de accesibilidad requiere retirar control, estado,
  selectores CSS y preferencia persistida. Conservar una clave vieja en
  `localStorage` puede reactivar estilos aunque el interruptor ya no exista.

## Párrafos reconstruidos desde el PDF

- Una exportación puede representar cada oración como `<p>`. La etiqueta HTML
  no demuestra que exista un punto aparte.
- Usar la sangría visible de primera línea del PDF como fuente de verdad y
  registrar los `data-id` que realmente inician párrafo.
- En modo normal, insertar un separador de bloque antes de esos inicios y
  mantener las oraciones siguientes inline. En Lectura fácil se puede ocultar
  el separador y conservar la presentación oración por oración.
- En páginas con imagen, mover sólo unidades semánticas completas. Si no es
  posible igualar la altura sin inventar texto, reducir fuente o romper un
  párrafo, alinear exactamente los bordes superiores y documentar el fallback.

### Los wrappers HTML también pueden fabricar saltos falsos

Registrar correctamente los inicios no alcanza si la exportación conserva
envoltorios `.reading-block` arbitrarios: por ser elementos de bloque, fuerzan
un renglón nuevo aunque no tengan margen. El síntoma es un punto seguido que
visualmente parece punto aparte, mientras la tabla de párrafos coincide con el
PDF.

Regla reutilizable:

1. derivar y validar primero los inicios desde las sangrías del PDF;
2. en secciones de prosa pura, aplanar sólo los wrappers que contienen
   exclusivamente unidades `.reading-sentence` o `.sentence-chain`;
3. excluir portadas, títulos, firmas, imágenes, chats y actividades;
4. mantener las unidades semánticas y sus `data-id` en el mismo orden;
5. usar el separador PDF como única causa de un nuevo párrafo en modo normal.

Las validaciones `validate_paragraph_geometry.py` deben informar igualdad
exacta entre IDs registrados e inferidos. Además, una prueba geométrica del DOM
debe confirmar que dos oraciones con punto seguido pueden compartir el mismo
`top`, mientras dos inicios consecutivos presentan separación de bloque.

### Balance de imagen y texto con medición real

No estimar altura mediante cantidad de caracteres. Medir el stack ya pintado
con `getBoundingClientRect()` y agregar el máximo prefijo de unidades
semánticas completas que quepa junto a la imagen. Si la siguiente oración no
cabe sin partirla, la alternativa accesible es conservar exactamente el borde
superior común; nunca duplicar texto, reducir selectivamente la fuente ni
alterar el interlineado.

Cuando el requerimiento editorial exige igualdad y no sólo contención, la
columna lateral debe recibir como `height` el alto renderizado de la imagen.
En Lectura fácil, las unidades completas que realmente caben se calculan
insertándolas y midiendo el DOM final, nunca mediante caracteres por línea.
Luego se distribuyen esas unidades semánticas entre los mismos bordes superior
e inferior, conservando fuente, ancho e interlineado. Verificar las seis
combinaciones Normal/Grande/Extra grande × LF OFF/ON; una diferencia menor a
0,01 px es redondeo subpíxel y no un desajuste de composición.

### Espaciado de quizzes sin inflar la tarjeta

La separación entre opciones y botón es independiente del alto total de la
tarjeta. Aumentar `gap` y el margen de acciones no justifica una gran reserva
blanca superior o inferior. La tarjeta debe usar la altura mínima compatible
con esos intervalos y con el feedback completo. El estado seleccionado debe
reemplazar el borde gris en la misma geometría: un único borde verde claro de
4 px, sin outline ni segundo marco.

El feedback puede reemplazar al botón por un contenido algunos píxeles más
bajo. Para evitar un salto visual, capturar la altura de la tarjeta en la fase
de captura del clic, antes de que el runtime modifique el DOM, y conservarla
como `min-height`. El feedback largo puede hacer crecer la tarjeta, pero uno
corto nunca debe contraerla. Al cambiar tamaño o Lectura fácil se descarta esa
medición porque pertenece a una geometría tipográfica anterior.

La altura de la tarjeta no basta: una regla exclusiva del estado evaluado
puede reducir `padding` y `gap` de las opciones aunque el marco exterior quede
estable. Capturar también alto, rellenos y separación de cada opción antes de
Enviar. Al pasar el borde seleccionado de 4 px al borde evaluado de 2 px,
compensar esos 2 px en el relleno para conservar exactamente la posición del
texto. Finalmente, registrar el `top` de la pregunta relativo a la tarjeta y
restaurarlo después de insertar el feedback; así el centrado vertical no mueve
todo el conjunto por la distinta altura del botón reemplazado.

### Fragmentos semánticos que terminan en artículo

Una oración partida entre dos páginas fuente puede conservar dos `data-id`.
Si Lectura fácil reescribe el segundo fragmento como una oración autónoma, el
primero no puede conservar el artículo de enlace original: «ojos celestes y
las / Tiene ojeras…» es agramatical. Cerrar el primer fragmento con punto y
regenerar juntos texto, MP3 y timecodes de ese ID. Un arreglo puramente visual
con espacios no separables sólo oculta el error y deja un TTS incorrecto.

### Estado inicial y preferencias de pruebas anteriores

El runtime recuerda tamaño y Lectura fácil en `localStorage`, por lo que un
paquete nuevo abierto en el mismo origen puede heredar una prueba anterior.
Cada entrega puede incluir una migración versionada de una sola ejecución que
retire esas dos preferencias. El primer inicio queda en Normal/Lectura fácil
OFF; cualquier elección posterior del lector vuelve a persistir normalmente.
