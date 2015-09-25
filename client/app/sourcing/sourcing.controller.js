'use strict';

angular.module('servicesApp').controller('SourcingCtrl', function ($rootScope, $scope, $http, $modal, ngTableParams, $filter, ngProgressFactory) {



  var brokerFees = [
    {name: "ABI-Customs Fee", charge: 15},
    {name: "Chassy Fee", charge: 15},
    {name: "Service Fee", charge:50}
  ];

  var loads = [];

  $rootScope.sourcing = $rootScope.sourcing || { ftlLoads: [], ltlLoads: []};


  $scope.queryLoads = function(type, days) {

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();

    $rootScope.sourcing = { ftlLoads: null, ltlLoads: null };

    $http.get('/api/load/ftl-loads?status=' + type + "&days=" + days).then(
      function(response) {
        $rootScope.sourcing.ftlLoads = response.data;
        $scope.updateLoadsTable();
      },
      function(response) {
        console.log('ran into error ' + response);
        $scope.progressbar.stop();
      });
    $http.get('/api/load/ltl-loads?status=' + type + "&days=" + days).then(
      function(response) {
        $rootScope.sourcing.ltlLoads = response.data;
        $scope.updateLoadsTable();
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
      if(!$scope.selectedLoad.brokerFees || $scope.selectedLoad.brokerFees.length==0) {
        $scope.selectedLoad.brokerFees = brokerFees;
      }
    }
  };

  $scope.updateLoadsTable = function() {
    if ($rootScope.sourcing.ftlLoads && $rootScope.sourcing.ltlLoads) {
      $scope.progressbar.complete();
      loads = $rootScope.sourcing.ftlLoads.concat($rootScope.sourcing.ltlLoads);
      $scope.tableParamsLoads.reload();
    }
  };


  $scope.selectSource = function(aSource) {
    $scope.selectedSource = aSource;
    if($scope.selectedLoad && aSource) {
      $scope.selectedLoad.fulfilledBy =
      {
        name: aSource.name,
        source: aSource.id,
        charge: aSource.totalCost,
        costItems: aSource.costItems
      };
      $scope.recalcAdjustments();
    }else {
      $scope.selectedLoad.fulfilledBy =
      {
        name: "",
        source: null,
        charge: null,
        costItems: []
      }
    }
  };

  $scope.recalcAdjustments = function() {
    var i, sum=0;
    for(i=0; i < $scope.selectedLoad.fulfilledBy.costItems.length; ++i) {
      var item = $scope.selectedLoad.fulfilledBy.costItems[i];
      if(item.charge) sum += item.charge;
      if(item.adjustment) sum += item.adjustment;
    }
    $scope.selectedLoad.vendorChargeAmount = sum;

    for(i=0; i < $scope.selectedLoad.brokerFees.length; ++i) {
      var brokerFee = $scope.selectedLoad.brokerFees[i];
      if(brokerFee.charge) {
        sum += brokerFee.charge;
      }
    }
    $scope.selectedLoad.totalAmount = sum;
  };

  $scope.sourcing = function() {

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    $http.post("/api/sourcing", $scope.selectedLoad).then(
      function(response) {
        console.log(JSON.stringify(response.data));
        $scope.selectedLoad.sources = response.data;
        if($scope.selectedLoad.sources.length > 0) {
          $scope.selectSource($scope.selectedLoad.sources[0]);
        }else {
          $scope.selectSource(null);
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

  $scope.finalizeSource = function() {
    $scope.selectedLoad.status = "FILLED";
    var path = $scope.selectedLoad.loadType=='FTL'?'/api/load/ftl-loads/':'/api/load/ltl-loads/';

    $http.put(path+$scope.selectedLoad._id, $scope.selectedLoad).then(

      function(response) {
        console.log("request saved succesfully " + JSON.stringify(response));
      },
      function(err) {
        console.log("request saving failed " + err);
        $scope.selectedLoad.status = "OPEN";
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
      templateUrl: 'app/delivery-order/do-details/do-details.html',
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
