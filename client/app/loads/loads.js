'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/loads', {
        templateUrl: 'app/loads/loads.html',
        controller: 'LoadsCtrl',
          authenticate: true
      });
  });
