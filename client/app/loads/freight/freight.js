'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/loads/freight', {
        templateUrl: 'app/loads/freight/freight.html',
        controller: 'FreightCtrl'
      });
  });
