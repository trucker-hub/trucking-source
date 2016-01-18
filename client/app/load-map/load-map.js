'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/load-map', {
        templateUrl: 'app/load-map/load-map.html',
        controller: 'LoadMapCtrl'
      });
  });
