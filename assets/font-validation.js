(function () {
  'use strict';

  var FAMILY = 'Atkinson Hyperlegible';
  var CONTROL_SELECTOR = [
    'button', 'input', 'select', 'textarea', 'output',
    '[role="button"]', '[role="tab"]', '[role="switch"]',
    '[role="radio"]', '[role="status"]'
  ].join(',');
  var timer = 0;
  var lastSignature = '';

  function isRendered(element) {
    var style = window.getComputedStyle(element);
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      element.getClientRects().length > 0;
  }

  function usesAtkinson(element) {
    return window.getComputedStyle(element).fontFamily
      .toLowerCase().indexOf(FAMILY.toLowerCase()) !== -1;
  }

  function describe(element) {
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || '',
      role: element.getAttribute('role') || '',
      className: typeof element.className === 'string' ? element.className : '',
      text: (element.textContent || element.value || '').trim().slice(0, 80),
      computedFamily: window.getComputedStyle(element).fontFamily
    };
  }

  function publish(passed, missingFaces, controls) {
    var signature = JSON.stringify({
      passed: passed,
      missingFaces: missingFaces,
      controls: controls
    });
    if (signature === lastSignature) {
      return window.__ATKINSON_FONT_AUDIT__ || null;
    }
    lastSignature = signature;

    var result = {
      passed: passed,
      family: FAMILY,
      checkedAt: new Date().toISOString(),
      missingFaces: missingFaces,
      controls: controls
    };

    try {
      window.__ATKINSON_FONT_AUDIT__ = result;
    } catch (error) {
      /* Some book runtimes freeze window after startup. The data attributes
         below remain available in those environments. */
    }
    document.documentElement.dataset.atkinsonFontAudit = passed ? 'pass' : 'fail';
    document.documentElement.dataset.atkinsonFontAuditDetails = JSON.stringify(result);
    window.dispatchEvent(new CustomEvent('atkinson-font-audit', { detail: result }));

    if (!passed) {
      console.error('[Atkinson audit] La fuente no se cargó o fue sustituida.', result);
    }
    return result;
  }

  function audit() {
    var missingFaces = [];
    var controls = [];
    var faceChecks = [
      { css: '400 16px "' + FAMILY + '"', text: '30 áéíóúñ¿¡' },
      { css: '700 16px "' + FAMILY + '"', text: '1930' }
    ];

    faceChecks.forEach(function (face) {
      if (!document.fonts.check(face.css, face.text)) {
        missingFaces.push(face);
      }
    });

    document.querySelectorAll(CONTROL_SELECTOR).forEach(function (element) {
      if (isRendered(element) && !usesAtkinson(element)) {
        controls.push(describe(element));
      }
    });

    return publish(missingFaces.length === 0 && controls.length === 0,
      missingFaces, controls);
  }

  function scheduleAudit() {
    window.clearTimeout(timer);
    timer = window.setTimeout(audit, 250);
  }

  function addedControls(mutations) {
    return mutations.some(function (mutation) {
      return Array.prototype.some.call(mutation.addedNodes, function (node) {
        return node.nodeType === 1 &&
          (node.matches(CONTROL_SELECTOR) || node.querySelector(CONTROL_SELECTOR));
      });
    });
  }

  function start() {
    Promise.all([
      document.fonts.load('400 16px "' + FAMILY + '"', '30 áéíóúñ¿¡'),
      document.fonts.load('700 16px "' + FAMILY + '"', '1930'),
      document.fonts.ready
    ]).then(audit).catch(function (error) {
      publish(false, [{ error: String(error) }], []);
    });

    new MutationObserver(function (mutations) {
      if (addedControls(mutations)) {
        scheduleAudit();
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    document.addEventListener('click', scheduleAudit, true);
    document.addEventListener('change', scheduleAudit, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}());
