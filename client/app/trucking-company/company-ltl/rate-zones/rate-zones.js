'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company', {
        templateUrl: 'app/trucking-company/company-ltl/rate-zones/rate-zones.html',
        controller: 'RateZonesCtrl'
      });
  });
