'use strict';

angular.module('servicesApp')
    .controller('CompanyFtlCtrl', function ($scope, truckingCompany) {
      var vm = this;

      vm.selectedRegions = [];

      vm.getState = function(item) {
        return item.state;
      };

      vm.setCompany = function(company) {
        vm.company = company;
      };

      vm.change = function() {
        vm.company.changed = true;
      };

      vm.editWeightRanges = function(sizeCharge) {
          truckingCompany.openWeightChargesDialog(sizeCharge,
              function() {
                  vm.change();
              },
              function() {}
          )};

      vm.editCharges = function() {
        truckingCompany.openChargesDialog(vm.company.ftl,
            function() {
              vm.change();
            },
            function() {}
        )};
    });
