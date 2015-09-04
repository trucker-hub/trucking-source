'use strict';

angular.module('servicesApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/',
      'alwaysShow': true
    },
      {
        'title': 'Trucking Companies',
        'link': '/trucking-company',
        'alwaysShow': true
      },
      {
        'title': 'Loads',
        'link': '/loads',
        'alwaysShow': true
      },
      {
        'title': 'Sourcing',
        'link': '/sourcing',
        'alwaysShow': true
      },
      {
        'title': 'DO',
        'link': '/delivery-order',
        'alwaysShow': true
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function (route) {
      return route === $location.path();
    };
  });
