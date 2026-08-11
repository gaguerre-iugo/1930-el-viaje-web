# Informe auditable — v45 final

Fecha: 29 de julio de 2026.

## 1. Destello de otro quiz al cambiar el formato

### Síntoma

Al activar Lectura fácil o Mayúsculas desde uno de los quizzes, durante una
fracción de segundo podía verse una pregunta vecina antes de regresar a la
pregunta elegida.

### Causa estructural

El runtime sustituye el texto de Lectura fácil y el CSS cambia las métricas de
Mayúsculas inmediatamente. La cantidad y posición de las columnas cambia en
ese mismo cuadro, pero el observador esperaba 220 ms para reagrupar mutaciones,
recalcular y recuperar la pregunta mediante su `data-id`. Durante esa espera,
el `scrollLeft` de la paginación anterior señalaba otra columna válida, por lo
que el navegador llegaba a pintarla.

### Solución

- Antes de un cambio tipográfico se identifica el quiz realmente visible y
  se conserva el ID de su pregunta.
- Se presenta una copia visual inerte del quiz actual mientras el contenido
  vivo se repagina. La copia no conserva IDs, nombres ni controles activos.
- Los observadores de contenido y tamaño priorizan el ID conservado aunque un
  evento intermedio modifique el índice visual.
- Tras recolocar la pregunta en su nueva columna, se retira la copia después
  de dos cuadros de pintura. Un temporizador de seguridad evita que quede
  retenida ante una excepción.

### Verificación

Se muestrearon los cuadros visibles durante cambios reales de interfaz:

- Quiz 1 + Mayúsculas: 100 muestras, cero cuadros vacíos y cero preguntas
  ajenas.
- Quiz 2 + Mayúsculas: 90 muestras, cero cuadros vacíos y cero apariciones del
  quiz anterior.
- Quiz 2 + Lectura fácil: 120 muestras durante las dos fases de repaginación,
  cero cuadros vacíos y cero preguntas ajenas.
- Quiz 3 + Lectura fácil: 120 muestras, cero cuadros vacíos y cero preguntas
  ajenas.

El indicador puede cambiar legítimamente de `32 / 33` a `34 / 35`, o pasar
por más de un total mientras el runtime instala Lectura fácil; la pregunta
visible permanece siempre unida a su ID semántico.

## 2. Descripción audible de emojis en chats

### Síntoma

El mono `🐒` se pronunciaba como «mono» pegado al texto del mensaje, sin
indicar que se trataba de un emoji.

### Solución

- El texto visible conserva `🐒`.
- Las locuciones `pg029_n0018` y `pg029_n0018_easy_read` dicen «emolli de un
  mono», con separación prosódica respecto del mensaje.
- La regla de síntesis mantiene un mapa explícito `emoji → descripción` para
  reutilizar el mismo mecanismo en futuros chats.
- Los cuatro límites temporales de la frase hablada se colapsan sobre el único
  glifo visible. Así el resaltado del emoji dura toda su descripción sin
  inventar palabras en pantalla.
- Valentina y Mateo fueron regenerados para ambas unidades. La copia de
  respaldo y sus marcas temporales también se sincronizaron desde Valentina.

### Validación

Ambos catálogos conservan 1206 MP3 y 1206 entradas temporales, cero vacíos,
rutas válidas, cobertura textual completa y marcas ordenadas.

## 3. Continuidad visual y navegación inerte

- El resguardo visual del quiz conserva ahora la tarjeta en sus coordenadas
  exactas mientras cambia la paginación. Ya no vuelve a centrar una copia y,
  por tanto, elimina el pequeño salto residual.
- Los controles anterior/siguiente del TTS toman como cursor principal el
  último ítem efectivamente enviado a reproducción y confirman el nuevo índice
  de inmediato. Esto evita reutilizar un resaltado anterior y mostrar
  fugazmente otra página.
- Los clics sin acción semántica dentro del contenido ya no heredan la
  navegación táctil del visor original. Los enlaces, controles, términos de
  glosario y opciones de quiz conservan su comportamiento; hacer clic en la
  ventana de WhatsApp no regresa a la página anterior. Si hay un panel abierto,
  ese mismo clic lo cierra antes de consumir la navegación heredada.
- Las dos locuciones del emoji se regeneraron para Valentina y Mateo con
  «emolli de un mono», manteniendo un solo glifo y una sola unidad temporal.

### Pruebas de regresión de este ajuste

- 10 clics consecutivos sobre el chat en Lectura fácil conservaron `31 / 43`.
- 10 clics consecutivos en Lectura fácil + Mayúsculas conservaron `35 / 49`.
- Índice, Glosario, Idioma, Configuración y el reproductor TTS se abrieron y
  cerraron con un clic sobre el contenido, sin modificar la página `23 / 33`.
- 10 avances semánticos de TTS se muestrearon cinco veces por paso: la secuencia
  fue monótona `31 → 32`, sin regreso transitorio a la página anterior.
- Un cambio manual de página con TTS activo se muestreó 25 veces: todas las
  muestras permanecieron en `33 / 43`.
- Ambos narradores conservan cobertura completa: 1205 textos más el alias
  histórico, 1206 rutas de audio y 1206 entradas temporales, sin vacíos.

## Regla transferible

Una repaginación nunca debe exponer coordenadas visuales provisionales: se
preserva primero el componente semántico y se publica la nueva geometría sólo
cuando está estable. Del mismo modo, un emoji visible es un único objetivo de
resaltado, aunque su alternativa audible contenga varias palabras.
