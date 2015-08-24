'use strict';

angular.module('servicesApp')
    .controller('UpdateCtrl', function ($scope, $location, $routeParams, User, Auth) {
        $scope.errors = {};

        $scope.userId = $routeParams.id;
        $scope.userName = $routeParams.userName;
        $scope.userRole = $routeParams.userRole;
        $scope.userEmail = $routeParams.userEmail;


        $scope.updateUser = function (form) {
            $scope.submitted = true;
            if (form.$valid) {
                Auth.updateUser($scope.userName, $scope.userRole, $scope.userEmail, $scope.userId)
                    .then(function () {
                        $scope.message = 'User Info successfully changed.';
                        if(Auth.getCurrentUser()._id == $scope.userId) {
                            console.log("update via $apply() " + Auth.getCurrentUser._id + ", " + $scope.userId);
                            $scope.$apply();
                        };
                        $location.path( "/admin" );
                    })
                    .catch(function () {
                        $scope.errors.other = 'Failed to update User Info';
                        $scope.message = '';
                    });
            }
        };

        $scope.cancelWithoutSaving = function() {
            $location.path( "/admin" );
        }
    });
