'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sourcing/quote', {
        templateUrl: 'app/sourcing/quote/quote.html',
        controller: 'QuoteCtrl'
      });
  });
