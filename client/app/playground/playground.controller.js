'use strict';

angular.module('servicesApp')
    .controller('PlaygroundCtrl', function ($scope, $http) {

      $scope.services = [
        {service:"TradeShow"} , {service: "Inside"}
      ];
      $scope.newFlatTier = {
        tier: "",
        previous: "",
        ranges: [0, 1000]
      };

      $scope.newWeightTier = {
        tier: "",
        previous: "",
        ranges: [0, 1000]
      };
      $scope.flatTiers = [{
        tier: "1",
        previous: "1",
        ranges: [0, 1000]
      }, {
        tier: "2",
        previous: "2",
        ranges: [1000, 2000]
      }];

      $scope.weightTiers = [{
        tier: "3",
        previous: "3",
        ranges: [0, 1000]
      }, {
        tier: "4",
        previous: "4",
        ranges: [1000, 2000]
      }];

      $scope.ltl= {
        fuelSurcharge: 0.2,
            residentialCharge: 60,
            liftGateCharge: 30,
            additionalCharges: [{ name: "Call before delivery",  charge: 10 }],
            regions: [ { state: "CA", county: "Los Angeles County" }],
            zoneRateVariables: {
              weightIncrement: 100,
              zones: [
            {
              label:"A",
              dropOffCharge: 10,
              dropOffChargeOffhour: 20,
              dropOffChargeWeekend: 30,
              dropOffChargeHoliday: 40
            }, {
              label:"B",
              dropOffCharge: 10,
              dropOffChargeOffhour: 20,
              dropOffChargeWeekend: 30,
              dropOffChargeHoliday: 40
            }, {
              label:"C",
              dropOffCharge: 10,
              dropOffChargeOffhour: 20,
              dropOffChargeWeekend: 30,
              dropOffChargeHoliday: 40
            }, {
              label:"D",
              dropOffCharge: 10,
              dropOffChargeOffhour: 20,
              dropOffChargeWeekend: 30,
              dropOffChargeHoliday: 40
            }, {
              label:"E",
              dropOffCharge: 10,
              dropOffChargeOffhour: 20,
              dropOffChargeWeekend: 30,
              dropOffChargeHoliday: 40
            }]
        },
        flatRates: [
          {
            tier:"1",
            ranges: [0,1000],
            rates:[
              {zone: "A", rate:55},
              {zone: "B", rate:33},
              {zone: "C", rate:23},
              {zone: "D", rate:89},
              {zone: "E", rate:20}
            ]},
          {
            tier: "2",
            ranges: [1000, 2000],
            rates:[
              {zone: "A", rate:55},
              {zone: "B", rate:33},
              {zone: "C", rate:23},
              {zone: "D", rate:89},
              {zone: "E", rate:20}
            ]}
        ],
        weightRates: [
          {
            tier:"3",
            ranges: [3000,4000],
            rates:[
              {zone: "A", rate:5.5},
              {zone: "B", rate:3.3},
              {zone: "C", rate:2.3},
              {zone: "D", rate:8.9},
              {zone: "E", rate:2.0}
            ]},
          {
            tier: "4",
            ranges: [4000, 5000],
            rates:[
              {zone: "A", rate:55},
              {zone: "B", rate:33},
              {zone: "C", rate:23},
              {zone: "D", rate:89},
              {zone: "E", rate:20}
            ]},
          {
            tier: "5",
            ranges: [5000, 6000],
            rates:[
              {zone: "A", rate:55},
              {zone: "B", rate:33},
              {zone: "C", rate:23},
              {zone: "D", rate:89},
              {zone: "E", rate:20}
            ]}
        ]
      };

      $scope.removeFlatTier = function(index) {
        $scope.flatTiers.splice(index,1);
      };

      $scope.removeWeightTier = function(index) {
        $scope.weightTiers.splice(index,1);
      };

      $scope.addFlatTier = function() {
        var newOne = JSON.parse(JSON.stringify($scope.newFlatTier));
        $scope.flatTiers.push(newOne);
        $scope.newFlatTier.tier = "";
      };

      $scope.addWeightTier = function() {
        var newOne = JSON.parse(JSON.stringify($scope.newWeightTier));
        $scope.weightTiers.push(newOne);
        $scope.newWeightTier.tier = "";
      };

      var updateTierRates = function(newTiers, tierRates) {
        var i, newTierRates = [];
        for(i=0; i < newTiers.length; ++i) {
          var tier = newTiers[i];
          var existing = tierRates.filter(function(item) {
            if(tier.previous== item.tier ) {
              return item;
            }
          });
          if(existing.length==1) {
            existing[0].ranges = tier.ranges;
            existing[0].tier = tier.tier;
            newTierRates.push(existing[0]);
          }else {
            newTierRates.push({
              tier: tier.tier,
              ranges: tier.ranges,
              rates: []
            });
          }
        }
        return newTierRates;
      };

    //loadType:  { type: String, default: 'FTL'},
//createdAt: { type: Date, required: true, default: Date.now },
//expectedBy: Date,
//  notes: String,
//  shipTo: {
//  location: {
//    full_address:     String,
//      state:      {type: String, required: true},
//    county:     {type: String, required: true},
//    city:       {type: String, required: true},
//    zipCode:    {type: String, required: true}
//  },
    $scope.testEmail = function() {
      $scope.sending = true;
      var req = {
        email: "jinbo.chen@gmail.com",
        load: {
          "who": "Dspeed", "source": "5606387fe7d3f6da4d34b2e2", "totalAmount": 184,
          loadType:"FTL",
          shipTo: {
            location: {
              state: "CA",
              zipCode: "90301"
            }
          },
          shipFrom: {
            location: {
              state: "CA",
              zipCode: "90503"
            }
          },
          fulfilledBy: {
            charge: 900,
            name: "Dspeed",
            "costItems": [
              {"charge": 15, "description": "Inside Delivery", "adjustment": 0},
              {"charge": 30, "description": "LifeGate Delivery", "adjustment": 0},
              {"charge": 15, "description": "Inside Pickup", "adjustment": 0},
              {"charge": 30, "description": "LifeGate Pickup", "adjustment": 0},
              {"charge": 10, "description": "DropOff Charge", "adjustment": 0},
              {"charge": 70, "description": "Basis rate for Zone C", "adjustment": 0},
              {"charge": 14, "description": "Fuel Surcharge 20%", "adjustment": 0}]
          },
          brokerFees: [
            {name: "ABI-Customs Fee", charge: 15},
            {name: "Chassy Fee", charge: 15},
            {name: "Service Fee", charge: 50}
          ]
        }
      };

      $http.post('/api/emails/invoice', req).then(
        function(response) {
          console.log(JSON.stringify(response.data));
          $scope.sending = false;
        },
        function(response) {
          console.log('ran into error ' + response);
          $scope.sending = false;
        });

    };

    $scope.print = function() {

    }

      $scope.ok = function () {


        var newFlatTierRates =    updateTierRates($scope.flatTiers, $scope.ltl.flatRates);
        var newWeightTierRates =  updateTierRates($scope.weightTiers, $scope.ltl.weightRates);
        console.log("updated = " + JSON.stringify(newFlatTierRates));
        console.log("updated = " + JSON.stringify(newWeightTierRates));
      };

      $scope.cancel = function () {

      };
    });
