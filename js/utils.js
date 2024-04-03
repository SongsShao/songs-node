var _excluded = ["id", "async", "defer", "crossOrigin", "dataset"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* global NexT, CONFIG */

HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};
(function () {
  var onPageLoaded = function onPageLoaded() {
    return document.dispatchEvent(new Event('page:loaded', {
      bubbles: true
    }));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('readystatechange', onPageLoaded, {
      once: true
    });
  } else {
    onPageLoaded();
  }
  document.addEventListener('pjax:success', onPageLoaded);
})();
NexT.utils = {
  registerExtURL: function registerExtURL() {
    document.querySelectorAll('span.exturl').forEach(function (element) {
      var link = document.createElement('a');
      // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
      link.href = decodeURIComponent(atob(element.dataset.url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      link.rel = 'noopener external nofollow noreferrer';
      link.target = '_blank';
      link.className = element.className;
      link.title = element.title;
      link.innerHTML = element.innerHTML;
      element.parentNode.replaceChild(link, element);
    });
  },
  registerCodeblock: function registerCodeblock(element) {
    var inited = !!element;
    var figure = (inited ? element : document).querySelectorAll('figure.highlight');
    var isHljsWithWrap = true;
    if (figure.length === 0) {
      figure = document.querySelectorAll('pre:not(.mermaid)');
      isHljsWithWrap = false;
    }
    figure.forEach(function (element) {
      if (!inited) {
        var span = element.querySelectorAll('.code .line span');
        if (span.length === 0) {
          // Hljs without line_number and wrap
          span = element.querySelectorAll('code.highlight span');
        }
        span.forEach(function (s) {
          s.classList.forEach(function (name) {
            s.classList.replace(name, "hljs-".concat(name));
          });
        });
      }
      var height = parseInt(window.getComputedStyle(element).height.replace('px', ''), 10);
      var needFold = CONFIG.fold.enable && height > CONFIG.fold.height;
      if (!needFold && !CONFIG.copycode.enable) return;
      var target;
      if (isHljsWithWrap && CONFIG.copycode.style === 'mac') {
        target = element;
      } else {
        var box = element.querySelector('.code-container');
        if (!box) {
          // https://github.com/next-theme/hexo-theme-next/issues/98
          // https://github.com/next-theme/hexo-theme-next/pull/508
          var container = element.querySelector('.table-container') || element;
          box = document.createElement('div');
          box.className = 'code-container';
          container.wrap(box);
        }
        target = box;
      }
      if (needFold && !target.classList.contains('unfold')) {
        target.classList.add('highlight-fold');
        target.insertAdjacentHTML('beforeend', '<div class="fold-cover"></div><div class="expand-btn"><i class="fa fa-angle-down fa-fw"></i></div>');
        target.querySelector('.expand-btn').addEventListener('click', function () {
          target.classList.remove('highlight-fold');
          target.classList.add('unfold');
        });
      }
      if (inited || !CONFIG.copycode.enable) return;
      // One-click copy code support.
      target.insertAdjacentHTML('beforeend', '<div class="copy-btn"><i class="fa fa-copy fa-fw"></i></div>');
      var button = target.querySelector('.copy-btn');
      button.addEventListener('click', function () {
        var lines = element.querySelector('.code') || element.querySelector('code');
        var code = lines.innerText;
        if (navigator.clipboard) {
          // https://caniuse.com/mdn-api_clipboard_writetext
          navigator.clipboard.writeText(code).then(function () {
            button.querySelector('i').className = 'fa fa-check-circle fa-fw';
          }, function () {
            button.querySelector('i').className = 'fa fa-times-circle fa-fw';
          });
        } else {
          var ta = document.createElement('textarea');
          ta.style.top = window.scrollY + 'px'; // Prevent page scrolling
          ta.style.position = 'absolute';
          ta.style.opacity = '0';
          ta.readOnly = true;
          ta.value = code;
          document.body.append(ta);
          ta.select();
          ta.setSelectionRange(0, code.length);
          ta.readOnly = false;
          var result = document.execCommand('copy');
          button.querySelector('i').className = result ? 'fa fa-check-circle fa-fw' : 'fa fa-times-circle fa-fw';
          ta.blur(); // For iOS
          button.blur();
          document.body.removeChild(ta);
        }
      });
      element.addEventListener('mouseleave', function () {
        setTimeout(function () {
          button.querySelector('i').className = 'fa fa-copy fa-fw';
        }, 300);
      });
    });
  },
  wrapTableWithBox: function wrapTableWithBox() {
    document.querySelectorAll('table').forEach(function (element) {
      var box = document.createElement('div');
      box.className = 'table-container';
      element.wrap(box);
    });
  },
  registerVideoIframe: function registerVideoIframe() {
    document.querySelectorAll('iframe').forEach(function (element) {
      var supported = ['www.youtube.com', 'player.vimeo.com', 'player.youku.com', 'player.bilibili.com', 'www.tudou.com'].some(function (host) {
        return element.src.includes(host);
      });
      if (supported && !element.parentNode.matches('.video-container')) {
        var box = document.createElement('div');
        box.className = 'video-container';
        element.wrap(box);
        var width = Number(element.width);
        var height = Number(element.height);
        if (width && height) {
          box.style.paddingTop = height / width * 100 + '%';
        }
      }
    });
  },
  updateActiveNav: function updateActiveNav() {
    if (!Array.isArray(NexT.utils.sections)) return;
    var index = NexT.utils.sections.findIndex(function (element) {
      return element && element.getBoundingClientRect().top > 10;
    });
    if (index === -1) {
      index = NexT.utils.sections.length - 1;
    } else if (index > 0) {
      index--;
    }
    this.activateNavByIndex(index);
  },
  registerScrollPercent: function registerScrollPercent() {
    var _this = this;
    var backToTop = document.querySelector('.back-to-top');
    var readingProgressBar = document.querySelector('.reading-progress-bar');
    // For init back to top in sidebar if page was scrolled after page refresh.
    window.addEventListener('scroll', function () {
      if (backToTop || readingProgressBar) {
        var contentHeight = document.body.scrollHeight - window.innerHeight;
        var scrollPercent = contentHeight > 0 ? Math.min(100 * window.scrollY / contentHeight, 100) : 0;
        if (backToTop) {
          backToTop.classList.toggle('back-to-top-on', Math.round(scrollPercent) >= 5);
          backToTop.querySelector('span').innerText = Math.round(scrollPercent) + '%';
        }
        if (readingProgressBar) {
          readingProgressBar.style.setProperty('--progress', scrollPercent.toFixed(2) + '%');
        }
      }
      _this.updateActiveNav();
    }, {
      passive: true
    });
    backToTop && backToTop.addEventListener('click', function () {
      window.anime({
        targets: document.scrollingElement,
        duration: 500,
        easing: 'linear',
        scrollTop: 0
      });
    });
  },
  /**
   * Tabs tag listener (without twitter bootstrap).
   */
  registerTabsTag: function registerTabsTag() {
    // Binding `nav-tabs` & `tab-content` by real time permalink changing.
    document.querySelectorAll('.tabs ul.nav-tabs .tab').forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        // Prevent selected tab to select again.
        if (element.classList.contains('active')) return;
        var nav = element.parentNode;
        // Get the height of `tab-pane` which is activated before, and set it as the height of `tab-content` with extra margin / paddings.
        var tabContent = nav.nextElementSibling;
        tabContent.style.overflow = 'hidden';
        tabContent.style.transition = 'height 1s';
        // Comment system selection tab does not contain .active class.
        var activeTab = tabContent.querySelector('.active') || tabContent.firstElementChild;
        // Hight might be `auto`.
        var prevHeight = parseInt(window.getComputedStyle(activeTab).height.replace('px', ''), 10) || 0;
        var paddingTop = parseInt(window.getComputedStyle(activeTab).paddingTop.replace('px', ''), 10);
        var marginBottom = parseInt(window.getComputedStyle(activeTab.firstElementChild).marginBottom.replace('px', ''), 10);
        tabContent.style.height = prevHeight + paddingTop + marginBottom + 'px';
        // Add & Remove active class on `nav-tabs` & `tab-content`.
        _toConsumableArray(nav.children).forEach(function (target) {
          target.classList.toggle('active', target === element);
        });
        // https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
        var tActive = document.getElementById(element.querySelector('a').getAttribute('href').replace('#', ''));
        _toConsumableArray(tActive.parentNode.children).forEach(function (target) {
          target.classList.toggle('active', target === tActive);
        });
        // Trigger event
        tActive.dispatchEvent(new Event('tabs:click', {
          bubbles: true
        }));
        // Get the height of `tab-pane` which is activated now.
        var hasScrollBar = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
        var currHeight = parseInt(window.getComputedStyle(tabContent.querySelector('.active')).height.replace('px', ''), 10);
        // Reset the height of `tab-content` and see the animation.
        tabContent.style.height = currHeight + paddingTop + marginBottom + 'px';
        // Change the height of `tab-content` may cause scrollbar show / disappear, which may result in the change of the `tab-pane`'s height
        setTimeout(function () {
          if (document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) !== hasScrollBar) {
            tabContent.style.transition = 'height 0.3s linear';
            // After the animation, we need reset the height of `tab-content` again.
            var currHeightAfterScrollBarChange = parseInt(window.getComputedStyle(tabContent.querySelector('.active')).height.replace('px', ''), 10);
            tabContent.style.height = currHeightAfterScrollBarChange + paddingTop + marginBottom + 'px';
          }
          // Remove all the inline styles, and let the height be adaptive again.
          setTimeout(function () {
            tabContent.style.transition = '';
            tabContent.style.height = '';
          }, 250);
        }, 1000);
        if (!CONFIG.stickytabs) return;
        var offset = nav.parentNode.getBoundingClientRect().top + window.scrollY + 10;
        window.anime({
          targets: document.scrollingElement,
          duration: 500,
          easing: 'linear',
          scrollTop: offset
        });
      });
    });
    window.dispatchEvent(new Event('tabs:register'));
  },
  registerCanIUseTag: function registerCanIUseTag() {
    // Get responsive height passed from iframe.
    window.addEventListener('message', function (_ref) {
      var data = _ref.data;
      if (typeof data === 'string' && data.includes('ciu_embed')) {
        var featureID = data.split(':')[1];
        var height = data.split(':')[2];
        document.querySelector("iframe[data-feature=".concat(featureID, "]")).style.height = parseInt(height, 10) + 5 + 'px';
      }
    }, false);
  },
  registerActiveMenuItem: function registerActiveMenuItem() {
    document.querySelectorAll('.menu-item a[href]').forEach(function (target) {
      var isSamePath = target.pathname === location.pathname || target.pathname === location.pathname.replace('index.html', '');
      var isSubPath = !CONFIG.root.startsWith(target.pathname) && location.pathname.startsWith(target.pathname);
      target.classList.toggle('menu-item-active', target.hostname === location.hostname && (isSamePath || isSubPath));
    });
  },
  registerLangSelect: function registerLangSelect() {
    var selects = document.querySelectorAll('.lang-select');
    selects.forEach(function (sel) {
      sel.value = CONFIG.page.lang;
      sel.addEventListener('change', function () {
        var target = sel.options[sel.selectedIndex];
        document.querySelectorAll('.lang-select-label span').forEach(function (span) {
          span.innerText = target.text;
        });
        // Disable Pjax to force refresh translation of menu item
        window.location.href = target.dataset.href;
      });
    });
  },
  registerSidebarTOC: function registerSidebarTOC() {
    this.sections = _toConsumableArray(document.querySelectorAll('.post-toc:not(.placeholder-toc) li a.nav-link')).map(function (element) {
      var target = document.getElementById(decodeURI(element.getAttribute('href')).replace('#', ''));
      // TOC item animation navigate.
      element.addEventListener('click', function (event) {
        event.preventDefault();
        var offset = target.getBoundingClientRect().top + window.scrollY;
        window.anime({
          targets: document.scrollingElement,
          duration: 500,
          easing: 'linear',
          scrollTop: offset,
          complete: function complete() {
            history.pushState(null, document.title, element.href);
          }
        });
      });
      return target;
    });
    this.updateActiveNav();
  },
  registerPostReward: function registerPostReward() {
    var button = document.querySelector('.reward-container button');
    if (!button) return;
    button.addEventListener('click', function () {
      document.querySelector('.post-reward').classList.toggle('active');
    });
  },
  activateNavByIndex: function activateNavByIndex(index) {
    var nav = document.querySelector('.post-toc:not(.placeholder-toc) .nav');
    if (!nav) return;
    var navItemList = nav.querySelectorAll('.nav-item');
    var target = navItemList[index];
    if (!target || target.classList.contains('active-current')) return;
    var singleHeight = navItemList[navItemList.length - 1].offsetHeight;
    nav.querySelectorAll('.active').forEach(function (navItem) {
      navItem.classList.remove('active', 'active-current');
    });
    target.classList.add('active', 'active-current');
    var activateEle = target.querySelector('.nav-child') || target.parentElement;
    var navChildHeight = 0;
    while (nav.contains(activateEle)) {
      if (activateEle.classList.contains('nav-item')) {
        activateEle.classList.add('active');
      } else {
        // .nav-child or .nav
        // scrollHeight isn't reliable for transitioning child items.
        // The last nav-item in a list has a margin-bottom of 5px.
        navChildHeight += singleHeight * activateEle.childElementCount + 5;
        activateEle.style.setProperty('--height', "".concat(navChildHeight, "px"));
      }
      activateEle = activateEle.parentElement;
    }

    // Scrolling to center active TOC element if TOC content is taller then viewport.
    var tocElement = document.querySelector(CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini' ? '.sidebar-panel-container' : '.sidebar');
    if (!document.querySelector('.sidebar-toc-active')) return;
    window.anime({
      targets: tocElement,
      duration: 200,
      easing: 'linear',
      scrollTop: tocElement.scrollTop - tocElement.offsetHeight / 2 + target.getBoundingClientRect().top - tocElement.getBoundingClientRect().top
    });
  },
  updateSidebarPosition: function updateSidebarPosition() {
    if (window.innerWidth < 1200 || CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini') return;
    // Expand sidebar on post detail page by default, when post has a toc.
    var hasTOC = document.querySelector('.post-toc:not(.placeholder-toc)');
    var display = CONFIG.page.sidebar;
    if (typeof display !== 'boolean') {
      // There's no definition sidebar in the page front-matter.
      display = CONFIG.sidebar.display === 'always' || CONFIG.sidebar.display === 'post' && hasTOC;
    }
    if (display) {
      window.dispatchEvent(new Event('sidebar:show'));
    }
  },
  activateSidebarPanel: function activateSidebarPanel(index) {
    var sidebar = document.querySelector('.sidebar-inner');
    var activeClassNames = ['sidebar-toc-active', 'sidebar-overview-active'];
    if (sidebar.classList.contains(activeClassNames[index])) return;
    var panelContainer = sidebar.querySelector('.sidebar-panel-container');
    var tocPanel = panelContainer.firstElementChild;
    var overviewPanel = panelContainer.lastElementChild;
    var postTOCHeight = tocPanel.scrollHeight;
    // For TOC activation, try to use the animated TOC height
    if (index === 0) {
      var nav = tocPanel.querySelector('.nav');
      if (nav) {
        postTOCHeight = parseInt(nav.style.getPropertyValue('--height'), 10);
      }
    }
    var panelHeights = [postTOCHeight, overviewPanel.scrollHeight];
    panelContainer.style.setProperty('--inactive-panel-height', "".concat(panelHeights[1 - index], "px"));
    panelContainer.style.setProperty('--active-panel-height', "".concat(panelHeights[index], "px"));
    sidebar.classList.replace(activeClassNames[1 - index], activeClassNames[index]);
  },
  getScript: function getScript(src) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var legacyCondition = arguments.length > 2 ? arguments[2] : undefined;
    if (typeof options === 'function') {
      return this.getScript(src, {
        condition: legacyCondition
      }).then(options);
    }
    var _options$condition = options.condition,
      condition = _options$condition === void 0 ? false : _options$condition,
      _options$attributes = options.attributes,
      _options$attributes2 = _options$attributes === void 0 ? {} : _options$attributes,
      _options$attributes2$ = _options$attributes2.id,
      id = _options$attributes2$ === void 0 ? '' : _options$attributes2$,
      _options$attributes2$2 = _options$attributes2.async,
      async = _options$attributes2$2 === void 0 ? false : _options$attributes2$2,
      _options$attributes2$3 = _options$attributes2.defer,
      defer = _options$attributes2$3 === void 0 ? false : _options$attributes2$3,
      _options$attributes2$4 = _options$attributes2.crossOrigin,
      crossOrigin = _options$attributes2$4 === void 0 ? '' : _options$attributes2$4,
      _options$attributes2$5 = _options$attributes2.dataset,
      dataset = _options$attributes2$5 === void 0 ? {} : _options$attributes2$5,
      otherAttributes = _objectWithoutProperties(_options$attributes2, _excluded),
      _options$parentNode = options.parentNode,
      parentNode = _options$parentNode === void 0 ? null : _options$parentNode;
    return new Promise(function (resolve, reject) {
      if (condition) {
        resolve();
      } else {
        var script = document.createElement('script');
        if (id) script.id = id;
        if (crossOrigin) script.crossOrigin = crossOrigin;
        script.async = async;
        script.defer = defer;
        Object.assign(script.dataset, dataset);
        Object.entries(otherAttributes).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
            name = _ref3[0],
            value = _ref3[1];
          script.setAttribute(name, String(value));
        });
        script.onload = resolve;
        script.onerror = reject;
        if (_typeof(src) === 'object') {
          var url = src.url,
            integrity = src.integrity;
          script.src = url;
          if (integrity) {
            script.integrity = integrity;
            script.crossOrigin = 'anonymous';
          }
        } else {
          script.src = src;
        }
        (parentNode || document.head).appendChild(script);
      }
    });
  },
  loadComments: function loadComments(selector, legacyCallback) {
    if (legacyCallback) {
      return this.loadComments(selector).then(legacyCallback);
    }
    return new Promise(function (resolve) {
      var element = document.querySelector(selector);
      if (!CONFIG.comments.lazyload || !element) {
        resolve();
        return;
      }
      var intersectionObserver = new IntersectionObserver(function (entries, observer) {
        var entry = entries[0];
        if (!entry.isIntersecting) return;
        resolve();
        observer.disconnect();
      });
      intersectionObserver.observe(element);
    });
  }
};