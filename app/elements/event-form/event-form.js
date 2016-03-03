(function() {
  'use strict';

  Polymer({
    is: 'event-form',

    properties: {
      name: {
        value: 'New Event',
        notify: true
      },

      host: {
        notify: true
      },
      type: {
        notify: true
      },
      // TODO: could add these time functions to the component
      startDateTime: {
        value: function() {
          return app.nowDateTime();
        },
        notify: true
      },
      startDate: {
        value: function() {
          return app.nowDate();
        },
        notify: true
      },
      startTime: {
        value: function() {
          return app.nowTime();
        },
        notify: true
      },
      endDateTime: {
        value: function() {
          return app.laterDateTime();
        },
        notify: true
      },
      endDate: {
        value: function() {
          return app.nowDate();
        },
        notify: true
      },
      endTime: {
        value: function() {
          return app.laterTime();
        },
        notify: true
      },
      guests: {
        type: Array,
        notify: true
      },
      address: {
        notify: true
      },
      details: {
        notify: true
      },
      message: {}
    },

    listeners: {
      'submitEvent.tap': 'submitHandler',
      'eventForm.iron-form-submit': 'saveEvent'
    },

    // it's hard to set a custom validator on-blur, so I'm
    // leaving it here as an on-submit event instead
    checkDates: function(start, end) {
      var diff = moment(start).diff(end),
          toast = this.$.failureToast,
          msg = "start date must be before end date";

      if (diff >= 0) {
        app.toastMessage(toast, msg, eventForm);
        return false;
      } else {
        return true;
      }
    },

    submitHandler: function() {
      var form = this.$.eventForm;
      form.submit();
    },

    normalizeDate: function(data) {
      var date = data[0],
          time = data[1];

      date = moment(date, "MM/DD/YYYY").format("YYYY-MM-DD");
      time = moment(time, "hh:mm a").format("HH:mm:ss");
      return date + "T" + time;
    },

    // saves new events using UUIDs for uniqueness
    // TODO: could rely on Polymer properties here intead of using HTML forms...
    saveEvent: function(data) {
      var dateSupported = Modernizr.inputtypes['datetime-local'];
      var name = this.name,
          host = this.host,
          type = this.type,
          start = dateSupported ? this.startDateTime : this.normalizeDate(data.detail.startDate),
          end = dateSupported ? this.endDateTime : this.normalizeDate(data.detail.endDate),
          guests = this.guests,
          address = this.address || data.detail.address,
          details = this.details,
          uuid = this.uuid || String(app.uuid());

      if (this.checkDates(start, end)) {
        var event = {name: name,
                     host: host,
                     type: type,
                     start: start,
                     end: end,
                     guests: guests,
                     address: address,
                     details: details,
                     uuid: uuid};

        var that = this;
        localforage.setItem(uuid, event).then(function(){
          var toast = that.$.eventToast,
              msg = 'New event added';

          app.toastMessage(toast, msg, eventForm);
        });

        // jump to homepage + render the new event in event-list
        // FIXME: pretty ugly way of updating (going quick for now)
        window.location = app.baseUrl;
      }
    }

  });
})();
