'use strict';

angular.module('servicesApp')
  .controller('LoadsCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams) {

    var NEW_FTL_ID = -2;
    var NEW_LTL_ID = -1;
    var loads = $rootScope.loads || [];

    $rootScope.loadsOpened = $rootScope.loadsOpened || {};

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 20,          // count per page
      filter: {
        who: ''       // initial filter
      }
    }, {
      total: loads.length, // length of data,
      counts: [],
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;

        loads = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(loads);
      }
    });

    var editLoadFunc = function(id) {
      console.log("edit a load whose id is " + id);

      var detail = $rootScope.loadsOpened[id];
      if(detail) {
        detail.active = true;
        return;
      }

      var index;
      for (index =0; index < loads.length; ++index) {
        var load = loads[index];
        if(load._id == id) {
          $rootScope.loadsOpened[id] = {data:load, active:true};
          return;
        }
      }
    };

    $scope.emptyFtlLoad  = {
      type: "FTL",
      who: 'NEW one',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: null,
        locationType: "Business with Dock/Fork",
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: null,
        locationType: "Business with Dock/Fork",
        extraServices: []
      },
      lines: [],

      trailer: {
        type: "Dry Van"
      }
    };
    $scope.closeTab = function(id, update) {
      console.log("cancel load info " + id);
      delete $rootScope.loadsOpened[id];

      if(update) {
        $scope.loadLoads();
      }
    };


    $scope.newFTLLoad = function() {
      console.log("calling createFTLLoad");
      var load = angular.copy($scope.emptyFtlLoad);
      load._id = NEW_FTL_ID;
      $rootScope.loadsOpened[NEW_FTL_ID] = {data:load, active:true};
      editLoadFunc(NEW_FTL_ID);
    };

    $scope.editLoad = function(id) {
      editLoadFunc(id);
    };

    $scope.loadLoads = function() {

      console.log('fetch loads from the db');
      $http.get('/api/load/ftl-loads').then(
        function(response) {
          console.log(JSON.stringify(response.data));
          $rootScope.loads = response.data;
          $scope.updateTable(response.data);

        },
        function(response) {
          console.log('ran into error ' + response);

        });
    };

    $scope.updateTable = function(data) {
      loads = data;
      $scope.tableParams.reload();
    };

    $scope.createFTLLoad = function() {

    }
  });
