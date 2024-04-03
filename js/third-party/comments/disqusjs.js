/* global NexT, CONFIG, DisqusJS */

document.addEventListener('page:loaded', function () {
  if (!CONFIG.page.comments) return;
  NexT.utils.loadComments('#disqus_thread').then(function () {
    return NexT.utils.getScript(CONFIG.disqusjs.js, {
      condition: window.DisqusJS
    });
  }).then(function () {
    window.dsqjs = new DisqusJS({
      api: CONFIG.disqusjs.api || 'https://disqus.com/api/',
      apikey: CONFIG.disqusjs.apikey,
      shortname: CONFIG.disqusjs.shortname,
      url: CONFIG.page.permalink,
      identifier: CONFIG.page.path,
      title: CONFIG.page.title
    });
    window.dsqjs.render(document.querySelector('.disqusjs-container'));
  });
});
document.addEventListener('pjax:send', function () {
  if (window.dsqjs) window.dsqjs.destroy();
});