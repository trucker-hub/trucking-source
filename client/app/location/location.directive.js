'use strict';

angular.module('servicesApp')
  .directive('location', function ($http) {
    return {
      templateUrl: 'app/location/location.html',
      restrict: 'E',
      scope: {
        info: '=info',
        type: '=type',
        label: '=label'

      },
      link: function (scope, element, attrs) {
        scope.isDelivery = function () {
          return scope.label == 'To';
        };

        scope.isFTL = function () {
          return scope.type == 'FTL';
        };

        scope.autocompleteOptions = {
          componentRestrictions: {country: 'us'}
        };
      }
    };
  });
