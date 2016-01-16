'use strict';

angular.module('servicesApp')
    .directive('loadType', function () {
      return {
        template: '<i class="fa fa-lg {{iconType}}"></i>',
        restrict: 'E',
        scope: {
          type: '=type'
        },
        link: function (scope, element, attrs) {
          scope.iconType = '';
          if (scope.type == "FTL") {
            scope.iconType = "fa-ship";
          } else if (scope.type == "LTL") {
            scope.iconType = "fa-truck";
          } else if (scope.type == "AIR") {
            scope.iconType = "fa-plane";
          }
          //console.log("scope icon Type is " + scope.iconType);
        }
      }
    });
