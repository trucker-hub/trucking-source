'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/setting/update', {
        templateUrl: 'app/settings/setting-update/setting-update.html',
        controller: 'SettingUpdateCtrl'
      });
  });
