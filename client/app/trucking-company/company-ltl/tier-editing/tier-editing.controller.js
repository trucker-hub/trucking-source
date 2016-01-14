'use strict';

angular.module('servicesApp')
    .controller('TierEditingCtrl', function ($scope, $uibModalInstance, flatTiers, weightTiers) {

      console.log("Initialized TierEditingCtrl");
      $scope.newFlatTier = {
        tier: "",
        previous: "",
        ranges: [0, 1000]
      };

      $scope.newWeightTier = {
        tier: "",
        previous: "",
        ranges: [0, 1000]
      };
      $scope.flatTiers = flatTiers;
      $scope.weightTiers = weightTiers;

      $scope.removeFlatTier = function(index) {
        $scope.flatTiers.splice(index,1);
      };

      $scope.removeWeightTier = function(index) {
        $scope.weightTiers.splice(index,1);
      };

      $scope.addFlatTier = function() {
        var newOne = JSON.parse(JSON.stringify($scope.newFlatTier));
        $scope.flatTiers.push(newOne);
        $scope.newFlatTier.tier = "";
      };

      $scope.addWeightTier = function() {
        var newOne = JSON.parse(JSON.stringify($scope.newWeightTier));
        $scope.weightTiers.push(newOne);
        $scope.newWeightTier.tier = "";
      };


      $scope.ok = function () {
        $uibModalInstance.close({flat: flatTiers, weight: weightTiers});
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    });