'use strict';

angular.module('servicesApp').controller('CompanyLtlCtrl', function ($rootScope, $scope, $http, $modal) {
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
        vm.company = company;
        vm.ltl = vm.company.ltl;
    };

    vm.editIncrement = function() {
        vm.editWeightIncrement = true;
    };

    vm.saveIncrement = function() {
        vm.editWeightIncrement = false;
    }
    vm.editZones = function() {

        vm.zoneStrings = vm.ltl.zoneRateVariables.zones.map(function(item) {
            return item.label;
        }).join(",");
        vm.editingZones = true;
    };

    var updateZoneRates = function(zoneRates, zones) {
        var i,j;
        for(j=0; j < zoneRates.length; ++j) {
            var tier = zoneRates[j];
            var newRates = [];
            for(i=0; i < zones.length; ++i) {
                var zone = zones[i];
                var existing = tier.rates.filter(function(item) {
                    if(item.zone ==zone) {
                        return item;
                    }
                });
                if(existing.length==1) {
                    newRates.push(existing[0]);
                }else {
                    newRates.push({zone:zone, rate:-1});
                }
            }
            tier.rates = newRates;
        }
        vm.change();
    };

    vm.saveZones = function() {
        vm.editingZones = false;
        var zones = vm.zoneStrings.split(',').filter(function(item) {
            if(item.trim()) {
                return item;
            }
        });
        var newZones = [];
        //sync zones in zoneRateVariables
        var i;
        for(i=0; i < zones.length; ++i) {
            var zone = zones[i];
            var existing = vm.ltl.zoneRateVariables.zones.filter(function(item) {
                if(item.label==zone) {
                    return item;
                }
            });
            if(existing.length==1) {
                newZones.push(existing[0]);
            }else {
                newZones.push({label:zone,
                    dropOffCharge: 10,
                    dropOffChargeOffhour: 20,
                    dropOffChargeWeekend: 30,
                    dropOffChargeHoliday: 40 });
            }
        }
        vm.ltl.zoneRateVariables.zones = newZones;

        updateZoneRates(vm.ltl.flatRates, zones);
        updateZoneRates(vm.ltl.weightRates, zones);

    };

    vm.change = function() {
        vm.company.changed = true;
    };

    vm.getLTL = function() {
        return vm.company.ltl;
    };
    vm.getLtlRates = function() {
        return vm.company.ltl.rates;
    };

    vm.getRateSummary = function() {
        if(vm.ltl.flatRates.length + vm.ltl.weightRates.length> 1) {
            return (vm.ltl.flatRates.length + vm.ltl.weightRates.length) + " rates available"
        } else {
            return "Not rates yet";
        }
    };

    vm.getState = function(item) {
        return item.state;
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
