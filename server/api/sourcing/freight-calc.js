/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');
var utilCalculator = require('./util-calc');
var zoneCostCalculator = require('./zone-rate-calc');

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

var zipCodeCityCosts = function(tariff, matchEntry) {
  var result = [];
  result.push({charge: matchEntry.rate, description: "Basis rate"});
  if(matchEntry.dropOffCharge >0.001) {
    result.push({charge:matchEntry.dropOffCharge , description: "Drop Off Charge"});
  }
  var fuelSurcharge = (matchEntry.rate * tariff.fuelSurcharge);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%"});

  return result;
};

exports.calc = function(load, company) {
  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;
  var freight = load.loadType=='LTL'?company.ltl:company.air;

  var matchEntry = utilCalculator.matchEntry(freight, city, zipCode);

  if(matchEntry) {
    console.log("found a matching entry for zipCode " + zipCode + "=" + matchEntry.zone);
  }else {
    return {
      totalCost: -1,
      costItems: []
    };
  }

  if(freight.rateBasis=='zone') {
    result = result.concat(zoneCostCalculator.calc(freight, load, matchEntry));
  }else {
    result = result.concat(zipCodeCityCosts(freight, matchEntry));
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
