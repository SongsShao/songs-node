/* global CONFIG, Chatra */

(function () {
  if (CONFIG.chatra.embed) {
    window.ChatraSetup = {
      mode: 'frame',
      injectTo: CONFIG.chatra.embed
    };
  }
  window.ChatraID = CONFIG.chatra.id;
  var chatButton = document.querySelector('.sidebar-button button');
  if (chatButton) {
    chatButton.addEventListener('click', function () {
      Chatra('openChat', true);
    });
  }
})();