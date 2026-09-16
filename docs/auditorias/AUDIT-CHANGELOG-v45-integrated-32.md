# Informe auditable — v45 integrada 32

Fecha: 28 de julio de 2026  
Alcance: correcciones posteriores a `45-integrated-22` en introducción +
capítulo 1.

Este informe distingue síntoma, causa, solución y evidencia. Los cambios no
resumen ni reescriben el contenido narrativo.

## 1. Rebote entre las dos páginas del chat

### Síntoma

Con Lectura fácil, Mayúsculas y letra Grande o Extra grande, el chat dividido
en dos tarjetas podía alternar entre ambas páginas o volver a la anterior.

### Causas concurrentes

La grabación permitió separar tres mecanismos que producían el mismo síntoma:

1. el trackpad emitía desplazamiento horizontal y vertical, además de inercia;
   el lector interceptaba sólo el eje vertical dominante y dejaba que el eje
   horizontal desplazara nativamente `#content`;
2. la primera tarjeta del chat no contenía un ancla ordinaria de oración, por
   lo que la reconciliación conservaba el ancla de la página anterior;
3. Texto a voz habilitado pero detenido podía conservar un elemento activo
   antiguo y usarlo para devolver la navegación a su página.

### Solución

- El lector se apropia de ambos ejes de la rueda mientras dura un gesto.
- Acumula distancia hasta un umbral, avanza una única página y mantiene un
  cerrojo hasta 260 ms después del último evento de inercia.
- Cada parte semántica del chat recibe un `data-reflow-anchor-id` propio.
- Una navegación manual con TTS habilitado pero inactivo elimina el ancla de
  audio obsoleta antes de reconciliar la nueva página.
- La activación de TTS desde Configuración se alinea primero con la página
  visual actual.

### Verificación

En Extra grande + Lectura fácil + Mayúsculas, las dos partes ocuparon las
páginas visuales 47 y 48. Gestos fuertes de trackpad produjeron
`47 → 48 → 47`, exactamente una página por gesto y sin rebote. Las posiciones
fueron múltiplos enteros del ancho de columna.

## 2. Prioridad visual de TTS sobre el glosario

### Síntoma

Una palabra verde del glosario cortaba el resaltado amarillo de una oración:
se pintaba amarillo antes del término, luego el término y finalmente el resto.

### Causa

El wrapper `.glossary-term` fragmentaba el árbol de nodos de texto. El rango
de TTS se construía por nodo y no como una secuencia textual lógica única.

### Solución

- Se crea un mapa lógico de texto que concatena todos los nodos de una unidad
  TTS, incluidos los contenidos dentro de wrappers del glosario.
- Los rangos de palabra u oración se proyectan después sobre el DOM real.
- Todo término del glosario intersectado recibe temporalmente
  `.tts-glossary-covered`, cuyo amarillo prevalece sobre el verde.
- La clase se retira en cada avance y el verde reaparece de inmediato.

### Verificación

En modo Oración se pintó de una sola vez la frase completa que contenía
«Mundial de fútbol». En el cambio a la frase siguiente el término volvió a
verde. En modo Palabra se comprobó el mismo ciclo con «bisabuelo».

## 3. Igualación exacta entre imagen y párrafo lateral

### Síntoma

El texto del altillo quedaba contenido entre los bordes de la imagen, pero no
ocupaba exactamente su misma altura visible.

### Causa

Mover el excedente resuelve el desbordamiento, pero no distribuye las líneas
restantes hasta los dos bordes. Una regla fija de interlineado tampoco sirve
porque fuente, mayúsculas, Lectura fácil y ancho cambian la cantidad de líneas.

### Solución

1. se restaura el orden fuente antes de cada medición;
2. se mueven a continuación sólo las últimas oraciones que no caben;
3. se mide el alto renderizado de la imagen y las líneas visuales reales del
   párrafo mediante rectángulos de `Range`;
4. se calcula un interlineado específico para distribuir esas líneas entre el
   borde superior e inferior;
5. se refina la medición hasta ocho veces, sin cambiar tamaño de letra ni
   ancho de composición.

### Verificación

- Normal: imagen `372,836 px`; párrafo `372,875 px`; diferencia `0,04 px`.
- Extra grande: imagen `499,805 px`; párrafo `499,625 px`; diferencia
  `0,18 px`.

La tolerancia queda por debajo de un píxel y el excedente conserva el orden
semántico en la página siguiente.

## 4. Término «canjeó» incompleto

### Síntoma

El glosario resaltaba «canje» y dejaba fuera la «ó» final.

### Causa

El límite `\b` de JavaScript está basado en la noción ASCII de carácter de
palabra. La vocal acentuada no formaba parte del límite esperado, por lo que
la variante corta coincidía antes que «canjeó».

### Solución

- Los límites usan propiedades Unicode de letras, números y marcas:
  `\p{L}`, `\p{N}` y `\p{M}`.
- La deduplicación se realiza por término concreto (`termKey`) dentro de cada
  sección, no solamente por forma base.

### Verificación

La sección contiene un único wrapper cuyo texto exacto es «canjeó». La forma
corta posterior no genera una segunda marca en la misma sección.

## 5. Archivos modificados

- `assets/reflow-book.js`: gesto paginado, anclas del chat, reconciliación TTS,
  rangos lógicos, límites Unicode y balance imagen–texto.
- `content/reflow.css`: desplazamiento atómico, prioridad amarilla y
  composición ilustrada balanceada.
- `index.html` y `assets/config.json`: versión de recursos
  `45-integrated-32`.
- `REFLOW-NAVIGATION-KNOWHOW.md` y `REFLOW-TYPOGRAPHY-KNOWHOW.md`: reglas
  reutilizables para el libro completo.

## 6. Reglas que deben automatizarse al transferir el libro completo

- Un gesto físico debe producir como máximo un cambio de página.
- Cada columna compuesta sólo por widgets debe tener un ancla semántica.
- Un estado TTS inactivo no puede gobernar navegación manual.
- Los wrappers editoriales no pueden interrumpir el rango lógico de TTS.
- La coincidencia de glosario debe respetar límites Unicode.
- Las composiciones laterales deben validarse por rectángulos renderizados en
  toda la matriz tipográfica, no por cantidad de caracteres.

