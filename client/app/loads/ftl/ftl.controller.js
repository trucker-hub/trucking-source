'use strict';

angular.module('servicesApp')
  .controller('FtlCtrl', function ($rootScope, $scope, $http) {


    var vm = this;

    vm.packagings = [];

    vm.init = function(load) {
      console.log("initialize controller for load = " + JSON.stringify(load));
      vm.load = load;
      if(vm.load._id!=-2 ) {
        vm.load.shipTo.location.raw = vm.load.shipTo.location.full_address;
        vm.load.shipFrom.location.raw = vm.load.shipFrom.location.full_address;
      }
      vm.setInitialExpectedDate();
      vm.loadConstants();
    };

    vm.setInitialExpectedDate = function () {
      if(!vm.load.expectedBy) {
        vm.load.expectedBy = new Date();
        vm.load.expectedBy.setDate(vm.load.expectedBy.getDate() + 2);
      }
    };


    var extractConstantsFromRootScope = function () {
      vm.packagings = $rootScope.loadConstants.ftl.packagings;
      vm.toLocationTypes = $rootScope.loadConstants.ftl.toLocationTypes;
      vm.fromLocationTypes = $rootScope.loadConstants.ftl.fromLocationTypes;
      vm.trailerTypes = $rootScope.loadConstants.ftl.trailerTypes;
    }

    vm.loadConstants = function() {
      if($rootScope.loadConstants) {
        extractConstantsFromRootScope();
      }else {
        $scope.$parent.loadConstants(extractConstantsFromRootScope);
      }
    };
    vm.addLine = function () {
      vm.load.lines.push({
        weight: 0,
        quantity: 1,
        packaging: "",
        length: 0,
        width: 0,
        height: 0,
        description: ""
      })
    };

    vm.removeLine = function (index) {
      vm.load.lines.splice(index, 1);

    };

    vm.isNew = function() {
      return vm.load._id == -2;
    }

    vm.close = function() {
      $scope.$parent.closeTab(vm.load._id, 'FTL', false);
    }

    vm.delete = function() {
      $http.delete('/api/load/ftl-loads/'+vm.load._id).then(

        function(response) {
          console.log("request saved succesfully " + response);
          $scope.$parent.closeTab(vm.load._id, 'FTL', true);
        },
        function(err) {
          console.log("request saving failed " + err);
        }
      );
    }

    vm.submit = function() {

      console.log("updating load = " + JSON.stringify(vm.load));
      //populate location with raw data.

      var id = vm.load._id;
      if(vm.load._id == -2) {
        delete vm.load._id;
        $http.post('/api/load/ftl-loads', vm.load).then(

          function(response) {
            console.log("request saved succesfully " + response);
            $scope.$parent.closeTab(id, 'FTL', true);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
        );
      }else {
        $http.put('/api/load/ftl-loads/'+vm.load._id, vm.load).then(

          function(response) {
            console.log("request saved succesfully " + JSON.stringify(response));
            $scope.$parent.closeTab(id, 'FTL', true);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
        );
      }
    }
  });
