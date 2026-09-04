/**
 * Yakka Works — Path Utilities
 *
 * Computes a base path prefix so links and assets resolve correctly
 * regardless of how deep the current page is nested (root, /store/,
 * /tools/, etc.), and regardless of whether the site is served from
 * a domain root or a GitHub Pages project subpath (/repo-name/).
 */
(function (window) {
  'use strict';

  function computeBasePath() {
    // Path to the currently loaded script's directory tells us how many
    // levels "assets/js/" sits below the site root, which lets us derive
    // the site root reliably even from nested pages.
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      var marker = 'assets/js/path-utils.js';
      var idx = src.indexOf(marker);
      if (idx !== -1) {
        return src.substring(0, idx); // everything before "assets/js/..."
      }
    }
    // Fallback: assume root
    return './';
  }

  var basePath = computeBasePath();

  window.YakkaPaths = {
    base: basePath,
    asset: function (relPath) {
      return basePath + relPath.replace(/^\/+/, '');
    },
    page: function (relPath) {
      return basePath + relPath.replace(/^\/+/, '');
    }
  };
})(window);
