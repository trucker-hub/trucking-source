'use strict';

angular.module('servicesApp')
    .controller('DoDetailsCtrl', function ($scope) {

      $scope.load =
      {
        who: "Elite Toner",
        notes: "",
        expectedBy: Date.now(),
        shipTo: {
          location: {
            full_address: "9111 S La Cienega Blvd, #211, Inglewood, CA 90301",
            state:        "CA",
            county:       "Los Angeles County",
            city:         "Inglewood",
            zipCode:      "90301"
          }
        },
        shipFrom: {
          location: {
            full_address: "3476 Del Amo Blvd, Torrance, CA 90503",
            state:        "CA",
            county:       "Los Angeles County",
            city:         "Torrance",
            zipCode:      "90503"
          }
        },

        lines: [{
          weight: 17000,
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
          name: "Aspeed",
          charge: 200,
          source: null
        }

      };

    });
