'use strict';

angular.module('servicesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trucking-company/company-ltl/tier-editing', {
        templateUrl: 'app/trucking-company/company-ltl/tier-editing/tier-editing.html',
        controller: 'TierEditingCtrl'
      });
  });
