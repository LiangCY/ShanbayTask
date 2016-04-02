var $ = require('jquery');
var anchors = [];
var SEARCH_WORD_URL = "https://www.shanbay.com/api/v1/bdc/search/?word=";

var pageHeight = document.documentElement.clientHeight;
var pageWidth = document.documentElement.clientWidth;

var $wordTip = $("<div class='word-tip'><div></div></div>");
var $wordTipHeader = $("<div class='header'></div>");
var $wordTipSpeaker = $("<div class='speaker'></div>");
var $wordTipTitle = $("<div class='title'></div>");
$wordTipHeader.append($wordTipSpeaker);
$wordTipHeader.append($wordTipTitle);
var $wordTipContent = $("<div class='definition'></div>");
var $audio = $("<audio></audio>");
$wordTip.append($wordTipHeader);
$wordTip.append($wordTipContent);
$wordTip.append($audio);

$(function () {
  var $body = $('body');

  /**
   * 阻止页面滚动
   */
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  $body.bind('touchmove', function (e) {
    e.preventDefault()
  });

  /**
   * 去除无用信息
   */
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
  /**
   * 删除之后加载的无用信息
   */
  $body.on('DOMNodeInserted', function (e) {
    if (e.target.tagName.toUpperCase() == 'ASIDE' ||
      e.target.className.indexOf('ad-slot') >= 0) {
      $(e.target).hide();
    }
  });

  /**
   * 分词
   */
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

  /**
   * 添加页码区
   */
  var $pagination = $("<div class='my-pagination'></div>");
  $body.append($pagination);

  /**
   * 获取页码并添加
   */
  anchors = genPagination();
  for (var i = 1; i <= anchors.length; i++) {
    $pagination.append("<span class='my-pagination-item'>" + i + "</span>");
  }
  $pagination.on('click', 'span', function (e) {
    jumpToPage(e.target, anchors);
  });

});

$(window).on('load', function () {
  /**
   * 到第一页
   */
  setTimeout(function () {
    scrollTo(0, 0);
    $('.my-pagination .my-pagination-item:first-child').addClass('active');
  }, 0);

  /**
   * 单词查询弹窗
   */
  $('body').append($wordTip);
  $wordTip.on('click', function (e) {
    if ($(e.target).hasClass('speaker')) {
      var audio = $audio.get(0);
      if (audio.src) {
        audio.play();
      }
    } else {
      $wordTip.css('visibility', 'hidden');
    }

  });

  var pageTops = anchors.map(function (anchor) {
    return anchor.offset().top - 2;
  });

  $('#article').find('span').on('click', function () {
    $wordTip.css('visibility', 'hidden');
    var $word = $(this);
    var offset = $word.offset();
    var word = $word.text();
    for (var i = 0, len = pageTops.length; i < len; i++) {
      if (offset.top < pageTops[i]) {
        break;
      }
    }
    /**
     * 计算弹窗位置
     */
    var pageTop = pageTops[i - 1];
    var pageBottom = pageTop + pageHeight - 54;
    var deltaTop = offset.top - pageTop;
    var deltaBottom = pageBottom - offset.top;
    var deltaLeft = offset.left;
    var deltaRight = pageWidth - deltaLeft;
    var h = deltaLeft > deltaRight ? 'left' : 'right';
    var v = deltaTop > deltaBottom ? 'top' : 'bottom';
    $.ajax(SEARCH_WORD_URL + word, {
      success: function (data) {
        showTip(h, v, $word, data);
      },
      error: function () {
        showTip(h, v, $word, {msg: "请求失败"});
      }
    });
  });
});

function showTip(h, v, $word, result) {
  var wordOffset = $word.offset();
  if (result.status_code === 0) {
    var data = result.data;
    var audio = data.audio;
    $wordTipTitle.text(data.content);
    $wordTipSpeaker.text("发音");
    $wordTipContent.text(data.definition);
    $audio.attr('src', audio);
  } else {
    $wordTipTitle.text("");
    $wordTipSpeaker.text("");
    $wordTipContent.text(result.msg);
  }
  var tipWidth = $wordTip.outerWidth();
  var tipHeight = $wordTip.outerHeight();
  $wordTip.offset({
    left: h == 'left' ? wordOffset.left - tipWidth : wordOffset.left,
    top: v == 'top' ? wordOffset.top - tipHeight : wordOffset.top
  });
  $wordTip.css('visibility', 'visible');
}

function genPagination() {
  var $header = $('header.content__head');
  var top = $header.offset().top;

  var anchors = [];
  anchors.push($header);

  $('.content__article-body').css('padding-bottom', pageHeight + 'px');
  $('.content__article-body span').css('display', 'inline-block');

  var $elements = $('#article').find('figure,.content__article-body span');

  $elements.each(function () {
    if (this.tagName.toUpperCase() == 'FIGURE') {
      var $figure = $(this);
      if ($figure.offset().top + $figure.outerHeight() > anchors[anchors.length - 1].offset().top + pageHeight - 54) {
        $figure.css('margin-top', $figure.outerHeight());
        if ($figure.outerHeight() > pageHeight - 54) {
          $figure.height(pageHeight - 54);
          var $image = $figure.find('img');
          var imgHeight = $image.height();
          var $figcaption = $figure.find('figcaption.caption');
          var newImgHeight = pageHeight - 54 - $figcaption.outerHeight();
          $image.height(newImgHeight).css('width', 'auto');
          var imgWidth = $image.width();
          $image.css('margin-left', (pageWidth - imgWidth) / 2 + 'px');
          $figcaption.css('margin-top', (newImgHeight - imgHeight) + 'px');
        }
        anchors.push($figure);
      }
    } else if (this.tagName.toUpperCase() == 'SPAN') {
      var $span = $(this);
      if ($span.offset().top != top) {
        top = $span.offset().top;
        if (top + $span.outerHeight() > anchors[anchors.length - 1].offset().top + pageHeight - 54) {
          $span.css('margin-top', pageHeight + 'px');
          anchors.push($span);
        }
      }
    }
  });

  return anchors;
}

function jumpToPage(item, anchors) {
  if ($(item).hasClass('active')) {
    return;
  }
  $(item).addClass('active').siblings().removeClass('active');
  var num = parseInt($(item).text());
  document.body.scrollTop = anchors[num - 1].offset().top - 2;
}