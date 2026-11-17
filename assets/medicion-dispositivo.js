/* Arnés de medición en el propio equipo.
   Se activa con `?medicion=1` sobre el paquete real: mismo código, mismo
   camino, un parámetro más. Sin el parámetro no hace absolutamente nada, así
   que el libro que usan los chicos no cambia.
   Mide tres cosas:
     1. Arranque: cuánto tarda el libro en quedar usable en este equipo.
     2. Cambio de página: cuánto tarda cada uno de cinco avances.
     3. Lectura en voz alta: cuántos audios avanza por segundo y si la pantalla
        se traba (cuadros por segundo y tareas largas).
   Los resultados se muestran en pantalla y además se envían al servidor de
   desarrollo (quedan en su registro), para no tener que copiarlos a mano. */
(function () {
  if (!/[?&](medicion|medir)=1(?:&|$)/.test(window.location.search)) return;

  var arranqueMs = null;
  var vioCapa = false;
  var fcpMs = null;
  var loadMs = null;
  var tareas = [];

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

  /* El libro queda usable cuando retira su capa de carga. Hay que esperar a que
     la capa aparezca: al principio del documento todavía no existe y medir su
     ausencia daría 50 ms. */
  (function esperarArranque() {
    var capa = document.getElementById("reflow-loading");
    if (arranqueMs !== null) return;
    if (capa) { vioCapa = true; }
    else if (vioCapa) {
      arranqueMs = Math.round(performance.now());
      pintaEstado();
      return;
    }
    window.requestAnimationFrame(esperarArranque);
  })();

  function ms(valor) { return valor === null ? "—" : String(valor); }

  function lineaCodigo(datos) {
    return "1930|arr=" + ms(arranqueMs) +
      "|fcp=" + ms(fcpMs) +
      "|load=" + ms(loadMs) +
      "|maxlong=" + (tareas.length ? Math.max.apply(null, tareas.map(function (t) { return t.ms; })) : 0) +
      "|nlong=" + tareas.length +
      "|vista=" + window.innerWidth + "x" + window.innerHeight + "@" + (window.devicePixelRatio || 1) +
      (datos ? "|" + datos : "");
  }

  function pintaEstado() {
    if (!salida) return;
    salida.textContent = lineaCodigo();
  }

  var panel = document.createElement("div");
  panel.id = "medicion-panel";
  panel.style.cssText = [
    "position:fixed", "top:8px", "left:8px", "z-index:2147483000",
    "max-width:min(560px,94vw)", "background:rgba(12,18,28,.94)", "color:#fff",
    "font:13px/1.45 ui-monospace,Consolas,monospace", "padding:10px 12px",
    "border-radius:10px", "box-shadow:0 6px 24px rgba(0,0,0,.45)",
    "border:2px solid #16b8ac"
  ].join(";");
  panel.innerHTML =
    '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
      '<strong style="font-size:14px;color:#16b8ac">Medición</strong>' +
      '<button type="button" data-m="arranque" style="' + boton() + '">Arranque</button>' +
      '<button type="button" data-m="paginas" style="' + boton() + '">Página ×5</button>' +
      '<button type="button" data-m="leer" style="' + boton() + '">Leer 8 s</button>' +
      '<button type="button" data-m="enviar" style="' + boton() + '">Enviar</button>' +
      '<button type="button" data-m="cerrar" style="' + boton() + ';opacity:.7">×</button>' +
    '</div>' +
    '<pre id="medicion-salida" style="margin:8px 0 0;white-space:pre-wrap;' +
      'word-break:break-word;font:12px/1.5 ui-monospace,Consolas,monospace;' +
      'color:#e8eef5;max-height:46vh;overflow:auto"></pre>';

  function boton() {
    return "background:#1f2b3d;color:#fff;border:1px solid #35506f;border-radius:7px;" +
      "padding:6px 10px;font:inherit;font-size:12px;cursor:pointer";
  }

  document.addEventListener("DOMContentLoaded", montar);
  if (document.readyState !== "loading") montar();
  function montar() {
    if (document.getElementById("medicion-panel")) return;
    document.body.appendChild(panel);
    salida = document.getElementById("medicion-salida");
    pintaEstado();
    panel.addEventListener("click", alTocar);
  }
  var salida = null;

  var ultimoCodigo = "";

  function alTocar(evento) {
    var boton = evento.target.closest("button[data-m]");
    if (!boton) return;
    var accion = boton.getAttribute("data-m");
    if (accion === "cerrar") { panel.remove(); return; }
    if (accion === "arranque") {
      ultimoCodigo = lineaCodigo("etapa=arranque");
      salida.textContent = ultimoCodigo;
      return;
    }
    if (accion === "paginas") { medirPaginas(); return; }
    if (accion === "leer") { medirLectura(); return; }
    if (accion === "enviar") { enviar(); return; }
  }

  function enviar() {
    var datos = ultimoCodigo || lineaCodigo();
    salida.textContent = datos + "\n\nenviando…";
    fetch("/medicion/" + encodeURIComponent(datos), { cache: "no-store" })
      .then(function () { salida.textContent = datos + "\n\nenviado"; })
      .catch(function () { salida.textContent = datos + "\n\nno se pudo enviar"; });
  }

  function etiquetaPagina() {
    var estado = document.getElementById("reflow-page-status");
    return estado ? estado.getAttribute("aria-label") || estado.textContent : "";
  }

  function medirPaginas() {
    var siguiente = document.getElementById("reflow-next");
    if (!siguiente) { salida.textContent = "no encontré el botón de página siguiente"; return; }
    var tiempos = [];
    var inicio = etiquetaPagina();
    salida.textContent = "midiendo cinco cambios de página…";

    function paso(indice) {
      if (indice >= 5) { terminar(); return; }
      var antes = etiquetaPagina();
      var t0 = performance.now();
      siguiente.click();
      (function esperar() {
        if (etiquetaPagina() !== antes) {
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
              tiempos.push(Math.round(performance.now() - t0));
              paso(indice + 1);
            });
          });
          return;
        }
        if (performance.now() - t0 > 20000) {
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
      var mediana = ordenados.length ? ordenados[Math.floor(ordenados.length / 2)] : -1;
      var detalle = tiempos.join("/");
      ultimoCodigo = lineaCodigo(
        "etapa=paginas|pg=" + detalle + "|mediana=" + mediana +
        "|fps_pg=" + (validos.length ? Math.round(1000 / mediana) : 0) +
        "|ini=" + encodeURIComponent(inicio) + "|fin=" + encodeURIComponent(etiquetaPagina())
      );
      salida.textContent = ultimoCodigo;
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
    salida.textContent = yaAndaba
      ? "midiendo ocho segundos de lectura en voz alta…"
      : "arrancando la lectura y midiendo ocho segundos…";
    window.setTimeout(function () { muestrear(); }, yaAndaba ? 0 : 1500);

    function muestrear() {
      var cuadros = 0;
      var t0 = performance.now();
      var inicioIndice = api && Number.isFinite(Number(api.currentIndex))
        ? Number(api.currentIndex) : null;
      var tareasInicio = tareas.length;
      (function cuadro() {
        cuadros += 1;
        if (performance.now() - t0 < 8000) { window.requestAnimationFrame(cuadro); return; }
        var transcurrido = performance.now() - t0;
        var finIndice = api && Number.isFinite(Number(api.currentIndex))
          ? Number(api.currentIndex) : null;
        var avances = (inicioIndice !== null && finIndice !== null)
          ? finIndice - inicioIndice : null;
        var nuevas = tareas.slice(tareasInicio);
        var peor = nuevas.length
          ? Math.max.apply(null, nuevas.map(function (t) { return t.ms; })) : 0;
        var totalTrabado = nuevas.reduce(function (suma, t) { return suma + t.ms; }, 0);
        var andando = !!(api && api.isPlaying);
        ultimoCodigo = lineaCodigo(
          "etapa=leer|sonando=" + (andando ? "si" : "no") +
          "|avances=" + (avances === null ? "sin-api" : avances) +
          "|ms_por_avance=" + (avances ? Math.round(transcurrido / avances) : 0) +
          "|fps=" + Math.round(cuadros / (transcurrido / 1000)) +
          "|maxlong_lect=" + peor +
          "|ms_trabados=" + Math.round(totalTrabado)
        );
        salida.textContent = ultimoCodigo +
          (avances === 0 ? "\n\nla lectura no avanzó: revisá que el audio suene en el equipo" : "");
      })();
    }
  }
})();
