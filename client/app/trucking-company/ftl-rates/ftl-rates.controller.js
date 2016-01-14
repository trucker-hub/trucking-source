'use strict';

angular.module('servicesApp')
    .controller('FtlRatesCtrl', function ($scope, $uibModalInstance, rates) {

        $scope.gridOptions = {};
        $scope.gridOptions.data = rates;
        $scope.gridOptions.enableCellEditOnFocus = true;
        $scope.gridOptions.enableFiltering = true;
        $scope.gridOptions.columnDefs = [
            { name: 'zipCode',        displayName: 'ZIP Code'},
            { name: 'city',           displayName: 'City'},
            { name: 'state',          enableCellEditOnFocus: false, displayName: 'State'},
            { name: 'rate',           displayName: 'Rate', type: 'number'},
            { name: 'dropOffCharge',  displayName: 'Dropoff Fee', type: 'number'},
            { name: 'dropOffChargeOffhour', displayName: 'Offhour Dropoff Fee', type: 'number'},
            { name: 'dropOffChargeWeekend', displayName: 'Weekend Dropoff Fee', type: 'number'},
            { name: 'dropOffChargeHoliday', displayName: 'Holiday Dropoff Fee', type: 'number'}
        ];


        $scope.addRow = function() {
            $scope.gridOptions.data.push({
                "zipCode": "  ",
                "city": "  ",
                "state": "  ",
                "rate": 0.0,
                "dropOffCharges": [{timePeriod: "normal", charge:100}]
            });
        }
        $scope.ok = function () {
          $uibModalInstance.close($scope.gridOptions.data);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
    });
