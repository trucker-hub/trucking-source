'use strict';

angular.module('servicesApp')
  .controller('CompanyLtlCtrl', function ($rootScope, $scope, $http, $modal) {
      var vm = this;


      vm.ltlcsv = {
        content: null,
        header: true,
        headerVisible: false,
        separator: ",",
        separatorVisible: false,
        result: null
      };

      vm.setCompany = function(company) {
        console.log("company is set to " + company);
        vm.company = company;
      };

      vm.change = function() {
        vm.company.changed = true;
      }

      vm.getLtlRates = function() {
        return vm.company.ftl.rates;
      };

      vm.getRateSummary = function() {
        if(vm.company.ltl.rates.length > 1) {
          return vm.company.ltl.rates.length + " rates available"
        } else {
          return "Not rates yet";
        }
      };

      vm.importLTLRates = function() {
        vm.company.ltl.rates = vm.ftlcsv.result;
        console.log(JSON.stringify(vm.ltlcsv.result))
        vm.openRateModal();

      };
      vm.openRateModal = function () {

        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/trucking-company/ftl-rates/ftl-rates.html',
          controller: 'FtlRatesCtrl',
          windowClass: 'full-screen-modal',
          resolve: {
            rates: function () {
              return vm.company.ltl.rates;
            }
          }
        });

        modalInstance.result.then(
            function (rates) {
              vm.company.ltl.rates = rates;
              vm.change();
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
        );
      };
    });
