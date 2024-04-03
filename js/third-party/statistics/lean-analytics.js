function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global CONFIG */
/* eslint-disable no-console */

(function () {
  var leancloudSelector = function leancloudSelector(url) {
    url = encodeURI(url);
    return document.getElementById(url).querySelector('.leancloud-visitors-count');
  };
  var addCount = function addCount(Counter) {
    var visitors = document.querySelector('.leancloud_visitors');
    var url = decodeURI(visitors.id);
    var title = visitors.dataset.flagTitle;
    Counter('get', "/classes/Counter?where=".concat(encodeURIComponent(JSON.stringify({
      url: url
    })))).then(function (response) {
      return response.json();
    }).then(function (_ref) {
      var results = _ref.results;
      if (results.length > 0) {
        var counter = results[0];
        leancloudSelector(url).innerText = counter.time + 1;
        Counter('put', '/classes/Counter/' + counter.objectId, {
          time: {
            '__op': 'Increment',
            'amount': 1
          }
        }).catch(function (error) {
          console.error('Failed to save visitor count', error);
        });
      } else if (CONFIG.leancloud_visitors.security) {
        leancloudSelector(url).innerText = 'Counter not initialized! More info at console err msg.';
        console.error('ATTENTION! LeanCloud counter has security bug, see how to solve it here: https://github.com/theme-next/hexo-leancloud-counter-security. \n However, you can still use LeanCloud without security, by setting `security` option to `false`.');
      } else {
        Counter('post', '/classes/Counter', {
          title: title,
          url: url,
          time: 1
        }).then(function (response) {
          return response.json();
        }).then(function () {
          leancloudSelector(url).innerText = 1;
        }).catch(function (error) {
          console.error('Failed to create', error);
        });
      }
    }).catch(function (error) {
      console.error('LeanCloud Counter Error', error);
    });
  };
  var showTime = function showTime(Counter) {
    var visitors = document.querySelectorAll('.leancloud_visitors');
    var entries = _toConsumableArray(visitors).map(function (element) {
      return decodeURI(element.id);
    });
    Counter('get', "/classes/Counter?where=".concat(encodeURIComponent(JSON.stringify({
      url: {
        '$in': entries
      }
    })))).then(function (response) {
      return response.json();
    }).then(function (_ref2) {
      var results = _ref2.results;
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        var _loop = function _loop() {
          var url = _step.value;
          var target = results.find(function (item) {
            return item.url === url;
          });
          leancloudSelector(url).innerText = target ? target.time : 0;
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }).catch(function (error) {
      console.error('LeanCloud Counter Error', error);
    });
  };
  var _CONFIG$leancloud_vis = CONFIG.leancloud_visitors,
    app_id = _CONFIG$leancloud_vis.app_id,
    app_key = _CONFIG$leancloud_vis.app_key,
    server_url = _CONFIG$leancloud_vis.server_url;
  var fetchData = function fetchData(api_server) {
    var Counter = function Counter(method, url, data) {
      return fetch("".concat(api_server, "/1.1").concat(url), {
        method: method,
        headers: {
          'X-LC-Id': app_id,
          'X-LC-Key': app_key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    };
    if (CONFIG.page.isPost) {
      if (CONFIG.hostname !== location.hostname) return;
      addCount(Counter);
    } else if (document.querySelectorAll('.post-title-link').length >= 1) {
      showTime(Counter);
    }
  };
  var api_server;
  if (server_url) {
    api_server = server_url;
  } else if (app_id.slice(-9) === '-MdYXbMMI') {
    api_server = "https://".concat(app_id.slice(0, 8).toLowerCase(), ".api.lncldglobal.com");
  }
  document.addEventListener('page:loaded', function () {
    if (api_server) {
      fetchData(api_server);
    } else {
      fetch("https://app-router.leancloud.cn/2/route?appId=".concat(app_id)).then(function (response) {
        return response.json();
      }).then(function (_ref3) {
        var api_server = _ref3.api_server;
        fetchData("https://".concat(api_server));
      });
    }
  });
})();