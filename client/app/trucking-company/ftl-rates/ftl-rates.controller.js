'use strict';

angular.module('servicesApp')
  .controller('FtlRatesCtrl', function ($scope, $modalInstance, rates) {

        $scope.gridOptions = {};
        $scope.gridOptions.data = rates;
        $scope.gridOptions.enableCellEditOnFocus = true;
        $scope.gridOptions.enableFiltering = true;
        $scope.gridOptions.columnDefs = [
            { name: 'zipCode',       displayName: 'ZIP Code'},
            { name: 'city',          displayName: 'City'},
            { name: 'state',         enableCellEditOnFocus: false, displayName: 'State'},
            { name: 'rate',          displayName: 'Rate', type: 'number'},
            { name: 'dropOffCharge', displayName: 'Dropoff Fee', type: 'number'},
        ];


        $scope.addRow = function() {
            $scope.gridOptions.data.push({
                "zipCode": "  ",
                "city": "  ",
                "state": "  ",
                "rate": 0.0,
                "dropOffCharge": 0.0
            });
        }
      $scope.ok = function () {
        $modalInstance.close($scope.gridOptions.data);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
  });
