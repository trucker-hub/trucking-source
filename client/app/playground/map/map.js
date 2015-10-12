'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/map', {
        templateUrl: 'app/playground/map/map.html',
        controller: 'MapCtrl'
      });
  });
