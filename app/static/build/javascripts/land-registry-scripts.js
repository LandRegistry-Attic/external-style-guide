// Function.prototype.bind
//
// A polyfill for Function.prototype.bind. Which lets you bind a defined
// value to the `this` keyword in a function call.
//
// Bind is natively supported in:
//   IE9+
//   Chrome 7+
//   Firefox 4+
//   Safari 5.1.4+
//   iOS 6+
//   Android Browser 4+
//   Chrome for Android 0.16+
//
// Originally from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var BaseButtons = function ($elms, opts) {
    this.$elms = $elms;
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    if (opts !== undefined) {
      $.each(opts, function (optionName, optionObj) {
        this[optionName] = optionObj;
      }.bind(this));
    }
    this.setEventNames();
    this.getSelections();
    this.bindEvents();
  };
  BaseButtons.prototype.setEventNames = function () {
    this.selectionEvents = 'click';
    this.focusEvents = 'focus blur';
  };
  BaseButtons.prototype.markFocused = function ($elm, state) {
    var elmId = $elm.attr('id');

    if (state === 'focused') {
      $elm.parent('label').addClass(this.focusedClass);
    } else {
      $elm.parent('label').removeClass(this.focusedClass);
    }
  };
  BaseButtons.prototype.bindEvents = function () {
    var selectionEventHandler = this.markSelected.bind(this),
        focusEventHandler = this.markFocused.bind(this);

    this.$elms
      .on(this.selectionEvents, function (e) {
        selectionEventHandler($(e.target));
      })
      .on(this.focusEvents, function (e) {
        var state = (e.type === 'focus') ? 'focused' : 'blurred';

        focusEventHandler($(e.target), state);
      });
  };

  var RadioButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  RadioButtons.prototype.setEventNames = function () {
    // some browsers fire the 'click' when the selected radio changes by keyboard
    this.selectionEvents = 'click change';
    this.focusEvents = 'focus blur';
  };
  RadioButtons.prototype.getSelections = function () {
    var selectionEventHandler = this.markSelected.bind(this),
        selections = {};

    $.each(this.$elms, function (index, elm) {
      var $elm = $(elm),
          radioName = $elm.attr('name');

      if (typeof selections[radioName] === 'undefined') {
        selections[radioName] = false;
      }
      if ($elm.is(':checked')) {
        selectionEventHandler($elm);
        selections[radioName] = $elm;
      }
    });
    this.selections = selections;
  };
  RadioButtons.prototype.bindEvents = function () {
    BaseButtons.prototype.bindEvents.call(this);
  };
  RadioButtons.prototype.markSelected = function ($elm) {
    var radioName = $elm.attr('name'),
        $previousSelection = this.selections[radioName];

    if ($previousSelection) {
      $previousSelection.parent('label').removeClass(this.selectedClass);
    }
    $elm.parent('label').addClass(this.selectedClass);
    this.selections[radioName] = $elm;
  };
  RadioButtons.prototype.markFocused = function ($elm) {
    BaseButtons.prototype.markFocused.apply(this, arguments);
  };

  var CheckboxButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  CheckboxButtons.prototype.setEventNames = function () {
    BaseButtons.prototype.setEventNames.call(this);
  };
  CheckboxButtons.prototype.getSelections = function () {
    var selectionEventHandler = this.markSelected.bind(this);

    this.$elms.each(function (idx, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        selectionEventHandler($elm);
      }
    });
  };
  CheckboxButtons.prototype.bindEvents = function () {
    BaseButtons.prototype.bindEvents.call(this);
  };
  CheckboxButtons.prototype.markSelected = function ($elm) {
    if ($elm.is(':checked')) {
      $elm.parent('label').addClass(this.selectedClass);
    } else {
      $elm.parent('label').removeClass(this.selectedClass);
    }
  };
  CheckboxButtons.prototype.markFocused = function ($elm) {
    BaseButtons.prototype.markFocused.apply(this, arguments);
  };

  root.GOVUK.RadioButtons = RadioButtons;
  root.GOVUK.CheckboxButtons = CheckboxButtons;

  var selectionButtons = function ($elms, opts) {
    var $radios = $elms.filter('[type=radio]'),
        $checkboxes = $elms.filter('[type=checkbox]');

    if ($radios) {
      new GOVUK.RadioButtons($radios, opts);
    }
    if ($checkboxes) {
      new GOVUK.CheckboxButtons($checkboxes, opts);
    }
  };

  root.GOVUK.selectionButtons = selectionButtons;
}).call(this);

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