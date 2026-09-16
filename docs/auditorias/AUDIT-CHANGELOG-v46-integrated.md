# Auditoría de integración — versión 46

## Alcance

La versión 46 es una entrega independiente. Conserva la introducción y el
capítulo 1 de la versión 45 final, y agrega el capítulo 2 sin modificar la
carpeta ni el ZIP de la versión 45.

Fuente primaria del capítulo 2:

- `1930-CAPÍTULO 2-reflow`
- secciones originales 36–57 y su cuestionario final;
- imágenes, glosario, audios y marcas de tiempo incluidos en esa fuente.

El ZIP del libro completo se conserva como referencia y respaldo, pero no se
usó para reemplazar la preparación específica del capítulo 2.

## Integración estructural

- Se agregaron 22 secciones: portadilla, páginas narrativas y cuestionario.
- La pregunta fuente del capítulo 2 se remapeó de `qz001` a `qz007` para evitar
  colisiones. Se agregaron editorialmente `qz008` y `qz009`, basados en el
  contenido del capítulo, para completar las tres dimensiones en el mismo
  orden que el capítulo 1.
- El índice incorpora `CAPÍTULO 2` y enlaza a `pg037_sec001`.
- Se importaron 877 identificadores de texto del capítulo.
- El glosario final contiene 154 términos: 56 nuevos y 6 reutilizados sin
  duplicar sus identificadores.
- La portadilla del capítulo 2 combina sus dos partes originales conservando
  las imágenes y el orden de lectura.
- Las páginas ilustradas 47 y 52 reutilizan el patrón imagen/texto del libro:
  texto alineado a la izquierda, sin superar la altura de la imagen.
- La página ilustrada 52 distribuye unidades semánticas completas según la
  altura renderizada de la imagen. El contenido excedente continúa en orden
  lineal, sin la grilla en zigzag heredada del contenedor principal.
- El cierre del capítulo presenta tres quizzes consecutivos en una sola
  secuencia semántica: recuperación explícita, interpretación/inferencia y
  reflexión/evaluación.
- Los grupos de oraciones conservan separadores de texto reales, incluso en el
  límite con el párrafo siguiente; esto evita uniones como `mismo.Lo` después
  de mover contenido durante la repaginación.

## Accesibilidad y audio

- La interfaz, Atkinson Hyperlegible para contenido y Verdana para menús se
  heredan de la v45 final.
- Lectura fácil, mayúsculas, tamaños de letra, glosario, resaltado y controles
  TTS se aplican también a las secciones nuevas.
- Se generan catálogos completos e independientes para Valentina y Mateo,
  incluidos los textos normales y de lectura fácil del capítulo 2.
- Las fronteras compuestas del sintetizador se expandieron a palabras visibles
  y las dos expansiones orales de portada se colapsaron sobre sus blancos
  gráficos. El reproductor acepta palabras breves y sigue directamente el
  reloj del audio, sin retrasar el marcador un índice por cuadro.
- El resaltado de una descripción de imagen usa el rectángulo efectivamente
  pintado por `object-fit: contain`; ya no incluye las bandas blancas superior
  e inferior del elemento paginado.
- Un destino explícito del índice o de la URL prevalece durante el arranque
  sobre el cursor TTS restaurado de una sesión anterior. Una vez estabilizada
  la paginación, el cursor de audio se alinea con la página solicitada.
- Los observadores de geometría y el rebalanceo de composiciones son
  idempotentes: sólo repaginan cuando cambia una firma real de dimensiones o
  configuración, evitando bucles que hacían rebotar la navegación.
- La versión usa claves de almacenamiento propias para no contaminar el estado
  guardado de la v45.

## Automatización incorporada

- `tools/integrate_chapter2.py`: importa el capítulo, remapea el cuestionario,
  deduplica el glosario y fusiona catálogos.
- `tools/validate_v46.py`: comprueba secciones, índice, glosario, audios,
  archivos, marcas de tiempo de ambas voces y el cierre de recursos portátiles.
- `CHAPTER2-INTEGRATION-REPORT.json`: registra los conteos producidos por la
  integración.
- `tools/build_portable_web_export.py`: acepta `--root`, `--archive` y
  `--preloader-only`, por lo que el mismo constructor puede regenerar futuras
  entregas sin una versión escrita de forma fija.
- `tools/normalize_voice_timecodes.py`: expande límites que contienen varias
  palabras, repara duraciones nulas y valida la correspondencia exacta entre
  el texto visible y las fronteras de ambas voces.

## Incidencia de apertura directa y causa

La primera compilación integrada funcionaba por HTTP, pero al abrir el mismo
`index.html` desde Finder mostraba «No fue posible preparar el libro
reflowable». El método de apertura del usuario era correcto. La causa era que
`assets/offline-preloader.js` se había heredado byte a byte de la versión 45:
no contenía las páginas 36–57 ni `qz007`, aunque el runtime nuevo intentaba
cargarlos.

Se regeneró el preloader desde la versión 46. Ahora incorpora los 73 recursos
HTML/JSON que el runtime puede solicitar, incluidas `pg057`, `qz007` y los
catálogos de Valentina y Mateo. El validador compara ese inventario en cada
empaquetado para que la divergencia no vuelva a pasar inadvertida.

## Verificación

Resultados de la validación automática:

- 49 secciones lógicas totales;
- 22 secciones del capítulo 2;
- 6 entradas de índice;
- 2.096 identificadores de texto;
- 154 términos de glosario;
- 73 recursos portátiles embebidos y 0 ausentes;
- Valentina: 2.097 audios y 2.097 conjuntos de marcas temporales;
- Mateo: 2.097 audios y 2.097 conjuntos de marcas temporales;
- 22.795 límites temporales por voz, 0 diferencias con el inventario léxico y
  0 secuencias inválidas;
- 0 asignaciones de audio faltantes;
- 0 marcas temporales faltantes;
- 0 archivos de audio faltantes o vacíos;
- sintaxis JavaScript y Python válida;
- todos los JSON parsean correctamente.
- 877 textos importados comparados con la fuente del capítulo 2: 0 cambios no
  previstos;
- 5 imágenes y 20 archivos de página importados comparados con la fuente: 0
  diferencias.

Pruebas funcionales realizadas en navegador:

- portadilla de `CAPÍTULO 2` visible y proporcionada;
- páginas ilustradas 47 y 52 con texto a la derecha;
- página 52 verificada en Normal y en Lectura fácil + Mayúsculas + Extra
  grande: texto dentro de los bordes de la imagen y continuación lineal;
- navegación desde el índice hasta el capítulo 2;
- Lectura fácil + Mayúsculas + Extra grande sin perder el ancla de lectura;
- clic en contenido cierra el panel activo sin cambiar de página;
- glosario de la página 39 muestra solo sus términos y `Mostrar en la
  página` lleva al término correcto;
- quizzes `qz007`, `qz008` y `qz009` consecutivos, con tres opciones y una
  respuesta correcta cada uno;
- cambio de voz entre Mateo y Valentina durante la narración;
- activación de Texto a voz inicia la lectura;
- Reproducción automática continúa la narración al pasar de página;
- resaltado de `pg047_im002` medido durante su locución: caja del elemento
  566×582 px, imagen pintada y borde 566×420 px, sin diferencia;
- cuestionarios del capítulo 2 en Lectura fácil + Mayúsculas + Extra grande:
  páginas 114–116 consecutivas y devolución completa dentro del viewport;
- navegación 114 → 115 → 116 validada después de hacer idempotente el
  rebalanceo de la composición del altillo;
- apertura directa en `#qz007` con TTS previamente activado: permanece en
  114/116 y no vuelve a la última locución almacenada;
- compilación `46-integrated-14`: 0 imágenes rotas y 0 IDs DOM duplicados.

## Ajustes `46-integrated-15`

- El subtítulo de la portadilla del capítulo 2 usa peso 500, igual que el del
  capítulo 1; la clase `font-bold` de la página fija ya no se hereda.
- La oración que terminaba entre `pg051_n0024` y `pg052_n0002` se consolidó
  como una sola unidad visible, audible y temporal. Se regeneraron Valentina y
  Mateo, tanto en texto normal como en Lectura fácil. Desaparecen el corte del
  resaltado y la pausa causada por cambiar de MP3 a mitad de la oración.
- Las ilustraciones 47 y 52 ocupan una columna estable de 668 px en el viewport
  de prueba, independiente de Normal/Grande/Extra grande. El algoritmo incorpora
  todos los bloques semánticos completos que caben y distribuye el remanente
  vertical sin partir oraciones.
- En la página 52 se midieron 511,46 px de imagen pintada y 511,45 px de texto;
  en la 47, 495,22 px en ambos lados.
- La protección visual de repaginación ya no puede ocultar una navegación
  explícita. El quiz nuevo aparece en el primer cuadro medido (menos de 90 ms)
  y el fallback del resguardo tipográfico se redujo de 1.800 a 500 ms.
- Decisión pendiente de coordinación: con un viewport de 1.280 px, el panel de
  Configuración mide 288 px y se superpone 268 px a una columna de texto de
  524 px. No existe una solución puramente overlay que mantenga simultáneamente
  imagen fija, texto completo y cero oclusión. Se recomienda una política
  mixta: overlay en Normal y panel con desplazamiento/repaginación preservando
  el ancla en Grande, Extra grande o viewports estrechos.

## Ajustes `46-integrated-16`

- Se identificó la causa exacta del oscurecimiento al seleccionar una opción de
  quiz: el listener global de repaginación aceptaba cualquier elemento con rol
  de control, incluso los radios del cuestionario. Ahora ese resguardo sólo
  responde a controles contenidos en el panel de interfaz.
- Se eliminó `justify-content: space-between` de las columnas ilustradas. Ese
  reparto artificial del espacio libre era el origen de los interlineados
  enormes en Lectura fácil + Mayúsculas. El texto conserva ahora su interlínea
  tipográfica natural y el algoritmo incorpora únicamente unidades semánticas
  completas que caben junto a la imagen.
- Antes de reconstruir el DOM por un cambio de Lectura fácil, Mayúsculas o
  tamaño, se captura el `data-id` TTS activo y se mantiene el destino bloqueado
  durante la repaginación. Una descripción de imagen ya no puede retroceder a
  la última oración de la página anterior.

### Pruebas funcionales de este ajuste

- `qz007`: 12 muestras cada 35 ms después de seleccionar una respuesta; fondo
  estable `rgb(22, 184, 172)`, sin overlay ni clase de repaginación.
- Lectura fácil + Mayúsculas en la página ilustrada conflictiva: columna en
  flujo normal, `justify-content: normal` y cuatro unidades contiguas con
  separación geométrica de 0 px; desaparece el estiramiento vertical.
- Descripción `pg052_im002` activa: al pasar de Lectura fácil ON a OFF se
  conserva el mismo `IMG` y el resaltado; la numeración cambia de 101/116 a
  73/86 por la repaginación, pero el contenido semántico no cambia.
- Prueba inversa, OFF a ON, incluso con el reproductor pausado: se conserva
  `pg052_im002`, el borde de imagen y el destino 101/116.

## Ajustes `46-integrated-31`

- Se corrigieron los botones Anterior/Siguiente del reproductor como una
  navegación semántica independiente de la página visual. El cursor
  autoritativo es ahora el último ítem enviado al TTS; una protección o
  repaginación pendiente ya no puede devolverlo al inicio ni repetir el borde
  de una página.
- Si el reproductor estaba pausado, el cambio de ítem se confirma primero y
  la pausa se restablece inmediatamente después. Se evita así cancelar la carga
  del nuevo MP3 antes de que React registre el destino.
- Las oraciones de Lectura fácil son bloques de ancho completo. Esto elimina
  la concurrencia de dos fragmentos importados en una misma línea y el
  solapamiento observado en `pg049_sec001`/`pg050_sec001`.
- Se descubrió que `getBoundingClientRect()` devolvía la unión de varios
  fragmentos de una columna paginada: una columna real de 556 px era informada
  como 1.836 px. El balanceo de las páginas ilustradas usa ahora el primer
  fragmento real de la columna junto a la imagen.
- En Lectura fácil ilustrada se redujo exclusivamente el margen adicional
  entre oraciones a `.42em`; la interlínea accesible permanece en `1.55`. El
  algoritmo puede incorporar más unidades completas sin fabricar bandas
  verticales ni reducir la letra.

### Pruebas funcionales de este ajuste

- Lectura fácil + Mayúsculas + Extra grande, IDs `pg049_n0021` a
  `pg050_n0003`: cero intersecciones geométricas entre bloques.
- Reproductor pausado: Anterior cambió de ítem 369 a 368 y permaneció en
  `Reproducir` durante 12 muestras; Siguiente volvió de 368 a 369 y permaneció
  pausado durante 10 muestras.
- Altillo en viewport de 1.280 px: la columna se midió en sus 556 px reales,
  no en la unión multicolumna de 1.836 px. La selección de texto usa el alto
  de la imagen pintada y sólo mueve unidades semánticas completas.
- Validador estructural: 49 secciones, 22 del capítulo 2, tres quizzes del
  capítulo 2, 2.097 audios por voz, cero recursos o timecodes faltantes y cero
  errores.

## Ajustes `46-integrated-34`

- La descripción TTS de la portada principal conserva su audio, pero ya no
  aplica el borde amarillo de resaltado de imagen.
- Las imágenes fuente ocultas de las portadillas de los capítulos 1 y 2 se
  vinculan geométricamente al contenedor visible de su portadilla. El
  resaltado se pinta sobre la imagen compuesta visible y la narración no puede
  seguir la geometría de un nodo oculto hacia la página siguiente o el último
  quiz.
- Se eliminó un segundo listener de los botones de página. Antes, un solo clic
  ejecutaba primero el listener del botón y después el listener delegado del
  documento, avanzando dos columnas y desincronizando página visual y cursor
  TTS.
- Las mutaciones y cambios de tamaño que pertenecen exclusivamente al paso del
  resaltado entre globos de WhatsApp ya no disparan una repaginación general.

### Pruebas funcionales de este ajuste

- Botón de página: delta medido de exactamente una columna por clic.
- WhatsApp: cuatro pasos consecutivos de audio, seis muestras por paso;
  `scrollLeft` permaneció en la misma página, opacidad `1` y cero overlays.
- Portadilla del capítulo 1: dos descripciones de imagen con overlay sobre la
  imagen compuesta y página estable; el cambio de página ocurrió después.
- Portadilla del capítulo 2: las dos descripciones de imagen permanecieron en
  la portadilla y nunca saltaron al quiz final.
- Portada principal: cuatro ítems narrados en la página 1, cero overlays y
  cero clases de imagen activa; el quinto ítem avanzó normalmente.

## Ajustes `46-integrated-35`

- Se eliminó el parpadeo que todavía era visible al avanzar manualmente el
  TTS dentro del chat de WhatsApp, especialmente al abrir el libro con
  `file://` desde Finder.
- La causa era un intervalo entre dos operaciones: el cleanup de React
  borraba el `CSS Highlight` anterior antes de que el siguiente MP3 local
  terminara de preparar su nuevo rango.
- El cleanup conserva ahora el rango amarillo anterior durante una ventana
  de traspaso y el primer rango del nuevo ítem lo reemplaza atómicamente. Si
  la reproducción se detiene realmente, una limpieza diferida elimina el
  rango; los botones Detener y Texto a voz OFF fuerzan limpieza inmediata.

### Pruebas funcionales de este ajuste

- Chat de WhatsApp, página 23: pasos consecutivos de Audio siguiente sin
  cambio de página, opacidad, geometría del chat ni posición de controles.
- Muestreo inmediato, a 20 ms y a 100 ms después del paso: siempre hubo un
  rango amarillo pintado; no apareció el fotograma intermedio sin resaltado.

## Ajustes `46-integrated-36`

- Se unificó la tipografía textual completa en Atkinson Hyperlegible:
  contenido editorial, chats, quizzes, índice, glosario, idioma,
  configuración, controles TTS y navegación inferior.
- Se reemplazaron las reglas activas de Verdana, Georgia y Merriweather tanto
  en la hoja global como en las declaraciones heredadas de las secciones HTML.
- Las clases de iconografía conservan su fuente técnica para no sustituir los
  glifos de Font Awesome; esto no afecta ninguna etiqueta textual.

### Pruebas funcionales de este ajuste

- `getComputedStyle`: contenido y los cuatro tipos de diálogo informaron
  `"Atkinson Hyperlegible", sans-serif`.
- Inspección visual de Índice, Glosario, Idioma, Configuración y reproductor
  TTS: cero etiquetas cortadas o desbordadas y todos los íconos intactos.

## Ajustes `46-integrated-37`

- Se reemplazó la ventana temporal fija del traspaso manual del TTS por un
  estado explícito de handoff. Al pulsar Audio anterior o Audio siguiente, el
  rango visual vigente permanece pintado hasta que el destino prepara el suyo.
- La primera palabra u oración del destino se pinta sincrónicamente antes de
  devolver el control al runtime. El navegador sustituye así un `CSS Highlight`
  por otro dentro de la misma tarea y no puede componer un cuadro vacío.
- Un cleanup tardío de React ya no puede borrar el resaltado de un ítem nuevo:
  si el elemento que se desmonta ya no es el elemento TTS activo, su limpieza
  se clasifica como obsoleta y se descarta.
- El reloj del audio fuente se pausa antes de seleccionar el destino manual,
  evitando la carrera entre su callback `onended` y el clic explícito.
- Los observadores de layout y mutaciones del chat ignoran el período real de
  handoff en lugar de depender únicamente de un margen fijo de 650 ms. Existe
  un failsafe de diez segundos sólo para un recurso de audio ausente o dañado.

### Pruebas funcionales de este ajuste

- Chat de WhatsApp: diez retrocesos pausados y diez avances pausados; cada clic
  modificó exactamente un ID semántico, el reproductor permaneció pausado y la
  opacidad del contenido permaneció siempre en `1`.
- En los primeros nueve avances dentro de la misma página, `scrollLeft`, la
  posición del chat y el número visual de página permanecieron invariantes. El
  décimo avanzó una sola página al alcanzar realmente el contenido siguiente.
- Muestreo de la transición cada 8–12 ms: cero overlays transitorios, cero
  cambios de opacidad, cero transformaciones y cero repaginaciones del chat.

## Ajustes `46-integrated-38`

- Se retiró por completo la opción Mayúsculas del panel, el estado de runtime,
  las reglas condicionales y la preferencia persistida de versiones anteriores.
- El libro reserva `18.75rem` a cada lado en escritorio. Índice, glosario,
  idioma y configuración quedan fuera de la caja central y no se solapan con
  texto, chats ni páginas ilustradas.
- El ancho exterior se mantuvo idéntico en Normal, Grande y Extra grande con
  Lectura fácil ON/OFF. Los párrafos conservan una medida interna de `72ch`.
- Todas las composiciones imagen/texto alinean sus bordes superiores. La
  redistribución conserva unidades completas y usa esa alineación como fallback
  cuando una igualdad inferior exigiría romper un párrafo o alterar el
  interlineado accesible.
- Se cotejaron las sangrías del PDF original en las páginas 39–57 y se
  registraron los verdaderos comienzos de párrafo. En modo normal los puntos
  seguidos fluyen inline y los puntos aparte reciben separación de bloque.
- Títulos introductorios, títulos de capítulo y subtítulos de portadilla usan
  mayúscula inicial y resto en minúsculas, tanto en contenido como en el índice.

### Pruebas funcionales de este ajuste

- Viewport de 1280 px: caja central de 680 px; panel izquierdo 0–288 px,
  panel derecho 992–1280 px y solapamiento medido de 0 px.
- Seis combinaciones tamaño/LF en `pg052`: ancho constante de 680 px y
  diferencia entre bordes superiores de imagen y texto de 0 px.
- `pg054`/`pg055`: continuidad inline entre `pg054_n0023` y `pg055_n0002`;
  saltos de párrafo confirmados antes de `pg055_n0004`, `pg055_n0005` y
  `pg055_n0012`, de acuerdo con el PDF.

## Ajustes `46-integrated-45`

- Se validaron 128 inicios de párrafo del capítulo 1 y 100 del capítulo 2
  contra las sangrías visibles del PDF, sin diferencias ni casos ambiguos.
- Se aplanaron únicamente los wrappers de prosa narrativa segura. Los puntos
  seguidos ya no reciben saltos falsos por la estructura HTML importada; los
  puntos aparte conservan el separador derivado del PDF.
- La navegación explícita mantiene prioridad sobre las restauraciones tardías
  de hash y layout. El chat de WhatsApp puede atravesarse con un clic por página
  y permanece estable después de todos los temporizadores de reconciliación.
- La portada iguala el ancho visual de «1930» y «El viaje» y centra
  `desafioprofundo.org` sin solaparlo con las fotografías.
- La firma de Alfredo Etchandy vuelve a ser un bloque independiente alineado a
  la derecha.
- Los quizzes conservan su estética: mayor separación entre opciones y botón,
  tarjeta blanca compactada al contenido y un único borde de selección verde
  claro de 4 px en la misma caja.
- Las páginas ilustradas incorporan el máximo número posible de unidades
  semánticas completas medido sobre el DOM real. Si la siguiente oración no
  cabe, imagen y texto comparten borde superior como fallback accesible.

## Ajustes `46-integrated-48-final`

- La frase de Lectura fácil se corrigió editorialmente a «A Javier le llaman la
  atención los ojos celestes.». Se retiró el enlace residual «y las» que había
  quedado al combinar el corte de página original con la reescritura accesible,
  y se regeneraron los MP3/timecodes correspondientes.
- La entrega inicia una sola vez en tamaño Normal y Lectura fácil OFF aunque
  el mismo navegador conserve preferencias de pruebas anteriores. A partir de
  ese inicio, las elecciones expresas del lector vuelven a persistir.
- La medición de portada confirma que «1930» y «El viaje» ocupan exactamente
  el mismo ancho visual y comparten el mismo centro horizontal.
- Los quizzes conservan su altura exacta al pulsar «Enviar». La medición se
  toma antes de insertar el feedback; éste puede ampliar la tarjeta cuando lo
  necesita, pero ya no puede achicarla durante la interacción.

## Ajustes `46-integrated-49-final`

- Las columnas de texto de todas las páginas ilustradas reciben exactamente la
  altura renderizada de su imagen contigua, después de separar al desborde sólo
  unidades semánticas completas.
- En la escena del altillo, Lectura fácil dejó de decidir el reparto mediante
  una estimación de caracteres. Ahora mide cada fila real en el navegador para
  evitar tanto columnas cortas como desbordes en Extra grande.
- Las filas accesibles conservan el interlineado 1,55 y se distribuyen entre
  los mismos bordes superior e inferior de la ilustración, sin agrandar la
  tipografía ni partir oraciones.

## Ajustes `46-integrated-50-final`

- Antes de enviar un quiz se capturan el alto, el relleno y la separación real
  de cada opción. El feedback ya no activa la antigua regla compacta que
  apretaba el texto dentro de recuadros más bajos.
- También se conserva el origen vertical de la pregunta. Reemplazar el botón
  por un feedback de altura distinta no puede desplazar ligeramente hacia
  abajo la pregunta ni las opciones.
