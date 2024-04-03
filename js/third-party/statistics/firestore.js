function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global CONFIG, firebase */

firebase.initializeApp({
  apiKey: CONFIG.firestore.apiKey,
  projectId: CONFIG.firestore.projectId
});
(function () {
  var getCount = function getCount(doc, increaseCount) {
    // IncreaseCount will be false when not in article page
    return doc.get().then(function (d) {
      // Has no data, initialize count
      var count = d.exists ? d.data().count : 0;
      // If first view this article
      if (increaseCount) {
        // Increase count
        count++;
        doc.set({
          count: count
        });
      }
      return count;
    });
  };
  var db = firebase.firestore();
  var articles = db.collection(CONFIG.firestore.collection);
  document.addEventListener('page:loaded', function () {
    if (CONFIG.page.isPost) {
      // Fix issue #118
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
      var title = document.querySelector('.post-title').textContent.trim();
      var doc = articles.doc(title);
      var increaseCount = CONFIG.hostname === location.hostname;
      if (localStorage.getItem(title)) {
        increaseCount = false;
      } else {
        // Mark as visited
        localStorage.setItem(title, true);
      }
      getCount(doc, increaseCount).then(function (count) {
        document.querySelector('.firestore-visitors-count').innerText = count;
      });
    } else if (CONFIG.page.isHome) {
      var promises = _toConsumableArray(document.querySelectorAll('.post-title')).map(function (element) {
        var title = element.textContent.trim();
        var doc = articles.doc(title);
        return getCount(doc);
      });
      Promise.all(promises).then(function (counts) {
        var metas = document.querySelectorAll('.firestore-visitors-count');
        counts.forEach(function (val, idx) {
          metas[idx].innerText = val;
        });
      });
    }
  });
})();