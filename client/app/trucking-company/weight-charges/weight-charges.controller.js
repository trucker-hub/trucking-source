'use strict';

angular.module('servicesApp')
  .controller('WeightChargesCtrl', function ($scope, $modalInstance, sizeCharge) {
      console.log("Initialized WeightChargesCtrl");

      $scope.sizeCharge = sizeCharge;
      $scope.weightRangesCopy = angular.copy(sizeCharge.weightRanges);

      $scope.ok = function () {
         $scope.sizeCharge.weightRanges = $scope.weightRangesCopy;
          $modalInstance.close();
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('Cancel');
      };
  });