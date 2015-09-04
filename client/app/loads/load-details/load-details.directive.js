'use strict';

angular.module('servicesApp')
  .directive('loadDetails', function () {
    return {
      templateUrl: 'app/loads/load-details/load-details.html',
      scope: {
        load: '=load',
        source: '=?source'
      },
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });
