'use strict';

angular.module('servicesApp').controller('SourcingCtrl', function ($scope, $http, ngTableParams, $filter, ngProgressFactory) {

  var selectedCompanies = [];

  var loads = [];

  var queryLoads = function(type) {
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    $http.get('/api/load/ftl-loads').then(
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
      $scope.sources =[];
      $scope.selectedLoad = load;
    }
  }
  $scope.getOpenLoads = function() {queryLoads('Open'); };

  $scope.updateLoadsTable = function(data) {
    loads = data;
    $scope.tableParamsLoads.reload();
  };
  var sum =  function (input) {
    var index;
    var result = 0;
    for(index=0; index < input.length; index++) {
      result += input[index].charge;
    }
    return result;
  };
  $scope.selectSource = function(aSource) {
    if($scope.selectedLoad && aSource) {

      $scope.selectedLoad.fulfilledBy =
      {
        name: aSource.name,
        source: aSource._id,
        charge: sum(aSource.cost)
      }
    }else {
      $scope.selectedLoad.fulfilledBy =
      {
        name: "",
        source: null,
        charge: null
      }
    }

  };


  $scope.sourcing = function() {

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    $http.post("/api/sourcing", $scope.selectedLoad).then(
      function(response) {
        console.log(JSON.stringify(response.data));
        $scope.sources = response.data;
        if($scope.sources.length > 0) {
          $scope.selectSource($scope.sources[0]);
        }
        //after get the companies' data, we can calculate the prices on the client side.
        $scope.progressbar.complete();
      },
      function(response) {
        //show a alert and empty the table
        console.log("called /api/sourcing but returned res = " + JSON.stringify(response));
        $scope.progressbar.stop();
      })
  };

  $scope.tableParamsLoads = new ngTableParams({
    page: 1,            // show first page
    count: 20,          // count per page
    filter: {
      who: ''       // initial filter
    }
  }, {
    total: loads.length, // length of data
    counts: [], // hide page counts control
    getData: function($defer, params) {
      // use build-in angular filter
      var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;

      loads = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

      params.total(orderedData.length); // set total for recalc pagination
      $defer.resolve(loads);
    }
  });


});
