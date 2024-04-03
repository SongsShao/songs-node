function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* global CONFIG, pjax, LocalSearch */

document.addEventListener('DOMContentLoaded', function () {
  if (!CONFIG.path) {
    // Search DB path
    console.warn('`hexo-generator-searchdb` plugin is not installed!');
    return;
  }
  var localSearch = new LocalSearch({
    path: CONFIG.path,
    top_n_per_article: CONFIG.localsearch.top_n_per_article,
    unescape: CONFIG.localsearch.unescape
  });
  var input = document.querySelector('.search-input');
  var inputEventFunction = function inputEventFunction() {
    if (!localSearch.isfetched) return;
    var searchText = input.value.trim().toLowerCase();
    var keywords = searchText.split(/[-\s]+/);
    var container = document.querySelector('.search-result-container');
    var resultItems = [];
    if (searchText.length > 0) {
      // Perform local searching
      resultItems = localSearch.getResultItems(keywords);
    }
    if (keywords.length === 1 && keywords[0] === '') {
      container.classList.add('no-result');
      container.innerHTML = '<div class="search-result-icon"><i class="fa fa-search fa-5x"></i></div>';
    } else if (resultItems.length === 0) {
      container.classList.add('no-result');
      container.innerHTML = '<div class="search-result-icon"><i class="far fa-frown fa-5x"></i></div>';
    } else {
      resultItems.sort(function (left, right) {
        if (left.includedCount !== right.includedCount) {
          return right.includedCount - left.includedCount;
        } else if (left.hitCount !== right.hitCount) {
          return right.hitCount - left.hitCount;
        }
        return right.id - left.id;
      });
      var stats = CONFIG.i18n.hits.replace('${hits}', resultItems.length);
      container.classList.remove('no-result');
      container.innerHTML = "<div class=\"search-stats\">".concat(stats, "</div>\n        <hr>\n        <ul class=\"search-result-list\">").concat(resultItems.map(function (result) {
        return result.item;
      }).join(''), "</ul>");
      if ((typeof pjax === "undefined" ? "undefined" : _typeof(pjax)) === 'object') pjax.refresh(container);
    }
  };
  localSearch.highlightSearchWords(document.querySelector('.post-body'));
  if (CONFIG.localsearch.preload) {
    localSearch.fetchData();
  }
  if (CONFIG.localsearch.trigger === 'auto') {
    input.addEventListener('input', inputEventFunction);
  } else {
    document.querySelector('.search-icon').addEventListener('click', inputEventFunction);
    input.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        inputEventFunction();
      }
    });
  }
  window.addEventListener('search:loaded', inputEventFunction);

  // Handle and trigger popup window
  document.querySelectorAll('.popup-trigger').forEach(function (element) {
    element.addEventListener('click', function () {
      document.body.classList.add('search-active');
      // Wait for search-popup animation to complete
      setTimeout(function () {
        return input.focus();
      }, 500);
      if (!localSearch.isfetched) localSearch.fetchData();
    });
  });

  // Monitor main search box
  var onPopupClose = function onPopupClose() {
    document.body.classList.remove('search-active');
  };
  document.querySelector('.search-pop-overlay').addEventListener('click', function (event) {
    if (event.target === document.querySelector('.search-pop-overlay')) {
      onPopupClose();
    }
  });
  document.querySelector('.popup-btn-close').addEventListener('click', onPopupClose);
  document.addEventListener('pjax:success', function () {
    localSearch.highlightSearchWords(document.querySelector('.post-body'));
    onPopupClose();
  });
  window.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      onPopupClose();
    }
  });
});