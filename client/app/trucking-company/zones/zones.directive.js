'use strict';

angular.module('servicesApp')
  .directive('zones', function () {
    return {
      templateUrl: 'app/trucking-company/zones/zones.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });