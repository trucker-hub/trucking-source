'use strict';

angular.module('servicesApp')
  .controller('CustomerSettingUpdateCtrl', function ($scope, $modalInstance, customerSettingService, customer) {
    console.log("Initialized CustomerSettingUpdateCtrl");

    $scope.customer = customer;


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
          $modalInstance.close();
        },
        function () {
          console.log("saved not successfully " + $scope.customer._id);
        }
      );

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
