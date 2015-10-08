'use strict';

angular.module('servicesApp').controller('CompanyLtlCtrl', function ($rootScope, $scope, $http, $modal) {

  var vm = this;

  vm.setCompany = function(company, freight, type) {
    vm.company = company;
    vm.freight = freight;
    vm.type = type;
    vm.rateFieldName = "rateOption-" + type;
  };


  vm.change = function() {
    vm.company.changed = true;
  };

  vm.getFreight = function() {
    return vm.freight;
  };
  vm.getRates = function() {
    return vm.freight.rates;
  };

  vm.getRateSummary = function() {

    if(!vm.freight.rateDef.byZone.rates) {
      return "Not rates yet";
    } else {
      return (vm.freight.rateDef.byZone.rates.length) + " rates available"
    }
  };

  vm.getState = function(item) {
    return item.state;
  };
});
