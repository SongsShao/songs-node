/* global NexT, CONFIG */

document.addEventListener('page:loaded', function () {
  var _CONFIG$changyan = CONFIG.changyan,
    appid = _CONFIG$changyan.appid,
    appkey = _CONFIG$changyan.appkey;
  var mainJs = 'https://cy-cdn.kuaizhan.com/upload/changyan.js';
  var countJs = "https://cy-cdn.kuaizhan.com/upload/plugins/plugins.list.count.js?clientId=".concat(appid);

  // Get the number of comments
  setTimeout(function () {
    return NexT.utils.getScript(countJs, {
      attributes: {
        async: true,
        id: 'cy_cmt_num'
      }
    });
  }, 0);

  // When scroll to comment section
  if (CONFIG.page.comments && !CONFIG.page.isHome) {
    NexT.utils.loadComments('#SOHUCS').then(function () {
      return NexT.utils.getScript(mainJs, {
        attributes: {
          async: true
        }
      });
    }).then(function () {
      window.changyan.api.config({
        appid: appid,
        conf: appkey
      });
    }).catch(function (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load Changyan', error);
    });
  }
});