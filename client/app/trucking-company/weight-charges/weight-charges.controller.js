'use strict';

angular.module('servicesApp')
  .controller('WeightChargesCtrl', function ($scope, $modalInstance, sizeCharge) {
      console.log("Initialized WeightChargesCtrl");

      $scope.sizeCharge = sizeCharge;
      $scope.weightRangesCopy = angular.copy(sizeCharge.weightRanges);
      $scope.newLimit=0;
      $scope.newCharge=0;

      $scope.ok = function () {
          var cleaned = [];
         for(var i=0; i < $scope.weightRangesCopy.length; ++i) {
             var range = $scope.weightRangesCopy[i];
             if(range.limit>0 && range.charge >0.1) {
                 cleaned.push(range);
             }
         }
         if($scope.newLimit > 0 && $scope.newCharge >0.1) {
             cleaned.push({
                 limit:$scope.newLimit,
                 charge:$scope.newCharge
             });
         }
         cleaned.sort(function(a,b) {
             return a.limit - b.limit;
         });
         $scope.sizeCharge.weightRanges = cleaned;
          $modalInstance.close();
      };
      $scope.addLine = function() {
          $scope.weightRangesCopy.push({
             limit:$scope.newLimit,
             charge:$scope.newCharge
          });
          $scope.newLimit=0;
          $scope.newCharge=0;
      };
      $scope.removeLine = function(index) {
          $scope.weightRangesCopy.splice(index,1);
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('Cancel');
      };
  });