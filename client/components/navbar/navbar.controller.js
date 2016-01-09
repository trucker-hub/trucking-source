'use strict';

angular.module('servicesApp')
    .controller('NavbarCtrl', function ($scope, $location, $rootScope, Auth) {

        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isLoggedInAsync = Auth.isLoggedInAsync;
        $scope.isAdmin = Auth.isAdmin;
        $scope.isOperator = Auth.isOperator;
        $scope.isCarrier = Auth.isCarrier;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $rootScope.$on('login', function() {
            console.log("user logged");
            $scope.isLoggedInAsync(function() {
                $scope.setVisibilityBasedOnRole();
            });
        });

        $scope.setVisibilityBasedOnRole = function() {
            console.log('logged in ' + $scope.isLoggedIn());
            console.log('operator = ' + $scope.isOperator());
            console.log('admin = ' + $scope.isAdmin());

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
            $scope.setVisibilityBasedOnRole();
            $location.path('/login');
        };

        $scope.isActive = function (route) {
            return route === $location.path();
        };
        Auth.isLoggedInAsync(function(loggedIn) {
            $scope.setVisibilityBasedOnRole();
        });
    });
