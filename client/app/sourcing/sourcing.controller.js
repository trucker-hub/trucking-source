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
        weight: 1000,
        quantity: 20,
        packaging: "carton",
        length: 10,
        width: 20,
        height: 10,
        description: "furnitures"
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

    $scope.sources = [
      {  name: "Aspeed", cost: 301.1, contact: "310-951-3843", location: "9111 S La Cienega Blvd, Inglewood, CA 90301"
      }
    ];

    $scope.removeLine = function (index) {
      $scope.request.lines.splice(index, 1);

    };

    $scope.query = function () {
      $scope.showDetails = false;
    }


  });
