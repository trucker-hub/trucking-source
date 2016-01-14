'use strict';

angular.module('servicesApp')
  .controller('TrackingCtrl', function ($rootScope, $scope, $http, ngTableParams, $filter, $uibModal, ngProgressFactory) {

    var loads = [];

    $scope.searchCriteria ="Today";

    $rootScope.dos = $rootScope.dos || { ftlLoads: [], ltlLoads: []};
    $scope.progressbar = ngProgressFactory.createInstance();

    $scope.queryLoads = function(type, days) {

      if(days==1) {
        $scope.searchCriteria ="Today";
      }else if(days > 1) {
        $scope.searchCriteria ="Last " + days + " days";
      }else if (days < 1) {
        $scope.searchCriteria ="All open loads";
      }

      $scope.progressbar.start();

      $rootScope.dos = { ftlLoads: null, ltlLoads: null };

      $http.get('/api/load/ftl-loads?status=' + type + "&days=" + days).then(
        function(response) {
          $rootScope.dos.ftlLoads = response.data;
          $scope.updateTable();
        },
        function(response) {
          console.log('ran into error ' + response);
          $scope.progressbar.stop();
        });
      $http.get('/api/load/ltl-loads?status=' + type + "&days=" + days).then(
        function(response) {
          $rootScope.dos.ltlLoads = response.data;
          $scope.updateTable();
        },
        function(response) {
          console.log('ran into error ' + response);
          $scope.progressbar.stop();
        });
    };

    $scope.updateTable = function() {
      if ($rootScope.dos.ftlLoads && $rootScope.dos.ltlLoads) {
        $scope.progressbar.complete();
        loads = $rootScope.dos.ftlLoads.concat($rootScope.dos.ltlLoads);
        $scope.tableParamsLoads.reload();
      }
    };



    $scope.createInvoice = function(selectedLoad) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/sourcing/invoice/invoice.html',
        controller: 'InvoiceCtrl',
        size: 'lg',
        resolve: {
          load: function () {
            return selectedLoad;
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


    $scope.createDO = function(selectedLoad) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/tracking/do-details/do-details.html',
        controller: 'DoDetailsCtrl',
        size: 'lg',
        resolve: {
          load: function () {
            return selectedLoad;
          }
        }
      });
      modalInstance.result.then(
        function () {
          var path = selectedLoad.loadType=='FTL'?'/api/load/ftl-loads/':'/api/load/ltl-loads/';
          $http.put(path +selectedLoad._id, selectedLoad).then(
            function(response) {
              console.log("request saved succesfully " + JSON.stringify(response));
            },
            function(err) {
              console.log("request saving failed " + err);
            }
          );
        },
        function () {
          console.log('Modal dismissed at: ' + new Date());
        }
      );
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

    $scope.updateTable();

  });
