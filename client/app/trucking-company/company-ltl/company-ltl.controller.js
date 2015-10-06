'use strict';

angular.module('servicesApp').controller('CompanyLtlCtrl', function ($rootScope, $scope, $http, $modal) {

  var vm = this;

  vm.setCompany = function(company, freight, type) {
    vm.company = company;
    vm.freight = freight;
    vm.type = type;
    vm.rateFieldName = "rateOption-" + type;

    vm.freight.csv = {
      content: null,
      header: true,
      headerVisible: false,
      separator: ",",
      separatorVisible: false,
      result: null
    };
  };

  vm.editIncrement = function() {
    vm.editWeightIncrement = true;
  };

  vm.saveIncrement = function() {
    vm.editWeightIncrement = false;
  }
  vm.editZones = function() {
    vm.zoneStrings = vm.freight.rateDef.byZone.zoneRateVariables.zones.map(function(item) {
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
      var existing = vm.freight.rateDef.byZone.zoneRateVariables.zones.filter(function(item) {
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
    vm.freight.rateDef.byZone.zoneRateVariables.zones = newZones;

    updateZoneRates(vm.freight.rateDef.byZone.flatRates, zones);
    updateZoneRates(vm.freight.rateDef.byZone.weightRates, zones);

  };

  vm.change = function() {
    vm.company.changed = true;
  };

  vm.getFreight = function() {
    return vm.freight;
  };
  vm.getRates = function() {
    return vm.freight.rates;
  };

  vm.getRateSummary = function() {

    if(!vm.freight.rateDef.byZone.rates) {
      return "Not rates yet";
    } else {
      return (vm.freight.rateDef.byZone.rates.length) + " rates available"
    }
  };

  vm.getState = function(item) {
    return item.state;
  };

  vm.importRates = function() {
    vm.freight.rateDef.byZone.rates = vm.freight.csv.result;
    console.log(JSON.stringify(vm.freight.csv.result))
    vm.openRateModal();
  };

  vm.updateTierRates = function(newTiers, tierRates) {
    var i, newTierRates = [];
    for(i=0; i < newTiers.length; ++i) {
      var tier = newTiers[i];
      var existing = tierRates.filter(function(item) {
        if(tier.previous== item.tier ) {
          return item;
        }
      });
      if(existing.length==1) {
        existing[0].ranges = tier.ranges;
        existing[0].tier = tier.tier;
        newTierRates.push(existing[0]);
      }else {
        var rates = vm.freight.rateDef.byZone.zoneRateVariables.zones.map(function(item) {
          return {
            zone: item.label,
            rate:0
          };
        });

        newTierRates.push({
          tier: tier.tier,
          ranges: tier.ranges,
          rates: rates
        });
      }
    }
    return newTierRates;
  };

  vm.openRateModal = function (type){

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'app/trucking-company/ltl-rates/ltl-rates.html',
      controller: 'LtlRatesCtrl',
      windowClass: 'full-screen-modal',
      resolve: {
        type: function() {
          return vm.type;
        },
        rates: function () {
          return vm.freight.rateDef.byZone.rates;
        }
      }
    });

    modalInstance.result.then(
        function (rates) {
          vm.freight.rates = rates;
          vm.change();
        },
        function () {
          console.log('Modal dismissed at: ' + new Date());
        }
    );
  };

  vm.openTierDialog = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'app/trucking-company/company-ltl/tier-editing/tier-editing.html',
      controller: 'TierEditingCtrl',
      size: 'lg',
      resolve: {
        flatTiers: function() {
          return vm.freight.rateDef.byZone.flatRates.map(function(item) {
            return {
              tier: item.tier,
              previous: item.tier,
              ranges: item.ranges
            };
          });
        },
        weightTiers: function() {
          return vm.freight.rateDef.byZone.weightRates.map(function(item) {
            return {
              tier: item.tier,
              previous: item.tier,
              ranges: item.ranges
            };
          });
        }
      }
    });

    modalInstance.result.then(
      function (result) {
        vm.freight.rateDef.byZone.weightRates = vm.updateTierRates(result.weight, vm.freight.rateDef.byZone.weightRates);
        vm.freight.rateDef.byZone.flatRates =   vm.updateTierRates(result.flat,     vm.freight.rateDef.byZone.flatRates);
        vm.change();
      },
      function () {
        console.log('Modal dismissed at: ' + new Date());
      }
    );
  };
});
