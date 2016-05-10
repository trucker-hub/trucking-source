'use strict';

angular.module('servicesApp')
  .controller('LoginCtrl', function ($scope, $rootScope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.loginAsGuest = function() {
        console.log("log in as a guest");
    }
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
