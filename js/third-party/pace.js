/* global Pace */

Pace.options.restartOnPushState = false;
document.addEventListener('pjax:send', function () {
  Pace.restart();
});