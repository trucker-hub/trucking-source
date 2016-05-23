'use strict';

angular.module('servicesApp').controller('SourcingCtrl',
    function ($scope, $http, $uibModal, $q, ngTableParams, $filter, ngProgressFactory,
              Auth, loadService, sourcingService) {

      $scope.loads = [];

      $scope.isGuest = Auth.isGuest();

      $scope.searchCriteria = "Today";

        $scope.filters = {
            period:1,
            types: { ftl:true, ltl:true, air:true},
            status: {open:open, filled:false, paid: false}
        };

      $scope.queryLoads = function (days) {

        if (days == 1) {
          $scope.searchCriteria = "Today";
        } else if (days > 1) {
          $scope.searchCriteria = "Last " + days + " days";
        } else if (days < 1) {
          $scope.searchCriteria = "All open loads";
        }

        $scope.filters.period= days;

        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        loadService.fetch($scope.filters,
            function () {
              $scope.updateLoadsTable();
            },
            function () {
              $scope.progressbar.stop();
            }
        );
      };


      $scope.clearSources = function(load) {
        sourcingService.clearSources(load);
        $scope.tableParamsLoads.reload();
        console.log("cleared the sources for this load");
      };

      $scope.updateLoadsTable = function () {
        $scope.loads = loadService.getCombinedLoads();
        $scope.tableParamsLoads.reload();
        $scope.progressbar.complete();
      };

      $scope.sourcing = function (load) {
        sourcingService.sourcing(load);
      };

      $scope.tableParamsLoads = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: {who: ''}
      }, {
        total: $scope.loads.length, // length of data
        //counts: [], // hide page counts control
        getData: function ($defer, params) {
          // use build-in angular filter
          var orderedData = params.filter() ? $filter('filter')($scope.loads, params.filter()) : $scope.loads;
          var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          params.total(orderedData.length); // set total for recalc pagination
          $defer.resolve(xxx);
        }
      });

      $scope.queryLoads(1);
    });
