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


exports.calc = function(tariff, load, matchEntry, lineName) {

  console.log("match entry " + JSON.stringify(matchEntry));
  lineName = (lineName)?(" for " + lineName):'';

  var result = [];
  var matchZone = _.find(tariff.rateDef.byZone.zoneRateVariables.zones, {label:matchEntry.zone});
  if(matchZone) {
    console.log("found a matching zone for zip code " + JSON.stringify(matchZone));
  }else {
    console.log("did find a matching zone for zip code ");
    return {
      totalCost: -1,
      costItems: []
    };
  }
  result.push({charge:matchZone.dropOffCharge , description: "DropOff Charge" + lineName});

  var weight = weightCalculator.weight(load.lines);
  console.log("load weight is " + weight);

  //base rate
  var baseRate =0;
  var rateRow = findZoneRate (tariff.rateDef.byZone.flatRates, weight, matchEntry.zone);
  if(rateRow) {
    baseRate = Math.max(rateRow.rate, matchZone.minCharge);
    result.push({charge: baseRate, description: "Basis rate for Zone " + matchEntry.zone + lineName});
    console.log("baseRate is " + baseRate + " min charge " + matchZone.minCharge);
  }else {
    rateRow = findZoneRate (tariff.rateDef.byZone.weightRates, weight, matchEntry.zone);
    //console.log("rate weight table = " + JSON.stringify(tariff.rateDef.byZone.weightRates));
    if(rateRow) {
      baseRate = (rateRow.rate * weight)/(tariff.rateDef.byZone.zoneRateVariables.weightIncrement);
      baseRate = Math.max(baseRate, matchZone.minCharge);
      result.push({charge: baseRate, description: "Basis rate for Zone " + matchEntry.zone});
      console.log("baseRate is " + baseRate + " min charge " + matchZone.minCharge);
    }else {
      console.log( "Basis rate Not Found!");
      return {
        totalCost: -1,
        costItems: []
      };
    }
  }
  var fuelSurcharge = (baseRate * tariff.fuelSurcharge*0.01);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%" + lineName});

  return result;
};
