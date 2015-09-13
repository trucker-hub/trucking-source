'use strict';

angular.module('servicesApp')
  .controller('PlaygroundCtrl', function ($scope) {
    $scope.message = 'Hello';


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
