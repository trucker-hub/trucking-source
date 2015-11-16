'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/company-contact', {
        templateUrl: 'app/trucking-company/company-contact/company-contact.html',
        controller: 'CompanyContactCtrl'
      });
  });
