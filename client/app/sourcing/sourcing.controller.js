'use strict';

angular.module('servicesApp')
  .controller('SourcingCtrl', function ($scope, $http, ngProgressFactory) {

    $scope.request = {
      shipTo: {
        label: "shipTo",
        location: "",
        locationType: 2,
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: "",
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

        $scope.packagings = [
            {id: 0, name: "Full container"},
            {id: 1, name: "Pallets (48x40)"},
            {id: 2, name: "Pallets (48x48)"},
            {id: 3, name: "Pallets (60x48)"},
            {id: 4, name: "Bags"},
            {id: 5, name: "Bales"},
            {id: 6, name: "Cartons"},
            {id: 7, name: "Crates"},
            {id: 8, name: "Boxes"},
            {id: 9, name: "Rolls"},
            {id: 10, name: "Others"}
        ];

    $scope.enableEditing = function() {
      $scope.showDetails = true;
    };

    $scope.showDetails = true;

    $scope.addLine = function () {
      $scope.request.lines.push({
        weight: 0,
        quantity: 1,
        packaging: {id:0, name: "Full container"},
        length: 0,
        width: 0,
        height: 0,
        description: ""
      })
    };

    $scope.sources = [];

    $scope.removeLine = function (index) {
      $scope.request.lines.splice(index, 1);

    };

    $scope.query = function () {
        console.log("send request = " + JSON.stringify($scope.request));

        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
      $http.post("/api/sourcing", $scope.request).then(
        function(response) {
            console.log(response);
            $scope.sources = response.data;
            $scope.progressbar.complete();
        },
        function(response) {
          //show a alert and empty the table
          console.log("called /api/sourcing but returned res = " + JSON.stringify(response));
            $scope.progressbar.stop();
        })
    };


  });
