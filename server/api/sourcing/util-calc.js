/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');

exports.weight = function(lines) {
  var index, sum=0;
  for(index=0; index < lines.length; ++index) {
    sum += lines[index].weight * lines[index].quantity;
  }
  return sum;
};

//The volumetric divisor has changed to 139 for inches/pounds (5,000 for cm/kg) and applies to
// DHL Express' Same Day, Time Definite and Day Definite services as per the below formula:
//Units of Measure
//CM/KG
//length*width*height/5000
//
//Inches/Pounds
//length*width*height/139

var volumeWeightPerLine = function(line) {
  return (line.height * line.length * line.width) / 139.0;
};

exports.volumeWeight = function(lines) {
  var index, sum=0;
  for(index=0; index < lines.length; ++index) {
    sum += volumeWeightPerLine(lines[index]) * lines[index].quantity;
  }
  return (sum | 0);
};

exports.getAdditionalCharges = function(type, company) {
  var result = [];
  if(type=='FTL') {
    result = company.ftl.additionalCharges;
  }else if(type=='LTL'){
    result = company.ltl.additionalCharges;
  }else if (type=='AIR') {
    result = company.air.additionalCharges;
  }
  return result;
};

exports.getDropOffCharges = function(matchRate, lineName) {

  //if this could be zoneObject, or a direct rateObject

  var result = [];
  if(matchRate.dropOffCharge) {
    result.push({charge:matchRate.dropOffCharge , description: "Drop Off Charge for " + lineName});
  }
  if(matchRate.dropOffChargeOffhour) {
    result.push({charge:matchRate.dropOffChargeOffhour , description: "Off Hour Drop Off Charge for " + lineName});
  }
  if(matchRate.dropOffChargeWeekend) {
    result.push({charge:matchRate.dropOffChargeWeekend , description: "Weekend Drop Off Charge for " + lineName});
  }
  if(matchRate.dropOffChargeHoliday) {
    result.push({charge:matchRate.dropOffChargeHoliday , description: "Holiday Drop Off Charge for " + lineName});
  }
  return result;
};

exports.matchEntry = function(freight, city, zipCode) {
  city = city.toLowerCase();
  var matchEntry;
  if(freight.rateBasis=='zone') {
    matchEntry =_.find(freight.rateDef.byZone.rates, {city:city});
    if(!matchEntry) {
      matchEntry =_.find(freight.rateDef.byZone.rates, {zipCode:zipCode});
    }
  }else if(freight.rateBasis=='city') {
    matchEntry =_.find(freight.rateDef.byCity.rates, {city:city});
  }else {
    matchEntry =_.find(freight.rateDef.byZipCode.rates, {zipCode:zipCode});
  }
  return matchEntry;
};
