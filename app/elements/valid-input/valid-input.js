(function() {
  'use-strict';

  Polymer({
    is: "valid-input",

    properties: {
      type: {
        type: String,
        value: "text"},
      validator: {
        type: String
      },
      name: {
        type: String
      },
      label: {
        type: String
      },
      placeholder: {
        type: String
      },
      pattern: {
        type: String
      }
    },

    listeners:{
      "input.blur":  "validate"
    },

    validate: function(e) {
      var vfn = eval(this.validator);
      vfn(e, this.$.input);
    }

  });
})();
