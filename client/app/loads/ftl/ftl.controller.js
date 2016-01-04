'use strict';

angular.module('servicesApp')
  .controller('FtlCtrl', function ($scope, $http, loadService, sourcingService) {

    var vm = this;
    vm.packagings = [];

    $scope.$on("LocationChanged", function(event, data) {
      vm.change();
    });


    vm.init = function (load) {
      //console.log("initialize controller for load = " + JSON.stringify(load));
      vm.load = load;
      if (!vm.load.new) {
        vm.load.shipTo.location.raw = vm.load.shipTo.location.full_address;
        vm.load.shipFrom.location.raw = vm.load.shipFrom.location.full_address;
        vm.load.changed = false;
      } else {
        vm.load.changed = true;
      }
      vm.setInitialExpectedDate();
      vm.loadConstants();
    };

    vm.setInitialExpectedDate = function () {
      if (!vm.load.expectedBy) {
        vm.load.expectedBy = new Date();
        vm.load.expectedBy.setDate(vm.load.expectedBy.getDate() + 2);
      }
    };
    vm.loadConstants = function () {
      loadService.fetchConstants(
        function () {
          vm.packagings = loadService.loadConstants.ftl.packagings;
          vm.toLocationTypes = loadService.loadConstants.ftl.toLocationTypes;
          vm.fromLocationTypes = loadService.loadConstants.ftl.fromLocationTypes;
          vm.trailerTypes = loadService.loadConstants.ftl.trailerTypes;
        },
        function () {
          console.log("loading constants failed");
        });
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
      });
      vm.change();
    };

    vm.removeLine = function (index) {
      vm.load.lines.splice(index, 1);
      vm.change();
    };

    vm.isNew = function () {
      return vm.load.new;
    };
    vm.change = function () {
      console.log("form is changed");
      vm.load.changed = true;
    };

    vm.close = function () {
      console.log("load id is " + vm.load._id);
      $scope.$parent.closeTab(vm.load.new?vm.load.tabId:vm.load._id, 'FTL', false);
    };

    vm.delete = function () {
      $http.delete('/api/load/ftl-loads/' + vm.load._id).then(
        function (response) {
          console.log("request saved succesfully " + response);
          $scope.$parent.closeTab(vm.load._id, 'FTL', true);
        },
        function (err) {
          console.log("request saving failed " + err);
        }
      );
    };

    vm.quote = function () {
      sourcingService.sourcing(vm.load, function() {
        vm.close();
      });
    };

    vm.submit = function () {
      loadService.save(vm.load, function () {
        vm.load.changed = false;
      }, function () {
        console.log("saving FTL failed");
      });
    };

  });
