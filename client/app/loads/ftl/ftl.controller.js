'use strict';

angular.module('servicesApp')
  .controller('FtlCtrl', function ($scope) {
    $scope.message = 'Hello';

    var vm = this;

    vm.status = {
      opened: false
    };

    vm.init = function(load) {
      vm.load = load;
      vm.setToday();
    };

    vm.setToday = function () {
      vm.load.expectedBy = new Date();
    }


    vm.packagings = [
      {id: 0, name: "Full container"},
      {id: 1, name: "Pallets (48x40)"},
      {id: 2, name: "Pallets (48x48)"},
      {id: 3, name: "Pallets (60x48)"},
      {id: 4, name: "Bags"},
      {id: 5, name: "Bales"},
      {id: 6, name: "Cartons"},
      {id: 7, name: "Crates"},
      {id: 8, name: "Boxes"},
      {id: 9, name: "Rolls"},
      {id: 10, name: "Others"}
    ];

    vm.addLine = function () {
      vm.load.lines.push({
        weight: 0,
        quantity: 1,
        packaging: {id:0, name: "Full container"},
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

    vm.submit = function() {

      console.log(JSON.stringify(vm.load));
    }
  });
