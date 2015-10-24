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
        scope.iconType = '';
        if(scope.type=="FTL") {
          scope.iconType="fa-ship";
        }else if(scope.type=="LTL") {
          scope.iconType = "fa-truck";
        }else if(scope.type=="AIR") {
          scope.iconType="fa-plane";
        }
      }
    };
  });