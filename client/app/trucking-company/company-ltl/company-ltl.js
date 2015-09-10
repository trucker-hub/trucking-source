'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/company-ltl', {
        templateUrl: 'app/trucking-company/company-ltl/company-ltl.html',
        controller: 'CompanyLtlCtrl'
      });
  });
