'use strict';

angular.module('servicesApp')
  .controller('FreightCtrl', function ($scope, $http, loadService, sourcingService) {


    var vm = this;

    $scope.$on("LocationChanged", function(event, data) {
      vm.change();
    });

    vm.packagings = [];

    vm.init = function(load) {
      //console.log("initialize controller for load = " + JSON.stringify(load));
      vm.freight = load;
      vm.freight.updated = false;
      if(!vm.freight.new) {
        vm.freight.shipTo.location.raw = load.shipTo.location.full_address;
        vm.freight.shipFrom.location.raw = load.shipFrom.location.full_address;
        vm.freight.changed = false;
      }else {
        vm.freight.changed = true;
      }
      vm.setInitialExpectedDate();
      vm.loadConstants();
    };

    vm.setInitialExpectedDate = function () {
      if(!vm.freight.expectedBy) {
        vm.freight.expectedBy = new Date();
        vm.freight.expectedBy.setDate(vm.freight.expectedBy.getDate() + 2);
      }
    };

    vm.loadConstants = function() {

      loadService.fetchConstants(
        function() {
          vm.packagings = loadService.loadConstants.ltl.packagings;
          vm.toServices = loadService.loadConstants.ltl.toServices;
          vm.fromServices = loadService.loadConstants.ltl.fromServices;
        },
        function() {
          console.log("loading constants failed");
        });

    };
    vm.addLine = function () {
      vm.freight.lines.push({
        weight: 0,
        quantity: 1,
        packaging: "",
        length: 0,
        width: 0,
        height: 0,
        description: ""
      });
      vm.change();
    };

    vm.change = function() {
      vm.freight.changed = true;
    };

    vm.removeLine = function (index) {
      vm.freight.lines.splice(index, 1);
      vm.change();
    };

    vm.isNew = function() {
      return vm.freight.new;
    };

    vm.close = function() {
      $scope.$parent.closeTab(vm.freight.new?vm.freight.tabId:vm.freight._id, 'LTL', vm.freight.updated);
    };

    vm.delete = function() {
      $http.delete('/api/load/ltl-loads/'+vm.freight._id).then(

          function(response) {
            //console.log("request saved successfully " + response);
            $scope.$parent.closeTab(vm.freight._id, 'LTL', true);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
      );
    };

    vm.prefillWL = function (line) {
      console.log("line=" + JSON.stringify(line));
      if(line.packaging=="Pallets (48x40)") {
        line.width=48;
        line.length=40;
      }else if (line.packaging=="Pallets (48x48)") {
        line.width = 48;
        line.length = 48;
      }else if (line.packaging=="Pallets (60x48)") {
        line.width = 60;
        line.length = 48;
      }else {
        line.width=0;
        line.length=0;
      }
    };

    vm.computeClass = function(line) {
      loadService.computeClass(line);
      vm.change();
    };

    vm.quote = function () {
      sourcingService.sourcing(vm.freight, function() {
        vm.freight.updated = true;
        vm.close();
      });
    };

    vm.submit = function() {
      loadService.save(vm.freight, function () {
        vm.freight.changed = false;
        vm.freight.updated = true;
      }, function () {
        console.log("saving FTL failed");
      });
    }
  });
