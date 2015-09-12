'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/playground', {
        templateUrl: 'app/playground/playground.html',
        controller: 'PlaygroundCtrl'
      });
  });
