'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/company-air', {
        templateUrl: 'app/trucking-company/company-air/company-air.html',
        controller: 'CompanyAirCtrl'
      });
  });
