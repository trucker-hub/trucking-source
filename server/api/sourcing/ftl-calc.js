/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');
var zoneCostCalculator = require('./zone-rate-calc');
var utilCalculator = require('./util-calc');

var zipCodeCityCosts = function(tariff, matchEntry, lineName) {
  var result = [];
  result.push({charge: matchEntry.rate, description: "Basis rate for " + lineName});
  if(matchEntry.dropOffCharge >0.001) {
    result.push({charge:matchEntry.dropOffCharge , description: "Drop Off Charge for " + lineName});
  }
  var fuelSurcharge = (matchEntry.rate * tariff.fuelSurcharge *0.01);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "% for " + lineName});

  return result;
};

var containerCost = function(line, freight, lineName) {
  var result = [];

  var containerCharges = _.find(freight.sizeCharges, {containerSize:line.packaging});

  if(containerCharges) {
    result.push({charge:containerCharges.pierPassFee ,    description: "Pier Pass Fee for " + lineName});
    result.push({charge:containerCharges.cleanTruckFee ,  description: "Clean Truck Fee for " + lineName});
    result.push({charge:containerCharges.congestionFee ,  description: "Congestion Fee for " + lineName});
    var containerWeightCharge = 0;
    for(var index=0; index < containerCharges.weightRanges.length; ++index) {
      var range = containerCharges.weightRanges[index];
      if(line.weight >= range.limit) {
          containerWeightCharge = range.charge;
      }
    }

    if(containerWeightCharge >0 ) {
      result.push({charge:containerCharges.congestionFee , description: "Container " + containerCharges.containerSize + " extra weight charge for " + lineName});
    }
  }
  return result;

};

exports.calc = function(load, company) {
  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;
  var freight = company.ftl;

  var matchEntry = utilCalculator.matchEntry(freight, city, zipCode);

  if(!matchEntry) {
    return {
      totalCost: -1,
      costItems: []
    };
  }

  console.log("found a matching entry for zipCode=" + zipCode + ", city="+ city + ", rate=" + matchEntry.rate);

  for(var i=0; i < load.lines.length; ++i) {
    var line = load.lines[i];
    var lineName = " line #" + (i+1);
    result = result.concat(containerCost(line, freight, lineName));
    if(freight.rateBasis=='zone') {
      result = result.concat(zoneCostCalculator.calc(freight, load, matchEntry, lineName));
    }else  {
      result = result.concat(zipCodeCityCosts(freight, matchEntry, lineName));
    }
  }

  var totalCost = result.reduce(function(total, item) {return total + item.charge;}, 0);

  return {
    totalCost: totalCost,
    costItems: result
  };
};
