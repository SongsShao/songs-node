/* global NexT, CONFIG */

NexT.motion = {};
NexT.motion.integrator = {
  queue: [],
  init: function init() {
    this.queue = [];
    return this;
  },
  add: function add(fn) {
    var sequence = fn();
    if (CONFIG.motion.async) this.queue.push(sequence);else this.queue = this.queue.concat(sequence);
    return this;
  },
  bootstrap: function bootstrap() {
    if (!CONFIG.motion.async) this.queue = [this.queue];
    this.queue.forEach(function (sequence) {
      var timeline = window.anime.timeline({
        duration: 200,
        easing: 'linear'
      });
      sequence.forEach(function (item) {
        if (item.deltaT) timeline.add(item, item.deltaT);else timeline.add(item);
      });
    });
  }
};
NexT.motion.middleWares = {
  header: function header() {
    var sequence = [];
    function getMistLineSettings(targets) {
      sequence.push({
        targets: targets,
        scaleX: [0, 1],
        duration: 500,
        deltaT: '-=200'
      });
    }
    function pushToSequence(targets) {
      var sequenceQueue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      sequence.push({
        targets: targets,
        opacity: 1,
        top: 0,
        deltaT: sequenceQueue ? '-=200' : '-=0'
      });
    }
    pushToSequence('.column');
    CONFIG.scheme === 'Mist' && getMistLineSettings('.logo-line');
    CONFIG.scheme === 'Muse' && pushToSequence('.custom-logo-image');
    pushToSequence('.site-title');
    pushToSequence('.site-brand-container .toggle', true);
    pushToSequence('.site-subtitle');
    (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini') && pushToSequence('.custom-logo-image');
    var menuItemTransition = CONFIG.motion.transition.menu_item;
    if (menuItemTransition) {
      document.querySelectorAll('.menu-item').forEach(function (targets) {
        sequence.push({
          targets: targets,
          complete: function complete() {
            return targets.classList.add('animated', menuItemTransition);
          },
          deltaT: '-=200'
        });
      });
    }
    return sequence;
  },
  subMenu: function subMenu() {
    var subMenuItem = document.querySelectorAll('.sub-menu .menu-item');
    if (subMenuItem.length > 0) {
      subMenuItem.forEach(function (element) {
        element.classList.add('animated');
      });
    }
    return [];
  },
  postList: function postList() {
    var sequence = [];
    var _CONFIG$motion$transi = CONFIG.motion.transition,
      post_block = _CONFIG$motion$transi.post_block,
      post_header = _CONFIG$motion$transi.post_header,
      post_body = _CONFIG$motion$transi.post_body,
      coll_header = _CONFIG$motion$transi.coll_header;
    function animate(animation, elements) {
      if (!animation) return;
      elements.forEach(function (targets) {
        sequence.push({
          targets: targets,
          complete: function complete() {
            return targets.classList.add('animated', animation);
          },
          deltaT: '-=100'
        });
      });
    }
    document.querySelectorAll('.post-block').forEach(function (targets) {
      sequence.push({
        targets: targets,
        complete: function complete() {
          return targets.classList.add('animated', post_block);
        },
        deltaT: '-=100'
      });
      animate(coll_header, targets.querySelectorAll('.collection-header'));
      animate(post_header, targets.querySelectorAll('.post-header'));
      animate(post_body, targets.querySelectorAll('.post-body'));
    });
    animate(post_block, document.querySelectorAll('.pagination, .comments'));
    return sequence;
  },
  sidebar: function sidebar() {
    var sequence = [];
    var sidebar = document.querySelectorAll('.sidebar-inner');
    var sidebarTransition = CONFIG.motion.transition.sidebar;
    // Only for Pisces | Gemini.
    if (sidebarTransition && (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini')) {
      sidebar.forEach(function (targets) {
        sequence.push({
          targets: targets,
          complete: function complete() {
            return targets.classList.add('animated', sidebarTransition);
          },
          deltaT: '-=100'
        });
      });
    }
    return sequence;
  },
  footer: function footer() {
    return [{
      targets: document.querySelector('.footer'),
      opacity: 1
    }];
  }
};