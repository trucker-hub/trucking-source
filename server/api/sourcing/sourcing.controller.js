'use strict';

var _ = require('lodash');
var Sourcing = require('./sourcing.model');
var TruckingCompany = require('../trucking-company/trucking-company.model');


// Get list of sourcings
exports.index = function(req, res) {

  //console.log("calling index api with req = " + req);

  var request = req.body;

  //console.log("to location is " + JSON.stringify(request.shipTo));

  var shipTo = request.shipTo;

  //map zip code to a county or region
  //scope.info.city = addressComponents[1].short_name;
  //scope.info.county = addressComponents[2].short_name;
  //scope.info.state = addressComponents[3].short_name;


  var countyTo = shipTo.location.address_components[2].short_name;


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
      sources.push({name: company.name, cost:200, time:2, contact: company.phone, location: company.location, id: company._id});
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
