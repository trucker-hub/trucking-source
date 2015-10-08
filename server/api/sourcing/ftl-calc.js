/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');

exports.calc = function(load, company) {
  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;

  var rates = company.ftl.rateDef.byZipCode.rates;
  var matchEntry =_.find(rates, {zipCode:zipCode});

  if(matchEntry) {
    console.log("found a matching entry for zipCode " + zipCode + "=" + matchEntry.rate);
  }else {
    return {
      totalCost: -1,
      costItems: []
    };
  }

  var index;

  result.push({charge: matchEntry.rate, description: "Basis rate"});

  var fuelSurcharge = (matchEntry.rate * company.ftl.fuelSurcharge *0.01);
  var fuelSurchargePercentage = company.ftl.fuelSurcharge;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%"});

  if(matchEntry.dropOffCharge >0.001) {
    result.push({charge:matchEntry.dropOffCharge , description: "Drop Off Charge"});
  }


  if(load.shipTo.locationType == "Business without Dock/Fork" || load.shipFrom.locationType == "Business without Dock/Fork") {
    result.push({charge:matchEntry.liftGateCharge , description: "Lift Gate Charge"});
  }

  if(load.shipTo.locationType == 'Residential' || load.shipFrom.locationType == 'Residential') {
    result.push({charge:company.ftl.residentialCharge , description: "Residential Charge"});
  }

  result.push({charge:company.ftl.pierPassFee , description: "Pier Pass Fee"});
  result.push({charge:company.ftl.cleaningTruckFee , description: "Cleaning Truck Fee"});
  result.push({charge:company.ftl.congestionFee , description: "Congestion Fee"});

  //overweight charge
  var totalWeight = load.lines.reduce( function(total, line) {
    return total + line.weight;
  },0);

  console.log("total weight=" + totalWeight);
  var totalWeightCharge =0;

  for(index=0; index < company.ftl.overWeightCharges.length; ++index) {
    var OverWeightCharge = company.ftl.overWeightCharges[index];
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
