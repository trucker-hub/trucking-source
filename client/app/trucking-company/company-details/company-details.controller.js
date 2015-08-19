'use strict';

angular.module('servicesApp')
    .controller('CompanyDetailsCtrl', function ($scope, $http, $modal) {

        console.log("open a edit window for company");

        var vm = this;

        vm.changed = false;

        vm.setCompany = function(company) {
          console.log("company is set to " + company);
          vm.company = company;
          vm.lastCopy = angular.copy(company);
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