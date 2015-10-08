/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');
var weightCalculator = require('./util-calc');

var populateServiceCharges = function(result, services, freight, suffix) {
  var index;

  for(index=0; index < services.length; ++index) {
    var service = services[index].service;
    var charge = null;
    if(service=='Inside') {
      charge= freight.insideCharge;
    }else if(service=='LifeGate') {
      charge= freight.liftGateCharge;
    }else if(service=='TradeShow') {
      charge= freight.tradeShowCharge;
    }else if(service=='Residential') {
      charge= freight.residentialCharge;
    }else if(service=='OffHours') {
      charge= matchZone.dropOffChargeOffhour;
    }else if(service=='Holidays') {
      charge= matchZone.dropOffChargeHoliday;
    }else if (service=="Weekends") {
      charge= matchZone.dropOffChargeWeekend;
    }

    if(charge) {
      result.push({charge:charge , description: service + suffix});
    }
  }
};



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


var zoneRatesCost = function(freight, load, matchEntry) {
  var result = [];
  var matchZone = _.find(freight.rateDef.byZone.zoneRateVariables.zones, {label:matchEntry.zone});
  if(matchZone) {
    console.log("found a matching zone for zip code " + JSON.stringify(matchZone));
  }else {
    return {
      totalCost: -1,
      costItems: []
    };
  }
  result.push({charge:matchZone.dropOffCharge , description: "DropOff Charge"});

  var weight = weightCalculator.weight(load.lines);
  console.log("load weight is " + weight);

  //base rate
  var baseRate =0;
  var rateRow = findZoneRate (freight.rateDef.byZone.flatRates, weight, matchEntry.zone);
  if(rateRow) {
    baseRate = rateRow.rate
    result.push({charge: baseRate, description: "Basis rate for Zone " + matchEntry.zone});
  }else {
    rateRow = findZoneRate (freight.rateDef.byZone.weightRates, weight, matchEntry.zone);
    if(rateRow) {
      baseRate = (rateRow.rate * weight)/(freight.rateDef.byZone.zoneRateVariables.weightIncrement);
      result.push({charge: baseRate, description: "Basis rate for Zone " + matchEntry.zone});
    }else {
      result.push({charge: 0, description: "Basis rate Not Found!"});
    }
  }
  var fuelSurcharge = (baseRate * freight.fuelSurcharge *0.01);
  var fuelSurchargePercentage = freight.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%"});

  return result;
};

var cityRatesCost = function() {

};

var zipCodeRatesCost = function() {

};

exports.calc = function(load, company) {
  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;
  var freight = load.loadType=='LTL'?company.ltl:company.air;


  var rates;
  if(freight.rateBasis=='zone') {
    rates = freight.rateDef.byZone.rates;
  }else if(freight.rateBasis=='city') {
    rates = freight.rateDef.byCity.rates;
  }else {
    rates = freight.rateDef.byZipCode.rates;
  }

  var matchEntry =_.find(rates, {zipCode:zipCode});

  if(matchEntry) {
    console.log("found a matching entry for zipCode " + zipCode + "=" + matchEntry.zone);
  }else {
    return {
      totalCost: -1,
      costItems: []
    };
  }

  if(freight.rateBasis=='zone') {
    result = result.concat(zoneRatesCost(freight, load, matchEntry));
  }else if(freight.rateBasis=='city') {
    result = result.concat(cityRatesCost());
  }else {
    result = result.concat(zipCodeRatesCost());
  }

  //service charges and drop off charges
  populateServiceCharges(result, load.shipTo.services, freight, " Delivery");
  populateServiceCharges(result, load.shipFrom.services, freight," Pickup");

  var totalCost = result.reduce(function(total, item) {return total + item.charge;}, 0);

  return {
    totalCost: totalCost,
    costItems: result
  };
};
