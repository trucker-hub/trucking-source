'use strict';

angular.module('servicesApp')
  .controller('CompanyContactCtrl', function ($scope, $modalInstance, company) {

      $scope.company = company;

      $scope.change = function() {
         $scope.company.changed = true;
      };
      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
  });
