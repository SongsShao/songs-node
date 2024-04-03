/* global NexT */

document.addEventListener('page:loaded', function () {
  NexT.utils.getScript('https://static.addtoany.com/menu/page.js', {
    condition: window.a2a
  }).then(function () {
    window.a2a.init();
  });
});