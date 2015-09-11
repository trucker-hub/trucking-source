'use strict';

angular.module('servicesApp')
  .controller('CompanyFtlCtrl', function ($rootScope, $scope, $http, $modal) {
      var vm = this;

      vm.ltlWeightChargesTemplate = [
        {
          "containerSize": "20",
          ranges: [
            {limit:36000, charge: 100}, {limit:39000,charge:150}
          ]
        },
        {
          "containerSize": "40",
          ranges: [
            {limit:44000, charge: 100}, {limit:48000,charge:150}
          ]
        },
        {
          "containerSize": "40HQ",
          ranges: [
            {limit:44000, charge: 100}, {limit:48000,charge:150}
          ]
        },
        {
          "containerSize": "48",
          ranges: [
            {limit:44000, charge: 100}, {limit:48000,charge:150}
          ]
        }
      ];

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
        if(vm.company.ftl.OverWeightCharges.length ==0 ) {
          vm.company.ftl.OverWeightCharges = vm.ltlWeightChargesTemplate;
        }
      };

      vm.change = function() {
         vm.company.changed = true;
      }

      vm.getFtlRates = function() {
        return vm.company.ftl.rates;
      };

      vm.getFTLRateSummary = function() {
        if(vm.company.ftl.rates.length > 1) {
          return vm.company.ftl.rates.length + " rates available"
        } else {
          return "Not rates yet";
        }

      };

      vm.importFTLRates = function() {
        vm.company.ftl.rates = vm.ftlcsv.result;
        console.log(JSON.stringify(vm.ftlcsv.result))
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
              return vm.company.ftl.rates;
            }
          }
        });

        modalInstance.result.then(
            function (rates) {
              vm.company.ftl.rates = rates;
              vm.change();
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
        );
      };
  });
