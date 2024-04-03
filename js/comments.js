/* global CONFIG */

window.addEventListener('tabs:register', function () {
  var activeClass = CONFIG.comments.activeClass;
  if (CONFIG.comments.storage) {
    activeClass = localStorage.getItem('comments_active') || activeClass;
  }
  if (activeClass) {
    var activeTab = document.querySelector("a[href=\"#comment-".concat(activeClass, "\"]"));
    if (activeTab) {
      activeTab.click();
    }
  }
});
if (CONFIG.comments.storage) {
  window.addEventListener('tabs:click', function (event) {
    if (!event.target.matches('.tabs-comment .tab-content .tab-pane')) return;
    var commentClass = event.target.classList[1];
    localStorage.setItem('comments_active', commentClass);
  });
}