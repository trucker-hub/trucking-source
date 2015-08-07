'use strict';

angular.module('servicesApp')
  .controller('TruckingCompanyCtrl', function($scope, $http, $filter, ngTableParams, $modal) {

    var editCompanyFunc = function(id) {
      console.log("edit a company whose id is " + id);
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/app/trucking-company/company-details/company-details.html',
        controller: 'CompanyDetailsCtrl',
        size: "lg",
        resolve: {
          id: function () {
            return id;
          }
        }
      });

      modalInstance.result.then(function (status) {
        console.log("status " + status)
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    }

    var companies =   [];

    $scope.toggleFavorite = function(id) {

      var index;
      for (index =0; index < companies.length; ++index) {
         var company = companies[index];
         if(company._id == id) {
            company.favorite = !company.favorite;
           return;
         }
      }
    }

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
      total: companies.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ?
          $filter('filter')(companies, params.filter()) :
          companies;

        companies = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(companies);
      }
    });

    $scope.updateTable = function(data) {
      companies = data;
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
