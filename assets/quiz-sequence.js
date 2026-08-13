(function () {
  "use strict";

  var resultAudio = null;
  var resultAudioTimer = 0;
  var resultRun = 0;

  function normalizeQuizSubmitLabels() {
    document.querySelectorAll("button").forEach(function (button) {
      var visibleLabel = String(button.textContent || "").trim().toLocaleLowerCase("es");
      var titleLabel = String(button.getAttribute("title") || "").trim().toLocaleLowerCase("es");
      var ariaLabel = String(button.getAttribute("aria-label") || "").trim().toLocaleLowerCase("es");
      var isLegacyLabel = visibleLabel === "comprobar respuesta" ||
        titleLabel === "comprobar respuesta" || ariaLabel === "comprobar respuesta";
      if (button.classList.contains("quiz-submit") || isLegacyLabel) {
        if (visibleLabel !== "enviar") button.textContent = "Enviar";
        if (titleLabel === "comprobar respuesta") button.setAttribute("title", "Enviar");
        if (ariaLabel === "comprobar respuesta") button.setAttribute("aria-label", "Enviar");
      }
    });
  }

  function normalizeQuizRetryPolicies() {
    document.querySelectorAll(".quiz-panel:not([data-allow-retry])").forEach(
      function (panel) {
        /* Compiled exports created before the policy existed remain retryable.
           An explicit editorial false value is never overwritten. */
        panel.dataset.allowRetry = "true";
      }
    );
  }

  var submitLabelUpdateScheduled = false;
  function scheduleSubmitLabelUpdate() {
    if (submitLabelUpdateScheduled) return;
    submitLabelUpdateScheduled = true;
    requestAnimationFrame(function () {
      submitLabelUpdateScheduled = false;
      normalizeQuizSubmitLabels();
      normalizeQuizRetryPolicies();
    });
  }

  normalizeQuizSubmitLabels();
  normalizeQuizRetryPolicies();
  new MutationObserver(scheduleSubmitLabelUpdate).observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });

  function panelFor(target) {
    return target && target.closest ? target.closest(".quiz-panel") : null;
  }

  function panelAllowsRetry(panel) {
    return Boolean(panel && panel.dataset.allowRetry === "true");
  }

  function stopResultAudio() {
    resultRun += 1;
    window.clearTimeout(resultAudioTimer);
    resultAudioTimer = 0;
    if (!resultAudio) return;
    resultAudio.pause();
    resultAudio.currentTime = 0;
    resultAudio = null;
  }

  function playResultAudio(isCorrect, onFinished) {
    stopResultAudio();
    var run = resultRun;
    var audio = new Audio(
      "./assets/sounds/" + (isCorrect ? "success.mp3" : "error.mp3")
    );
    resultAudio = audio;
    audio.volume = .5;
    audio.preload = "auto";
    var finished = false;
    function finish() {
      if (finished || run !== resultRun) return;
      finished = true;
      if (resultAudio === audio) resultAudio = null;
      if (onFinished) onFinished();
    }
    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    var playResult = audio.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(finish);
    }
    /* success.mp3 contains a long silent tail. End the effect after its
       audible flourish so spoken feedback can begin without a dead pause. */
    if (isCorrect) {
      resultAudioTimer = window.setTimeout(function () {
        audio.pause();
        finish();
      }, 1250);
    }
  }

  function clearConfetti(panel) {
    panel.querySelectorAll(".quiz-confetti").forEach(function (layer) {
      layer.remove();
    });
  }

  function launchConfetti(panel) {
    var bookRequestsReducedMotion =
      typeof window.__adtReflowShouldReduceMotion === "function" &&
      window.__adtReflowShouldReduceMotion();
    var systemRequestsReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (bookRequestsReducedMotion || systemRequestsReducedMotion) {
      clearConfetti(panel);
      return;
    }
    /* Reuse the book runtime's original canvas-confetti engine and its exact
       activity parameters. This produces the slower, full-screen celebration
       used by the source quizzes. */
    if (typeof window.__adtReflowConfetti === "function") {
      window.__adtReflowConfetti({
        particleCount: 120,
        spread: 90,
        startVelocity: 45,
        origin: { x: .5, y: .7 }
      });
      return;
    }
    var card = panel.querySelector(".quiz-card");
    if (!card) return;
    clearConfetti(panel);
    var layer = document.createElement("span");
    layer.className = "quiz-confetti";
    layer.setAttribute("aria-hidden", "true");
    var colors = ["#ffcf24", "#e84c3d", "#2aa876", "#2d7dd2", "#9b5de5", "#f58f29"];
    for (var index = 0; index < 72; index += 1) {
      var piece = document.createElement("i");
      piece.style.setProperty("--confetti-x", (2 + Math.random() * 96).toFixed(2) + "%");
      piece.style.setProperty("--confetti-drift", (-70 + Math.random() * 140).toFixed(0) + "px");
      piece.style.setProperty("--confetti-delay", (Math.random() * 450).toFixed(0) + "ms");
      piece.style.setProperty("--confetti-duration", (2200 + Math.random() * 1100).toFixed(0) + "ms");
      piece.style.setProperty("--confetti-turn", (420 + Math.random() * 720).toFixed(0) + "deg");
      piece.style.setProperty("--confetti-color", colors[index % colors.length]);
      layer.appendChild(piece);
    }
    card.appendChild(layer);
    window.setTimeout(function () {
      if (layer.isConnected) layer.remove();
    }, 4200);
  }

  function clearValidation(panel) {
    clearConfetti(panel);
    panel.classList.remove("quiz-result-correct", "quiz-result-incorrect");
    panel.querySelectorAll(".quiz-option").forEach(function (option) {
      option.classList.remove("is-correct", "is-incorrect");
      option.removeAttribute("aria-invalid");
      var mark = option.querySelector(".quiz-result-mark");
      if (mark) mark.remove();
    });
  }

  function clearFeedback(panel) {
    var feedback = panel.querySelector(".quiz-feedback");
    if (!feedback) return;
    stopResultAudio();
    if (window.__adtReflowStopQuizFeedback) window.__adtReflowStopQuizFeedback();
    feedback.replaceChildren();
    feedback.removeAttribute("data-feedback-audio-id");
    feedback.classList.remove("is-correct", "is-incorrect");
    feedback.setAttribute("aria-hidden", "true");
    clearValidation(panel);
  }

  document.addEventListener("change", function (event) {
    var input = event.target;
    if (!input.matches || !input.matches('.quiz-panel input[type="radio"]')) return;
    var panel = panelFor(input);
    if (!panel) return;
    if (panel.dataset.quizEvaluated === "true" && !panelAllowsRetry(panel)) return;
    panel.removeAttribute("data-quiz-evaluated");
    panel.querySelectorAll(".quiz-option").forEach(function (option) {
      option.classList.toggle("is-selected", option.contains(input));
    });
    var submit = panel.querySelector(".quiz-submit");
    if (submit) submit.disabled = false;
    clearFeedback(panel);
  });

  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest(".quiz-submit");
    if (!button) return;
    var panel = panelFor(button);
    var selected = panel && panel.querySelector('input[type="radio"]:checked');
    if (!panel || !selected) return;

    var option = selected.closest(".quiz-option");
    var explanationId = option && option.dataset.explanationId;
    var explanation = explanationId
      ? panel.querySelector('[data-feedback-audio-id="' + explanationId + '"]') ||
        panel.querySelector('[data-id="' + explanationId + '"]')
      : null;
    var isCorrect = option && option.dataset.correct === "true";
    var feedback = panel.querySelector(".quiz-feedback");
    if (!feedback) return;

    clearValidation(panel);
    option.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    option.setAttribute("aria-invalid", String(!isCorrect));
    panel.classList.add(isCorrect ? "quiz-result-correct" : "quiz-result-incorrect");

    var optionMark = document.createElement("span");
    optionMark.className = "quiz-result-mark";
    optionMark.setAttribute("aria-hidden", "true");
    optionMark.textContent = isCorrect ? "✓" : "×";
    option.appendChild(optionMark);

    var icon = document.createElement("span");
    icon.className = "quiz-feedback-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = isCorrect ? "✓" : "×";
    var message = document.createElement("span");
    message.className = "quiz-feedback-text";
    message.textContent = explanation ? explanation.textContent.trim() :
      (isCorrect ? "Correcto." : "La respuesta no es correcta.");
    feedback.replaceChildren(icon, message);
    feedback.dataset.feedbackAudioId = explanationId || "";
    feedback.classList.toggle("is-correct", Boolean(isCorrect));
    feedback.classList.toggle("is-incorrect", !isCorrect);
    feedback.setAttribute("aria-hidden", "false");
    panel.dataset.quizEvaluated = "true";
    button.disabled = true;
    if (!panelAllowsRetry(panel)) {
      panel.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.disabled = true;
        var label = input.closest(".quiz-option");
        if (label) label.setAttribute("aria-disabled", "true");
      });
    }
    feedback.focus({ preventScroll: true });

    if (isCorrect) launchConfetti(panel);

    if (window.__adtReflowStopQuizFeedback) window.__adtReflowStopQuizFeedback();
    var audioApi = window.__adtReflowAudio;
    if (audioApi && audioApi.pause) audioApi.pause();
    playResultAudio(isCorrect, function () {
      if (window.__adtReflowReadQuizFeedback && explanationId) {
        window.__adtReflowReadQuizFeedback(explanationId, feedback);
      }
    });
  });
})();
