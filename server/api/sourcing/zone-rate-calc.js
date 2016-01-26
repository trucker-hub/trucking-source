var _ = require('lodash');
var weightCalculator = require('./util-calc');

var findZoneRate = function(rateTable, weight, zone) {
  var index;
  for(index=0; index < rateTable.length; ++index) {
    var row = rateTable[index];
    if(row.ranges[0] <= weight && row.ranges[1] >= weight ) {
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
  var rateRow = findZoneRate (tariff.rateDef.byZone.flatRates, weight, matchZone.label);
  if(rateRow) {
    baseRate = Math.max(rateRow.rate, matchZone.minCharge);
    result.push({charge: baseRate, description: "Basis rate for Zone " + matchZone.label + lineName});
    console.log("baseRate is " + baseRate + " min charge " + matchZone.minCharge);
  }else {
    rateRow = findZoneRate (tariff.rateDef.byZone.weightRates, weight, matchZone.label);
    //console.log("rate weight table = " + JSON.stringify(tariff.rateDef.byZone.weightRates));
    if(rateRow) {
      baseRate = (rateRow.rate * weight)/(tariff.rateDef.byZone.zoneRateVariables.weightIncrement);
      baseRate = Math.max(baseRate, matchZone.minCharge);
      result.push({charge: baseRate, description: "Basis rate for Zone " + matchZone.label});
      console.log("baseRate is " + baseRate + " min charge " + matchZone.minCharge);
    }else {
      console.log( "Basis rate Not Found!");
      return null;
    }
  }
  var fuelSurcharge = (baseRate * tariff.fuelSurcharge*0.01);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%" + lineName});

  return result;
};
