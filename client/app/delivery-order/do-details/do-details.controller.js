'use strict';

angular.module('servicesApp')
    .controller('DoDetailsCtrl', function ($scope, $modalInstance, load, source) {

    $scope.load = load;
    $scope.source = source;
    $scope.contact = {
      email: null,
      phone:null
    };

    $scope.create = function () {
      $modalInstance.close($scope.contact);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
