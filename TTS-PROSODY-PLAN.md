# Plan para una narración prosódica consistente

## Límite actual

El catálogo vigente usa `edge-tts`. Esta interfaz recibe texto plano, escapa
SSML y sólo permite modificar globalmente velocidad, volumen y altura. No
acepta un prompt narrativo ni curvas locales por frase. Valentina es una voz
estándar sin estilos o roles expresivos declarados por Microsoft.

Por eso una regeneración idéntica no resolvería de forma sistemática:

- rehilamiento variable de `ll`/`y`;
- reducción u omisión de la conjunción «y»;
- foco contrastivo;
- diferencias declarativa/interrogativa/imperativa;
- suspensiones, incisos y cierres narrativos.

## Capa prosódica propuesta

Antes de sintetizar, un modelo analiza unidades con su contexto paragrafal,
escena, hablante y turno. Produce un JSON auditable, no audio directo:

```json
{
  "id": "pg000_n0000",
  "speaker": "narrador",
  "illocution": "interrogativa_parcial",
  "phrases": [
    {
      "text": "¿Cuál de todas las llaves es?",
      "contour": "L+H* L-L%",
      "focus": ["cuál"],
      "break_after_ms": 450
    }
  ],
  "pronunciations": [
    {"grapheme": "llaves", "ipa": "ˈʒaβes"}
  ],
  "confidence": 0.88,
  "review": false
}
```

La notación puede usar ToBI simplificado o etiquetas más accesibles
(`subida`, `caída`, `suspensión`, `foco`, `pausa`). El JSON se transforma luego
en SSML con `s`, `break`, `prosody contour`, `pitch`, `rate`, `phoneme` y
lexicón.

## Flujo recomendado

1. Seleccionar 20–30 pasajes representativos: narración, diálogo, pregunta,
   orden, enumeración, inciso, suspenso y emoción.
2. Anotarlos automáticamente con contexto amplio.
3. Marcar ambigüedades y baja confianza para revisión humana.
4. Probar las anotaciones en Azure Speech Studio/Audio Content Creation.
5. Comparar audio plano y audio anotado mediante escucha ciega.
6. Fijar un perfil narrativo y un lexicón rioplatense versionados.
7. Regenerar audio **y marcas temporales juntos**; cualquier cambio prosódico
   invalida los timecodes anteriores.
8. Escalar al capítulo y después al libro completo sólo si el piloto mejora la
   comprensión de forma consistente.

## Aporte humano de mayor valor

- atribución de hablantes;
- intención pragmática de frases ambiguas;
- registro deseado del narrador;
- lista de pronunciaciones rioplatenses obligatorias;
- una lectura humana breve de referencia o anotaciones de 20–30 pasajes;
- decisiones sobre cuánto dramatizar sin perder claridad accesible.

Una transcripción prosódica derivada de una lectura humana es la referencia
más fiable. Si no existe audio humano, el modelo puede inferir una partitura,
pero esa salida sigue siendo una interpretación que conviene revisar.

## Evaluación del piloto Gemini/Puck recibido

El prompt recibido define una identidad vocal general —español montevideano,
articulación compacta, altura algo aguda, ritmo conversacional y ausencia de
musicalidad mexicana—, por lo que es un buen **perfil base de voz**. No alcanza
por sí solo como dirección de una obra extensa porque no describe qué debe
ocurrir en cada enunciado.

La versión de control debe separar dos capas:

1. **Perfil estable**: variedad uruguaya, timbre, altura, ritmo, grado de
   actuación y pronunciaciones obligatorias.
2. **Partitura contextual**: hablante, intención, foco, grupos entonativos,
   pausas, continuidades, cierres, suspensiones y emoción contenida de cada
   unidad.

No conviene reescribir fonéticamente todo el libro: dificulta auditar el texto
y puede inducir artefactos. Se mantiene el original como fuente canónica y se
aplican sustituciones o indicaciones fonéticas sólo a los casos problemáticos,
con un lexicón versionado. La capa contextual puede representarse en JSON
neutral y traducirse después al mecanismo que admita cada proveedor (SSML,
etiquetas o instrucciones de lenguaje natural).

### Prueba comparativa mínima

Para evaluar Gemini/Puck, Azure u otro sintetizador se usarán los mismos
20–30 pasajes y cuatro variantes:

- texto plano;
- sólo perfil estable;
- perfil estable más partitura contextual;
- partitura contextual más lexicón rioplatense localizado.

La escucha ciega evaluará inteligibilidad, naturalidad, adecuación pragmática,
consistencia dialectal y fatiga. Sólo la variante que mejore de manera estable
pasará a la generación del capítulo completo.
