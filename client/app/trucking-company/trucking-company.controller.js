'use strict';

angular.module('servicesApp')
  .controller('TruckingCompanyCtrl', function($rootScope, $scope, $http, $filter, ngTableParams, truckingCompany) {

    $rootScope.companiesOpened = $rootScope.companiesOpened || {};

    $scope.alerts = [];

    $scope.allCompanies = truckingCompany.get() || [];

    var editCompanyFunc = function(id) {
      console.log("edit a company whose id is " + id);

      var detail = $rootScope.companiesOpened[id];
      if(detail) {
        detail.active = true;
        return;
      }

      var index;
      for (index =0; index < $scope.allCompanies.length; ++index) {
        var company = $scope.allCompanies[index];
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

    $scope.archive = function() {
      truckingCompany.archive(function(response) {

        $scope.alerts.push({ type: 'success', msg: 'Companies have been saved to files' });
        $scope.getArchiveList();
      }, function(response) {
        $scope.alerts.push({ type: 'warning', msg: 'Companies did not get saved to files' });
      });
    };

    $scope.archiveOne = function(id) {
      truckingCompany.archiveOne(id, function(response) {

        $scope.alerts.push({ type: 'success', msg: 'Companies have been saved to files' });
        $scope.getArchiveList();
      }, function(response) {
        $scope.alerts.push({ type: 'warning', msg: 'Companies did not get saved to files' });
      });
    };

    $scope.extract = function() {
      truckingCompany.extract(function(response) {
        $scope.alerts.push({ type: 'success', msg: 'Companies have been extracted from files' });
          $scope.loadCompanies();
      }, function(response) {
        $scope.alerts.push({ type: 'warning', msg: 'Companies did not get extracted from files' });
      });
    };

    $scope.extractOne = function(name) {
      truckingCompany.extractOne(name, function(response) {
        $scope.alerts.push({ type: 'success', msg: 'Company has been extracted from the file' });
        $scope.loadCompanies();
      }, function(response) {
        $scope.alerts.push({ type: 'warning', msg: 'Company did not get extracted from the file' });
      });
    };



    $scope.saveCompany = function(company, successCallback, errorCallback) {
      truckingCompany.save(company,
        function(response) {
          $scope.closeTab(company._id);
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
          $scope.updateTable();
        },
        function(response) {
          $scope.alerts.push({ type: 'warning', msg: 'Failed to delete the company!' });
        }
      );
    };

    $scope.getArchiveList = function() {
      truckingCompany.archiveList(
          function(response){
            $scope.files = response.data;
          },
          function(err){
            console.error(err);
          });
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
          $scope.updateTable();
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
      total: $scope.allCompanies.length, // length of data
      //counts: [], // hide page counts control
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')($scope.allCompanies, params.filter()) : $scope.allCompanies;

        var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(xxx);
      }
    });

    $scope.updateTable = function() {
      $scope.allCompanies = truckingCompany.get();
      $scope.tableParams.reload();
    };

    $scope.loadCompanies = function() {
      console.log("fetch companies from the db");
      truckingCompany.fetch(
        function(response) {
          $scope.updateTable();
        },
        function(response) {
          console.log("ran into error " + response);
        });
    };

    if(!truckingCompany.get()) {
      $scope.loadCompanies();
    }
  });
