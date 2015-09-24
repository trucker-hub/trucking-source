'use strict';

angular.module('servicesApp')
    .controller('DoDetailsCtrl', function ($scope, $modalInstance, load) {

    $scope.load = load;

    $scope.send = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
