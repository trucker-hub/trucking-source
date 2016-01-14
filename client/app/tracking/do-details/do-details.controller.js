'use strict';

angular.module('servicesApp')
    .controller('DoDetailsCtrl', function ($scope, $uibModalInstance, load) {

    $scope.load = load;

    $scope.send = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
