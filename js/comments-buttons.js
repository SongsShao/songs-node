/* global CONFIG */

(function () {
  var commentButton = document.querySelectorAll('.comment-button');
  commentButton.forEach(function (element) {
    var commentClass = element.classList[2];
    element.addEventListener('click', function () {
      commentButton.forEach(function (active) {
        return active.classList.toggle('active', active === element);
      });
      document.querySelectorAll('.comment-position').forEach(function (active) {
        return active.classList.toggle('active', active.classList.contains(commentClass));
      });
      if (CONFIG.comments.storage) {
        localStorage.setItem('comments_active', commentClass);
      }
    });
  });
  var activeClass = CONFIG.comments.activeClass;
  if (CONFIG.comments.storage) {
    activeClass = localStorage.getItem('comments_active') || activeClass;
  }
  if (activeClass) {
    var activeButton = document.querySelector(".comment-button.".concat(activeClass));
    if (activeButton) {
      activeButton.click();
    }
  }
})();