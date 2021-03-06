'use strict';

var _ = require('lodash');
var Sourcing = require('./sourcing.model');
var TruckingCompany = require('../trucking-company/trucking-company.model');
var ftlCalculator = require('./ftl-calc');
var freightCalculator = require('./freight-calc');

var calcCosts = function(load, company) {
  if(load.loadType=='FTL') {
    return ftlCalculator.quote(load, company);
  }else {
    return freightCalculator.quote(load, company);
  }
};


// Get list of sourcings
exports.index = function(req, res) {

  var startTime = Date.now();
  console.log("calling index api with req = " + req);

  var load = req.body;
  var shipTo = load.shipTo;
  console.log("Ship to = " + JSON.stringify(shipTo));
  var countyTo = shipTo.location.county;
  var stateTo = shipTo.location.state;


  var options = {};
    if(load.loadType=="FTL") {
        options = { "ftl.regions": { "$elemMatch": { state: stateTo, county: countyTo}}};
    }else if (load.loadType=="LTL") {
        options = { "ltl.regions": { "$elemMatch": { state: stateTo, county: countyTo}}};
    }else if (load.loadType=="AIR") {
        options = { "air.regions": { "$elemMatch": { state: stateTo, county: countyTo}}};
    }

  console.log("request companies serving region=" + countyTo + "," + stateTo + " loadType=" + load.loadType);
  console.log("query options " + JSON.stringify(options));
  TruckingCompany.find(options, function(err, companies) {

    if(err) {
      console.log("run into error " + err);
      return handleError(res, err);
    }
    console.log("Found " + companies.length + " companies serving this region");
    var x;
    var sources = companies.map(function(company) {
      var cost = calcCosts(load, company);
      return {
        name: company.name,
        totalCost: cost.totalCost,
        costItems:cost.costItems,
        additionalCharges: cost.additionalCharges,
        time:2,
        contact: company.phone,
        location: company.location,
        id: company._id};
    }).sort(function(a, b) {
      if(a.totalCost > b.totalCost) return 1;
      if(a.totalCost < b.totalCost) return -1;
      return 0;
    });

    var time = Date.now() - startTime;
    console.log("The sourcing step took about " + time  + " milliseconds with " + sources.length + " companies");
    var cleaned = sources.filter(function(source) {
      return source.totalCost > 0;
    });
    console.log("The sourcing step removed the companies with negative cost, the list now is " + sources.length);

    cleaned.time = time;
    return res.status(200).json(cleaned);
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
