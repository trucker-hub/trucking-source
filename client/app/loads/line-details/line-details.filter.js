'use strict';

angular.module('servicesApp')
  .filter('lineDetails', function () {
    return function (input) {
      var result ='' + input.weight + 'lbs, ' + input.quantity + ' ' + input.packaging;

      if(input.length!=0 && input.width!=0 && input.height!=0) {
        result += ", " + input.width +"x" + input.length + "x" + input.height;
      }
      if(input.freightClass) {
        result += ", Class=" + input.freightClass;
      }
      return result;
    };
  });
