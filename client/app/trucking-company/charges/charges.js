'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/charges', {
        templateUrl: 'app/trucking-company/charges/charges.html',
        controller: 'ChargesCtrl'
      });
  });
