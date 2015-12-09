'use strict';

angular.module('servicesApp')
    .controller('CustomerSettingsCtrl', function ($scope, User, $http, $filter, ngTableParams, customerSettingService) {

        // Use the User $resource to fetch all users
        $scope.users = User.query(function() {
            $scope.updateTable();
        });

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 25,          // count per page
            filter: {
                name: ''       // initial filter
            }
        }, {
            total: $scope.users.length, // length of data
            //counts: [], // hide page counts control
            getData: function($defer, params) {
                // use build-in angular filter
                var userData = params.filter() ? $filter('filter')($scope.users, params.filter()) : $scope.users;

                var xxx = userData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(userData.length); // set total for recalc pagination
                $defer.resolve(xxx);
            }
        });


        $scope.updateTable = function() {
            console.log("Display users " + $scope.users.length + " in the table");
            $scope.tableParams.reload();
        };


        $scope.editCustomerSettings = function(user) {
            customerSettingService.openCustomerSettingsDialog(user,
                function() {
                    console.log("clicked on OK");

                },
                function() {
                    console.log("clicked on Cancel");
                }
            );
        }

    });
