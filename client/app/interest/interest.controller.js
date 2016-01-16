'use strict';

angular.module('servicesApp')
    .controller('InterestCtrl', function ($scope, $http, $filter, ngTableParams) {

      var specials = [];
      $scope.fetch = function () {
        $http.get("/api/interests").then(
            function (response) {
              console.log(JSON.stringify(response.data));
              specials = response.data;
              $scope.updateTable();
            },
            function (response) {
              console.log('ran into error ' + response);
            });
      };

      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 25,          // count per page
        filter: {company: ''}
      }, {
        total: specials.length, // length of data,
        //counts: [],
        getData: function ($defer, params) {
          // use build-in angular filter
          var orderedData = params.filter() ? $filter('filter')(specials, params.filter()) : specials;
          var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          params.total(orderedData.length); // set total for recalc pagination
          $defer.resolve(xxx);
        }
      });
      $scope.updateTable = function () {
        console.log("refresh table display " + specials.length);
        $scope.tableParams.reload();

      };

    });
