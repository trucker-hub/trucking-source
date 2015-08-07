'use strict';

angular.module('servicesApp')
  .controller('TruckingCompanyCtrl', function($scope, $http, $filter, ngTableParams) {
    var rows =   [
    ];

    $scope.toggleFavorite = function(id) {

      var index;
      for (index =0; index < rows.length; ++index) {
         var company = rows[index];
         if(company._id == id) {
            company.favorite = !company.favorite;
           return;
         }
      }
    }

    $scope.editCompany = function(id) {
      console.log("edit a company whose id is " + id);
    };

    $scope.addCompany = function() {

    };



    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {
        name: ''       // initial filter
      }
    }, {
      total: rows.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ?
          $filter('filter')(rows, params.filter()) :
          rows;

        rows = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(rows);
      }
    });

    $scope.updateTable = function(data) {
      rows = data;
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
