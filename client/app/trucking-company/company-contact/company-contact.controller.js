'use strict';

angular.module('servicesApp')
  .controller('CompanyContactCtrl', function ($scope, $uibModalInstance, company) {

      $scope.company = company;

      $scope.change = function() {
         $scope.company.changed = true;
      };
      $scope.ok = function () {
        $uibModalInstance.close();
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
  });
