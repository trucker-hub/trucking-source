'use strict';

angular.module('servicesApp').controller('SourcingCtrl',
  function ($scope, $http, $modal, ngTableParams, $filter, ngProgressFactory,
            Auth, loadService, sourcingService) {

    $scope.loads = [];

    $scope.searchCriteria ="Today";

    $scope.queryLoads = function (days) {

      if(days==1) {
        $scope.searchCriteria ="Today";
      }else if(days > 1) {
        $scope.searchCriteria ="Last " + days + " days";
      }else if (days < 1) {
        $scope.searchCriteria ="All open loads";
      }

      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.start();
      loadService.fetch('ALL', days,
        function () {
          $scope.updateLoadsTable();
        },
        function () {
          $scope.progressbar.stop();
        }
      );
    };

    $scope.selectLoad = function (load) {
      if ($scope.selectedLoad != load) {
        $scope.sources = [];
        $scope.selectedLoad = load;
        if (!$scope.selectedLoad.brokerFees || $scope.selectedLoad.brokerFees.length == 0) {
          sourcingService.getCustomerFeeSettings($scope.selectedLoad);
        }
      }
    };

    $scope.updateLoadsTable = function () {
      $scope.loads = loadService.getCombinedLoads();
      $scope.tableParamsLoads.reload();
      $scope.progressbar.complete();

    };

    $scope.sourcing = function () {

      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.start();
      sourcingService.sourcing($scope.selectedLoad,
        function () {
          //after get the companies' data, we can calculate the prices on the client side.
          $scope.progressbar.complete();
            $scope.selectedLoad.showLoadDetails = false;
            sourcingService.showQuoteDialog($scope.selectedLoad);
        },
        function () {
          $scope.progressbar.stop();
        }
      );
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
