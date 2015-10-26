'use strict';

angular.module('servicesApp')
    .controller('PlaygroundCtrl', function ($scope, $http) {


        $scope.createInvoice = function(selectedLoad) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/sourcing/invoice/invoice.html',
                controller: 'InvoiceCtrl',
                size: 'lg',
                resolve: {
                    load: function () {
                        return $scope.load;
                    }
                }
            });
            modalInstance.result.then(
                function () {
                },
                function () {
                    console.log('Modal dismissed at: ' + new Date());
                }
            );
        };


        $scope.createDO = function(selectedLoad) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/tracking/do-details/do-details.html',
                controller: 'DoDetailsCtrl',
                size: 'lg',
                resolve: {
                    load: function () {
                        return $scope.load;
                    }
                }
            });
            modalInstance.result.then(
                function () {
                    console.log("load updated");
                },
                function () {
                    console.log('Modal dismissed at: ' + new Date());
                }
            );
        };

        $scope.load = {
            who: "Beverly Furniture",
            email: "jinbo.chen@gmail.com",
            loadType:  'FTL',
            status: 'FILLED',
            payment: 'OPEN',
            createdAt: Date.now(),
            expectedBy: Date.now(),
            shipTo: {
                location: {
                    full_address: "3476 Del Amo Blvd, Torrance, CA 90503",
                    state:        "CA",
                    county:       "Los Angeles County",
                    city:          "Torrance",
                    zipCode:       "90503"
                }
            },
            shipFrom: {
                location: {
                    full_address:     "9111 S La Cienega Blvd, #211, Inglewood, CA 90301",
                    state:      "CA",
                    county:     "Los Angeles County",
                    city:       "Inglewood",
                    zipCode:    "90301"
                }
            },

            lines: [{
                weight: 10000,
                quantity: 1,
                packaging: "Full container",
                length: 20,
                width: 20,
                height: 20,
                description: "Metals"
            }],
            trailer: {
                type: 'Dry Van',
                size: "40"
            },
            fulfilledBy: {
                source: "10101010101010",
                charge: 500,
                name: "Aspeed",
                costItems: [
                    {
                    charge: 20,
                    description: "Service 1",
                    adjustment: {type: 10}
                    },
                    {
                        charge: 30,
                        description: "Service 2",
                        adjustment: {type: 10}
                    }
                ],
                additionalCharges: [{
                    name: "Additional Service 1",
                    charge: 100
                }]
            },

            brokerFees: [
                {name: "ABI Fee", charge: 20}
            ],

            invoice: {
                referenceNumber: "1"
            },

            deliveryOrder: {
                email: "jinbo.chen@gmail.com",
                phone: "3102275185",
                instructions: "Call 3102275185 before delivery"
            },

            activityLog: [
                {time: Date.now(), activity: "Load request created"},
                {time: Date.now(), activity: "Load request sourced"},
                {time: Date.now(), activity: "Load request was finalized"},
                {time: Date.now(), activity: "Load D/O was sent to Aspeed"},
                {time: Date.now(), activity: "Load Invoice was sent to consignee"}
            ]

        };
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
