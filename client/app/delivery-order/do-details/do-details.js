'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/delivery-order/do-details', {
        templateUrl: 'app/delivery-order/do-details/do-details.html',
        controller: 'DoDetailsCtrl'
      });
  });
