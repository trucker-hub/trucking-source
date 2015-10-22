'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tracking', {
        templateUrl: 'app/tracking/tracking.html',
        controller: 'TrackingCtrl'
      });
  });
