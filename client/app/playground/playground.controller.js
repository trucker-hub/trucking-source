'use strict';

angular.module('servicesApp')
  .controller('PlaygroundCtrl', function ($scope) {
    $scope.message = 'Hello';


    $scope.editZones = function() {

      $scope.zoneStrings = $scope.ltl.zoneRateVariables.zones.map(function(item) {
        return item.label;
      }).join(",");
      $scope.editingZones = true;
    }

    var updateZoneRates = function(zoneRates, zones) {
      var i,j;
      for(j=0; j < zoneRates.length; ++j) {
        var tier = zoneRates[j];
        var newRates = [];
        for(i=0; i < zones.length; ++i) {
          var zone = zones[i];
          var existing = tier.rates.filter(function(item) {
            if(item.zone ==zone) {
              return item;
            }
          });
          if(existing.length==1) {
            newRates.push(existing[0]);
          }else {
            newRates.push({zone:zone, rate:-1});
          }
        }
        tier.rates = newRates;
      }
    }


    $scope.saveZones = function() {
      $scope.editingZones = false;
      var zones = $scope.zoneStrings.split(',').filter(function(item) {
        if(item.trim()) {
          return item;
        }
      });
      var newZones = [];
      //sync zones in zoneRateVariables
      var i;
      for(i=0; i < zones.length; ++i) {
        var zone = zones[i];
        var existing = $scope.ltl.zoneRateVariables.zones.filter(function(item) {
          if(item.label==zone) {
            return item;
          }
        });
        if(existing.length==1) {
          newZones.push(existing[0]);
        }else {
          newZones.push({label:zone,
            dropOffCharge: 10,
            dropOffChargeOffhour: 20,
            dropOffChargeWeekend: 30,
            dropOffChargeHoliday: 40 });
        }
      }
      $scope.ltl.zoneRateVariables.zones = newZones;

      updateZoneRates($scope.ltl.flatRates, zones);
      updateZoneRates($scope.ltl.weightRates, zones);

    };

    $scope.ltl = {
      fuelSurcharge: 0.2,
      residentialCharge: 60,
      liftGateCharge: 30,
      additionalCharges: [{
        name: "Call before delivery",
        charge: 10
      }],

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

  });
