'use strict';

angular.module('servicesApp')
  .controller('DeliveryOrderCtrl', function ($scope, $http,ngTableParams, $filter, ngProgressFactory) {
    var selectedCompanies = [];

    var loads = [];

    $scope.queryLoads = function(type, days) {

      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.start();
      $http.get('/api/load/ftl-loads?status=' + type + "&days=" + days).then(
        function(response) {
          console.log(JSON.stringify(response.data));
          $scope.updateLoadsTable(response.data);
          $scope.progressbar.complete();
        },
        function(response) {
          console.log('ran into error ' + response);
          $scope.progressbar.stop();
        });
    };

    $scope.select = function(load) {
      if($scope.selectedLoad!=load) {
        $scope.selectedLoad = load;
      }
    };

    $scope.updateDO = function() {

    }

    $scope.updateLoadsTable = function(data) {
      loads = data;
      $scope.tableParamsLoads.reload();
    };

    $scope.tableParamsLoads = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      filter: {
        who: ''       // initial filter
      }
    }, {
      total: loads.length, // length of data
      //counts: [], // hide page counts control
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;
        var xxx  = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(xxx);
      }
    });

  });
