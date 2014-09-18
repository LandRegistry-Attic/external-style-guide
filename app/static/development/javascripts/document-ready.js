$(function() {

  // stop the position:fixed subnav rolling into footer
  GOVUK.stopScrollingAtFooter.addEl($('.js-stick-at-top-when-scrolling'), $('.js-stick-at-top-when-scrolling').height());

});