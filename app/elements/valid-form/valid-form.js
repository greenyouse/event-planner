(function() {
  'use-strict';

  Polymer({
    is: 'valid-form',
    properties: {
      method: {
        type: String,
        value: "post"},
      action: {
        type: String,
        value: "/"},
      button: {
        type: String,
        value: "Submit"}
    },

    listeners: {
      // using tap and keydown work well for handling custom element validity like <input-list>
      'form.tap': 'validate',
      'form.keydown': 'validate',
      'submit.tap': 'submit'
    },

    validate: function() {
      var form = this.$.form,
          submitBtn = this.$.submit;
      submitBtn.disabled = !form.validate();
    },

    submit: function() {
      this.$.form.submit();
    }

  });
})();
