/* global CONFIG */

document.addEventListener('DOMContentLoaded', function () {
  var isRight = CONFIG.sidebar.position === 'right';
  var sidebarToggleMotion = {
    mouse: {},
    init: function init() {
      window.addEventListener('mousedown', this.mousedownHandler.bind(this));
      window.addEventListener('mouseup', this.mouseupHandler.bind(this));
      document.querySelector('.sidebar-dimmer').addEventListener('click', this.clickHandler.bind(this));
      document.querySelector('.sidebar-toggle').addEventListener('click', this.clickHandler.bind(this));
      window.addEventListener('sidebar:show', this.showSidebar);
      window.addEventListener('sidebar:hide', this.hideSidebar);
    },
    mousedownHandler: function mousedownHandler(event) {
      this.mouse.X = event.pageX;
      this.mouse.Y = event.pageY;
    },
    mouseupHandler: function mouseupHandler(event) {
      var deltaX = event.pageX - this.mouse.X;
      var deltaY = event.pageY - this.mouse.Y;
      var clickingBlankPart = Math.hypot(deltaX, deltaY) < 20 && event.target.matches('.main');
      // Fancybox has z-index property, but medium-zoom does not, so the sidebar will overlay the zoomed image.
      if (clickingBlankPart || event.target.matches('img.medium-zoom-image')) {
        this.hideSidebar();
      }
    },
    clickHandler: function clickHandler() {
      document.body.classList.contains('sidebar-active') ? this.hideSidebar() : this.showSidebar();
    },
    showSidebar: function showSidebar() {
      document.body.classList.add('sidebar-active');
      var animateAction = isRight ? 'fadeInRight' : 'fadeInLeft';
      document.querySelectorAll('.sidebar .animated').forEach(function (element, index) {
        element.style.animationDelay = 100 * index + 'ms';
        element.classList.remove(animateAction);
        setTimeout(function () {
          // Trigger a DOM reflow
          element.classList.add(animateAction);
        });
      });
    },
    hideSidebar: function hideSidebar() {
      document.body.classList.remove('sidebar-active');
    }
  };
  sidebarToggleMotion.init();
});