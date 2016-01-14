'use strict';

angular.module('servicesApp')
  .controller('LoadsCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams, loadService, sourcingService, ngProgressFactory) {

    // a list contains LTL, FTL and Air
    $rootScope.loadsOpened = $rootScope.loadsOpened || {ftl: {}, ltl: {}, air: {}};

    $scope.loads = loadService.getCombinedLoads();

    $scope.searchCriteria = 'Today';

    $scope.filters = {
      period: 1,
      types: {ftl: true, ltl: true, air: true},
      status: {open: true, filled: false, paid: false}
    };
    $scope.editLoad = function (id, type) {
      loadService.editLoad(id, type);
    };

    $scope.closeTab = function (id, type, update) {

      loadService.closeTab(id, type);
      if (update) {
        $scope.fetch(1);
      }
    };

    $scope.newFTLLoad = function () {
      loadService.editNewFTLLoad();
    };

    $scope.newFreightLoad = function () {
      loadService.editNewFreightLoad();
    };

    $scope.newAirLoad = function () {
      loadService.editNewAirLoad();
    };

    $scope.fetch = function () {
      var days = $scope.filters.period;
      console.log('fetch loads from the db');
      if (!$scope.filters.types.ftl && !$scope.filters.types.ltl && !$scope.filters.types.air) {
        $scope.filters.types = {ftl: true, ltl: true, air: true}
      }
      if (days == 1) {
        $scope.searchCriteria = "Today";
      } else if (days > 1) {
        $scope.searchCriteria = "Last " + days + " days";
      } else if (days < 1) {
        $scope.searchCriteria = "All open loads";
      }
      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.start();
      loadService.fetch($scope.filters, function () {
          $scope.updateTable();
        },
        function () {
          console.log('ran into error ');
          $scope.progressbar.stop();
        });
    };

    $scope.sourcing = function (load) {
      sourcingService.sourcing(load);
    };

    $scope.clearSources = function (load) {
      sourcingService.clearSources(load);
      $scope.tableParamsLoads.reload();
      console.log("cleared the sources for this load");
    };

    $scope.updateTable = function () {
      $scope.loads = loadService.getCombinedLoads();

      //console.log("loads = " + JSON.stringify(loads));
      $scope.tableParams.reload();
      $scope.progressbar.complete();
    };

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 25,          // count per page
      filter: {who: ''}
    }, {
      total: $scope.loads.length, // length of data,
      //counts: [],
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')($scope.loads, params.filter()) : $scope.loads;
        var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(xxx);
      }
    });


    $scope.fetch();
  });
