'use strict';

angular.module('servicesApp')
  .controller('PlaygroundCtrl', function ($scope) {
    $scope.message = 'Hello';

      $scope.zones = [
        {
          zone: "A",
          dropOffCharge:0,
          dropOffChargeOffhour:25,
          dropOffChargeWeekend:50,
          dropOffChargeHoliday:70,
          tiers: [{
            rate: 55,
            weightFrom: 0,
            weightTo: 1000,
            flat: true,
            weightIncrement: -1
          },
            {
              rate: 5,
              weightFrom: 1000,
              weightTo: 2000,
              flat: false,
              weightIncrement: 100
            },
            {
              rate: 4.5,
              weightFrom: 2000,
              weightTo: 3000,
              flat: false,
              weightIncrement: 100
            }
          ]
        },
        {
          zone: "B",
          dropOffCharge:0,
          dropOffChargeOffhour:25,
          dropOffChargeWeekend:50,
          dropOffChargeHoliday:70,
          tiers: [{
            rate: 60,
            weightFrom: 0,
            weightTo: 1000,
            flat: true,
            weightIncrement: -1
          },
            {
              rate: 5.25,
              weightFrom: 1000,
              weightTo: 2000,
              flat: false,
              weightIncrement: 100
            },
            {
              rate: 4.75,
              weightFrom: 2000,
              weightTo: 3000,
              flat: false,
              weightIncrement: 100
            }
          ]
        }];

      $scope.columns = [];
      $scope.flatRateRows = [];
      $scope.perLBSrateRows = [];


      var populateTable = function() {
        var index;
        for(index=0; index < $scope.zones.length; ++index) {
          var x = $scope.zones[index];
          $scope.columns.push(x.zone);
          var j;
          for(j=0; j < x.tiers.length; ++j) {
            var tier = x.tiers[j];
            if(tier.flat) {
              $scope.flatRateRows.push({from: tier.weightFrom, to: tier.weightTo});
            }else {
              $scope.perLBSrateRows()
            }
          }
        }


      }
  });
