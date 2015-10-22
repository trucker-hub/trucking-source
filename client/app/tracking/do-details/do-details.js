'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tracking/do-details', {
        templateUrl: 'app/tracking/do-details/do-details.html',
        controller: 'DoDetailsCtrl'
      });
  });
