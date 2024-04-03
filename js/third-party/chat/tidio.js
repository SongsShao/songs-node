/* global tidioChatApi */

(function () {
  var chatButton = document.querySelector('.sidebar-button button');
  if (chatButton) {
    chatButton.addEventListener('click', function () {
      tidioChatApi.open();
    });
  }
})();