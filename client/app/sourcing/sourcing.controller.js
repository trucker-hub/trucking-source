'use strict';

angular.module('servicesApp')
  .controller('SourcingCtrl', function ($scope) {

    $scope.message = 'Hello';

    $scope.request = {
      shipTo: {
        label: "shipTo",
        location: "90301",
        locationType: 2,
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: "90011",
        locationType: 1,
        extraServices: []
      },
      lines: [{
        weight: 0,
        quanity: 0,
        packaging: "carton",
        length: 0,
        width: 0,
        height: 0,
        description: ""
      }],

      trailer: {
        type: "Dry Van",
        length: "20"
      }
    };
    $scope.type = 'LTL';
    $scope.isQuerying = false;

    $scope.enableEditing = function() {
      $scope.showDetails = true;
    }

    $scope.showDetails = true;

    $scope.addLine = function () {
      $scope.request.lines.push({
        weight: 0,
        quanity: 0,
        packaging: "carton",
        length: 0,
        width: 0,
        height: 0,
        description: ""
      })
    };

    $scope.removeLine = function (index) {
      $scope.request.lines.splice(index, 1);

    };

    $scope.query = function () {
      $scope.showDetails = false;
    }


  });
