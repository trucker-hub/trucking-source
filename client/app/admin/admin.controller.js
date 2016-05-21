'use strict';

angular.module('servicesApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User) {

        // Use the User $resource to fetch all users
        $scope.users = User.query();

        $scope.delete = function (user) {
            User.remove({id: user._id});
            angular.forEach($scope.users, function (u, i) {
                if (u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };

      $scope.hasGuestAccount = function() {
        var result = false;
        angular.forEach($scope.users, function (u, i) {
          //console.log("u=" + JSON.stringify(u));
          if(u.role=='guest') {
            result= true;
          }
        });
        return result;
      };

      $scope.addGuest = function(user) {
        Auth.createGuestAccount()
            .then( function() {
              // Account created, redirect to home
              console.log("guest account created");
              $scope.users = User.query();
            })
            .catch( function(err) {
              console.log("failed to create guest account");
            });
      };
    });
