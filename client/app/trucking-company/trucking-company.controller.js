'use strict';

angular.module('servicesApp')
  .controller('TruckingCompanyCtrl', function($rootScope, $scope, $http, $filter, ngTableParams) {

    $scope.companiesOpened = {};

    $scope.alerts = [];

    var allCompanies = $rootScope.allCompanies || [];

    var editCompanyFunc = function(id) {
      console.log("edit a company whose id is " + id);

      var detail = $scope.companiesOpened[id];
      if(detail) {
        detail.active = true;
        return;
      }

      var index;
      for (index =0; index < allCompanies.length; ++index) {
        var company = allCompanies[index];
        if(company._id == id) {
          $scope.companiesOpened[id] = {data:company, active:true};
          return;
        }
      }
    }

    $scope.cancel = function(company) {
      console.log("cancel company info " + company._id);
      $scope.closeTab(company._id);
    }



    $scope.closeTab = function(id) {
      delete $scope.companiesOpened[id];
    };

    $scope.saveCompany = function(company, successCallback, errorCallback) {
      $http.put('/api/trucking-companies/' + company._id, {company: company}).then(
        function(response) {
          successCallback(response);
          $scope.alerts.push({ type: 'success', msg: 'company info was just saved succesfully!' });
        },
        function(response) {
          errorCallback(response);
          $scope.alerts.push({ type: 'warning', msg: 'failed to save company info!' });
        }
      );

    }

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.deleteCompany = function(company) {
      $http.delete('/api/trucking-companies/' + company._id).then(
        function(response) {
          $scope.closeTab(company._id);
          var index;
          for (index =0; index < allCompanies.length; ++index) {
            var x = allCompanies[index];
            if(x._id == company._id) {
              allCompanies.splice(index,1);
              break;
            }
          }
          $rootScope.allCompanies = allCompanies;
          $scope.alerts.push({ type: 'success', msg: 'The company was just deleted succesfully!' });
        },
        function(response) {
          $scope.alerts.push({ type: 'warning', msg: 'Failed to delete the company!' });
        }
      );

    }

    $scope.toggleFavorite = function(id) {

      var index;
      for (index =0; index < allCompanies.length; ++index) {
         var company = allCompanies[index];
         if(company._id == id) {
           company.favorite = !company.favorite;
           $scope.saveCompany(company,
             function (response) {
               console.log(JSON.stringify(response.data));
             },
             function(response) {
               console.log("ran into error during update");
               //if error, revert the change
               company.favorite = !company.favorite;
             }
           );
           return;
         }
      }
    };


    $scope.editCompany = function(id) {
      editCompanyFunc(id);
    };

    $scope.newOne = {
      name: "company name",
      location: "Street, City, State",
      phone: "(999)999-9999",
      favorite: false
    };

    $scope.addCompany = function() {
      $http.post("/api/trucking-companies", $scope.newOne).then(
        function(response) {
          console.log(JSON.stringify(response.data));

          var added = response.data;
          allCompanies.push(added);
          $rootScope.allCompanies = allCompanies;
          $scope.tableParams.reload();
          editCompanyFunc(added._id);
          $scope.alerts.push({ type: 'success', msg: 'A new company was just added succesfully!' });

        },
        function(response) {
          console.log("ran into error " + response);
          $scope.alerts.push({ type: 'danger', msg: 'Failed to create the new company!' });
        });

    };

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {
        name: ''       // initial filter
      }
    }, {
      total: allCompanies.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')(allCompanies, params.filter()) : allCompanies;

        allCompanies = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(allCompanies);
      }
    });

    $scope.updateTable = function(data) {
      allCompanies = data;
      $scope.tableParams.reload();
    }



    $scope.loadCompanies = function() {

      console.log("fetch companies from the db");
      $http.get("/api/trucking-companies").then(
        function(response) {
          console.log(JSON.stringify(response.data));
          $rootScope.allCompanies = response.data;
          $scope.updateTable(response.data);

        },
        function(response) {
          console.log("ran into error " + response);

        });
    };

    if(!$rootScope.allCompanies) {
      $scope.loadCompanies();
    }

  });
