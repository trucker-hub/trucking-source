'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/interest', {
        templateUrl: 'app/interest/interest.html',
        controller: 'InterestCtrl'
      });
  });
