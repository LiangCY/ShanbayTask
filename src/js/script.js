var $ = require('jquery');


$(function () {

  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  var $body = $('body');
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

  $body.on('DOMNodeInserted', function (e) {
    if (e.target.tagName.toUpperCase() == 'ASIDE' ||
      e.target.className.indexOf('ad-slot') >= 0) {
      $(e.target).hide();
    }
  });

  $body.bind('touchmove', function (e) {
    e.preventDefault()
  })

  var $headline = $('h1.content__headline');
  $headline.html($headline.text().replace(/([a-z]+)/ig, "<span>$1</span>"));

  var $description = $('.content__standfirst p');
  $description.html($description.text().replace(/([a-z]+)/ig, "<span>$1</span>"));

  var $captions = $('figure figcaption.caption');
  $.each($captions, function (index, caption) {
    var $caption = $(caption);
    $caption.html($caption.text().replace(/([a-z]+)/ig, "<span>$1</span>"));
  });

  var $contents = $('.content__article-body p,.content__article-body li');
  $.each($contents, function (index, content) {
    var $content = $(content);
    $content.html($content.text().replace(/([a-z]+)/ig, "<span>$1</span>"));
  });


  $body.css('overflow', 'hidden');

  var $header = $('header.content__head');

  var top = 0;
  top = $header.offset().top;

  var anchors = [];

  anchors.push($header);

  var pageHeight = document.documentElement.clientHeight;

  $('.content__article-body').css('padding-bottom', pageHeight + 'px');

  var $pagination = $("<div class='my-pagination'></div>");

  $body.append($pagination);

  var $elements = $('#article').find('figure,.content__article-body span');

  $('.content__article-body span').css('display', 'inline-block');

  $elements.each(function () {
    if (this.tagName.toUpperCase() == 'FIGURE') {
      var $figure = $(this);
      if ($figure.offset().top + $figure.height() > anchors[anchors.length - 1].offset().top + pageHeight - 54) {
        $figure.css('margin-top', $figure.height());
        anchors.push($figure);
      }
    } else if (this.tagName.toUpperCase() == 'SPAN') {
      var $span = $(this);
      if ($span.offset().top != top) {
        top = $span.offset().top;
        if (top + $span.height() > anchors[anchors.length - 1].offset().top + pageHeight - 54) {
          $span.css('margin-top', $span.height());
          anchors.push($span);
        }
      }
    }
  });

  for (var i = 1; i <= anchors.length; i++) {
    $pagination.append("<span class='my-pagination-item'>" + i + "</span>");
  }

  $pagination.on('click', 'span', function (e) {
    var num = parseInt($(e.target).text());
    jump(num);
  });

  function jump(page) {
    document.body.scrollTop = anchors[page - 1].offset().top - 2;
  }

});