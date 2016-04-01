(function() {

  'use strict';

  Polymer ({
    properties: {
      name: {
        type: String
      },
      label: {
        type: String
      },
      datetime: {
        type: String,
        notify: true
      },
      date: {
        type: String,
        notify: true
      },
      time: {
        type: String,
        notify: true
      }
    },

    dateValidator: function(event) {
      var parent = event.target,
          date = event.target.value,
          badExp = /\d{2}\/\d{2}\/\d{4}/g,
          goodExp = /\d{4}-\d{2}-\d{2}/g;

      if (badExp.exec(date)) {
        date = date.split('/').reverse().join('-');
      }

      if (!goodExp.exec(date) && date !== "") {
        parent.setCustomValidity('Please enter birthday as mm/dd/yyyy');
      } else {
        parent.setCustomValidity('');
      }
    },

    timeValidator: function(event) {
      var parent = event.target,
          time = event.target.value,
          timeExp = /\d{1,2}\:\d{2}\s*(am|pm)/gi;

      if (!timeExp.exec(time)) {
        parent.setCustomValidity('Please enter a time with am or pm at the end');
      } else {
        parent.setCustomValidity('');
      }
    },

    // here's a basic datetime input polyfill since no others would work :(
    // it just the css on the divs depending on the datetime-local support
    ready: function() {
      var date;
      if (Modernizr.inputtypes['datetime-local']) {
        date = this.$.dateNative;
        date.setAttribute('style', "hidden: true");
        date.setAttribute('data-hidden', true);
      } else {
        date = this.$.datePolyfill;
        date.setAttribute('style', "hidden: false");
        date.setAttribute('data-hidden', false);
      }
    }
  });

})();
