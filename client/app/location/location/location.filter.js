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
  })
    .filter('serviceList', function () {
      return function (services, type) {
        if(!services) {
          return "";
        }
        var i, x = "";
        for(i=0; i<services.length; ++i) {
          x += services[i].service +"; "
        }
        return type + (i==1?" service: ":" services: ") + x;

      };
    })
;
