(function() {
  'use strict';

  Polymer({
    is: 'input-list',

    properties: {
      name: {},
      items: {
        type: Array,
        value: [],
        notify: true
      }
    },

    addItem: function (event) {
      event.preventDefault();
      var idx = this.items.indexOf(this.newItem);

      // make sure newItem isn't already in the list
      if (idx === -1) {
        this.push('items', this.newItem);
        this.newItem = "";
      }
    },

    removeItem: function(event) {
      var item = event.model.item;
      var index = this.items.indexOf(item);

      if (index > -1) {
        this.splice('items', index, 1);
      }
    }

  });
})();
