(function() {

  'use strict';

  Polymer ({
    properties: {
      id: {},
      name: {},
      label: {
        value: "date and time"
      },
      datetime: {},
      date: {},
      time: {}
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
    ready: function() {
      var temp = this.$.dtForm;
      if (Modernizr.inputtypes['datetime-local']) {
        var dt = document.createElement('paper-input');
        dt.setAttribute('type', 'datetime-local');
        dt.setAttribute('id', this.id);
        dt.setAttribute('name', this.name);
        dt.setAttribute('label', this.label);
        dt.value = this.datetime;
        temp.appendChild(dt);
      } else {
        var dl = document.createElement('p'),
            d = document.createElement('input'),
            t = document.createElement('input');

        d.setAttribute('name', this.name);
        d.setAttribute('type', 'text');
        d.setAttribute('class', 'flexchild');
        d.setAttribute('placeholder', 'mm/dd/yyyy');
        d.value = this.date;
        t.setAttribute('id', this.id);
        t.setAttribute('name', this.name);
        t.setAttribute('type', 'text');
        t.setAttribute('class', 'flexchild');
        t.setAttribute('placeholder', 'hh:mm am/pm');
        t.value = this.time;
        temp.setAttribute('class', 'container flex');
        dl.textContent = this.label;

        d.addEventListener('blur', this.dateValidator);
        t.addEventListener('blur', this.timeValidator);
        temp.appendChild(dl);
        temp.appendChild(d);
        temp.appendChild(t);
      }
    }
  });

})();
