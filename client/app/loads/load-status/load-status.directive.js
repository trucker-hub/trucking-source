'use strict';

angular.module('servicesApp')
  .directive('loadStatus', function () {
    return {
      templateUrl: 'app/loads/load-status/load-status.html',
      restrict: 'E',
      scope: {
        load: '=load'
      },
      link: function (scope, element, attrs) {
        scope.showLog = false;

        scope.toggleShowLog = function() {
          scope.showLog = !scope.showLog;
        }
      }
    };
  });