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

      var menuForOperator = $scope.isLoggedIn() && ($scope.isOperator() || $scope.isAdmin());

      console.log("user visibility=" + menuForOperator);
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
          'title': 'Load Map',
          'link': '/load-map',
          'alwaysShow': true
        },
        {
          'title': 'Specials',
          'link': '/interest',
          'alwaysShow': true
        }
      ];
      $scope.managementMenu = [
        {
          'title': 'Trucking Companies',
          'link': '/trucking-company',
          'alwaysShow': menuForOperator
        },
        {
          'title': 'Customer Settings',
          'link': '/customer-settings',
          'alwaysShow': true
        },
        {
          'title': 'Warehouse',
          'link': '/warehouse',
          'alwaysShow': menuForOperator
        },
        {
          'title': 'Availability',
          'link': '/availability',
          'alwaysShow': menuForOperator
        },
        {
          'title': 'DDP',
          'link': '/ddp',
          'alwaysShow': true
        },
        {
          'title': 'Playground',
          'link': '/playground',
          'alwaysShow': true
        },
        {
          'title': 'Map',
          'link': '/map',
          'alwaysShow': menuForOperator
        },

        {
          'title': 'Charts',
          'link': '/charts',
          'alwaysShow': menuForOperator
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
