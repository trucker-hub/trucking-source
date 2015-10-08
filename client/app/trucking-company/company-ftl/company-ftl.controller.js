'use strict';

angular.module('servicesApp')
  .controller('CompanyFtlCtrl', function ($rootScope, $scope, $http, $modal) {
    var vm = this;

    vm.selectedRegions = [];

    vm.getState = function(item) {
      return item.state;
    };

    vm.setCompany = function(company) {
      vm.company = company;
    };

    vm.change = function() {
      vm.company.changed = true;
    };


  });
