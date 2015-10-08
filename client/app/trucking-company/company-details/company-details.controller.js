'use strict';

angular.module('servicesApp')
  .controller('CompanyDetailsCtrl', function ($rootScope, $scope, $http, $modal) {

    console.log("open a edit window for company");

    var vm = this;

    vm.setCompany = function(company) {
      //console.log("company is set to " + JSON.stringify(company));
      vm.company = company;
      vm.lastCopy = angular.copy(company);
    };


    vm.regions = $rootScope.regions || [];
    vm.refreshRegions = function() {
      if(vm.regions.length > 0) {
        return;
      }
      return $http.get('/api/geoservice/regions'
      ).then(function(response) {
          vm.regions = response.data;
          $rootScope.regions = vm.regions;
          console.log("result = " + JSON.stringify(response.data));
        },

        function(response) {
          console.log("Error=" + response);
        }
      );

    };

    vm.change = function() {
      vm.company.changed = true;
    };

    vm.cancel = function() {
      console.log("Calling cancel function for company " + vm.company._id);
      angular.copy(vm.lastCopy, vm.company);
      $scope.$parent.cancel(vm.company);
    };

    vm.save = function() {
      $scope.$parent.saveCompany(vm.company,
        function(response) {
          vm.company.changed = false;
          vm.lastCopy = angular.copy(vm.company);
          vm.company = response.data;
          console.log("saved company as " + JSON.stringify(response.data));
        },
        function(response) {
          vm.company.changed = true;
        }
      )
    };

    vm.delete = function() {
      $scope.$parent.deleteCompany(vm.company);
    };

    vm.loadFTL = function() {
      $http.get("/api/trucking-companies/" + vm.company._id).then(
        function(response) {
          console.log(JSON.stringify(response.data));
          vm.company.ftl = response.data.ftl;
        },
        function(response) {
          console.log("ran into error " + response);

        });
    };
  });
