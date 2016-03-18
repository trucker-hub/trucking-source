'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/careers', {
        templateUrl: 'app/careers/careers.html',
        controller: 'CareersCtrl'
      });
  });
