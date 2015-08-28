'use strict';

angular.module('servicesApp')
  .controller('LoadsCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams) {
    $scope.message = 'Hello';

      var loads = $rootScope.loads || [];

      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 20,          // count per page
        filter: {
          who: ''       // initial filter
        }
      }, {
        total: loads.length, // length of data
        getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;

          loads = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

          params.total(orderedData.length); // set total for recalc pagination
          $defer.resolve(loads);
        }
      });

      $scope.loadLoads = function() {

        console.log("fetch loads from the db");
        $http.get("/api/load/ftl-loads").then(
            function(response) {
              console.log(JSON.stringify(response.data));
              $rootScope.loads = response.data;
              $scope.updateTable(response.data);

            },
            function(response) {
              console.log("ran into error " + response);

            });
      };

      $scope.updateTable = function(data) {
        loads = data;
        $scope.tableParams.reload();
      };

      $scope.createFTLLoad = function() {

      }
    });
