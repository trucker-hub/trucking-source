'use strict';

angular.module('servicesApp')
  .controller('FreightCtrl', function ($rootScope, $scope, $http) {


    var vm = this;

    vm.packagings = [];

    vm.init = function(load) {
      console.log("initialize controller for load = " + JSON.stringify(load));
      vm.freight = load;
      if(vm.freight._id!=-2 ) {
        vm.freight.shipTo.location.raw = vm.load.shipTo.location.full_address;
        vm.freight.shipFrom.location.raw = vm.load.shipFrom.location.full_address;
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
      vm.packagings = $rootScope.constants.freight.packagings;
      vm.toServiceTypes = $rootScope.constants.freight.toLocationTypes;
      vm.fromServiceTypes = $rootScope.constants.freight.fromLocationTypes;
    }

    vm.loadConstants = function() {
      if($rootScope.constants) {
        extractConstantsFromRootScope();
      }else {
        $http.get('/api/load/ftl-loads/util/constants').then(
          function(response) {
            var data = response.data;
            $rootScope.constants = {
              freight: {
                packagings: data.packagings,
                toLocationTypes: data.toServiceTypes,
                fromLocationTypes: data.fromServiceTypes
              }
            };
            extractConstantsFromRootScope();
          }, function(err) {
            console.log(err);}
        );
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
      return vm.load._id == -2;
    }

    vm.close = function() {
      $scope.$parent.closeTab(vm.load._id, false);
    }

    vm.delete = function() {

    }

    vm.submit = function() {
      console.log("updating load = " + JSON.stringify(vm.load));

    }
  });
