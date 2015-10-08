/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');
var zoneCostCalculator = require('./zone-rate-calc');

var zipCodeCityCosts = function(tariff, matchEntry) {
  var result = [];
  result.push({charge: matchEntry.rate, description: "Basis rate"});
  if(matchEntry.dropOffCharge >0.001) {
    result.push({charge:matchEntry.dropOffCharge , description: "Drop Off Charge"});
  }
  var fuelSurcharge = (matchEntry.rate * tariff.fuelSurcharge *0.01);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%"});

  return result;
};

exports.calc = function(load, company) {
  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;
  var freight = company.ftl;

  var rates;
  if(freight.rateBasis=='zone') {
    rates = freight.rateDef.byZone.rates;
  }else if(freight.rateBasis=='city') {
    rates = freight.rateDef.byCity.rates;
  }else {
    rates = freight.rateDef.byZipCode.rates;
  }

  var matchEntry =(freight.rateBasis=='city')?_.find(rates, {city:city}):_.find(rates, {zipCode:zipCode});

  if(matchEntry) {
    console.log("found a matching entry for zipCode " + zipCode + "=" + matchEntry.rate);
  }else {
    return {
      totalCost: -1,
      costItems: []
    };
  }

  if(freight.rateBasis=='zone') {
    result = result.concat(zoneCostCalculator.calc(freight, load, matchEntry));
  }else  {
    result = result.concat(zipCodeCityCosts(freight, matchEntry));
  }

  if(load.shipTo.locationType == 'Residential' || load.shipFrom.locationType == 'Residential') {
    result.push({charge:freight.residentialCharge , description: "Residential Charge"});
  }

  result.push({charge:freight.pierPassFee , description: "Pier Pass Fee"});
  result.push({charge:freight.cleaningTruckFee , description: "Cleaning Truck Fee"});
  result.push({charge:freight.congestionFee , description: "Congestion Fee"});

  //overweight charge
  var totalWeight = load.lines.reduce( function(total, line) {
    return total + line.weight;
  },0);

  console.log("total weight=" + totalWeight);
  var totalWeightCharge =0;

  var index;
  for(index=0; index < freight.overWeightCharges.length; ++index) {
    var OverWeightCharge = freight.overWeightCharges[index];
    if(OverWeightCharge.containerSize == load.trailer.size) {
      var j;
      for(j=0; j < OverWeightCharge.ranges.length; ++j) {
        var range = OverWeightCharge.ranges[j];
        if(totalWeight >= range.limit) {
          totalWeightCharge = range.charge;
        }
      }
      break;
    }
  }

  if(totalWeightCharge> 0.001) {
    result.push({charge:totalWeightCharge , description: "Overweight Charge " + totalWeight + "lbs"});
  }

  var totalCost = result.reduce(function(total, item) {return total + item.charge;}, 0);

  return {
    totalCost: totalCost,
    costItems: result
  };
};
