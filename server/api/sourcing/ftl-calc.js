/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');
var zoneCostCalculator = require('./zone-rate-calc');
var utilCalculator = require('./util-calc');


var populateAdditionalCharges = function(result, company, type, matchRate, suffix) {
  result.push.apply(result, utilCalculator.getAdditionalCharges(type, company));
  result.push.apply(result, utilCalculator.getDropOffCharges(matchRate, suffix));
};

var zipCodeCityCosts = function(freight, matchEntry, lineName) {
  var result = [];
  result.push({charge: matchEntry.rate, description: "Basis rate for " + lineName});

  var fuelSurcharge = (matchEntry.rate * freight.fuelSurcharge *0.01);
  var fuelSurchargePercentage = freight.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "% for " + lineName});

  return result;
};


var addContainerCost = function(line, freight, lineName, baseCharges, additionalCharges) {

  var containerCharges = _.find(freight.sizeCharges, {containerSize:line.packaging});

  if(containerCharges) {
    additionalCharges.push({charge:containerCharges.pierPassFee ,    description: "Pier Pass Fee for " + lineName});
    additionalCharges.push({charge:containerCharges.cleanTruckFee ,  description: "Clean Truck Fee for " + lineName});
    additionalCharges.push({charge:containerCharges.congestionFee ,  description: "Congestion Fee for " + lineName});
    var containerWeightCharge = 0;
    for(var index=0; index < containerCharges.weightRanges.length; ++index) {
      var range = containerCharges.weightRanges[index];
      if(line.weight >= range.limit) {
          containerWeightCharge = range.charge;
      }
    }

    if(containerWeightCharge >0 ) {
      baseCharges.push({charge:containerWeightCharge , description: "Container " + containerCharges.containerSize + " extra weight charge for " + lineName});
    }
  }
};

exports.quote = function(load, company) {
  var baseCharges = [];
  var additionalCharges = [];
  var errorResult = {
    totalCost: -1,
    costItems: [],
    additionalCharges: []
  };

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;
  var freight = company.ftl;

  var matchEntry = utilCalculator.matchEntry(freight, city, zipCode);

  if(!matchEntry) {
    return errorResult;
  }

  if(freight.rateBasis=='zone') {
    var matchZone = zoneCostCalculator.getZoneEntry(freight, matchEntry);
    if(matchZone) {
      populateAdditionalCharges(additionalCharges, company, load.loadType, matchZone, "per container");
    } else {
      return errorResult;
    }
  }else {
    populateAdditionalCharges(additionalCharges, company, load.loadType, matchEntry, "per container");
  }

  console.log("found a matching entry for zipCode=" + zipCode + ", city="+ city + ", rate=" + matchEntry.rate);

  for(var i=0; i < load.lines.length; ++i) {
    var line = load.lines[i];
    var lineName = " line #" + (i+1);
    addContainerCost(line, freight, lineName, baseCharges, additionalCharges);
    if(freight.rateBasis=='zone') {
      baseCharges = baseCharges.concat(zoneCostCalculator.computeZoneBasedCost(freight, load, matchEntry, lineName));
    }else  {
      baseCharges = baseCharges.concat(zipCodeCityCosts(freight, matchEntry, lineName));
    }
  }

  var totalCost = baseCharges.reduce(function(total, item) {return total + item.charge;}, 0);

  return {
    totalCost: totalCost,
    costItems: baseCharges,
    additionalCharges: additionalCharges
  };
};
