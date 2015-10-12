'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/charts', {
        templateUrl: 'app/playground/charts/charts.html',
        controller: 'ChartsCtrl'
      });
  });
