function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global CONFIG, quicklink */

(function () {
  if (typeof CONFIG.quicklink.ignores === 'string') {
    var ignoresStr = "[".concat(CONFIG.quicklink.ignores, "]");
    CONFIG.quicklink.ignores = JSON.parse(ignoresStr);
  }
  var resetFn = null;
  var onRefresh = function onRefresh() {
    if (resetFn) resetFn();
    if (!CONFIG.quicklink.enable) return;
    var ignoresArr = CONFIG.quicklink.ignores || [];
    if (!Array.isArray(ignoresArr)) {
      ignoresArr = [ignoresArr];
    }
    resetFn = quicklink.listen({
      timeout: CONFIG.quicklink.timeout,
      priority: CONFIG.quicklink.priority,
      ignores: [function (uri) {
        return uri.includes('#');
      }, function (uri) {
        return uri === CONFIG.quicklink.url;
      }].concat(_toConsumableArray(ignoresArr))
    });
  };
  if (CONFIG.quicklink.delay) {
    window.addEventListener('load', onRefresh);
    document.addEventListener('pjax:success', onRefresh);
  } else {
    document.addEventListener('page:loaded', onRefresh);
  }
})();