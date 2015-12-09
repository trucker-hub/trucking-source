'use strict';

angular.module('servicesApp')
  .controller('CustomerSettingUpdateCtrl', function ($scope, $modalInstance, customerSettingService, customer) {
      console.log("Initialized CustomerSettingUpdateCtrl");

      $scope.customer = customer;


      $scope.ok = function () {

          $modalInstance.close();
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  });
