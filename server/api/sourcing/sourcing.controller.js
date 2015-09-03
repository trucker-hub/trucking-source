'use strict';

var _ = require('lodash');
var Sourcing = require('./sourcing.model');
var TruckingCompany = require('../trucking-company/trucking-company.model');


var calculateRate = function(load, company) {

  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;

  var rates = company.ftl.rates;
  var matchEntry;
  var index;
  for(index=0; index < rates.length; ++index) {
    var entry = rates[index];
    if(entry.city == city && entry.zipCode == zipCode) {
      matchEntry = entry;
      break;
    }
  }

  result.push({charge: matchEntry.rate, description: "Basis rate"});

  var fuelSurcharge = (matchEntry.rate * company.ftl.fuelSurcharge);
  var fuelSurchargePercentage = company.ftl.fuelSurcharge *100;
  result.push({charge: fuelSurcharge, description: "Fuel Surcharge " + fuelSurchargePercentage + "%"});

  if(matchEntry.dropOffCharge >0.001) {
    result.push({charge:matchEntry.dropOffCharge , description: "Drop Off Charge"});
  }


  if(load.shipTo.locationType == "Business without Dock/Fork" || load.shipFrom.locationType == "Business without Dock/Fork") {
    result.push({charge:matchEntry.liftGateCharge , description: "Lift Gate Charge"});
  }

  if(load.shipTo.locationType == 'Residential' || load.shipFrom.locationType == 'Residential') {
    result.push({charge:matchEntry.residentialCharge , description: "Residential Charge"});
  }

  //overweight charge
  var totalWeight =0;
  for(index =0; index < load.lines.length; ++ index) {
    var line = load.lines[index];
    totalWeight += line.weight;
  }
  console.log("total weight=" + totalWeight);

  var totalWeightCharge =0;
  for(index=0; index < company.ftl.OverWeightCharges.length; ++index) {
    var OverWeightCharge = company.ftl.OverWeightCharges[index];
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
  return result;
}

// Get list of sourcings
exports.index = function(req, res) {

  //console.log("calling index api with req = " + req);

  var load = req.body;

  //console.log("to location is " + JSON.stringify(request.shipTo));

  var shipTo = load.shipTo;

  //map zip code to a county or region
  //scope.info.city = addressComponents[1].short_name;
  //scope.info.county = addressComponents[2].short_name;
  //scope.info.state = addressComponents[3].short_name;


  var countyTo = shipTo.location.county;


  TruckingCompany.find({"ftl.regions.county": { $in: [countyTo]}}, function(err, companies) {

    if(err) {
      console.log("run into error " + err);
      return handleError(res, err);;
    }

    console.log(JSON.stringify(companies));

    var x;
    var sources = [];
    for(x=0; x < companies.length; ++x) {
      var company = companies[x];
      var cost = calculateRate(load, company);
      sources.push({name: company.name, cost:cost, time:2, contact: company.phone, location: company.location, id: company._id});
    }
    return res.status(200).json(sources);
  });
};

// Get sourcing
exports.show = function(req, res) {
  Sourcing.findById(req.params.id, function (err, sourcing) {
    if(err) { return handleError(res, err); }
    if(!sourcing) { return res.status(404).send('Not Found'); }
    return res.json(sourcing);
  });
};

// Creates a new sourcing in the DB.
exports.create = function(req, res) {
  Sourcing.create(req.body, function(err, sourcing) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(sourcing);
  });
};

// Updates an existing sourcing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sourcing.findById(req.params.id, function (err, sourcing) {
    if (err) { return handleError(res, err); }
    if(!sourcing) { return res.status(404).send('Not Found'); }
    var updated = _.merge(sourcing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(sourcing);
    });
  });
};

// Deletes a sourcing from the DB.
exports.destroy = function(req, res) {
  Sourcing.findById(req.params.id, function (err, sourcing) {
    if(err) { return handleError(res, err); }
    if(!sourcing) { return res.status(404).send('Not Found'); }
    sourcing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
