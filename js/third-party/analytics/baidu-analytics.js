/* global _hmt */

if (!window._hmt) window._hmt = [];
document.addEventListener('pjax:success', function () {
  _hmt.push(['_trackPageview', location.pathname]);
});