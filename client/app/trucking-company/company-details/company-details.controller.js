'use strict';

angular.module('servicesApp')
    .controller('CompanyDetailsCtrl', function ($scope, $modalInstance, id) {

        console.log("open a edit window for company whose id is " +id);

        $scope.status = {id: id, status: "OK"};
        $scope.ok = function() {
            $modalInstance.close($scope.status);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        }
    });
