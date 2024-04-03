/* global NexT, CONFIG, WaveDrom */

document.addEventListener('page:loaded', function () {
  NexT.utils.getScript(CONFIG.wavedrom.js, {
    condition: window.WaveDrom
  }).then(function () {
    NexT.utils.getScript(CONFIG.wavedrom_skin.js, {
      condition: window.WaveSkin
    }).then(function () {
      WaveDrom.ProcessAll();
    });
  });
});