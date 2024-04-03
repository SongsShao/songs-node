/* global CONFIG */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var doSaveScroll = function doSaveScroll() {
    localStorage.setItem('bookmark' + location.pathname, window.scrollY);
  };
  var scrollToMark = function scrollToMark() {
    var top = localStorage.getItem('bookmark' + location.pathname);
    top = parseInt(top, 10);
    // If the page opens with a specific hash, just jump out
    if (!isNaN(top) && location.hash === '') {
      // Auto scroll to the position
      window.anime({
        targets: document.scrollingElement,
        duration: 200,
        easing: 'linear',
        scrollTop: top
      });
    }
  };
  // Register everything
  var init = function init(trigger) {
    // Create a link element
    var link = document.querySelector('.book-mark-link');
    // Scroll event
    window.addEventListener('scroll', function () {
      return link.classList.toggle('book-mark-link-fixed', window.scrollY === 0);
    }, {
      passive: true
    });
    // Register beforeunload event when the trigger is auto
    if (trigger === 'auto') {
      // Register beforeunload event
      window.addEventListener('beforeunload', doSaveScroll);
      document.addEventListener('pjax:send', doSaveScroll);
    }
    // Save the position by clicking the icon
    link.addEventListener('click', function () {
      doSaveScroll();
      window.anime({
        targets: link,
        duration: 200,
        easing: 'linear',
        top: -30,
        complete: function complete() {
          setTimeout(function () {
            link.style.top = '';
          }, 400);
        }
      });
    });
    scrollToMark();
    document.addEventListener('pjax:success', scrollToMark);
  };
  init(CONFIG.bookmark.save);
});