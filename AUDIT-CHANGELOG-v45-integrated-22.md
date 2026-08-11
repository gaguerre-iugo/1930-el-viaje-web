# Informe auditable — v45 integrada 22

Fecha: 28 de julio de 2026  
Alcance: introducción + capítulo 1, sobre la versión integrada 45.

Este informe separa síntoma, causa, cambio y verificación. No se agregó
vocabulario al glosario ni se modificó el texto narrativo.

## 1. Chat de WhatsApp con Lectura fácil, Mayúsculas y letra ampliada

### Síntoma

El chat grande podía forzar el último globo a otra columna o interferir con
la navegación cuando coincidían Lectura fácil, Mayúsculas y tamaño Grande o
Extra grande.

### Causa

`break-inside: avoid-column` es una preferencia, no una garantía: si el bloque
indivisible supera o tensiona la altura disponible, Chromium debe fragmentarlo
y elige un punto interno. Las mayúsculas y las sustituciones de Lectura fácil
aumentan los saltos de línea y alteran esa altura.

### Cambio

El chat conserva un único DOM semántico y los mismos seis mensajes. Sólo en
Grande/Extra grande + Lectura fácil + Mayúsculas se presentan dos tarjetas
estables:

- primera tarjeta: fecha y mensajes 1–3;
- segunda tarjeta: mensajes 4–6;
- cada tarjeta es indivisible y la segunda comienza en una columna nueva;
- Normal y las demás combinaciones siguen mostrando un solo chat.

No se redujo el tamaño tipográfico ni se duplicaron IDs o audios.

### Verificación

- Grande: partes en páginas visuales 37 y 38; alturas 227 y 267 px;
  un fragmento por parte.
- Extra grande: partes en páginas visuales 47 y 48; alturas 255 y 304 px;
  un fragmento por parte.
- Normal: wrappers con `display: contents`; chat exterior con un fragmento.

## 2. Resaltado y velocidad de narración

### Síntoma

Rápido/Muy rápido forzaban Oración correctamente, pero al volver a Normal
no se restauraba Palabra.

### Causa

La implementación anterior sólo escribía `WordHighlight=false`; no registraba
si Oración provenía de la restricción automática o de una elección manual.

### Cambio

Al entrar en velocidad restringida se guarda la preferencia previa:

- si era Palabra, se fuerza Oración y se marca la restauración pendiente;
- si ya era Oración, no se marca restauración;
- al volver a Lento/Normal se restaura Palabra sólo en el primer caso.

### Verificación

- Palabra → Rápido = Oración → Normal = Palabra.
- Oración manual → Rápido = Oración → Normal = Oración.

## 3. Cuestionarios en Extra grande

### Síntoma

La pregunta se reducía mientras las opciones crecían.

### Causa

Existía una excepción CSS que bajaba la pregunta a `1.12rem × escala` para
reservar espacio a «Comprensión lectora · Pregunta N de 3» y a la dimensión.

### Cambio

- se ocultan visualmente esos dos metadatos;
- la pregunta usa `1.35rem × escala` en Extra grande;
- las dimensiones pedagógicas permanecen registradas en el DOM y en el orden:
  recuperación, interpretación y reflexión.

### Verificación

- pregunta: 30,24 px;
- opciones: 28 px;
- alturas de las tres tarjetas: 392, 502 y 538 px sobre 640 px disponibles;
- un fragmento por tarjeta.

## 4. Glosario

### Qué se había cambiado

No se agregó la palabra «maqueta». Ya estaba en
`content/i18n/es-UY/glossary.json`, con singular y plural. El cambio anterior
amplió el marcado desde la primera aparición global a una aparición por nodo
de texto. Eso produjo tres marcas seguidas en las respuestas del quiz.

### Cambios actuales

- no se marcan preguntas, opciones ni feedback de cuestionarios;
- se marca como máximo la primera aparición de cada término por sección fuente;
- las apariciones posteriores en otras secciones siguen disponibles;
- «En esta página» se calcula con los rectángulos de la columna visual actual,
  no con todo `#content`;
- «Glosario del libro» conserva el inventario completo;
- «Mostrar en la página» calcula la columna del término y llama a la
  navegación paginada atómica. Una reconciliación a 140 ms absorbe el retorno
  de foco tardío del panel React.

### Verificación

- página visual probada: 1 término («altillo»);
- glosario completo: 98 entradas;
- términos marcados dentro de quizzes: 0;
- apariciones marcadas de «maqueta»: 1;
- «Mostrar en la página» para «turbinas»: página 20 exacta,
  `scrollLeft / viewportWidth = 19`.

## 5. Archivos modificados

- `assets/reflow-book.js`: composición del chat, estado de resaltado,
  adaptador del glosario y navegación a términos.
- `content/reflow.css`: división condicional del chat, tipografía del quiz y
  estado visual del término localizado.
- `quiz_final.html`: dimensiones pedagógicas registradas como datos auditables.
- `index.html` y `assets/config.json`: identificación y caché de la versión.

## 6. Limitación de la auditoría

El inspector integrado bloqueó la apertura directa del archivo local `.mov`
por su política de URLs. No se eludió esa restricción. Los estados descriptos
en la grabación se reprodujeron directamente en la versión web local y se
midieron sobre el DOM renderizado.

