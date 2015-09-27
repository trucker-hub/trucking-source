'use strict';

angular.module('servicesApp')
  .controller('LoadsCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams) {

    var NEW_FTL_ID = -2;
    var NEW_LTL_ID = -1;

    // a list contains LTL, FTL and Air


    $rootScope.loadsOpened  = $rootScope.loadsOpened || { ftl:  {},  ltl:  {},  air:  {} };

    $rootScope.loads = $rootScope.loads || {ftl: [], ltl:[], air: []};

    var loads = [];

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 20,          // count per page
      filter: { who: '' }
    }, {
      total: loads.length, // length of data,
      counts: [],
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;

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
      for (index =0; index < loads.length; ++index) {
        var load = loads[index];
        if(load._id == id) {
          xx[id] = {data:load, active:true};
          return;
        }
      }
    };


    $scope.emptyFtlLoad  = {
      who: 'NEW one',
      loadType:'FTL',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: {},
        locationType: "Business with Dock/Fork",
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: {},
        locationType: "Business with Dock/Fork",
        extraServices: []
      },
      lines: [],

      trailer: {
        type: "Dry Van"
      }
    };

    $scope.emptyFreightLoad  = {
      who: 'NEW one',
      loadType:'LTL',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: {},
        services: [],
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: {},
        services: [],
        extraServices: []
      },
      lines: []
    };

    $scope.closeTab = function(id, type, update) {

      if(type =='FTL') {
        delete $rootScope.loadsOpened.ftl[id];
      }else if (type=='LTL' || type=='AIR') {
        delete $rootScope.loadsOpened.ltl[id];
      }

      if(update) {
        $scope.loadLoads(type);
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


    $scope.loadLoads = function(type) {

      console.log('fetch loads from the db');

      if(!type || type=='FTL') {
        $http.get('/api/load/ftl-loads?status=OPEN').then(
          function(response) {
            //console.log(JSON.stringify(response.data));
            $rootScope.loads.ftl = response.data;
            $scope.updateTable();
          },
          function(response) {
            console.log('ran into error ' + response);

          });
      }
      if(!type || type=='LTL') {
        $http.get('/api/load/ltl-loads?status=OPEN').then(
          function(response) {
            //console.log(JSON.stringify(response.data));
            $rootScope.loads.ltl = response.data;
            $scope.updateTable();
          },
          function(response) {
            console.log('ran into error ' + response);
          });
      }
    };
    $scope.loadConstants = function(callback) {
      if(!$rootScope.loadConstants) {
        $http.get('/api/load/ftl-loads/util/constants').then(
          function(response) {
            var data = response.data;
            //console.log("constants are " + JSON.stringify((data)));
            $rootScope.loadConstants = {
              ftl: {
                packagings: data.packagings,
                toLocationTypes: data.toLocationTypes,
                fromLocationTypes: data.fromLocationTypes,
                trailerTypes: data.trailerTypes
              },
              ltl: {
                toServices: data.toServices.map(function(item) {
                  return {service:item};
                }),
                fromServices: data.fromServices.map(function(item) {
                  return {service:item};
                }),
                packagings: data.ltlPackagings
              }
            };
            callback();
          }, function(err) {
            console.log(err);}
        );
      }
    };

    $scope.updateTable = function() {
      loads = null;
      loads = $rootScope.loads.ftl.concat($rootScope.loads.ltl);

      //console.log("loads = " + JSON.stringify(loads));
      $scope.tableParams.reload();
    };


    $scope.updateTable();
  });
