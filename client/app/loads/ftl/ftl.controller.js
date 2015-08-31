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

    vm.extract = function(raw) {

      var index;
      var result = {};
      for(index=0; index < raw.address_components.length; ++index) {
        var comp = raw.address_components[index];
        if(comp.types.length==2 && comp.types[0]=='administrative_area_level_1')
          result.state = comp.short_name;
        else if(comp.types.length==2 && comp.types[0]=='administrative_area_level_2')
          result.county = comp.short_name;
        else if(comp.types.length==2 && comp.types[0]=='locality')
          result.city = comp.short_name;
        else if(comp.types.length==1 && comp.types[0]=='postal_code')
          result.zipCode = comp.short_name;
      }
      result.street = raw.formatted_address;
      return result;

    }
    vm.submit = function() {

      console.log("request is " + JSON.stringify(vm.load));
      //populate location with raw data.
      vm.load.shipTo.location = vm.extract(vm.load.shipTo.location.raw);
      vm.load.shipFrom.location = vm.extract(vm.load.shipFrom.location.raw);

      console.log("cleaned up request is " + JSON.stringify(vm.load));

      $http.post('/api/load/ftl-loads', vm.load).then(

          function(response) {
            console.log("request saved succesfully " + response);
          },
          function(err) {
            console.log("request saving failed " + err);
          }
      );

    }
  });
