'use strict';

angular.module('servicesApp')
  .service('sourcingService', function ($http) {
    var vm = this;

    vm.sourcing = { ftlLoads: null, ltlLoads: null };
    vm.fetchLoads = function(type, days, callbackOK, callbackERR) {

      $http.get('/api/load/ftl-loads?status=' + type + "&days=" + days).then(
        function(response) {
          vm.sourcing.ftlLoads = response.data;
          callbackOK();
        },
        function(response) {
          console.log('ran into error ' + response);
          callbackERR();
        });
      $http.get('/api/load/ltl-loads?status=' + type + "&days=" + days).then(
        function(response) {
          vm.sourcing.ltlLoads = response.data;
          callbackOK();
        },
        function(response) {
          console.log('ran into error ' + response);
          callbackERR();
        });
    };

    vm.sourcing = function(load, callbackOK, callbackERR) {

      $http.post("/api/sourcing", load).then(
        function(response) {
          console.log(JSON.stringify(response.data));
          load.sources = response.data;
          if(load.sources.length > 0) {
            vm.selectSource(load, load.sources[0]);
          }else {
            vm.selectSource(load, null);
          }
          callbackOK();
        },
        function(response) {
          //show a alert and empty the table
          console.log("called /api/sourcing but returned res = " + JSON.stringify(response));
          callbackERR();
        })
    };

    vm.finalizeSource = function(load, callbackOK, callbackERR) {
      load.status = "FILLED";
      var path = load.loadType=='FTL'?'/api/load/ftl-loads/invoice/':'/api/load/ltl-loads/invoice/';

      $http.put(path+load._id, load).then(

        function(response) {
          load.invoice = response.data.invoice;
          callbackOK();
        },
        function(err) {
          console.log("request saving failed " + err);
          load.status = "OPEN";
          callbackERR();
        }
      );

    };

    vm.recalcAdjustment = function(load) {
      var i, sum=0;
      for(i=0; i < load.fulfilledBy.costItems.length; ++i) {
        var item = load.fulfilledBy.costItems[i];
        if(item.charge) sum += item.charge;
        if(item.adjustment) sum += item.adjustment;
      }
      load.vendorChargeAmount = sum;

      for(i=0; i < load.brokerFees.length; ++i) {
        var brokerFee = load.brokerFees[i];
        if(brokerFee.charge) {
          sum += brokerFee.charge;
        }
      }
      load.totalAmount = sum;
    };

    vm.selectSource = function(load, source) {

      if(load && source) {
        load.fulfilledBy =
        {
          name: source.name,
          source: source.id,
          charge: source.totalCost,
          costItems: source.costItems,
          additionalCharges: source.additionalCharges
        };
        vm.recalcAdjustment(load);
      }else {
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

    vm.getLoads = function() {
      return vm.sourcing;
    };

    return vm;
  });
