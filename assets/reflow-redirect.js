(function () {
  "use strict";
  var titleMeta = document.querySelector('meta[name="title-id"]');
  if (!titleMeta || !titleMeta.content) return;
  window.location.replace("./index.html#" + encodeURIComponent(titleMeta.content));
})();
