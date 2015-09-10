'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/company-ftl', {
        templateUrl: 'app/trucking-company/company-ftl/company-ftl.html',
        controller: 'CompanyFtlCtrl'
      });
  });
