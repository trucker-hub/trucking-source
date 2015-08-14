'use strict';

angular.module('servicesApp')
  .controller('TruckingCompanyCtrl', function($scope, $http, $filter, ngTableParams) {

    $scope.companiesOpened = {};

    var allCompanies =   [];

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

    $scope.fetchZipCode = function() {

      var url = "http://production.shippingapis.com/ShippingAPI.dll?API= ZipCodeLookup&XML=";
      url += "<ZipCodeLookupRequest USERID='790TRUCK5238'>"
        + "<Address ID='0'>"
        + "<FirmName></FirmName>"
        + "<Address1>30944 Rue de la Pierre</Address1>"
        + "<Address2></Address2>"
        + "<City>Rancho Palos Verdes</City>"
        + "<State>CA</State></Address>"
      +"</ZipCodeLookupRequest>";
      console.log("request=" + url);
      $http.get(url).then(
        function(response) {
          $scope.zipCodeResponse = "<pre>" + response.data + "</pre>";
        },

        function(response) {
          $scope.zipCodeResponse = "Error:<pre>" + response + "</pre>";
        }
      )
    };

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
        },
        function(response) {
          errorCallback(response);
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

    $scope.addCompany = function() {
      editCompanyFunc(-1);
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
        var orderedData = params.filter() ?
          $filter('filter')(allCompanies, params.filter()) :
          allCompanies;

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
         $scope.updateTable(response.data);

        },
        function(response) {
          console.log("ran into error " + response);

        });
    };
  });
