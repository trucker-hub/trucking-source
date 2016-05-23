'use strict';

angular.module('servicesApp')
  .controller('LoginCtrl', function ($scope, $rootScope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.loginAsGuest = function() {
      console.log("log in as a guest");

      var guest = Auth.getGuestCredentials();
      var path = $location.path();
      Auth.login({
            email: guest.email,
            password: guest.password
          })
          .then( function() {
            // Logged in, redirect to home
            console.log("switch to path=" + path);
            $location.path('/loads');
          })
          .catch( function(err) {
            $scope.errors.other = err.message;
          });

    };
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
