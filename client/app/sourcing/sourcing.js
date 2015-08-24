'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sourcing', {
          templateUrl: 'app/sourcing/sourcing.html',
          controller: 'SourcingCtrl',
          authenticate: true
      });
  });
