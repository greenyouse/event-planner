(function() {
  'use strict';

  Polymer({
    'is': 'profile-form',

    'properties': {
      'email': {},
      'name': {},
      'password': {},
      'birthday': {},
      'employer': {},
      'job': {}
    },

    'listeners': {
      'profileForm.iron-form-submit': 'updateProfile'
    },

    updateProfile: function(data) {
      var name = this.name,
          passwd = this.password,
          bday = this.birthday,
          employer = this.employer,
          job = this.job,
          email = this.email;

      var profile = {name: name,
                     email: email,
                     password: passwd,
                     birthday: bday,
                     employer: employer,
                     title: job};

      localforage.setItem(email, profile).then(function(val) {
        var toast = document.getElementById('updateToast'),
            msg = 'Profile updated successfully';

        app.toastMessage(toast, msg, profileForm);
      });
    }

  });
})();
