var $ = require('jquery');



$(function () {

  $('.top-banner-ad-container').remove();
  $('iframe').remove();
  $('header#header').remove();
  $('[class*=ad-slot]').remove();
  $('.content__header .content__labels ').remove();
  $('.breaking-news').remove();
  $('.site-message').remove();
  $('.content__meta-container').remove();
  $('.content__secondary-column').remove();
  $('aside.element-rich-link').remove();
  $('.submeta').remove();
  $('.content-footer').remove();
  $('footer.l-footer').remove();

  $('body').on('DOMNodeInserted', function (e) {
    if (e.target.tagName.toUpperCase() == 'ASIDE' ||
      e.target.className.indexOf('ad-slot') >= 0) {
      $(e.target).hide();
    }
  });

});