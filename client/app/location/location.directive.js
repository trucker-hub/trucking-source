'use strict';

angular.module('servicesApp')
  .directive('location', function ($http) {
    return {
      templateUrl: 'app/location/location.html',
      restrict: 'E',
      scope: {
        info: '=info',
        types: '=types',
        label: '=label'

      },
      link: function (scope, element, attrs) {
        scope.isDelivery = function () {
          return scope.label == 'To';
        };
        scope.autocompleteOptions = {
          componentRestrictions: {country: 'us'}
        };
      }
    };
  });
