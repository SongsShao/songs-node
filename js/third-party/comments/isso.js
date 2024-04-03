/* global NexT, CONFIG */

document.addEventListener('page:loaded', function () {
  if (!CONFIG.page.comments) return;
  NexT.utils.loadComments('#isso-thread').then(function () {
    return NexT.utils.getScript("".concat(CONFIG.isso, "js/embed.min.js"), {
      attributes: {
        dataset: {
          isso: "".concat(CONFIG.isso)
        }
      },
      parentNode: document.querySelector('#isso-thread')
    });
  });
});