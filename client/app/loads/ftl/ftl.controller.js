'use strict';

angular.module('servicesApp')
  .controller('FtlCtrl', function ($scope, $http) {
    $scope.message = 'Hello';

    var vm = this;

    vm.status = {
      opened: false
    };

    vm.init = function(load) {
      console.log("initialize controller " + JSON.stringify(load));
      vm.load = load;
      if(vm.load._id!=-2 ) {
        vm.load.shipTo.location.raw = vm.load.shipTo.location.street;
        vm.load.shipFrom.location.raw = vm.load.shipFrom.location.street;
      }
      vm.setInitialExpectedDate();
      vm.loadConstants();
    };

    vm.setInitialExpectedDate = function () {
      vm.load.expectedBy = new Date();
      vm.load.expectedBy.setDate(vm.load.expectedBy.getDate() + 2);
    };


    vm.packagings = [];

    vm.loadConstants = function() {
      $http.get('/api/load/ftl-loads/util/constants').then(
        function(response) {
          var data = response.data;
          vm.packagings = data.packagings;
          vm.toLocationTypes = data.toLocationTypes;
          vm.fromLocationTypes = data.fromLocationTypes;
          vm.trailerTypes = data.trailerTypes;
        }, function(err) {
            console.log(err);}
      );
    };
    vm.addLine = function () {
      vm.load.lines.push({
        weight: 0,
        quantity: 1,
        packaging: vm.packaings[0],
        length: 0,
        width: 0,
        height: 0,
        description: ""
      })
    };

    vm.removeLine = function (index) {
      vm.load.lines.splice(index, 1);

    };

    vm.open = function($event) {
      vm.status.opened = true;
    };

    vm.isNew = function() {
      return vm.load._id == -2;
    }

    vm.close = function() {
      $scope.$parent.closeTab(vm.load._id, false);
    }

    vm.delete = function() {
      $http.delete('/api/load/ftl-loads/'+vm.load._id).then(

        function(response) {
          console.log("request saved succesfully " + response);
          $scope.$parent.closeTab(vm.load._id, true);
        },
        function(err) {
          console.log("request saving failed " + err);
        }
      );
    }

    vm.submit = function() {

      console.log("request is " + JSON.stringify(vm.load));
      //populate location with raw data.

      var id = vm.load._id;
      if(vm.load._id == -2) {
        delete vm.load._id;
        $http.post('/api/load/ftl-loads', vm.load).then(

          function(response) {
            console.log("request saved succesfully " + response);
            $scope.$parent.closeTab(id, true);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
        );
      }else {
        $http.put('/api/load/ftl-loads/'+vm.load._id, vm.load).then(

          function(response) {
            console.log("request saved succesfully " + response);
            $scope.$parent.closeTab(id, true);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
        );
      }
    }
  });
