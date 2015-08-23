'use strict';

angular.module('servicesApp')
    .controller('CompanyDetailsCtrl', function ($scope, $http, $modal) {

        console.log("open a edit window for company");

        var vm = this;

        vm.changed = false;

        vm.ftlWeightCharges = [
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

        vm.ftlcsv = {
            content: null,
            header: true,
            headerVisible: false,
            separator: ",",
            separatorVisible: false,
            result: null
        };

        vm.getFtlRates = function() {
            return vm.company.ftl.rates;
        }

        vm.setCompany = function(company) {
          console.log("company is set to " + company);
          vm.company = company;
          vm.lastCopy = angular.copy(company);

          if(vm.company.ftl.OverWeightCharges.length ==0 ) {
              vm.company.ftl.OverWeightCharges = vm.ftlWeightCharges;
          }
        }

        vm.getFTLRateSummary = function() {
            if(vm.company.ftl.rates.length > 1) {
                return vm.company.ftl.rates.length + " rates available"
            } else {
                return "Not rates yet";
            }

        }

        vm.importFTLRates = function() {
          vm.company.ftl.rates = vm.ftlcsv.result;
          console.log(JSON.stringify(vm.ftlcsv.result))
          vm.openRateModal();

        }
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
                },
                function () {
                    console.log('Modal dismissed at: ' + new Date());
                }
            );
        };

        vm.selectedRegions = [];
        vm.regions = [];
        vm.refreshRegions = function() {
            if(vm.regions.length > 0) {
                return;
            }
            return $http.get('/api/geoservice/regions'
            ).then(function(response) {
                    vm.regions = response.data;
                    console.log("result = " + JSON.stringify(response.data));
                },

                function(response) {
                    console.log("Error=" + response);
                }
            );

        }

        vm.getState = function(item) {
            return item.state;
        }

        vm.change = function() {
          vm.changed = true;
        }

        vm.cancel = function() {
            console.log("Calling cancel function for company " + vm.company._id);
            angular.copy(vm.lastCopy, vm.company);
            $scope.$parent.cancel(vm.company);
        };

        vm.save = function() {
          $scope.$parent.saveCompany(vm.company,
            function(response) {
              vm.changed = false;
              vm.lastCopy = angular.copy(vm.company);
              console.log(JSON.stringify(response.data));
            },
            function(response) {
              vm.changed = true;
            }
          )
        }

      vm.delete = function() {
        $scope.$parent.deleteCompany(vm.company);
      }

        vm.loadFTL = function() {
          $http.get("/api/trucking-companies/" + vm.company._id).then(
            function(response) {
              console.log(JSON.stringify(response.data));
              vm.company.ftl = response.data.ftl;
            },
            function(response) {
              console.log("ran into error " + response);

            });
        };
    });
