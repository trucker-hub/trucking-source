'use strict';

angular.module('servicesApp')
  .filter('elaspedTime', function () {
    return function (input) {
      var now = Date.now();

      var elapsed = (input.getTime() - now) % (1000 * 3600);

      if(elapsed < 0 ) {
        return " in the past"
      }else {
        return elapsed + ' hours away';
      }
    };
  });
