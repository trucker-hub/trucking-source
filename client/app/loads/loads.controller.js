'use strict';

angular.module('servicesApp')
  .controller('LoadsCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams, loadService, ngProgressFactory) {

    // a list contains LTL, FTL and Air
    $rootScope.loadsOpened  = $rootScope.loadsOpened || { ftl:  {},  ltl:  {},  air:  {} };

    $scope.loads = loadService.getCombinedLoads();

    $scope.searchCriteria ='Today';



    $scope.editLoad = function(id, type) {

      var xx = {};
      if(type =='FTL') {
        xx = $rootScope.loadsOpened.ftl;
      }else if (type=='LTL' || type=='AIR') {
        xx = $rootScope.loadsOpened.ltl;
      }

      console.log("edit a load whose id/tab is " + id);

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
      var load = loadService.create('FTL');
      $rootScope.loadsOpened.ftl[load.tabId] = {data:load, active:true};
      $scope.editLoad(load.tabId);
    };

    $scope.newFreightLoad = function() {
      console.log("calling createLTLLoad");
      var load = loadService.create('LTL');
      $rootScope.loadsOpened.ltl[load.tabId] = {data:load, active:true};
      $scope.editLoad(load.tabId);
    };

    $scope.newAirLoad = function() {
      console.log("calling create AIR Load");
      var load = loadService.create('AIR');
      $rootScope.loadsOpened.ltl[load.tabId] = {data:load, active:true};
      $scope.editLoad(load.tabId);
    };


    $scope.fetch = function(days) {
      console.log('fetch loads from the db');
      if(days==1) {
        $scope.searchCriteria ="Today";
      }else if(days > 1) {
        $scope.searchCriteria ="Last " + days + " days";
      }else if (days < 1) {
        $scope.searchCriteria ="All open loads";
      }
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


    $scope.fetch(1);
  });
