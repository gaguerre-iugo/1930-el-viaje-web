/* Arnés de medición en el propio equipo.
   Se activa con `?medicion=1` sobre el paquete real: mismo código, mismo
   camino, un parámetro más. Sin el parámetro no hace absolutamente nada, así
   que el libro que usan los chicos no cambia.
   Mide tres cosas:
     1. Arranque: cuánto tarda el libro en quedar usable en este equipo.
     2. Cambio de página: cuánto tarda cada uno de cinco avances.
     3. Lectura en voz alta: cuántos audios avanza por segundo y si la pantalla
        se traba (cuadros por segundo y tareas largas).
   Los resultados se ACUMULAN, así una sola captura de pantalla los muestra
   todos. El botón «Resumen» los pone en grande, con los números separados para
   que se lean en la foto, y la línea completa en letra chica al pie. No
   necesita red. */
(function () {
  if (!/[?&](medicion|medir)=1(?:&|$)/.test(window.location.search)) return;

  var arranqueMs = null;
  var vioCapa = false;
  var fcpMs = null;
  var loadMs = null;
  var tareas = [];
  var medidas = { arranque: null, paginas: null, leer: null };
  var panel = null;
  var salida = null;

  /* Tareas largas: cualquier bloque de más de 50 ms congela la pantalla. Son la
     causa directa de que "no responda" al tocar. */
  try {
    new PerformanceObserver(function (lista) {
      lista.getEntries().forEach(function (entrada) {
        tareas.push({ t: Math.round(entrada.startTime), ms: Math.round(entrada.duration) });
      });
    }).observe({ type: "longtask", buffered: true });
  } catch (_error) {}

  try {
    new PerformanceObserver(function (lista) {
      lista.getEntries().forEach(function (entrada) {
        if (entrada.name === "first-contentful-paint" && fcpMs === null) {
          fcpMs = Math.round(entrada.startTime);
        }
      });
    }).observe({ type: "paint", buffered: true });
  } catch (_error) {}

  window.addEventListener("load", function () { loadMs = Math.round(performance.now()); });

  /* Cuenta de audios que arrancan. `currentIndex` del motor no sirve para esto:
     cambia por archivo de audio, no por palabra, así que dentro de un audio
     largo se queda quieto aunque el resaltado avance. Este enganche sí ve cada
     reproducción, porque el arnés se carga antes que el libro. */
  var reproducciones = 0;
  var elementosDeAudio = [];
  try {
    var reproducirOriginal = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      reproducciones += 1;
      if (elementosDeAudio.indexOf(this) === -1) elementosDeAudio.push(this);
      return reproducirOriginal.apply(this, arguments);
    };
  } catch (_error) {}

  /* ¿Hay audio sonando ahora? Se mira el elemento real: `isPlaying` del motor es
     una copia congelada del estado con que se armó, no un valor vivo. */
  function suenaAhora() {
    return elementosDeAudio.some(function (elemento) {
      return !elemento.paused && elemento.currentTime > 0;
    });
  }

  /* Huella del resaltado de lectura (Custom Highlight `adt-tts-active`). Cada
     palabra u oración nueva deja una huella distinta: contarlas mide lo que la
     persona ve avanzar. */
  function claveResaltado() {
    try {
      var highlights = window.CSS && window.CSS.highlights;
      var activo = highlights && highlights.get("adt-tts-active");
      if (!activo || !activo.size) return "";
      return Array.from(activo).slice(0, 3).map(function (rango) {
        return rango.startOffset + "-" + rango.endOffset + ":" +
          String(rango.startContainer && rango.startContainer.nodeValue || "").slice(0, 6);
      }).join("|");
    } catch (_error) { return ""; }
  }

  /* El libro está usable cuando retiró la capa de carga Y ya tiene su barra de
     navegación. Cuando se sirve rápido (segunda visita, caché), la capa
     desaparece antes de que existan los botones de página: quedarse con la sola
     capa daba un arranque corto y dejaba la medición de páginas sin botón. */
  var libroListo = false;

  function libroEstaUsable() {
    return !document.getElementById("reflow-loading") &&
      !!document.getElementById("reflow-next") &&
      !!document.getElementById("reflow-page-status");
  }

  (function esperarArranque() {
    if (arranqueMs !== null) return;
    if (document.getElementById("reflow-loading")) vioCapa = true;
    else if (vioCapa && libroEstaUsable()) {
      arranqueMs = Math.round(performance.now());
      libroListo = true;
      medidas.arranque = {
        arr: arranqueMs,
        fcp: fcpMs,
        load: loadMs,
        maxlong: peorTarea(0),
        nlong: tareas.length
      };
      pintar();
      return;
    }
    window.requestAnimationFrame(esperarArranque);
  })();

  function ms(valor) {
    return valor === null || valor === undefined ? "—" : String(valor);
  }

  function peorTarea(desde) {
    var lista = tareas.slice(desde || 0);
    return lista.length ? Math.max.apply(null, lista.map(function (t) { return t.ms; })) : 0;
  }

  var ORDEN = ["arranque", "paginas", "leer"];
  var TITULOS = { arranque: "ARRANQUE", paginas: "CAMBIO DE PÁGINA", leer: "LECTURA EN VOZ ALTA" };

  function comun() {
    return "arr=" + ms(arranqueMs) +
      "|fcp=" + ms(fcpMs) +
      "|load=" + ms(loadMs) +
      "|maxlong=" + peorTarea(0) +
      "|nlong=" + tareas.length +
      "|vista=" + window.innerWidth + "x" + window.innerHeight + "@" + (window.devicePixelRatio || 1) +
      "|pantalla=" + (window.screen ? window.screen.width + "x" + window.screen.height : "—");
  }

  function lineaCruda(clave) {
    var medida = medidas[clave];
    if (!medida) return null;
    if (clave === "arranque") return "1930|etapa=arranque|" + comun();
    if (clave === "paginas") {
      return "1930|etapa=paginas|" + comun() +
        "|pg=" + medida.tiempos.join("/") + "|mediana=" + medida.mediana +
        "|ini=" + encodeURIComponent(medida.ini) + "|fin=" + encodeURIComponent(medida.fin);
    }
    return "1930|etapa=leer|" + comun() +
      "|sonando=" + (medida.sonando ? "si" : "no") +
      "|pasos=" + medida.pasos +
      "|audios=" + medida.audios +
      "|ms_por_paso=" + medida.msPorPaso +
      "|fps=" + medida.fps +
      "|maxlong_lect=" + medida.maxlongLect +
      "|ms_trabados=" + medida.msTrabados;
  }

  function bloqueTexto() {
    var lineas = [];
    ORDEN.forEach(function (clave) {
      var crudo = lineaCruda(clave);
      if (crudo) lineas.push(TITULOS[clave] + "\n" + crudo);
    });
    if (!lineas.length) {
      lineas.push("Todavía no hay mediciones.\nTocá Arranque, después Página ×5 y después Leer 8 s.");
    }
    return lineas.join("\n\n");
  }

  function pintar() {
    if (!salida) return;
    salida.textContent = bloqueTexto();
  }

  document.addEventListener("DOMContentLoaded", montar);
  if (document.readyState !== "loading") montar();
  window.addEventListener("load", function () {
    montar();
    vigilarPanel();
  });

  /* El libro reemplaza el contenido del cuerpo cuando termina de arrancar. Si el
     arranque es rápido (segunda visita, servido desde caché), el panel quedaba
     montado antes de ese reemplazo y desaparecía: en GitHub Pages pasó con el
     libro ya en caché. Se cuelga del elemento raíz, que el libro no reemplaza, y
     además se revisa cada segundo por si algo lo saca. */
  function vigilarPanel() {
    window.setInterval(function () {
      if (!panel) return;
      if (panel.parentNode !== document.documentElement) {
        document.documentElement.appendChild(panel);
        salida = document.getElementById("medicion-salida");
      }
    }, 1000);
  }

  function montar() {
    if (panel && panel.isConnected) return;
    if (document.getElementById("medicion-panel")) return;
    panel = document.createElement("div");
    panel.id = "medicion-panel";
    panel.style.cssText = [
      "position:fixed", "top:10px", "left:10px", "z-index:2147483000",
      "max-width:min(620px,95vw)", "background:#0c121c", "color:#fff",
      "font:13px/1.45 ui-monospace,Consolas,monospace", "padding:12px 14px",
      "border-radius:12px", "box-shadow:0 8px 28px rgba(0,0,0,.5)",
      "border:2px solid #16b8ac"
    ].join(";");
    panel.innerHTML =
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
        '<strong style="font-size:15px;color:#16b8ac">Medición 1930</strong>' +
        '<button type="button" data-m="arranque" style="' + estiloBoton() + '">Arranque</button>' +
        '<button type="button" data-m="paginas" style="' + estiloBoton() + '">Página ×5</button>' +
        '<button type="button" data-m="leer" style="' + estiloBoton() + '">Leer 8 s</button>' +
        '<button type="button" data-m="resumen" style="' + estiloBoton(true) + '">Resumen</button>' +
        '<button type="button" data-m="cerrar" style="' + estiloBoton() + ';opacity:.65">×</button>' +
      '</div>' +
      '<pre id="medicion-salida" style="margin:10px 0 0;white-space:pre-wrap;' +
        'word-break:break-word;font:12px/1.55 ui-monospace,Consolas,monospace;' +
        'color:#e8eef5;max-height:44vh;overflow:auto"></pre>';
    document.documentElement.appendChild(panel);
    salida = document.getElementById("medicion-salida");
    pintar();
    panel.addEventListener("click", alTocar);
  }

  function estiloBoton(destacado) {
    return "background:" + (destacado ? "#16b8ac" : "#1f2b3d") + ";" +
      "color:" + (destacado ? "#04202a" : "#fff") + ";" +
      "border:1px solid " + (destacado ? "#16b8ac" : "#35506f") + ";border-radius:8px;" +
      "padding:7px 11px;font:inherit;font-size:12px;font-weight:600;cursor:pointer";
  }

  function alTocar(evento) {
    var boton = evento.target.closest("button[data-m]");
    if (!boton) return;
    var accion = boton.getAttribute("data-m");
    if (accion === "cerrar") { panel.remove(); return; }
    if (accion === "resumen") { mostrarResumen(); return; }
    if (accion === "arranque") {
      medidas.arranque = {
        arr: arranqueMs,
        fcp: fcpMs,
        load: loadMs,
        maxlong: peorTarea(0),
        nlong: tareas.length
      };
      pintar();
      return;
    }
    if (accion === "paginas") { medirPaginas(); return; }
    if (accion === "leer") { medirLectura(); return; }
  }

  /* Renglón de número grande para leer en una captura. */
  function renglon(etiqueta, valor, nota) {
    return '<div style="display:flex;justify-content:space-between;gap:16px;' +
      'border-bottom:1px solid #1d2b3c;padding:5px 0">' +
      '<span style="color:#b9c9da">' + etiqueta + '</span>' +
      '<span style="font-weight:700;white-space:nowrap">' + valor +
      (nota ? ' <span style="color:#7d92a8;font-weight:400">' + nota + '</span>' : '') +
      '</span></div>';
  }

  function seccion(titulo, cuerpo) {
    return '<h2 style="font:700 15px/1.4 ui-monospace,Consolas,monospace;' +
      'color:#16b8ac;margin:22px 0 6px;letter-spacing:.06em">' + titulo + '</h2>' + cuerpo;
  }

  /* Resumen a pantalla completa: es lo que se fotografía o se captura. */
  function mostrarResumen() {
    var anterior = document.getElementById("medicion-resumen");
    if (anterior) anterior.remove();

    var partes = [];
    if (medidas.arranque) {
      partes.push(seccion("ARRANQUE",
        renglon("Libro usable en la pantalla", ms(medidas.arranque.arr) + " ms") +
        renglon("Primer contenido en pantalla", ms(medidas.arranque.fcp) + " ms") +
        renglon("Carga completa", ms(medidas.arranque.load) + " ms") +
        renglon("Bloqueo más largo", ms(medidas.arranque.maxlong) + " ms") +
        renglon("Bloqueos durante el arranque", String(medidas.arranque.nlong)) ));
    }
    if (medidas.paginas) {
      var t = medidas.paginas;
      var de = numeroDePagina(t.ini);
      var hasta = numeroDePagina(t.fin);
      partes.push(seccion("CAMBIO DE PÁGINA",
        renglon("Los cinco cambios", t.tiempos.join(" · ") + " ms") +
        renglon("Cambio típico (mediana)", t.mediana + " ms") +
        (de && hasta ? renglon("Recorrido", "página " + de + " a " + hasta) : "")));
    }
    if (medidas.leer) {
      var l = medidas.leer;
      partes.push(seccion("LECTURA EN VOZ ALTA",
        renglon("Audio sonando", l.sonando ? "sí" : "no") +
        renglon("Avances del resaltado en 8 s", String(l.pasos)) +
        renglon("Audios que arrancaron", String(l.audios)) +
        renglon("Cuadros por segundo", String(l.fps)) +
        renglon("Bloqueo más largo", l.maxlongLect + " ms") +
        renglon("Tiempo trabado en total", l.msTrabados + " ms")));
    }
    if (!partes.length) {
      partes.push('<p style="color:#b9c9da">Todavía no hay mediciones.</p>');
    }

    var crudo = ORDEN.map(lineaCruda).filter(Boolean).join("\n");

    var capa = document.createElement("div");
    capa.id = "medicion-resumen";
    capa.style.cssText = [
      "position:fixed", "inset:0", "z-index:2147483600", "background:#0c121c",
      "color:#e8eef5", "padding:20px 26px", "overflow:auto",
      "font:15px/1.5 ui-monospace,Consolas,monospace"
    ].join(";");
    capa.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;' +
        'border-bottom:2px solid #16b8ac;padding-bottom:10px">' +
        '<strong style="font-size:20px;color:#16b8ac">Medición · 1930: El viaje</strong>' +
        '<button type="button" data-cerrar-resumen style="' + estiloBoton() + '">Cerrar</button>' +
      '</div>' +
      '<div style="color:#7d92a8;font-size:13px;margin-top:8px">' +
        'Resolución ' + window.innerWidth + '×' + window.innerHeight +
        ', densidad ' + (window.devicePixelRatio || 1) + '</div>' +
      partes.join("") +
      (crudo
        ? '<h2 style="font:700 12px/1.4 ui-monospace,Consolas,monospace;color:#5d7389;' +
          'margin:26px 0 6px;letter-spacing:.06em">LÍNEA COMPLETA</h2>' +
          '<pre style="white-space:pre-wrap;word-break:break-word;font:11px/1.5 ' +
          'ui-monospace,Consolas,monospace;color:#8fa4b8;margin:0">' +
          crudo.replace(/[<>&]/g, function (c) {
            return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
          }) + '</pre>'
        : "");
    document.body.appendChild(capa);
    capa.addEventListener("click", function (evento) {
      if (evento.target.closest("[data-cerrar-resumen]") || evento.target === capa) capa.remove();
    });
  }

  function etiquetaPagina() {
    var estado = document.getElementById("reflow-page-status");
    return estado ? estado.getAttribute("aria-label") || estado.textContent : "";
  }

  /* Del rótulo «Capítulo 2, página 7 de 24» saca el 7, para mostrar el recorrido
     sin arrastrar el nombre del capítulo a la captura. */
  function numeroDePagina(etiqueta) {
    var encontrado = String(etiqueta || "").match(/p[áa]gina\s+(\d+)/i);
    return encontrado ? encontrado[1] : null;
  }

  var paginasEsperando = false;

  function medirPaginas() {
    var siguiente = document.getElementById("reflow-next");
    if (!siguiente) {
      /* El libro puede estar todavía montando su barra. Se espera hasta medio
         minuto antes de rendirse, y se avisa en pantalla qué está pasando. */
      if (paginasEsperando) return;
      paginasEsperando = true;
      salida.textContent = bloqueTexto() + "\n\nesperando que el libro termine de abrir…";
      var intentos = 0;
      var esperar = function () {
        intentos += 1;
        if (document.getElementById("reflow-next")) {
          paginasEsperando = false;
          medirPaginas();
          return;
        }
        if (intentos > 600) {
          paginasEsperando = false;
          salida.textContent = bloqueTexto() +
            "\n\nel libro no terminó de abrir: recargá la página y probá otra vez";
          return;
        }
        window.setTimeout(esperar, 50);
      };
      esperar();
      return;
    }
    var tiempos = [];
    var inicio = etiquetaPagina();
    salida.textContent = bloqueTexto() + "\n\nmidiendo cinco cambios de página…";

    /* Justo después de abrir, el libro todavía está asentando su paginación y
       puede tragarse el primer toque (medido: el primer cambio quedaba sin
       efecto). Se espera a que el contador de página quede quieto y después se
       hace un toque de calentamiento que NO se cronometra. */
    var etiquetaPrevia = etiquetaPagina();
    var quietos = 0;
    (function esperarQuieto() {
      var actual = etiquetaPagina();
      if (actual === etiquetaPrevia && actual) quietos += 1;
      else { quietos = 0; etiquetaPrevia = actual; }
      if (quietos >= 2) { calentar(0); return; }
      window.setTimeout(esperarQuieto, 400);
    })();

    function calentar(intentos) {
      var antes = etiquetaPagina();
      siguiente.click();
      var limite = performance.now() + 1500;
      (function mirar() {
        if (etiquetaPagina() !== antes) {
          inicio = etiquetaPagina();
          paso(0);
          return;
        }
        if (performance.now() > limite) {
          if (intentos < 4) calentar(intentos + 1);
          else { inicio = etiquetaPagina(); paso(0); }
          return;
        }
        window.requestAnimationFrame(mirar);
      })();
    }

    /* Cada intento invalida al anterior: si no, el vigilante viejo sigue mirando
       y anota el mismo cambio dos veces (medido: diez valores en vez de cinco). */
    var generacion = 0;

    function paso(indice, reintentos) {
      if (indice >= 5) { terminar(); return; }
      generacion += 1;
      var miGeneracion = generacion;
      var antes = etiquetaPagina();
      var t0 = performance.now();
      siguiente.click();
      (function esperar() {
        if (miGeneracion !== generacion) return;
        if (etiquetaPagina() !== antes) {
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
              if (miGeneracion !== generacion) return;
              tiempos.push(Math.round(performance.now() - t0));
              paso(indice + 1);
            });
          });
          return;
        }
        var transcurrido = performance.now() - t0;
        /* Un toque sin efecto se reintenta: el libro puede estar terminando de
           componer. Se rinde a los ocho segundos por cambio. */
        if (transcurrido > 1200 && reintentos < 3) {
          paso(indice, reintentos + 1);
          return;
        }
        if (transcurrido > 8000) {
          tiempos.push(-1);
          paso(indice + 1);
          return;
        }
        window.requestAnimationFrame(esperar);
      })();
    }

    function terminar() {
      var validos = tiempos.filter(function (t) { return t >= 0; });
      var ordenados = validos.slice().sort(function (a, b) { return a - b; });
      medidas.paginas = {
        tiempos: tiempos,
        mediana: ordenados.length ? ordenados[Math.floor(ordenados.length / 2)] : -1,
        ini: inicio,
        fin: etiquetaPagina()
      };
      pintar();
    }

    paso(0);
  }

  function medirLectura() {
    var api = window.__adtReflowAudio;
    var yaAndaba = !!(api && api.isPlaying);
    /* El toque del usuario es la habilitación de audio del navegador: si la
       lectura no estaba andando, se arranca acá mismo y no en un segundo paso. */
    if (api && !yaAndaba) {
      try { api.play(); } catch (_error) {}
    }
    salida.textContent = bloqueTexto() + "\n\n" + (yaAndaba
      ? "midiendo ocho segundos de lectura en voz alta…"
      : "arrancando la lectura y midiendo ocho segundos…");
    window.setTimeout(muestrear, yaAndaba ? 0 : 1500);

    function muestrear() {
      var cuadros = 0;
      var pasos = 0;
      var sonoAlgun = false;
      var ultimaClave = claveResaltado();
      var audiosAlEmpezar = reproducciones;
      var t0 = performance.now();
      var tareasInicio = tareas.length;
      (function cuadro() {
        cuadros += 1;
        if (suenaAhora()) sonoAlgun = true;
        var clave = claveResaltado();
        if (clave && clave !== ultimaClave) {
          pasos += 1;
          ultimaClave = clave;
        }
        if (performance.now() - t0 < 8000) { window.requestAnimationFrame(cuadro); return; }
        var transcurrido = performance.now() - t0;
        var audios = reproducciones - audiosAlEmpezar;
        var nuevas = tareas.slice(tareasInicio);
        medidas.leer = {
          /* «Sonando» describe la ventana medida, no el último instante: al
             terminar los ocho segundos el audio puede estar en pausa y eso no
             significa que no haya sonado. */
          sonando: sonoAlgun,
          pasos: pasos,
          audios: audios,
          msPorPaso: pasos ? Math.round(transcurrido / pasos) : 0,
          fps: Math.round(cuadros / (transcurrido / 1000)),
          maxlongLect: nuevas.length
            ? Math.max.apply(null, nuevas.map(function (t) { return t.ms; })) : 0,
          msTrabados: Math.round(nuevas.reduce(function (suma, t) { return suma + t.ms; }, 0))
        };
        pintar();
        if (!pasos && !audios) {
          salida.textContent = bloqueTexto() +
            "\n\nla lectura no avanzó: revisá que el audio suene en la pantalla";
        }
      })();
    }
  }
})();
