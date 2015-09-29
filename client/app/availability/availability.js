'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/availability', {
        templateUrl: 'app/availability/availability.html',
        controller: 'AvailabilityCtrl'
      });
  });
