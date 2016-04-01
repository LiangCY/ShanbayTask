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

  // var height = 0;
  //
  // height += $('header.content__head')[0].offsetHeight;
  //
  // var $figures = $('#article').find('figure');
  //
  // var pageHeight = document.documentElement.clientHeight - 80;
  //
  // var totalHeight = document.body.offsetHeight;
  //
  // $.each($figures, function (index, figure) {
  //   console.log($(figure).offset().top);
  //   console.log(figure.offsetHeight);
  //   console.log($(figure).offset().top + figure.offsetHeight);
  //
  //   var figureTopOffsetTop = $(figure).offset().top;
  //   var figureBottomOffsetTop = figureTopOffsetTop + figure.offsetHeight;
  //
  //   console.log(height);
  //   console.log(pageHeight);
  //
  //   console.log(height + figureTopOffsetTop);
  //   console.log(height + figureBottomOffsetTop);
  //
  //   if (Math.floor((height + figureTopOffsetTop) / pageHeight) !== Math.floor((height + figureBottomOffsetTop) / pageHeight)) {
  //     $(figure).offset({top: Math.floor((height + figureTopOffsetTop) / pageHeight + 1) * pageHeight});
  //
  //   }
  //
  // });

});