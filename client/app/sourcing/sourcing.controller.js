'use strict';

angular.module('servicesApp').controller('SourcingCtrl', function ($scope, $http, $modal, ngTableParams, $filter, ngProgressFactory) {

    var selectedCompanies = [];

    var loads = [];

    $scope.queryLoads = function(type, days) {

        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        $http.get('/api/load/ftl-loads?status=' + type + "&days=" + days).then(
            function(response) {
                $scope.updateLoadsTable(response.data);
                $scope.progressbar.complete();
            },
            function(response) {
                console.log('ran into error ' + response);
                $scope.progressbar.stop();
            });
    };

    $scope.select = function(load) {
        if($scope.selectedLoad!=load) {
            $scope.sources =[];
            $scope.selectedLoad = load;
        }
    }

    $scope.updateLoadsTable = function(data) {
        loads = data;
        $scope.tableParamsLoads.reload();
    };


    $scope.selectSource = function(aSource) {
        $scope.selectedSource = aSource;
        if($scope.selectedLoad && aSource) {
            $scope.selectedLoad.fulfilledBy =
            {
                name: aSource.name,
                source: aSource.id,
                charge: aSource.totalCost,
                costItems: aSource.costItems
            }
        }else {
            $scope.selectedLoad.fulfilledBy =
            {
                name: "",
                source: null,
                charge: null,
                costItems: []
            }
        }
    };


    $scope.sourcing = function() {

        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        $http.post("/api/sourcing", $scope.selectedLoad).then(
            function(response) {
                console.log(JSON.stringify(response.data));
                $scope.sources = response.data;
                if($scope.sources.length > 0) {
                    $scope.selectSource($scope.sources[0]);
                }
                //after get the companies' data, we can calculate the prices on the client side.
                $scope.progressbar.complete();
            },
            function(response) {
                //show a alert and empty the table
                console.log("called /api/sourcing but returned res = " + JSON.stringify(response));
                $scope.progressbar.stop();
            })
    };
    $scope.createDO = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'app/delivery-order/do-details/do-details.html',
            controller: 'DoDetailsCtrl',
          size: 'lg',
            resolve: {
                load: function () {
                    return $scope.selectedLoad;
                },
                source: function() {
                  return $scope.selectedSource;
                }
            }
        });

        modalInstance.result.then(
            function (contact) {
              $scope.selectedLoad.deliveryOrderContact = contact;
              $scope.selectedLoad.status = "FILLED";
              $http.put('/api/load/ftl-loads/'+$scope.selectedLoad._id, $scope.selectedLoad).then(

                function(response) {
                  console.log("request saved succesfully " + JSON.stringify(response));
                },
                function(err) {
                  console.log("request saving failed " + err);
                }
              );


            },
            function () {
                console.log('Modal dismissed at: ' + new Date());
            }
        );
    };
    $scope.tableParamsLoads = new ngTableParams({
        page: 1,            // show first page
        count: 20,          // count per page
        filter: {
            who: ''       // initial filter
        }
    }, {
        total: loads.length, // length of data
        counts: [], // hide page counts control
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.filter() ? $filter('filter')(loads, params.filter()) : loads;
            loads = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(loads);
        }
    });


});
