'use strict';

angular.module('servicesApp')
  .filter('location', function () {
    return function (location, short) {
      //location: {
      //  street:     String,
      //      state:      {type: String, required: true},
      //  city:       {type: String, required: true},
      //  zipCode:    {type: String, required: true}
      //},
      var result = '';

      if(short) {
        if(location.zipCode) {
          result += location.state + " " + location.zipCode;
        }else {
          result += location.city + " " + location.state;
        }
      } else {
        //logic is to only show zip code if possible, otherwise show city.
        // case 1. if zipcode, state + zipCode
        // case 2. if no zipcode, city, state
        if(location.street) {
          result += location.street + ", " + location.city;
        }
        result += ", " + location.state;
        if(location.zipCode) {
          result += " " + location.zipCode;
        }
      }

      return result;
    };
  });
