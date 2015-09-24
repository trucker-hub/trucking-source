'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sourcing/invoice', {
        templateUrl: 'app/sourcing/invoice/invoice.html',
        controller: 'InvoiceCtrl'
      });
  });
