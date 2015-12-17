'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/container-weight-charges', {
        templateUrl: 'app/trucking-company/weight-charges/weight-charges.html',
        controller: 'WeightChargesCtrl'
      });
  });
