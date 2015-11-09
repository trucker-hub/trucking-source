'use strict';

angular.module('servicesApp')
  .controller('LoadsCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams, loadService, ngProgressFactory) {

    var NEW_FTL_ID = -2;
    var NEW_LTL_ID = -1;

    // a list contains LTL, FTL and Air


    $rootScope.loadsOpened  = $rootScope.loadsOpened || { ftl:  {},  ltl:  {},  air:  {} };

    $scope.loads = loadService.getCombinedLoads();

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 25,          // count per page
      filter: { who: '' }
    }, {
      total: $scope.loads.length, // length of data,
      //counts: [],
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')($scope.loads, params.filter()) : $scope.loads;

        var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(xxx);
      }
    });


    $scope.editLoad = function(id, type) {

      var xx = {};
      if(type =='FTL') {
        xx = $rootScope.loadsOpened.ftl;
      }else if (type=='LTL' || type=='AIR') {
        xx = $rootScope.loadsOpened.ltl;
      }

      console.log("edit a load whose id is " + id);

      var detail = xx[id];
      if(detail) {
        detail.active = true;
        return;
      }

      var index;
      for (index =0; index < $scope.loads.length; ++index) {
        var load = $scope.loads[index];
        if(load._id == id) {
          xx[id] = {data:load, active:true};
          return;
        }
      }
    };


    $scope.emptyFtlLoad  = loadService.emptyFtlLoad;

    $scope.emptyFreightLoad  = loadService.emptyFreightLoad;

    $scope.closeTab = function(id, type, update) {

      if(type =='FTL') {
        delete $rootScope.loadsOpened.ftl[id];
      }else if (type=='LTL' || type=='AIR') {
        delete $rootScope.loadsOpened.ltl[id];
      }

      if(update) {
        $scope.fetch(type);
      }
    };


    $scope.newFTLLoad = function() {
      console.log("calling createFTLLoad");
      var load = angular.copy($scope.emptyFtlLoad);
      load._id = NEW_FTL_ID;
      $rootScope.loadsOpened.ftl[NEW_FTL_ID] = {data:load, active:true};
      $scope.editLoad(load._id);
    };


    $scope.newFreightLoad = function() {
      console.log("calling createFTLLoad");
      var load = angular.copy($scope.emptyFreightLoad);
      load._id = NEW_LTL_ID;
      $rootScope.loadsOpened.ltl[NEW_LTL_ID] = {data:load, active:true};
      $scope.editLoad(load._id);
    };

    $scope.newAirLoad = function() {
      console.log("calling createFTLLoad");
      var load = angular.copy($scope.emptyFreightLoad);
      load._id = NEW_LTL_ID;
      load.loadType="AIR";
      $rootScope.loadsOpened.ltl[NEW_LTL_ID] = {data:load, active:true};
      $scope.editLoad(load._id);
    };


    $scope.fetch = function(days) {
      console.log('fetch loads from the db');
      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.start();
      loadService.fetch('ALL', days, function() {
          $scope.updateTable();
        },
        function() {
          console.log('ran into error ');
          $scope.progressbar.stop();
        });
    };

    $scope.updateTable = function() {
        $scope.loads = loadService.getCombinedLoads();

      //console.log("loads = " + JSON.stringify(loads));
      $scope.tableParams.reload();
      $scope.progressbar.complete();
    };


    //$scope.fetch('ALL');
  });
