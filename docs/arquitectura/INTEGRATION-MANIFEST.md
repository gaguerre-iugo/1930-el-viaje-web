# Versión 45 — manifiesto de integración

Build vigente de esta carpeta: **`45-final`**.

La versión 45 parte de la versión 44 integrada, conserva todos sus aportes y
completa el capítulo 1 con las páginas originales 29–35 del libro completo.

| Origen | Aporte conservado en v44 |
| --- | --- |
| v35 | Portada final: imagen completa, sin recorte ni bloque bordeaux; textos Verdana sobre zonas despejadas; color y márgenes equilibrados. |
| v36 | Menús superpuestos, en Verdana y sin desplazamiento ni repaginación del contenido. |
| v38 | Índice y lista de páginas basados en paginación visual: sin «Imprimir», títulos correctos y destinos dinámicos. |
| v39 | Subtítulos preliminares con tamaño, peso, alineación, espaciado y separación superior unificados. |
| v40 | Paneles compactos y anclados al borde: índice de 280 px, Configuración de 288 px y glosario de 300 px; contenido completo desde el primer clic. |
| v41 | TTS: Configuración inicia la lectura; el parlante sólo abre el reproductor; Play inicia manualmente; Pausa persiste al cambiar de página. En v44, Play/Detener y Texto a voz ON/OFF comparten un único estado. |
| v42 | Cuestionarios sobre fondo turquesa Ceibal, con tarjetas y opciones blancas; selección y corrección se comunican mediante borde e icono sin tapar el texto. |
| v44 | Interruptor «Mayúsculas» ON/OFF, persistente y compatible con repaginación, Lectura fácil, tres tamaños de letra y TTS. |
| v45 | Capítulo 1 completo; unidad paragrafal en modo estándar; chats de WhatsApp al ancho de la caja de texto; nuevo chat semántico sin duplicados; 322 alineaciones de audio nuevas; composiciones ilustradas corregidas; portada reparada; índice alineado con la interfaz Ceibal. |

La v38 es la base técnica porque contiene la navegación visual corregida. La
portada de esa base se reemplazó explícitamente por la implementación de v35.
La v37 fue auditada: su primera solución contra las anclas invisibles quedó
completamente superada por el cálculo visual más preciso de v38. La mejora
independiente de paneles de v40 sí se recuperó e integró explícitamente.

## Validación realizada

- Carga completa del paquete por servidor local, sin recursos 404 ni errores
  o advertencias de consola.
- Portada: `pg001_cover_art_repaired_v2.png`, `object-fit: contain`, proporción
  `738 / 1078` y mismo color calculado para «1930» y «EL VIAJE».
- Índice: 32 páginas visuales en modo estándar en la ventana de prueba; la cantidad sigue recalculándose según formato y viewport.
- Navegación: páginas 10 y 16 verificadas con contenidos diferentes y
  correctos.
- Menús: índice de 280 px a la izquierda, Configuración de 288 px y glosario
  de 300 px a la derecha; anclados al borde, completos desde el primer clic,
  en Verdana y sin repaginar el contenido principal.
- El panel compacto de idioma muestra Buscar, Español (Uruguay) y Lectura
  fácil con el primer clic. El engranaje y su encabezado se llaman
  «Configuración»; ya no aparece «IA Universal».
- «Lista de páginas» recibe una proporción mayor dentro del mismo ancho del
  índice. «Oración» queda completamente visible en el selector de resaltado
  sin reducir Verdana ni ensanchar Configuración.
- Interruptores activos, resaltado seleccionado y tamaño elegido usan el mismo
  turquesa claro del fondo de cuestionarios (`#16b8ac`) como convención visual;
  el indicador circular de todos los interruptores activos es blanco, incluido
  «Resaltar palabras» en el glosario.
- Jerarquía tipográfica responsive: títulos de capítulo 28/36 px,
  subtítulos 18/22 px, cuerpo 18/20 px y captions 16/16 px en móvil/escritorio.
  Grande y Extra grande conservan escalas proporcionales de 1,2 y 1,4.
- TTS: parlante sin reproducción automática; Play inicia y enciende Texto a
  voz; Detener lo apaga; activar desde Configuración inicia; apagar desde
  Configuración detiene; Pausa permanece tras avanzar de la 16 a la 17.
- Cuestionarios: las tres páginas finales; fondo `#16b8ac`; opciones blancas y selección
  con borde, sin relleno ni sombra. ✓ y ✕ conservan 10 px de separación
  respecto del texto en las respuestas verificadas.
- Mayúsculas, sin Lectura fácil: Normal 31 páginas, Grande 40 y Extra grande
  49 en la ventana de prueba; sin páginas fantasma, desbordamientos ni
  solapamientos.
- Mayúsculas, con Lectura fácil: Normal 34 páginas, Grande 41 y Extra grande
  53; sin páginas fantasma, desbordamientos ni solapamientos.
- La página ilustrada redistribuye el texto según su altura renderizada, no
  según una tabla fija de modos. El texto lateral queda centrado y todo el
  excedente continúa en columnas normales.
- La dirección de la portada se reajusta en mayúsculas para permanecer en la
  franja despejada de la imagen.
- Persistencia comprobada tras recargar. El texto fuente mantuvo su caja
  original mientras la representación visible cambió a mayúsculas.
- TTS comprobado en resaltado por Palabra y Oración. El cambio de caja con el
  reproductor pausado mantuvo la pausa.
- Cuestionario comprobado en Mayúsculas + Extra grande: tarjeta dentro del
  viewport, sin desbordamiento, y ✕ separada 10 px de la respuesta.

El diagnóstico estructural y las reglas preventivas quedan registrados en
`REFLOW-TYPOGRAPHY-KNOWHOW.md`.

## Validación específica de v45

- Páginas originales 29–35 presentes y navegables antes del cuestionario.
- 322 textos/audios importados y 322 entradas nuevas de tiempo por palabra,
  sin fallas de alineación.
- Modo estándar: las unidades de audio se muestran `inline` dentro de cada
  bloque paragrafal; los bloques distintos conservan su separación editorial.
- Lectura fácil: las unidades pueden separarse y los chats permanecen dentro
  de una sola página visual.
- Chats de las páginas 20, 21 y 29: ancho calculado igual al ancho de columna;
  el chat de la 29 contiene una fecha y seis mensajes, sin IDs duplicados.
- Portada: la unión horizontal dejada por el título original se reconstruyó
  mediante una máscara localizada. La composición final toma únicamente esa
  banda de la edición generativa; personajes, fotografías y resto del arte
  conservan exactamente los píxeles originales.
- Página ilustrada del comedor: imagen ampliada y texto lateral limitado por
  la altura superior e inferior renderizada de la imagen.
- Página del altillo: imagen y texto forman una única composición adaptable,
  con imagen a la izquierda y texto alineado a la izquierda a la derecha. En
  Extra grande y Lectura fácil se trasladan únicamente las últimas oraciones
  que exceden la altura real de la imagen; al volver a Normal se restaura el
  bloque completo y su orden semántico.
- Páginas visuales 24, 26 y 27: márgenes, sangrías y alineaciones importadas
  normalizadas en todos los niveles de wrappers; todo el cuerpo queda a la
  izquierda.
- Chat de la página 29: separación inferior aumentada levemente sin alterar
  el ancho común de la caja de texto. El nombre entrante «FEDE» conserva el
  fucsia de la fuente (`#db2777`); «JAVI» mantiene la etiqueta oscura.
- Índice: buscador, pestañas, estados activos y botones de navegación usan la
  misma jerarquía visual, radios, tarjetas y turquesa claro (`#16b8ac`) del panel
  de accesibilidad. La sección y la página actuales quedan identificadas.
- Glosario: tarjetas y pestañas alineadas con Índice y Configuración, sin
  superposición entre «En esta página» y «Glosario del libro»; pestaña y botón
  de barra activos usan el mismo turquesa claro.
- Cuestionarios: tras responder se oculta la acción Enviar, se compactan sólo
  los espacios de interfaz y el feedback queda completo dentro de la tarjeta
  en Normal, Grande y Extra grande, sin reducir el tamaño tipográfico.
- El cierre «Red Global de Aprendizajes» forma una unidad semántica con la
  oración anterior. Ya no queda huérfano ni se superpone en Extra grande,
  mayúsculas o Lectura fácil.
- TTS y navegación: cuando un elemento sincronizado ocupa dos páginas, se
  conserva la página elegida por el usuario. Verificado avance 33→34 con
  mayúsculas, tamaño Normal y Texto a voz activo.
- TTS y navegación explícita: durante el breve reajuste del audio se descarta
  cualquier devolución tardía del elemento anterior. Verificados, con audio
  reproduciéndose y mayúsculas, los recorridos 33→34→35→36 en Normal y
  46→47→48 en Extra grande, sin rebote.
- Glosario: la lista, la ficha de definición, «Mostrar en la página» y la
  selección consecutiva de dos palabras del texto comparten un único ciclo de
  estado visible. La ficha ya no queda fuera del viewport al reemplazar la
  lista.
- Velocidad y resaltado: Lento y Normal permiten Palabra u Oración. Rápido y
  Muy rápido fuerzan Oración y deshabilitan visual y funcionalmente Palabra;
  al volver a Lento/Normal se restaura Palabra sólo si la restricción la había
  cambiado automáticamente. Una elección manual de Oración se conserva.
- Cuestionarios: la acción Enviar conserva una separación de 0,75 rem respecto
  de la última opción (0,7 rem en Extra grande) y el feedback evaluado continúa
  completo dentro de la tarjeta.
- Matriz de control de la nueva composición: Normal mantiene 32 páginas y todo
  el pasaje junto a la imagen; Extra grande produce 51 páginas y continúa
  `pg031_n0006`–`pg031_n0007` en la página siguiente; Lectura fácil Normal
  produce 40 páginas y continúa sólo `pg031_n0007`. En los tres casos el texto
  lateral queda entre los bordes superior e inferior de la imagen.
- Navegación con Lectura fácil + Mayúsculas: los cambios de página son
  atómicos y cada control parte de la columna realmente visible. Se verificaron
  33→34→35→36 en Extra grande, sin rebote ni anclaje en la página anterior.
- Glosario: se marca como máximo la primera aparición de cada vocablo por
  sección fuente; los cuestionarios quedan excluidos. «En esta página» usa la
  columna visual actual y «Mostrar en la página» navega a una columna entera.
- Chat de la página 29: Normal conserva el chat único. Con Lectura fácil,
  Mayúsculas y Grande/Extra grande, los seis globos se distribuyen 3+3 en dos
  tarjetas consecutivas e indivisibles, sin reducir tipografía ni duplicar IDs.
- Cuestionarios: se ocultan los rótulos «Pregunta N de 3» y la dimensión; la
  correspondencia recuperación→interpretación→reflexión queda registrada en
  el DOM. En Extra grande la pregunta mide 30,24 px y las opciones 28 px.
- Navegación del chat: el paginador absorbe ambos ejes y la inercia del trackpad
  y realiza como máximo un cambio de página por gesto. Las dos tarjetas
  condicionales tienen anclas semánticas propias. Verificado `47 → 48 → 47` en
  Extra grande + Lectura fácil + Mayúsculas, sin rebote.
- TTS inactivo: una navegación manual descarta el elemento de audio obsoleto;
  reactivar Texto a voz comienza desde la página visual actual.
- TTS y glosario: el rango amarillo atraviesa wrappers verdes y prevalece sobre
  ellos durante la palabra u oración activa. Al avanzar, el verde reaparece sin
  modificar el vocabulario.
- Glosario Unicode: «canjeó» se marca completo y una sola vez en su sección;
  los límites ya no dependen de `\b` ASCII.
- Composición del altillo: el párrafo y la imagen comparten borde superior e
  inferior mediante medición de líneas y ajuste de interlineado. La diferencia
  verificada fue de 0,04 px en Normal y 0,18 px en Extra grande.
- La mecánica y las pruebas de estas correcciones están documentadas en
  `AUDIT-CHANGELOG-v45-integrated-32.md` y en los dos documentos de know-how.
- Lectura fácil junto a la imagen del altillo conserva su interlineado `1,55`
  en lugar de estirar las unidades para igualar bordes. En Normal y Extra
  grande, «UN MANOJO» permanece unido y el bloque se centra sin desbordar.
- Cuando el chat de la página 29 se divide, la segunda tarjeta incorpora antes
  del primer mensaje la locución «Continuación de la conversación de
  WhatsApp». El ID y el ítem TTS se agregan sólo en la configuración dividida
  y se retiran al volver al chat único.
- Estos dos ajustes están auditados en
  `AUDIT-CHANGELOG-v45-integrated-33.md`.
- El anuncio de continuación y su rango de resaltado heredan ahora la página
  visual de la segunda tarjeta. En la prueba de 30 segundos el TTS avanzó
  directamente `47 → 48`, sin salto transitorio a la página final.
- Se diagnosticó que la diferencia del altillo en Mayúsculas + Lectura fácil
  + Extra grande proviene de `pg031_n0006`: tres oraciones, un solo ID y un
  solo audio. Se conserva como unidad indivisible y se registran métricas DOM
  `data-reflow-attic-*` para futuras auditorías.
- Estas correcciones están auditadas en
  `AUDIT-CHANGELOG-v45-integrated-34.md`.
- Lectura fácil + Mayúsculas iguala ahora la altura de imagen y texto del
  altillo distribuyendo espacio entre ideas, sin alterar el interlineado
  interno `1.55`: 373/373 px en Normal, 450/450 en Grande y 500/500 en Extra
  grande en la ventana de control.
- La locución de entrada dice «Ventana de chat de uatsap» y la segunda tarjeta
  anuncia «Continuación de la conversación de uatsap». La grafía visible
  conserva «WhatsApp».
- Valentina (`es-UY-ValentinaNeural`) y Mateo (`es-UY-MateoNeural`) cuentan
  con catálogos completos equivalentes: 1206 MP3 y 1206 entradas de
  sincronización por voz, sin vacíos y con cobertura textual validada. El
  selector expone ambas voces porque las dos superan la validación integral.
- La mecánica, los conteos y las pruebas se documentan en
  `AUDIT-CHANGELOG-v45-integrated-35.md`.
- Los controles TTS pausados ya no heredan el cero global del runtime: sin
  posición toman la primera unidad de la página visual y avanzan o retroceden
  relativamente desde allí.
- Reproducción automática inicia la primera unidad de la nueva página sólo si
  Texto a voz está habilitado e inactivo. Una pausa manual siempre prevalece.
- El Índice usa «Páginas» y el encabezado del Glosario separa 16 px el título
  de «Resaltar palabras».
- Estas correcciones están auditadas en
  `AUDIT-CHANGELOG-v45-integrated-36.md`.
- Mateo (`es-UY-MateoNeural`) se incorpora con el mismo inventario semántico
  que Valentina y marcas temporales obtenidas de su propia síntesis. Cambiar
  de narrador conserva la página y la unidad semántica actual; sólo sustituye
  el recurso de audio y su alineación correspondiente.
- La generación, los conteos y la validación reproducible están documentados
  en `AUDIT-CHANGELOG-v45-integrated-37.md`.
- La v45 final impide que una geometría intermedia muestre otro quiz al
  activar Lectura fácil, Mayúsculas o un tamaño distinto: conserva una copia
  visual inerte de la pregunta actual hasta recolocar su ID semántico.
- Los emojis de chat usan una descripción audible explícita. El mono `🐒`
  permanece visible, pero Valentina y Mateo dicen «emolli de un mono»; toda la
  descripción se alinea con el único glifo para el resaltado.
- El diagnóstico, la implementación y las pruebas cuadro por cuadro quedan en
  `AUDIT-CHANGELOG-v45-final.md`.

## Estado frente al pedido tipográfico inicial

| Requisito | Estado en v45 |
| --- | --- |
| Unidad paragrafal y puntos seguidos/aparte del original | Implementado en modo estándar; Lectura fácil puede segmentar las unidades de sincronización. |
| Chats de WhatsApp al ancho de la caja de texto | Implementado. |
| Alineación izquierda | Implementada y normalizada también en wrappers importados. |
| Interlineado 1,5–1,6 | Implementado para el cuerpo principal (`1.55`). |
| Texto lateral contenido entre los bordes de la imagen | Implementado por medición del rectángulo renderizado, no por una tabla fija. |
| Lectura fácil OFF de inicio | Implementado: la función está disponible, pero el estado persistente nace en `false`. |
| Atkinson Hyperlegible para el contenido | Implementado. Índice, Glosario, Configuración y barra conservan Verdana. |
| Cuerpo de 18 px móvil / 20 px escritorio | Implementado. Tablet usa provisionalmente interpolación fluida hasta recibir el valor definitivo. |
| Títulos, subtítulos y captions según la tabla 28/36, 18/22 y 16/16 px | Implementado; la portada artística conserva su escala geométrica como excepción explícita. |
| Ancho de lectura de 65–75 caracteres | Implementado en 72ch. |
| Selector TTS Valentina/Mateo y audio completo con ambas voces | Implementado: cada voz posee 1206 audios y 1206 alineaciones propias; ambas se ofrecen únicamente tras validar el catálogo completo. |
