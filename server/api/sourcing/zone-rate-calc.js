var _ = require('lodash');
var weightCalculator = require('./util-calc');



var getWeightTier = function(rateTable, weight) {
  return _.find(rateTable, function(row) {
    return row.ranges[0] <= weight && row.ranges[1] > weight;
  })
};
var getTierRate = function(tier, zone, weight, weightIncrement) {
  var rowRate = _.find(tier.rates, {zone:zone});
  return (rowRate==null)? null: (rowRate.rate * weight)/weightIncrement;
};

var findZoneWeightRate = function(rateTable, weight, weightIncrement, zone) {

  var result = {rate: null, weight: weight, useNextTier: false};
  var tier = getWeightTier(rateTable, weight);
  if(tier) {

    var currentTierRate = getTierRate(tier, zone, weight, weightIncrement);
    if(currentTierRate) {
      result.rate = currentTierRate;
    }

    var nextTier = getWeightTier(rateTable, tier.ranges[1]);
    var nextTierRate = getTierRate(nextTier, zone, tier.ranges[1], weightIncrement);
    if(nextTierRate && nextTierRate < currentTierRate) {
      result = {rate: nextTierRate, weight: tier.ranges[1], useNextTier: true}
    }
  }
  return result;
};


var findZoneFlatRate = function(rateTable, weight, zone) {
  var index;
  var row;
  for(index=0; index < rateTable.length; ++index) {
    row = rateTable[index];
    if(row.ranges[0] <= weight && row.ranges[1] > weight ) {
      return _.find(row.rates, {zone:zone});
    }
  }
  return null;
};

var getZoneEntry = function(tariff, matchEntry) {
  var matchZone = _.find(tariff.rateDef.byZone.zoneRateVariables.zones, {label:matchEntry.zone});
  if(matchZone) {
    console.log("found a matching zone for zip code " + JSON.stringify(matchZone));
    return matchZone;
  }else {
    console.log("did not find a matching zone for zip code ");
    return null;
  }
};

exports.getZoneEntry = getZoneEntry;

exports.computeZoneBasedCost = function(tariff, load, matchZone, lineName) {

  var result = [];

  console.log("match Zone " + JSON.stringify(matchZone));
  lineName = (lineName)?(" for " + lineName):'';

  var weight = weightCalculator.weight(load.lines);
  console.log("load weight is " + weight);

  //base rate
  var baseRate =0;
  var rateRow = findZoneFlatRate (tariff.rateDef.byZone.flatRates, weight, matchZone.label);
  if(rateRow) {
    baseRate = Math.max(rateRow.rate, matchZone.minCharge);
    result.push({charge: baseRate, description: "Basis rate for Zone " + matchZone.label + lineName});
    console.log("baseRate is " + baseRate + " min charge " + matchZone.minCharge);
  }else {
    baseRate = findZoneWeightRate (tariff.rateDef.byZone.weightRates, weight,
        tariff.rateDef.byZone.zoneRateVariables.weightIncrement, matchZone.label);
    //console.log("rate weight table = " + JSON.stringify(tariff.rateDef.byZone.weightRates));
    if(baseRate) {
      if(baseRate.rate < matchZone.minCharge) {
        result.push({charge: matchZone.minCharge, description: "Basis rate for Zone using the minimum charge for zone:" + matchZone.label});
      }else {
        if(baseRate.useNextTier) {
          result.push({charge: baseRate.rate, description: "Basis rate for Zone:" + matchZone.label + " using next tier weight: " + baseRate.weight + " for a better rate"});
        }else {
          result.push({charge: baseRate.rate, description: "Basis rate for Zone " + matchZone.label + " weight: " + baseRate.weight});
        }
      }
      console.log("baseRate is " + JSON.stringify(baseRate) + " min charge " + matchZone.minCharge);
    }else {
      console.log( "Basis rate Not Found!");
      return null;
    }
  }
  var fuelSurcharge = (baseRate.rate * tariff.fuelSurcharge*0.01);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%" + lineName});

  return result;
};
