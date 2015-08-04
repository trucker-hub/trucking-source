'use strict';

angular.module('servicesApp')
  .controller('SourcingCtrl', function ($scope) {

        $scope.message = 'Hello';
        $scope.shipTo = {
            label:"shipTo",
            location: "...",
            locationType: 2,
            extraServices: []
        }
        $scope.shipFrom = {
            label:"shipFrom",
            location: "...",
            locationType: 1,
            extraServices: []
        }


  });
