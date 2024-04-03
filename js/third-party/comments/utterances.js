/* global NexT, CONFIG */

document.addEventListener('page:loaded', function () {
  if (!CONFIG.page.comments) return;
  NexT.utils.loadComments('.utterances-container').then(function () {
    return NexT.utils.getScript('https://utteranc.es/client.js', {
      attributes: {
        async: true,
        crossOrigin: 'anonymous',
        'repo': CONFIG.utterances.repo,
        'issue-term': CONFIG.utterances.issue_term,
        'theme': CONFIG.utterances.theme
      },
      parentNode: document.querySelector('.utterances-container')
    });
  });
});