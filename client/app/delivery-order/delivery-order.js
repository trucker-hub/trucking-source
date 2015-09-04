'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/delivery-order', {
        templateUrl: 'app/delivery-order/delivery-order.html',
        controller: 'DeliveryOrderCtrl'
      });
  });
