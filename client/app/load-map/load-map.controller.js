'use strict';

angular.module('servicesApp')
    .controller('LoadMapCtrl', function ($scope, loadService, ngProgressFactory, uiGmapGoogleMapApi) {

      $scope.loads = loadService.getCombinedLoads();

      $scope.searchCriteria = 'Today';

      $scope.filters = loadService.filters;

      $scope.fetch = function () {
        var days = $scope.filters.period;
        console.log('fetch loads from the db');
        if (!$scope.filters.types.ftl && !$scope.filters.types.ltl && !$scope.filters.types.air) {
          $scope.filters.types = {ftl: true, ltl: true, air: true}
        }
        if (days == 1) {
          $scope.searchCriteria = "Today";
        } else if (days > 1) {
          $scope.searchCriteria = "Last " + days + " days";
        } else if (days < 1) {
          $scope.searchCriteria = "All open loads";
        }
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        loadService.fetch(function () {
              $scope.progressbar.complete();
              updateMap();
            },
            function () {
              console.log('ran into error ');
              $scope.progressbar.stop();
            });
      };

      var updateMap = function () {
        console.log("update markers");
        $scope.loads = loadService.getCombinedLoads();
        var markers = [];
        for (var i = 0; i < $scope.loads.length; i++) {
          markers.push(createLoadMarker($scope.loads[i], $scope.map.bounds))
        }
        console.log("we have " + markers.length + " markers to display");
        $scope.loadMarkers = markers;
      };

      $scope.loadMarkers = [];

      $scope.map = {
        center: {
          latitude: 33.845385,
          longitude: -118.360726
        },
        zoom: 11,
        bounds: {}
      };
      $scope.options = {
        scrollwheel: false
      };

      var createLoadMarker = function (load, bounds, idKey) {
        var lat_min = bounds.southwest.latitude,
            lat_range = bounds.northeast.latitude - lat_min,
            lng_min = bounds.southwest.longitude,
            lng_range = bounds.northeast.longitude - lng_min;

        if (idKey == null) {
          idKey = "id";
        }

        var latitude = load.shipTo.location.coordinates[0];
        var longitude = load.shipTo.location.coordinates[1];
        var ret = {
          latitude: latitude,
          longitude: longitude,
          title: load.who,
          icon: 'assets/images/trucking-YES-16x16.png'
        };
        ret[idKey] = load._id;
        return ret;
      };

      // Get the bounds from the map once it's loaded
      $scope.$watch(function () {
        return $scope.map.bounds;
      }, function (nv, ov) {
        // Only need to regenerate once
        if (!ov.southwest && nv.southwest) {
          console.log("update the map markers")
          updateMap();
        }
      }, true);

    });
