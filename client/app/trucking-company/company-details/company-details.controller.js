'use strict';

angular.module('servicesApp')
  .controller('CompanyDetailsCtrl', function ($rootScope, $scope, $http, truckingCompany) {

    console.log("open a edit window for company");

    var vm = this;

    vm.setCompany = function(company) {
      //console.log("company is set to " + JSON.stringify(company));
      vm.company = company;
      vm.lastCopy = angular.copy(company);
    };


    vm.regions =  [];
    vm.refreshRegions = function() {
      truckingCompany.fetchRegions(
          function() {
            vm.regions = truckingCompany.getRegions();
          },
          function() {
            console.log("can't get the list of the pre-defined regions");
          }
      );
    };

    vm.change = function() {
      vm.company.changed = true;
    };

    vm.cancel = function() {
      console.log("Calling cancel function for company " + vm.company._id);
      angular.copy(vm.lastCopy, vm.company);
      $scope.$parent.cancel(vm.company);
    };

    vm.save = function() {
      $scope.$parent.saveCompany(vm.company,
        function(response) {
          vm.company = response.data;
          vm.company.changed = false;
        },
        function(response) {
          vm.company.changed = true;
        }
      )
    };

    vm.delete = function() {
      $scope.$parent.deleteCompany(vm.company);
    };

  });
