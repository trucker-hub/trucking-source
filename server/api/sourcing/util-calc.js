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
