'use strict';

angular.module('servicesApp')
  .directive('ftlSummary', function () {
    return {
      templateUrl: 'app/ftl-summary/ftl-summary.html',
      restrict: 'EA',
      scope: {
        info: '=info',
        type: '=type'
      },

      link: function (scope, element, attrs) {
        scope.isDelivery = function() {
          return scope.label=='To';
        }

        scope.isFTL = function() {
          return scope.type=='FTL';
        }
      }
    };
  });
