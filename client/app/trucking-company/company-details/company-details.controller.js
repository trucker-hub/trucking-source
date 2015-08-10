'use strict';

angular.module('servicesApp')
    .controller('CompanyDetailsCtrl', function ($scope) {

        console.log("open a edit window for company");

        var vm = this;
        vm.setCompany = function(company) {
          console.log("company is set to " + company.name);
          vm.company = company;
        }


        vm.cancel = function() {
            console.log("Calling cancel function for company " + vm.company.id);
            $scope.$parent.cancel(vm.company);
        };

        vm.save = function() {
            $scope.$parent.save(vm.company);
        }
    });
