'use strict';

angular.module('servicesApp')
    .controller('WarehouseDetailsCtrl', function ($scope) {
        var vm = this;
        vm.set = function(warehouse) {
            vm.warehouse = warehouse;
            vm.lastCopy = angular.copy(warehouse);
            if(!vm.warehouse.location.raw) {
                vm.warehouse.location.raw = vm.warehouse.location.full_address;
            }
        };

        vm.cancel = function() {
            console.log("Calling cancel function for company " + vm.company._id);
            angular.copy(vm.lastCopy, vm.warehouse);
            $scope.$parent.cancel(vm.warehouse);
        };

        vm.change = function() {
            vm.warehouse.changed = true;
        }
        vm.save = function() {
            $scope.$parent.save(vm.warehouse,
                function(response) {
                    vm.warehouse.changed = false;
                    vm.lastCopy = angular.copy(vm.warehouse);
                    vm.warehouse = response.data;
                    console.log("saved company as " + JSON.stringify(response.data));
                },
                function(response) {
                    vm.warehouse.changed = true;
                }
            )
        };

        vm.delete = function() {
            $scope.$parent.delete(vm.warehouse);
        };

    });
