'use strict';

angular.module('servicesApp')
  .controller('FreightCtrl', function ($rootScope, $scope, $http, loadService) {


    var vm = this;

    vm.packagings = [];

    vm.init = function(load) {
      //console.log("initialize controller for load = " + JSON.stringify(load));
      vm.freight = load;
      if(vm.freight._id!=-1 ) {
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
      return vm.freight._id == -1;
    };

    vm.close = function() {
      $scope.$parent.closeTab(vm.freight._id, 'LTL', false);
    };

    vm.delete = function() {
      $http.delete('/api/load/ltl-loads/'+vm.freight._id).then(

          function(response) {
            //console.log("request saved succesfully " + response);
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

    vm.submit = function() {
      //console.log("updating ltl load = " + JSON.stringify(vm.freight));
      //populate location with raw data.

      var id = vm.freight._id;
      if(vm.freight._id == -1) {
        delete vm.freight._id;
        $http.post('/api/load/ltl-loads', vm.freight).then(

            function(response) {
              console.log("request saved succesfully " + response);
              $scope.$parent.closeTab(id, 'LTL', true);
            },
            function(err) {
              console.log("request saving failed " + JSON.stringify(err));
            }
        );
      }else {
        $http.put('/api/load/ltl-loads/'+vm.freight._id, vm.freight).then(

            function(response) {
              console.log("request saved succesfully " + JSON.stringify(response));
              $scope.$parent.closeTab(id, 'LTL', true);
            },
            function(err) {
              console.log("request saving failed " + err);
            }
        );
      }
    }
  });
