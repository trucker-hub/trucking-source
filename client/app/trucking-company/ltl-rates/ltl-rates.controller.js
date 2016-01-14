'use strict';

angular.module('servicesApp')
    .controller('LtlRatesCtrl', function ($scope, $uibModalInstance, type, rates) {

      $scope.type = type;
      $scope.gridOptions = {};
      $scope.gridOptions.data = rates;
      $scope.gridOptions.enableCellEditOnFocus = true;
      $scope.gridOptions.enableFiltering = true;
      $scope.gridOptions.columnDefs = [
        { name: 'zipCode',        displayName: 'ZIP Code'},
        { name: 'city',           displayName: 'City'},
        { name: 'state',          enableCellEditOnFocus: false, displayName: 'State'},
        { name: 'zone',  displayName: 'Zone'}
      ];


      $scope.addRow = function() {
        $scope.gridOptions.data.push({
          "zipCode": "  ",
          "city": "  ",
          "state": "  ",
          "zone": ""
        });
      }
      $scope.ok = function () {
        $uibModalInstance.close($scope.gridOptions.data);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
