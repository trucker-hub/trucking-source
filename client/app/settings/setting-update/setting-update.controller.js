'use strict';

angular.module('servicesApp')
  .controller('CustomerSettingUpdateCtrl', function ($scope, $uibModalInstance, customerSettingService, customer) {
    console.log("Initialized CustomerSettingUpdateCtrl");

    $scope.customer = customer;

    $scope.sameFeeStructure = true;

    customerSettingService.getCustomerSettings(customer._id,
      function (settings) {
        $scope.settings = settings;
      },
      function (defaultSettings) {
        $scope.settings = defaultSettings;
      }
    );

    $scope.ok = function () {

      customerSettingService.updateCustomerSettings($scope.settings, $scope.customer._id,

        function () {
          console.log("saved successfully " + $scope.customer._id);
          $uibModalInstance.close();
        },
        function () {
          console.log("saved not successfully " + $scope.customer._id);
        }
      );

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
