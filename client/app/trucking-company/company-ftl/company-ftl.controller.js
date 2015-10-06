'use strict';

angular.module('servicesApp')
  .controller('CompanyFtlCtrl', function ($rootScope, $scope, $http, $modal) {
      var vm = this;

      vm.selectedRegions = [];

      vm.getState = function(item) {
        return item.state;
      };

      vm.ftlcsv = {
        content: null,
        header: true,
        headerVisible: false,
        separator: ",",
        separatorVisible: false,
        result: null
      };

      vm.setCompany = function(company) {
        vm.company = company;
      };

      vm.change = function() {
         vm.company.changed = true;
      };

      vm.getFtlRates = function() {
        return vm.company.ftl.rateDef.byZipCode.rates;
      };

      vm.getFTLRateSummary = function() {
        if(vm.company.ftl.rateDef.byZipCode.rates.length > 1) {
          return vm.company.ftl.rateDef.byZipCode.rates.length + " rates available"
        } else {
          return "Not rates yet";
        }

      };

      vm.importFTLRates = function() {
        vm.company.ftl.rateDef.byZipCode.rates = vm.ftlcsv.result;
        console.log(JSON.stringify(vm.ftlcsv.result))
        vm.openRateModal();

      };
      vm.openRateModal = function () {

        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/trucking-company/ftl-rates/ftl-rates.html',
          controller: 'FtlRatesCtrl',
            scope: $scope,
          windowClass: 'full-screen-modal',
          resolve: {
            rates: function () {
              return vm.company.ftl.rateDef.byZipCode.rates;
            }
          }
        });

        modalInstance.result.then(
            function (rates) {
              vm.company.ftl.rateDef.byZipCode.rates = rates;
              vm.change();
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
        );
      };
  });
