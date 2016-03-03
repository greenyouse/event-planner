(function() {

  var autocomplete;
  'use strict',

  Polymer({
    is: 'places-input',

    properties: {
      place: {}
    },

    fillInAddress: function() {
      var place = autocomplete.getPlace(),
          premise,
          street,
          route,
          city;

      // destructure the results and bind to local vars
      for (var i = 0; i < place.address_components.length; i++) {
        switch (place.address_components[i].types[0]) {
        case "premise":
          premise = place.address_components[i]["long_name"];
          break;
        case "street_number":
          street = place.address_components[i]['short_name'];
          break;
        case "route":
          route = place.address_components[i]['long_name'];
          break;
        case "locality":
          city = place.address_components[i]['long_name'];
          break;
        }
      }

      street = [street, route].filter(function(s) {
        return s;
      }).join(" ");

      // bind the values back to the HTML inputs
      var addr = [premise, street, city].filter(function(s) {
        return s;
      }).join(", "),
          addrForm = document.getElementById('address');
      this.place = addr;
      addrForm.value = addr;
    },

    geoLocate: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    },

    // load the Google Places library and initialize after it's loaded
    // "https://maps.googleapis.com/maps/api/js?key=AIzaSyC3IKiTAqm02v_qve7K0uf_PXv6fmDQX7I&signed_in=true&libraries=places"
    attached: function() {
      autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('address').inputElement,
        {types: ['geocode']});
      this.geoLocate();
      autocomplete.addListener('place_changed', this.fillInAddress);
    }

  });
})();
