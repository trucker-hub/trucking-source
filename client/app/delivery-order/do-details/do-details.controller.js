'use strict';

angular.module('servicesApp')
    .controller('DoDetailsCtrl', function ($scope, $modalInstance, load) {

    $scope.load = load;
    $scope.contact = {
      email: null,
      phone:null
    };

    $scope.send = function () {
      $modalInstance.close($scope.contact);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
