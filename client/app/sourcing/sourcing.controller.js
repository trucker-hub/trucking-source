'use strict';

angular.module('servicesApp').controller('SourcingCtrl',
    function ($scope, $http, $modal, $q, ngTableParams, $filter, ngProgressFactory,
              Auth, loadService, sourcingService) {

      $scope.loads = [];

      $scope.searchCriteria = "Today";

      $scope.queryLoads = function (days) {

        if (days == 1) {
          $scope.searchCriteria = "Today";
        } else if (days > 1) {
          $scope.searchCriteria = "Last " + days + " days";
        } else if (days < 1) {
          $scope.searchCriteria = "All open loads";
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

      var settingsPromise = function(load) {
        console.log("fetching settings before sourcing");
        var deferred = $q.defer();
        console.log("broker fee" + JSON.stringify(load.brokerFees));
        if (!load.brokerFees || load.brokerFees.length==0) {
          sourcingService.getCustomerFeeSettings(load, function(response) {
            deferred.resolve(load);
          }, function(response) {
            deferred.reject("error");
          });
        }else {
          console.log("already has broker fees set!")
          deferred.resolve(load);
        }
        return deferred.promise;
      };

      var search = function(load) {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        sourcingService.sourcing(load,
            function () {
              //after get the companies' data, we can calculate the prices on the client side.
              $scope.progressbar.complete();
              load.showLoadDetails = false;
              sourcingService.showQuoteDialog(load);
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
        settingsPromise(load).then(search).catch(function(err) {
          console.error("sourcing error");
        });
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
