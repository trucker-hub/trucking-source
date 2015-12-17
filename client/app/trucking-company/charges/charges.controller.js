'use strict';

angular.module('servicesApp')
  .controller('ChargesCtrl', function ($scope, $modalInstance, container) {
        console.log("Initialized ChargesCtrl");

        $scope.container = container;
        $scope.charges = angular.copy(container.additionalCharges);


        $scope.delete = function(index) {
            $scope.charges.splice(index,1);
        };

        $scope.add = function() {
            $scope.charges.push({
                name: $scope.name,
                charge: $scope.charge
            });
            $scope.name = '';
            $scope.charge =0.0;
        };

        $scope.ok = function () {
            var list = [];
            for(var i=0; i < $scope.charges.length; ++i) {
                var entry = $scope.charges[i];
                if(entry.name && entry.charge > 0.0) {
                    list.push(entry);
                }
            }
            if($scope.name && $scope.charge > 0.0) {
                list.push({
                    name: $scope.name,
                    charge: $scope.charge
                });
            }
            $scope.container.additionalCharges = list;

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
  });
