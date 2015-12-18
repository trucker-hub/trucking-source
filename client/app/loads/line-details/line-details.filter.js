'use strict';

angular.module('servicesApp')
  .filter('lineDetails', function () {
    return function (input) {

      var result ='' + input.weight + 'lbs, ' + input.quantity + ' ' + input.packaging;

      if(input.length && input.width && input.height) {
        result += ", " + input.width +"x" + input.length + "x" + input.height;
      }
      if(input.freightClass) {
        result += ", Class=" + input.freightClass;
      }
      return result;
    };
  });
