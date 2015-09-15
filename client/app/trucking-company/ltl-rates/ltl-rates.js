'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/ltl-rates', {
        templateUrl: 'app/trucking-company/ltl-rates/ltl-rates.html',
        controller: 'LtlRatesCtrl'
      });
  });
