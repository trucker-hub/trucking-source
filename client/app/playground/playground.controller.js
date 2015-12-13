'use strict';

angular.module('servicesApp')
  .controller('PlaygroundCtrl', function ($scope, $http, $q) {

    $scope.load = {
      who: "Beverly Furniture",
      email: "jinbo.chen@gmail.com",
      loadType: 'FTL',
      status: 'FILLED',
      payment: 'OPEN',
      createdAt: Date.now(),
      expectedBy: Date.now(),
      shipTo: {
        location: {
          full_address: "3476 Del Amo Blvd, Torrance, CA 90503",
          state: "CA",
          county: "Los Angeles County",
          city: "Torrance",
          zipCode: "90503"
        }
      },
      shipFrom: {
        location: {
          full_address: "9111 S La Cienega Blvd, #211, Inglewood, CA 90301",
          state: "CA",
          county: "Los Angeles County",
          city: "Inglewood",
          zipCode: "90301"
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
            adjustment: 10
          },
          {
            charge: 30,
            description: "Service 2",
            adjustment: 10
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
    $scope.counterName = "counter";
    $scope.counters = [];
    $scope.fetch = function () {
      $http.get('/api/counters').then(
        function (response) {
          $scope.counters = response.data;
        },
        function (response) {
          console.log('ran into error ' + JSON.stringify(response));
        });
    };

    $scope.update = function (counter) {
      console.log("update counter =" + JSON.stringify(counter));
      $http.put('/api/counters/' + counter.name, counter).then(
        function (response) {
          console.log("counter=" + JSON.stringify(response));
          $scope.fetch();
        },
        function (response) {
          console.log('ran into error ' + JSON.stringify(response));
        });
    };

    $scope.delete = function (counter) {
      console.log("update counter =" + JSON.stringify(counter));
      $http.delete('/api/counters/' + counter._id).then(
        function (response) {
          $scope.fetch();
        },
        function (response) {
          console.log('ran into error ' + JSON.stringify(response));
        });
    };
    $scope.add = function () {
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

    $scope.transitTime = function () {
      var data = {
        from: {
          city: 'Dover',
          state_code: 'OH',
          postal_code: '44622',
          country_code: 'US'
        },
        to: {
          city: 'Charlotte',
          state_code: 'NC',
          postal_code: '28205',
          country_code: 'US'
        },
        weight: 100, // set imperial to false for KGS
        pickup_date: '20151130',
        total_packages: 1, // number of packages in shipment
        value: 999 // Invoice value, set currency in options
      };
      $http.post('/api/ups/services/time', data).then(
        function (response) {
          console.log(JSON.stringify(response));
        },
        function (response) {
          console.log('ran into error ' + JSON.stringify(response));
        });

    };

    $scope.transitTimePromise = function () {
      var data = {
        from: {
          city: 'Dover',
          state_code: 'OH',
          postal_code: '44622',
          country_code: 'US'
        },
        to: {
          city: 'Charlotte',
          state_code: 'NC',
          postal_code: '28205',
          country_code: 'US'
        },
        weight: 100, // set imperial to false for KGS
        pickup_date: '20151130',
        total_packages: 1, // number of packages in shipment
        value: 999 // Invoice value, set currency in options
      };

      return $http.post('/api/ups/services/timeX', data);
    };


    $scope.rates = function () {
      var data = {
        ship_from: {
          name: 'Test My Company',
          address: {
            address_line_1: '1234 Test Name Rd',
            city: 'Charlotte',
            state_code: 'NC',
            postal_code: '28262',
            country_code: 'US'
          }
        },
        ship_to: {
          name: 'John Doe',
          address: {
            address_line_1: '4567 Another Road Ct',
            city: 'Dover',
            state_code: 'OH',
            postal_code: '44622',
            country_code: 'US'
          }
        },
        payer: {
          name: 'Ron Rosef',
          address: {
            address_line_1: '867 Five Three Oh Nine',
            city: 'Charlotte',
            state_code: 'NC',
            postal_code: '28262',
            country_code: 'US'
          },
          shipper_number: 'ABC123'
        },
        billing_option: '10',
        service_code: '308',
        handling_unit_one: {
          quantity: '20',
          code: 'PLT'
        },
        commodity: {
          description: 'A huge bag of something',
          weight: '750',
          number_of_pieces: '45',
          packaging_type: 'BAG',
          freight_class: '60'
        }
      };
      $http.post('/api/ups/services/rates', data).then(
        function (response) {
          console.log(JSON.stringify(response));
        },
        function (response) {
          console.log('ran into error ' + JSON.stringify(response));
        });
    };

    $scope.fetch();

    var anotherPromise = function(data) {
      console.log("test another promise");
      var deferred = $q.defer();
      if(data) {
        deferred.resolve(data.data);
      }else {
        deferred.reject("empty response");
      }
      return deferred.promise;
    };

    var logData = function(data) {
      console.log("logged data", JSON.stringify(data));
    };
    var catchError = function(data) {
      console.error("error happened", JSON.stringify(data));
    };

    $scope.promiseTest = function() {
      $scope.transitTimePromise().then(anotherPromise).then(logData).catch(catchError);
    }

  });
