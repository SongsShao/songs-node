/* global Fancybox */

document.addEventListener('page:loaded', function () {
  /**
   * Wrap images with fancybox.
   */
  document.querySelectorAll('.post-body :not(a) > img, .post-body > img').forEach(function (image) {
    var imageLink = image.dataset.src || image.src;
    var imageWrapLink = document.createElement('a');
    imageWrapLink.classList.add('fancybox');
    imageWrapLink.href = imageLink;
    imageWrapLink.setAttribute('itemscope', '');
    imageWrapLink.setAttribute('itemtype', 'http://schema.org/ImageObject');
    imageWrapLink.setAttribute('itemprop', 'url');
    var dataFancybox = 'default';
    if (image.closest('.post-gallery') !== null) {
      dataFancybox = 'gallery';
    } else if (image.closest('.group-picture') !== null) {
      dataFancybox = 'group';
    }
    imageWrapLink.dataset.fancybox = dataFancybox;
    var imageTitle = image.title || image.alt;
    if (imageTitle) {
      imageWrapLink.title = imageTitle;
      // Make sure img captions will show correctly in fancybox
      imageWrapLink.dataset.caption = imageTitle;
    }
    image.wrap(imageWrapLink);
  });
  Fancybox.bind('[data-fancybox]');
});