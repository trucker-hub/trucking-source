'use strict';

angular.module('servicesApp')
    .service('sourcingService', function ($http, $uibModal, $q, loadService, customerSettingService, Auth, ngProgressFactory) {
      var vm = this;

      var upsRates = {};
      vm.settingsPerCustomers = {};
      vm.progressbar = ngProgressFactory.createInstance();

      var upsRateToSource = function (upsRate) {

        var rates = upsRate.Rate;
        var costItems = [];
        var index;
        for (index = 0; index < rates.length; ++index) {
          var rate = rates[index];
          if (rate.Type.Code == '2') {
            costItems.push({charge: Number(rate.Factor.Value), description: "Fuel Surcharge"});
          } else if (rate.Type.Code == 'AFTR_DSCNT') {
            costItems.push({charge: Number(rate.Factor.Value), description: "Charges After Discount 60%"});
          }
        }

        var source = {
          name: "UPS Freight",
          totalCost: upsRate.TotalShipmentCharge.MonetaryValue,
          costItems: costItems,
          additionalCharges: [],
          time: 2,
          contact: "800-333-7400",
          location: "UPS Freight",
          id: "UPS-Freight-ID"
        };
        return source;
      };

      var setBrokerFees = function (load, settings) {
        if (load.loadType == 'FTL') {
          load.brokerFees = settings.ftlSettings.brokerFees;
        } else if (load.loadType == 'LTL') {
          load.brokerFees = settings.ltlSettings.brokerFees;
        } else {
          load.brokerFees = settings.airSettings.brokerFees;
        }
      };

      var settingsPromise = function (load) {
        console.log("fetching settings before sourcing");
        var deferred = $q.defer();
        console.log("broker fee" + JSON.stringify(load.brokerFees));
        if (!load.brokerFees || load.brokerFees.length == 0) {
          vm.getCustomerFeeSettings(load, function (response) {
            deferred.resolve(load);
          }, function (response) {
            deferred.reject("error");
          });
        } else {
          console.log("already has broker fees set!")
          deferred.resolve(load);
        }
        return deferred.promise;
      };

      var sourcingPromise = function (load) {
        console.log("started sourcing");
        var deferred = $q.defer();
        console.log("broker fee" + JSON.stringify(load.brokerFees));
        $http.post("/api/sourcing", load).then(
            function (response) {
              console.log(JSON.stringify(response.data));
              load.sources = response.data;
              deferred.resolve(load);
            },
            function (response) {
              deferred.reject(response);
            });
        return deferred.promise;
      };

      var augmentWithUPS = function (load, sources, cb) {
        //only call UPS Freight if it's not FTL
        if (load.loadType == 'FTL') {
          cb();
          return;
        }
        var source = upsRates[load._id];
        if (source) {
          sources.push(source);
          cb();
          return;
        }
        var req = vm.ltl2ups(load);
        $http.post('/api/ups/services/rates', req).then(
            function (response) {
              var upsRate = response.data;
              console.log("rate response = " + JSON.stringify(upsRate));
              var source = upsRateToSource(upsRate);
              upsRates[load._id] = source;
              sources.push(source);
              console.log("add UPS source to LTL/AIR sourcing result");
              cb();
            },
            function (response) {
              console.error(response);
              cb();
            });
      };


      var postProcessingPromise = function (load) {
        console.log("started post processing of sources");
        var deferred = $q.defer();
        console.log("broker fee" + JSON.stringify(load.brokerFees));
        augmentWithUPS(load, load.sources, function () {
          var index;
          for (index = 0; index < load.sources.length; ++index) {
            var source = load.sources[index];
            vm.recalcAdjustment(load, source);
          }
          deferred.resolve(load);
        }, function (response) {
          deferred.reject(response);
        });
        return deferred.promise;
      };


      vm.sourcing = function (load, cb) {
        vm.progressbar.start();
        settingsPromise(load)
            .then(sourcingPromise)
            .then(postProcessingPromise)
            .then(function () {
              vm.progressbar.complete();
              vm.showQuoteDialog(load, cb);
            })
            .catch(function (err) {
              vm.progressbar.stop();
              console.error("sourcing error");
            });
      };


      vm.getCustomerFeeSettings = function (load, cb, cbErr) {
        var user_id = load.createdBy;
        if (!user_id) {
          user_id = Auth.getCurrentUser()._id;
        }

        customerSettingService.getCustomerSettings(user_id,
            function (settings) {
              setBrokerFees(load, settings);
              cb(settings);
            },
            function (defaultSettings) {
              setBrokerFees(load, defaultSettings);
              cb(defaultSettings);
            });
      };

      vm.finalizeSource = function (load, callbackOK, callbackERR) {
        load.status = "FILLED";
        var path = load.loadType == 'FTL' ? '/api/load/ftl-loads/invoice/' : '/api/load/ltl-loads/invoice/';

        $http.put(path + load._id, load).then(
            function (response) {
              load.invoice = response.data.invoice;
              callbackOK();
            },
            function (err) {
              console.log("request saving failed " + err);
              load.status = "OPEN";
              callbackERR();
            }
        );

      };

      vm.recalcAdjustment = function (load, source) {
        var i, sum = 0;
        for (i = 0; i < source.costItems.length; ++i) {
          var item = source.costItems[i];
          if (item.charge) sum += item.charge;
          if (item.adjustment) sum += item.adjustment;
        }
        source.vendorChargeAmount = sum;

        for (i = 0; i < load.brokerFees.length; ++i) {
          var brokerFee = load.brokerFees[i];
          if (brokerFee.charge) {
            sum += brokerFee.charge;
          }
        }
        source.totalAmount = sum;
        //if already selected, need to adjust the load charges
        if (load.fulfilledBy.source && load.fulfilledBy.source == source.id) {
          load.fulfilledBy.charge = source.totalAmount;
          load.fulfilledBy.costItems = source.costItems;
        }
      };

      vm.selectSource = function (load, source) {

        //if the load is already sourced,
        if (load.status == 'FILLED') {
          load.status = 'OPEN';
        }

        if (load && source) {
          load.fulfilledBy =
          {
            name: source.name,
            source: source.id,
            charge: source.totalAmount,
            costItems: source.costItems,
            additionalCharges: source.additionalCharges
          };
        } else {
          load.fulfilledBy =
          {
            name: "",
            source: null,
            charge: null,
            costItems: [],
            additionalCharges: []
          }
        }
      };

      vm.clearSources = function (load) {
        load.status = 'OPEN';
        load.fulfilledBy =
        {
          name: "",
          source: null,
          charge: null,
          costItems: [],
          additionalCharges: []
        };
        load.sources = [];
      };

      var upsType = function (type) {
        /*
         current definition in Trucking-hub

         "Pallets (48x40)",
         "Pallets (48x48)",
         "Pallets (60x48)",
         "Bags",
         "Bales",
         "Cartons",
         "Crates",
         "Boxes",
         "Rolls",
         "Others"
         */

        /* UPS definition
         'BAG': 'Bag',
         'BAL': 'Bale',
         'BAR': 'Barrel',
         'BDL': 'Bundle',
         'BIN': 'Bin',
         'BOX': 'Box',
         'BSK': 'Basket',
         'BUN': 'Bunch',
         'CAB': 'Cabinet',
         'CAN': 'Can',
         'CAR': 'Carrier',
         'CAS': 'Case',
         'CBY': 'Carboy',
         'CON': 'Container',
         'CRT': 'Crate',
         'CSK': 'Cask',
         'CTN': 'Carton',
         'CYL': 'Cylinder',
         'DRM': 'Drum',
         'LOO': 'Loose',
         'OTH': 'Other',
         'PAL': 'Pail',
         'PCS': 'Pieces',
         'PKG': 'Package',
         'PLN': 'Pipe Line',
         'PLT': 'Pallet',
         'RCK': 'Rack',
         'REL': 'Reel',
         'ROL': 'Roll',
         'SKD': 'Skid',
         'SPL': 'Spool',
         'TBE': 'Tube',
         'TNK': 'Tank',
         'UNT': 'Unit',
         'VPK': 'Van Pack',
         'WRP': 'Wrapped'
         */

        if (type.startsWith('Pallets')) {
          return 'PLT';
        } else if (type == 'Cartons') {
          return 'CTN';
        } else if (type == 'Boxes') {
          return 'BOX';
        } else if (type == 'Rolls') {
          return 'ROL';
        } else if (type == 'Crates') {
          return 'CRT';
        } else if (type == 'Bales') {
          return 'BAL';
        } else if (type == 'Bags') {
          return 'BAG';
        } else {
          return 'OTH';
        }
      };

      var freightClass = function (line) {

        var result = loadService.computeClass(line);

        console.log("computed class=" + result);
        return result;
      };

      vm.ltl2ups = function (ltl) {
        var data = {
          ship_from: {
            name: 'From Location',
            address: {
              address_line_1: ltl.shipFrom.location.full_address,
              city: ltl.shipFrom.location.city,
              state_code: ltl.shipFrom.location.state,
              postal_code: ltl.shipFrom.location.zipCode,
              country_code: 'US'
            }
          },
          ship_to: {
            name: 'Destination',
            address: {
              address_line_1: ltl.shipTo.location.full_address,
              city: ltl.shipTo.location.city,
              state_code: ltl.shipTo.location.state,
              postal_code: ltl.shipTo.location.zipCode,
              country_code: 'US'
            }
          },
          payer: {
            name: 'Trucking-Hub',
            address: {
              address_line_1: '9111 S La Cienega Blvd, #210',
              city: 'Inglewood',
              state_code: 'CA',
              postal_code: '90301',
              country_code: 'US'
            },
            shipper_number: 'ABC123'
          },
          billing_option: '10',
          service_code: '308'
        };

        var index, commodities = [];
        var total = 0;
        var handlingUnitviaPallet = true;
        for (index = 0; index < ltl.lines.length; ++index) {
          var line = ltl.lines[index];
          commodities.push({
            description: line.description || ' line #' + index,
            weight: line.weight * line.quantity,
            number_of_pieces: line.quantity,
            packaging_type: upsType(line.packaging),
            freight_class: line.freightClass || freightClass(line)
          });
          if (!line.packaging.startsWith('Pallets')) {
            handlingUnitviaPallet = false;
          }
          total += line.quantity;
        }

        data.handling_unit_one = {
          quantity: total,
          code: (handlingUnitviaPallet) ? 'PLT' : 'OTH'
        };

        data.commodity = commodities;

        return data;
      };

      vm.quickQuote = function (load, cb, cbErr) {
        load.brokerFees = [];
        vm.progressbar.start();
        sourcingPromise(load)
            .then(function (load) {
              var index;
              for (index = 0; index < load.sources.length; ++index) {
                var source = load.sources[index];
                vm.recalcAdjustment(load, source);
              }
              vm.progressbar.complete();
              cb(load);
            })
            .catch(function (err) {
              vm.progressbar.stop();
              cbErr(load);
            });
      };

      vm.showQuoteDialog = function (load, cb, dismissCb) {
        load.showLoadDetails = false;
        cb = (cb || angular.noop);
        dismissCb = (dismissCb || angular.noop);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/sourcing/quote/quote.html',
          controller: 'QuoteCtrl',
          size: 'lg',
          resolve: {
            load: function () {
              return load;
            }
          }
        });

        modalInstance.result.then(
            function (result) {
              cb(result);
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
              dismissCb();
            }
        );
      };
      return vm;
    });
