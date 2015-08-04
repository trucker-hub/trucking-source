'use strict';

angular.module('servicesApp')
  .directive('location', function () {
    return {
      templateUrl: 'app/location/location.html',
      restrict: 'E',
      scope: {
        info: '=info',
        label: '=label'
      },
      link: function (scope, element, attrs) {
        scope.isDelivery = function() {
          return scope.label=='Ship To';
        }
      }
    };
  });