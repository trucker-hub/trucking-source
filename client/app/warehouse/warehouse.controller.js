'use strict';

angular.module('servicesApp')
  .controller('WarehouseCtrl', function ($rootScope, $scope, $filter, ngTableParams, $http) {

        $rootScope.warehousesOpened = $rootScope.warehousesOpened || {};
        $rootScope.allWarehouses = $rootScope.allWarehouses || [];
        $scope.alerts = [];

        $scope.edit = function(id) {
            console.log("edit a warehouse whose id is " + id);

            var detail = $rootScope.warehousesOpened[id];
            if(detail) {
                detail.active = true;
                return;
            }

            var index;
            for (index =0; index < $rootScope.allWarehouses.length; ++index) {
                var warehouse = $rootScope.allWarehouses[index];
                if(warehouse._id == id) {
                    $rootScope.warehousesOpened[id] = {data:warehouse, active:true};
                    return;
                }
            }
        };

        $scope.cancel = function(warehouse) {
            console.log("cancel warehouse info " + warehouse._id);
            $scope.closeTab(warehouse._id);
        };



        $scope.closeTab = function(id) {
            delete $rootScope.warehousesOpened[id];
        };


        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.delete = function(warehouse) {
            $http.delete('/api/warehouses/' + warehouse._id).then(
                function(response) {
                    $scope.closeTab(warehouse._id);
                    var index;
                    for (index =0; index < $rootScope.allWarehouses.length; ++index) {
                        var x = $rootScope.allWarehouses[index];
                        if(x._id == warehouse._id) {
                            $rootScope.allWarehouses.splice(index,1);
                            break;
                        }
                    }
                    $scope.tableParams.reload();
                    $scope.alerts.push({ type: 'success', msg: 'The warehouse was just deleted succesfully!' });
                },
                function(response) {
                    $scope.alerts.push({ type: 'warning', msg: 'Failed to delete the warehouse!' });
                }
            );

        };


        $scope.newOne = {

        };

        $scope.add = function() {
            $http.post("/api/warehouses", $scope.newOne).then(
                function(response) {
                    console.log(JSON.stringify(response.data));
                    $rootScope.allWarehouses.push(response.data);
                    $scope.tableParams.reload();
                    edit(response.data._id);
                    $scope.alerts.push({ type: 'success', msg: 'A new warehouse was just added succesfully!' });

                },
                function(response) {
                    console.log("ran into error " + response);
                    $scope.alerts.push({ type: 'danger', msg: 'Failed to create the new warehouse!' });
                });
        };

        $scope.save = function(warehouse, callback) {
            $http.put("/api/warehouses", warehouse).then(
                function(response) {
                    console.log(JSON.stringify(response.data));
                    callback();
                },
                function(response) {
                    console.log("ran into error " + response);
                    $scope.alerts.push({ type: 'danger', msg: 'Failed to create the new warehouse!' });
                });
        };

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            filter: {
                name: ''       // initial filter
            }
        }, {
            total: $rootScope.allWarehouses.length, // length of data
            counts: [], // hide page counts control
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ? $filter('filter')($rootScope.allWarehouses, params.filter()) : $rootScope.allWarehouses;

                var xxx = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(xxx);
            }
        });


        $scope.load = function() {

            console.log("fetch warehouses from the db");
            $http.get("/api/warehouses").then(
                function(response) {
                    console.log(JSON.stringify(response.data));
                    $rootScope.allWarehouses = response.data;
                    $scope.tableParams.reload();
                },
                function(response) {
                    console.log("ran into error " + response);
                });
        };

        if(!$rootScope.allCompanies) {
            $scope.load();
        }
  });
