'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ddp', {
        templateUrl: 'app/ddp/ddp.html',
        controller: 'DdpCtrl'
      });
  });
