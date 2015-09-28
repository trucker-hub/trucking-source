'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/warehouse/warehouse-details', {
        templateUrl: 'app/warehouse/warehouse-details/warehouse-details.html',
        controller: 'WarehouseDetailsCtrl'
      });
  });
