/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');
var utilCalculator = require('./util-calc');
var zoneCostCalculator = require('./zone-rate-calc');


var populateAdditionalCharges = function(result, company, type, matchRate, suffix) {
  result.push.apply(result, utilCalculator.getAdditionalCharges(type, company));
  result.push.apply(result, utilCalculator.getDropOffCharges(matchRate, suffix));
};

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
    }else if(service=='OffHours' && matchZone.dropOffChargeOffhour) {
      charge= matchZone.dropOffChargeOffhour;
    }else if(service=='Holidays' && matchZone.dropOffChargeHoliday) {
      charge= matchZone.dropOffChargeHoliday;
    }else if (service=="Weekends" && matchZone.dropOffChargeWeekend) {
      charge= matchZone.dropOffChargeWeekend;
    }
    if(charge) {
      result.push({charge:charge , description: service + suffix});
    }
  }
};

var zipCodeCityCosts = function(tariff, matchEntry, baseCharges, additionalCharges) {
  var result = [];
  baseCharges.push({charge: matchEntry.rate, description: "Basis rate"});
  if(matchEntry.dropOffCharge >0.001) {
    additionalCharges.push({charge:matchEntry.dropOffCharge , description: "Drop Off Charge"});
  }
  var fuelSurcharge = (matchEntry.rate * tariff.fuelSurcharge);
  var fuelSurchargePercentage = tariff.fuelSurcharge;
  baseCharges.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%"});

  return result;
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
  var freight = load.loadType=='LTL'?company.ltl:company.air;

  var matchEntry = utilCalculator.matchEntry(freight, city, zipCode);

  if(matchEntry) {
    console.log("1.0 found a matching entry for " + city + " " + zipCode + "=" + matchEntry.zone);
    console.log("1.1 company rate basis is *" + freight.rateBasis + "* for company:" + company.name);
  }else {
    console.log("1.0, did not a matching entry for " + city + " " + zipCode);
    console.log("1.0, No zone cost can be calculated, so skip this company " + company.name);
    return errorResult;
  }

  if(freight.rateBasis=='zone') {
    console.log("2.0, the cost will be computed via zone based from: " + company.name);
    var matchZone = zoneCostCalculator.getZoneEntry(freight, matchEntry);
    if(matchZone) {
      var zoneCost = zoneCostCalculator.computeZoneBasedCost(freight, load, matchZone);
      if(!zoneCost) {
        console.log("2.1, No zone cost can be calculated, so skip this company " + company.name);
        return errorResult;
      }else {
        baseCharges = baseCharges.concat(zoneCost);
        populateAdditionalCharges(additionalCharges, company, load.loadType, matchZone, "shipment");
        console.log("3.2, added additional charges from company: " + company.name);
      }
    } else {
      console.log("2.1, No zone is matched for matchEntry " + matchEntry.zone);
      console.log("2.1, No zone cost can be calculated, so skip this company " + company.name);
      return errorResult;
    }
  }else {
    var zipCityCost = zipCodeCityCosts(freight, matchEntry, baseCharges, additionalCharges);
    console.log("3.1, used zip code or city to compute the quote  [" + company.name + "]");
    populateAdditionalCharges(additionalCharges, company, load.loadType, matchEntry, "shipment");
    console.log("3.2, added additional charges from company: " + company.name);
  }

  //service charges and drop off charges
  populateServiceCharges(additionalCharges, load.shipTo.services, freight, " Delivery");
  populateServiceCharges(additionalCharges, load.shipFrom.services, freight," Pickup");
  console.log("3.3, added additional pickup/delivery charges from company: " + company.name);

  var totalCost = baseCharges.reduce(function(total, item) {return total + item.charge;}, 0);
  console.log("4, computed quote using this company : " + company.name + " with total cost=" + totalCost);

  return {
    totalCost: totalCost,
    costItems: baseCharges,
    additionalCharges: additionalCharges
  };
};
