'use strict';

angular.module('servicesApp').controller('SourcingCtrl', function ($scope, $http, $modal, ngTableParams, $filter, ngProgressFactory, loadService, sourcingService) {

  var brokerFees = [
    {name: "ABI-Customs Fee", charge: 15},
    {name: "Chassy Fee", charge: 15},
    {name: "Service Fee", charge:50}
  ];

  var loads = [];

  $scope.queryLoads = function(days) {

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    loadService.fetch('ALL', days,
      function() {
        $scope.updateLoadsTable();
      },
      function() {
        $scope.progressbar.stop();
      }
    );
  };

  $scope.selectLoad = function(load) {
    if($scope.selectedLoad!=load) {
      $scope.sources =[];
      $scope.selectedLoad = load;
      if(!$scope.selectedLoad.brokerFees || $scope.selectedLoad.brokerFees.length==0) {
        $scope.selectedLoad.brokerFees = brokerFees;
      }
    }
  };

  $scope.updateLoadsTable = function() {

    var xx = loadService.getLoads();
    loads = xx.ftl.concat(xx.ltl);

    $scope.tableParamsLoads.reload();
    $scope.progressbar.complete();

  };


  $scope.selectSource = function(aSource) {
    $scope.selectedSource = aSource;
    sourcingService.selectSource($scope.selectedLoad, $scope.selectedSource);
  };

  $scope.sourcing = function() {

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    sourcingService.sourcing($scope.selectedLoad,
      function() {
        //after get the companies' data, we can calculate the prices on the client side.
        $scope.progressbar.complete();
      },
      function() {
        $scope.progressbar.stop();
      }
    );
  };

  $scope.finalizeSource = function() {
    sourcingService.finalizeSource($scope.selectedLoad,
      function() {
        console.log("finalizeSource succesfully ");
      },
      function() {
        console.log("finalizeSource  failed ");
      }
    );
  };

  $scope.createInvoice = function() {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'app/sourcing/invoice/invoice.html',
      controller: 'InvoiceCtrl',
      size: 'lg',
      resolve: {
        load: function () {
          return $scope.selectedLoad;
        }
      }
    });
    modalInstance.result.then(
      function () {
      },
      function () {
        console.log('Modal dismissed at: ' + new Date());
      }
    );
  };

  $scope.createDO = function() {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'app/tracking/do-details/do-details.html',
      controller: 'DoDetailsCtrl',
      size: 'lg',
      resolve: {
        load: function () {
          return $scope.selectedLoad;
        }
      }
    });

    modalInstance.result.then(
      function () {
        var path = $scope.selectedLoad.loadType=='FTL'?'/api/load/ftl-loads/':'/api/load/ltl-loads/';
        $http.put(path+$scope.selectedLoad._id, $scope.selectedLoad).then(
          function(response) { console.log("request saved succesfully " + JSON.stringify(response));},
          function(err) { console.log("request saving failed " + err);}
        );
      },
      function () { console.log('Modal dismissed at: ' + new Date());}
    );
  };
  $scope.tableParamsLoads = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    filter: { who: ''}
  }, {
    total: loads.length, // length of data
    //counts: [], // hide page counts control
    getData: function($defer, params) {
      // use build-in angular filter
      var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;
      var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      params.total(orderedData.length); // set total for recalc pagination
      $defer.resolve(xxx);
    }
  });


});
