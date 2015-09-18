'use strict';

angular.module('servicesApp')
  .controller('FreightCtrl', function ($rootScope, $scope, $http) {


    var vm = this;

    vm.packagings = [];

    vm.init = function(load) {
      console.log("initialize controller for load = " + JSON.stringify(load));
      vm.freight = load;
      if(vm.freight._id!=-1 ) {
        vm.freight.shipTo.location.raw = load.shipTo.location.full_address;
        vm.freight.shipFrom.location.raw = load.shipFrom.location.full_address;
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


    var extractConstantsFromRootScope = function () {
      vm.packagings = $rootScope.loadConstants.ltl.packagings;
      vm.toServices = $rootScope.loadConstants.ltl.toServices;
      vm.fromServices = $rootScope.loadConstants.ltl.fromServices;

      console.log("toServices =" + JSON.stringify(vm.toServices));
    }

    vm.loadConstants = function() {
      if($rootScope.loadConstants) {
        extractConstantsFromRootScope();
      }else {
        $scope.$parent.loadConstants(extractConstantsFromRootScope);
      }
    };
    vm.addLine = function () {
      vm.freight.lines.push({
        weight: 0,
        quantity: 1,
        packaging: vm.packagings[0],
        length: 0,
        width: 0,
        height: 0,
        description: ""
      })
    };

    vm.removeLine = function (index) {
      vm.freight.lines.splice(index, 1);

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
            console.log("request saved succesfully " + response);
            $scope.$parent.closeTab(vm.freight._id, true);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
      );
    };



    vm.submit = function() {
      console.log("updating ltl load = " + JSON.stringify(vm.freight));
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
