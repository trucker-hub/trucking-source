'use strict';

angular.module('servicesApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth) {

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedInAsync = Auth.isLoggedInAsync;
    $scope.isOperator = Auth.isOperator;
    $scope.isCarrier = Auth.isCarrier;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $rootScope.$on('login', function () {
      console.log("received broadcast on login event");
      $scope.isLoggedInAsync(function () {
        $scope.setVisibilityBasedOnRole();
      });
    });

    $rootScope.$on('logout', function () {
      console.log("received broadcast on logout event");
      $scope.setVisibilityBasedOnRole();
      $location.path('/');
    });

    $scope.setVisibilityBasedOnRole = function () {
      console.log('setVisibilityBasedOnRole: logged in ' + $scope.isLoggedIn());
      console.log('setVisibilityBasedOnRole: operator = ' + $scope.isOperator());
      console.log('setVisibilityBasedOnRole: admin = ' + $scope.isAdmin());

      $scope.menuForOperator = $scope.isLoggedIn() && ($scope.isOperator() || $scope.isAdmin());

      console.log("user visibility=" + $scope.menuForOperator);
      $scope.menu = [{
        'title': 'Home',
        'link': '/',
        'alwaysShow': true
      },
        {
          'title': 'Loads',
          'link': '/loads',
          'alwaysShow': true
        },
        {
          'title': 'Specials',
          'link': '/interest',
          'alwaysShow': $scope.menuForOperator
        }
      ];
      $scope.managementMenu = [
        {
          'title': 'Trucking Companies',
          'link': '/trucking-company',
          'alwaysShow': $scope.menuForOperator
        },
        {
          'title': 'Customer Settings',
          'link': '/customer-settings',
          'alwaysShow': $scope.menuForOperator
        },
        {
          'title': 'Warehouse',
          'link': '/warehouse',
          'alwaysShow': $scope.menuForOperator
        },
        {
          'title': 'Availability',
          'link': '/availability',
          'alwaysShow': $scope.menuForOperator
        }
      ];

      $scope.toolsMenu = [
        {
          'title': 'DDP',
          'link': '/ddp',
          'alwaysShow': true
        },
        {
          'title': 'Playground',
          'link': '/playground',
          'alwaysShow': $scope.menuForOperator
        },
        {
          'title': 'Load Map',
          'link': '/load-map',
          'alwaysShow': $scope.menuForOperator
        },
        {
          'title': 'Map',
          'link': '/map',
          'alwaysShow': $scope.menuForOperator
        },

        {
          'title': 'Charts',
          'link': '/charts',
          'alwaysShow': $scope.menuForOperator
        }
      ];

    };

    $scope.logout = function () {
      Auth.logout();
    };

    $scope.isActive = function (route) {
      return route === $location.path();
    };
    Auth.isLoggedInAsync(function (loggedIn) {
      $scope.setVisibilityBasedOnRole();
    });
  });
