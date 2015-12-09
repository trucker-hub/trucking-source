'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/customer-settings', {
        templateUrl: 'app/settings/settings.html',
        controller: 'CustomerSettingsCtrl'
      });
  });
