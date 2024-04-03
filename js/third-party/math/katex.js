/* global NexT, CONFIG */

document.addEventListener('page:loaded', function () {
  if (!CONFIG.enableMath) return;
  NexT.utils.getScript(CONFIG.katex.copy_tex_js).catch(function () {});
});