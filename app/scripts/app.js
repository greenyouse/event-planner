/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/event-planner/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  window.addEventListener('WebComponentsReady', function() {
    // these pass the form submissions either validate or create an account
    document.getElementById('loginForm').addEventListener('iron-form-submit', app.setCredentials);
    document.getElementById('signupForm').addEventListener('iron-form-submit', app.createAccount);

    // var emails = document.querySelectorAll('input[name=email]');
    // var i = -1, len = emails.length;
    // for(; ++i < len;){
    //   var el = emails[i];
    //   el.addEventListener('blur', app.validateEmail);
    // }

  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  app._getInputValue = function(el) {
    return el.target.value;
  };

  app.validateEmail = function(e, inputEl) {
    var val = app._getInputValue(e),
        emailExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;

    if (!emailExp.exec(val)) {
      inputEl.setAttribute('error-message', 'Please enter a valid email address');
      inputEl.setAttribute('invalid', true);
    } else  {
      inputEl.removeAttribute('invalid');
    }

  };

  // TODO: add a password input element that has a checkbox to reveal the password (to prevent input error)
  app.validatePassword = function(e, inputEl) {
    var passwd = app._getInputValue(e),
        passExp = /(?=.*[#@\\.\\!]).*/,
        errMsg = [];

    if (passwd.length < 8) {
      errMsg.push('please use 8 or more characters');
    }
    if (!passExp.exec(passwd)) {
      errMsg.push('use one of these characters: # @ . !');
    }

    if (errMsg.length > 0) {
      var err = errMsg.join(' and ');
      inputEl.setAttribute('error-message', err);
      inputEl.setAttribute('invalid', true);
    } else {
      inputEl.removeAttribute('invalid');
    }
  };

  app.validateDate = function(e, inputEl) {
    var date = app._getInputValue(e),
        dateExp = /\d{2,4}\/\d{2}\/\d{2,4}/;

    if (!dateExp.exec(date)) {
      inputEl.setAttribute('error-message', 'Enter a birthday using mm/dd/yyyy');
      inputEl.setAttribute('invalid', true);
    } else {
      inputEl.removeAttribute('invalid');
    }
  };

  // used as a default for when to end a new event
  app.hourLater = function() {
    var date = new Date();

    date.setHours(date.getHours() + 1);
    return date.toLocaleDateString();
  };

  // used as default for start of new event
  app.today = function() {
    var date = new Date();

    return date.toLocaleDateString();
  };

  // returns a datetime string for the given date (used for datetime inputs)
  app.datetime = function(date) {
    var d = date.split("/").reverse().join("-"),
        t = date.toLocaleTimeString().split(":").slice(0,2).join(":");

    return d + "T" + t;
  };


  // this takes a date and formats it into a datetime-local string
  app.nowDateTime = function() {
    return moment().format('YYYY-MM-DDTHH:mm');
  };

  app.laterDateTime = function() {
    return moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm');
  };

  app.nowDate = function() {
    return moment().format("MM/DD/YYYY");
  };

  app.nowTime = function() {
    return moment().format("hh:mm a");
  };

  app.laterTime = function() {
    return moment().add(1, 'hours').format("hh:mm a");
  };


  app.toastMessage = function(toast, msg, into) {
    toast.text = msg;
    toast.fitInto = into;
    toast.show();
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };


  // for <form> submission using a <paper-button>
  app.submitHandler = function(id) {
    document.getElementById(id).submit();
  };

  // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  app.uuid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  /*
   Here's a fake session storage for weak login authentication. Normally the
   server does the authenticating and sets an encrypted session cookie but
   this isn't real authentication. Just storing a cleartext passwd here instead :p.
   */

  app.setCredentials = function (value) {
    var email = value.detail.email,
        passwd = value.detail.password;

    function invalidPasswd  () {
      var toast = app.$.loginToast,
          msg = 'Email and password combination invalid';
      app.toastMessage(toast, msg, loginMenu);
    };

    // validate here that the saved passwd matches the given one
    localforage.getItem(email).then(function(val) {
      if (!val) {
        invalidPasswd();
      }

      var acctPass = val.password;
      if (passwd === acctPass) {
        sessionStorage.setItem('sessionId', email);
        page.redirect(app.baseUrl);
      } else {
        invalidPasswd();
      }
    });
  };

  app.getCredentials = function () {
    return sessionStorage.getItem('sessionId');
  };

  // for logout
  app.removeCredentials = function () {
    sessionStorage.removeItem('sessionId');
  };

  // TODO: should use UUIDs for the account ids
  app.createAccount = function (value) {
    var name = value.detail.name,
        email = value.detail.email,
        passwd = value.detail.password;

    var acct = {name: name,
                email: email,
                password: passwd};

    localforage.setItem(email, acct).then(function(val) {
      app.setCredentials(value);
      page.redirect(app.baseUrl);
    }, function (e) {
      console.log("Error creating account", e);
    });
  };

  // taken from http://www.html5rocks.com/en/tutorials/es6/promises/
  app.spawn = function (generatorFunc) {
    function continuer(verb, arg) {
      var result;
      try {
        result = generator[verb](arg);
      } catch (err) {
        return Promise.reject(err);
      }
      if (result.done) {
        return result.value;
      } else {
        return Promise.resolve(result.value).then(onFulfilled, onRejected);
      }
    }
    var generator = generatorFunc();
    var onFulfilled = continuer.bind(continuer, "next");
    var onRejected = continuer.bind(continuer, "throw");
    return onFulfilled();
  };

})(document);
