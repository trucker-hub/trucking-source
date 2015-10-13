'use strict';

angular.module('servicesApp')
  .controller('ChargesCtrl', function ($scope, $modalInstance, charges) {
        console.log("Initialized ChargesCtrl");

        $scope.charges = charges;

        $scope.delete = function(index) {
            $scope.charges.splice(index,1);
        };


        $scope.add = function() {
            var newOne = {
                name: $scope.name,
                charge: $scope.charge
            };
            $scope.charges.push(angular.copy(newOne));
            $scope.name ="";
            $scope.charge =0.0;
        };

        $scope.ok = function () {
            var list = $scope.charges;
            if($scope.name && $scope.charge > 0) {
                var newOne = {
                    name: $scope.name,
                    charge: $scope.charge
                };
                list.push(newOne);
            }
            $modalInstance.close(list);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
  });
