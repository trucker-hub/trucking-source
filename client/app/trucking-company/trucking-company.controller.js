'use strict';

angular.module('servicesApp')
  .controller('TruckingCompanyCtrl', function($rootScope, $scope, $http, $filter, ngTableParams, truckingCompany) {

    $rootScope.companiesOpened = $rootScope.companiesOpened || {};

    $scope.alerts = [];

    var allCompanies = $rootScope.allCompanies || [];

    var editCompanyFunc = function(id) {
      console.log("edit a company whose id is " + id);

      var detail = $rootScope.companiesOpened[id];
      if(detail) {
        detail.active = true;
        return;
      }

      var index;
      for (index =0; index < allCompanies.length; ++index) {
        var company = allCompanies[index];
        if(company._id == id) {
          $rootScope.companiesOpened[id] = {data:company, active:true};
          return;
        }
      }
    };

    $scope.cancel = function(company) {
      console.log("cancel company info " + company._id);
      $scope.closeTab(company._id);
    };



    $scope.closeTab = function(id) {
      delete $rootScope.companiesOpened[id];
    };

    $scope.saveCompany = function(company, successCallback, errorCallback) {
      truckingCompany.save(company,
        function(response) {
          successCallback(response);
          $scope.alerts.push({ type: 'success', msg: 'company info was just saved succesfully!' });
        },
        function() {
          errorCallback(response);
          $scope.alerts.push({ type: 'warning', msg: 'failed to save company info!' });
        }
      );
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.deleteCompany = function(company) {
      truckingCompany.delete(company, function(response) {
          $scope.closeTab(company._id);
          $scope.updateTable(truckingCompany.get());
        },
        function(response) {
          $scope.alerts.push({ type: 'warning', msg: 'Failed to delete the company!' });
        }
      );
    };

    $scope.toggleFavorite = function(id) {
      truckingCompany.toggleFavorite(id);
    };


    $scope.editCompany = function(id) {
      editCompanyFunc(id);
    };

    $scope.newOne = truckingCompany.newOne;

    $scope.addCompany = function() {
      truckingCompany.add($scope.newOne,
        function(response) {
          var added = response.data;
          $scope.updateTable(truckingCompany.get());
          editCompanyFunc(added._id);
          $scope.alerts.push({ type: 'success', msg: 'A new company was just added succesfully!' });
        },
        function () {
          console.log("ran into error " + response);
          $scope.alerts.push({ type: 'danger', msg: 'Failed to create the new company!' });
        }
      );
    };

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 25,          // count per page
      filter: {
        name: ''       // initial filter
      }
    }, {
      total: allCompanies.length, // length of data
      //counts: [], // hide page counts control
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')(allCompanies, params.filter()) : allCompanies;

        var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(xxx);
      }
    });

    $scope.updateTable = function(data) {
      allCompanies = data;
      $scope.tableParams.reload();
    };

    $scope.loadCompanies = function() {
      console.log("fetch companies from the db");
      truckingCompany.fetch(
        function(response) {
          $scope.updateTable(truckingCompany.get());
        },
        function(response) {
          console.log("ran into error " + response);
        });
    };

    if(!truckingCompany.get()) {
      $scope.loadCompanies();
    }

  });
