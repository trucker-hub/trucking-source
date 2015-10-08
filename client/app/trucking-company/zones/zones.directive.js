'use strict';

angular.module('servicesApp')
  .directive('zoneDefinition', function ($modal) {
    return {
      templateUrl: 'app/trucking-company/zones/zones.html',
      restrict: 'E',
      scope: {
        company: '=company',
        type: '=type'
      },
      link: function (scope, element, attrs) {
        scope.csv = {
          content: null,
          header: true,
          headerVisible: false,
          separator: ",",
          separatorVisible: false,
          result: null
        };

        var setFormBasedOnRateDefType = function() {
          if(scope.container.rateBasis=='zone') {
            scope.def = scope.container.rateDef.byZone;
          }else if(scope.container.rateBasis=='zipCode') {
            scope.def = scope.container.rateDef.byZipCode;
          }else {
            scope.def = scope.container.rateDef.byCity;
          }
        };

        var initRateContainer  = function() {
          if(scope.type=='FTL') {
            scope.container = scope.company.ftl;
          } else if(scope.type=='LTL') {
            scope.container = scope.company.ltl;
          } else if(scope.type=='AIR') {
            scope.container = scope.company.air;
          }
          setFormBasedOnRateDefType();
        };

        scope.adaptRateForm = function(init) {
          setFormBasedOnRateDefType();
          scope.change();
          scope.rateSummary = getRateSummary();
        };

        scope.rateFieldName = "rateBased" + scope.type + "Field";


        scope.editIncrement = function() {
          scope.editWeightIncrement = true;
        };

        scope.saveIncrement = function() {
          scope.editWeightIncrement = false;
        };
        scope.editZones = function() {
          scope.zoneStrings = scope.def.zoneRateVariables.zones.map(function(item) {
            return item.label;
          }).join(",");
          scope.editingZones = true;
        };

        scope.change = function() {
          scope.company.changed = true;
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
          scope.change();
        };

        scope.saveZones = function() {
          scope.editingZones = false;
          var zones = scope.zoneStrings.split(',').filter(function(item) {
            if(item.trim()) {
              return item;
            }
          });
          var newZones = [];
          //sync zones in zoneRateVariables
          var i;
          for(i=0; i < zones.length; ++i) {
            var zone = zones[i];
            var existing = scope.def.zoneRateVariables.zones.filter(function(item) {
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
          scope.def.zoneRateVariables.zones = newZones;

          updateZoneRates(scope.def.flatRates, zones);
          updateZoneRates(scope.def.weightRates, zones);

        };

        var getRateSummary = function() {
          if(scope.def.rates) {
            return (scope.def.rates.length) + " rates available";
          } else {
            return "Not rates yet";
          }
        };

        scope.getRates = function() {
          return scope.def.rates;
        };

        scope.getState = function(item) {
          return item.state;
        };

        scope.importRates = function() {
          scope.def.rates = scope.csv.result;
          console.log(JSON.stringify(scope.csv.result))
          scope.openRateModal();
        };

        scope.updateTierRates = function(newTiers, tierRates) {
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
              var rates = scope.def.zoneRateVariables.zones.map(function(item) {
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


        scope.openRateModal = function (type){

          var templateUrlStr, controllerStr;
          if(scope.container.rateBasis=='zone') {
            templateUrlStr= 'app/trucking-company/ftl-rates/ftl-rates.html';
            controllerStr = 'LtlRatesCtrl';
          }else {
            templateUrlStr= 'app/trucking-company/ftl-rates/ftl-rates.html';
            controllerStr = 'FtlRatesCtrl';
          }

          var modalInstance = $modal.open({
            animation: true,
            templateUrl: templateUrlStr,
            controller: controllerStr,
            windowClass: 'full-screen-modal',
            resolve: {
              type: function() {
                return scope.type;
              },
              rates: function () {
                return scope.def.rates;
              }
            }
          });

          modalInstance.result.then(
            function (rates) {
              scope.def.rates = rates;
              scope.change();
              scope.rateSummary = getRateSummary();
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
          );
        };

        scope.openTierDialog = function () {

          var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'app/trucking-company/company-ltl/tier-editing/tier-editing.html',
            controller: 'TierEditingCtrl',
            size: 'lg',
            resolve: {
              flatTiers: function() {
                return scope.def.flatRates.map(function(item) {
                  return {
                    tier: item.tier,
                    previous: item.tier,
                    ranges: item.ranges
                  };
                });
              },
              weightTiers: function() {
                return scope.def.weightRates.map(function(item) {
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
              scope.def.weightRates = scope.updateTierRates(result.weight, scope.def.weightRates);
              scope.def.flatRates =   scope.updateTierRates(result.flat,   scope.def.flatRates);
              scope.change();
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
          );
        };
        initRateContainer();
        scope.rateSummary = getRateSummary();
      }
    }});
