(function() {
  'use strict';

  Polymer({
    is: 'event-list',

    properties: {
      'items': {
        type: Array,
        value: function() {
          return [];
        }
      }
    },

    loadEvent: function(event) {
      var item = event.model.item;
      var uuid = item.uuid;

      page.redirect('/event/' + uuid);
    },

    removeEvent: function(event) {
      var item = event.model.item;
      var uuid = item.uuid,
          index = this.items.indexOf(item);

      if (index > -1) {
        this.splice('items', index, 1);
      }

      localforage.removeItem(uuid, function(err) {
        // console.log('event removed');
      });
    },

    prettifyDateTime: function(date) {

    },

    prettifyEvent: function(event) {
      var guests = event.guests || [],
          start = event.start,
          end = event.end;

      event.guests = guests.join(", ");
      event.start = moment(start, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY, hh:mm a");
      event.end = moment(end, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY, hh:mm a");
      return event;
    },

    filterUUID: function (k) {
      var uuidExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      if (uuidExp.exec(k)) {
        return true;
      } else {
        return false;
      }
    },

    ready: function() {
      var that = this;
      // NOTE: using a generator funciton here, hence the *()
      app.spawn(function *() {
        var woot = that;
        try {
          // get a list of all the keys from the database
          let ks = localforage.keys().then(function(keys) {
            return keys;
          });
          let keys = yield ks;

          // filter down to only event items
          let eks = keys.filter(woot.filterUUID);
          // fetch each event from the database
          let eventPromises = eks.map(function(k){
            return localforage.getItem(k).then(function(event) {
              return event;
            });
          });

          for (let eventPromise of eventPromises) {
            // realize the pending promise
            let event = yield eventPromise;
            // and finally load the event so it gets rendered
            event = woot.prettifyEvent(event);
            woot.push('items', event);
          }
        }
        catch (err) {
          console.log("error loading the events " + err.message);
        }
      });
    }

  });
})();
