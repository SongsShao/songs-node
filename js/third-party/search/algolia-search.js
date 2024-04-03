function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* global instantsearch, algoliasearch, CONFIG, pjax */

document.addEventListener('DOMContentLoaded', function () {
  var _CONFIG$algolia = CONFIG.algolia,
    indexName = _CONFIG$algolia.indexName,
    appID = _CONFIG$algolia.appID,
    apiKey = _CONFIG$algolia.apiKey,
    hits = _CONFIG$algolia.hits;
  var search = instantsearch({
    indexName: indexName,
    searchClient: algoliasearch(appID, apiKey),
    searchFunction: function searchFunction(helper) {
      if (document.querySelector('.search-input').value) {
        helper.search();
      }
    }
  });
  if ((typeof pjax === "undefined" ? "undefined" : _typeof(pjax)) === 'object') {
    search.on('render', function () {
      pjax.refresh(document.querySelector('.algolia-hits'));
    });
  }

  // Registering Widgets
  search.addWidgets([instantsearch.widgets.configure({
    hitsPerPage: hits.per_page || 10
  }), instantsearch.widgets.searchBox({
    container: '.search-input-container',
    placeholder: CONFIG.i18n.placeholder,
    // Hide default icons of algolia search
    showReset: false,
    showSubmit: false,
    showLoadingIndicator: false,
    cssClasses: {
      input: 'search-input'
    }
  }), instantsearch.widgets.stats({
    container: '.algolia-stats',
    templates: {
      text: function text(data) {
        var stats = CONFIG.i18n.hits_time.replace('${hits}', data.nbHits).replace('${time}', data.processingTimeMS);
        return "<span>".concat(stats, "</span>\n            <img src=\"").concat(CONFIG.images, "/logo-algolia-nebula-blue-full.svg\" alt=\"Algolia\">");
      }
    },
    cssClasses: {
      text: 'search-stats'
    }
  }), instantsearch.widgets.hits({
    container: '.algolia-hits',
    escapeHTML: false,
    templates: {
      item: function item(data) {
        var _data$_highlightResul = data._highlightResult,
          title = _data$_highlightResul.title,
          excerpt = _data$_highlightResul.excerpt,
          excerptStrip = _data$_highlightResul.excerptStrip,
          contentStripTruncate = _data$_highlightResul.contentStripTruncate;
        var result = "<a href=\"".concat(data.permalink, "\" class=\"search-result-title\">").concat(title.value, "</a>");
        var content = excerpt || excerptStrip || contentStripTruncate;
        if (content && content.value) {
          var div = document.createElement('div');
          div.innerHTML = content.value;
          result += "<a href=\"".concat(data.permalink, "\"><p class=\"search-result\">").concat(div.textContent.substring(0, 100), "...</p></a>");
        }
        return result;
      },
      empty: function empty(data) {
        return "<div class=\"algolia-hits-empty\">\n              ".concat(CONFIG.i18n.empty.replace('${query}', data.query), "\n            </div>");
      }
    },
    cssClasses: {
      list: 'search-result-list'
    }
  }), instantsearch.widgets.pagination({
    container: '.algolia-pagination',
    scrollTo: false,
    showFirst: false,
    showLast: false,
    templates: {
      first: '<i class="fa fa-angle-double-left"></i>',
      last: '<i class="fa fa-angle-double-right"></i>',
      previous: '<i class="fa fa-angle-left"></i>',
      next: '<i class="fa fa-angle-right"></i>'
    },
    cssClasses: {
      list: ['pagination', 'algolia-pagination'],
      item: 'pagination-item',
      link: 'page-number',
      selectedItem: 'current',
      disabledItem: 'disabled-item'
    }
  })]);
  search.start();

  // Handle and trigger popup window
  document.querySelectorAll('.popup-trigger').forEach(function (element) {
    element.addEventListener('click', function () {
      document.body.classList.add('search-active');
      setTimeout(function () {
        return document.querySelector('.search-input').focus();
      }, 500);
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
  document.addEventListener('pjax:success', onPopupClose);
  window.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      onPopupClose();
    }
  });
});