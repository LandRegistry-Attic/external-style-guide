// This is essentially to make a <section> > <h*> pattern into a kind of <details>
// THIS WILL NEED AN ACCESSIBILITY REVIEW!!!!
(function () {
  "use strict";
  var root = this,
      $ = root.jQuery;
  if(typeof root.LR === 'undefined') { root.LR = {}; }

  var fauxDetails = {

    _collection: {},

    init: function() {
      fauxDetails._collection = $('.js-faux-details');

      $.each(fauxDetails._collection, function(i, el) {
        var $this = $(el);

        // essentially wrap a <div class="js-faux-details-wrapper"> around everything after the first <h*> tag
        var $block = $this.children(':not(:first())');
        var $summary = $this.children().first();
        var $wrapper = $('<div class="js-faux-details-wrapper">');
        $wrapper.append($block);
        $this.empty().append($wrapper).prepend($summary);

        $summary
          .attr('tabindex', '0')
          .on('click', function(e) {
            $(this).parent().toggleClass('js-faux-details--open');
          })
          .on('keydown', function(e) {
            // e.preventDefault(); not needed?
            if (e.keyCode == 13) {
              $(this).parent().toggleClass('js-faux-details--open');
            }
          });
      });

    }
  };

  root.LR.fauxDetails = fauxDetails;

}).call(this);