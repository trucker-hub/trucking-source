'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/loads/ftl', {
        templateUrl: 'app/loads/ftl/ftl.html',
        controller: 'FtlCtrl'
      });
  });
