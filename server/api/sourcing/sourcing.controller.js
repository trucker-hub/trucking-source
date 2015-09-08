'use strict';

var _ = require('lodash');
var Sourcing = require('./sourcing.model');
var TruckingCompany = require('../trucking-company/trucking-company.model');


var calculateRate = function(load, company) {

  var result = [];

  var zipCode = load.shipTo.location.zipCode;
  var city = load.shipTo.location.city;

  var rates = company.ftl.rates;
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
  var totalWeight = load.lines.reduce( function(total, line) {
    return total + line.weight;
  },0);

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

  var totalCost = result.reduce(function(total, item) {return total + item.charge;}, 0);

  return {
    totalCost: totalCost,
    costItems: result
  };
}

// Get list of sourcings
exports.index = function(req, res) {

  console.log("calling index api with req = " + req);

  var load = req.body;
  var shipTo = load.shipTo;
  var countyTo = shipTo.location.county;


  console.log("request companies serving region=" + countyTo);
  TruckingCompany.find({"ftl.regions.county": { $in: [countyTo]}}, function(err, companies) {

    if(err) {
      console.log("run into error " + err);
      return handleError(res, err);;
    }
    console.log("found " + companies.length + " companies serving this region");
    var x;
    var sources = companies.map(function(company) {
      var cost = calculateRate(load, company);
      return {name: company.name,
        totalCost: cost.totalCost, costItems:cost.costItems,
        time:2, contact: company.phone, location: company.location, id: company._id};
    }).sort(function(a, b) {
      if(a.totalCost > b.totalCost) return 1;
      if(a.totalCost < b.totalCost) return -1;
      return 0;
    });
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
