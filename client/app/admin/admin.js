'use strict';

angular.module('servicesApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin', {
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminCtrl'
            })
            .when('/update/:id', {
                templateUrl: 'app/admin/update/update.html',
                controller: 'UpdateCtrl'
            });
    });
