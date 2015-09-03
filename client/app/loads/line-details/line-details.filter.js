'use strict';

angular.module('servicesApp')
  .filter('lineDetails', function () {
    return function (input) {
      console.log(JSON.stringify(input));
      var result ='' + input.weight + 'lbs, ' + input.quantity + ' ' + input.packaging;

      if(input.length!=0 && input.width!=0 && input.height!=0) {
        result += ", " + input.width +"x" + input.length + "x" + input.height;
      }
      return result;
    };
  })
  .filter('costSummary', function () {
    return function (input) {
      var index;
      var result = 0;
      for(index=0; index < input.length; index++) {
        result += input[index].charge;
      }
      return result;
    };
  });
