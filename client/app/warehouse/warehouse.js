'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/warehouse', {
        templateUrl: 'app/warehouse/warehouse.html',
        controller: 'WarehouseCtrl'
      });
  });
