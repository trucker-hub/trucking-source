'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company', {
        templateUrl: 'app/trucking-company/trucking-company.html',
        controller: 'TruckingCompanyCtrl'
      });
  });
