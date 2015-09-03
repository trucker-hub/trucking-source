'use strict';

angular.module('servicesApp')
  .filter('location', function () {
    return function (location, short) {
      //location: {
      //  street:     String,
      //      state:  {type: String, required: true},
      //      county: {type: String, required: true},
      //  city:       {type: String, required: true},
      //  zipCode:    {type: String, required: true}
      //},
      var result = '';

      if(!location) {
        return result;
      }
      if(short) {
        if(location.zipCode) {
          result += location.state + " " + location.zipCode;
        }else {
          result += location.city + " " + location.state;
        }
      } else {
        result = location.full_address;
      }
      return result;
    };
  });
