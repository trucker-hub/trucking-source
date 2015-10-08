'use strict';

angular.module('servicesApp')
    .controller('PlaygroundCtrl', function ($scope, $http) {

        $scope.counterName ="counter";
        $scope.counters = [];
        $scope.fetch = function() {
            $http.get('/api/counters').then(
                function(response) {
                    $scope.counters = response.data;
                },
                function(response) {
                    console.log('ran into error ' + JSON.stringify(response));
                });
        };

        $scope.update = function(counter) {
            console.log("update counter =" + JSON.stringify(counter));
            $http.put('/api/counters/' + counter.name, counter).then(
                function(response) {
                    console.log("counter=" + JSON.stringify(response));
                    $scope.fetch();
                },
                function(response) {
                    console.log('ran into error ' + JSON.stringify(response));
                });
        };

        $scope.delete = function(counter) {
            console.log("update counter =" + JSON.stringify(counter));
            $http.delete('/api/counters/' + counter._id).then(
                function(response) {
                    $scope.fetch();
                },
                function(response) {
                    console.log('ran into error ' + JSON.stringify(response));
                });
        };
        $scope.add = function() {
            var x = {
                name: $scope.counterName,
                counter: 0
            };

            console.log("add a new counter =" + JSON.stringify(x));
            $http.post('/api/counters/', x).then(
                function (response) {
                    $scope.fetch();
                },
                function (response) {
                    console.log('ran into error ' + JSON.stringify(response));
                });
        };

        $scope.fetch();
    });
