'use strict';

var _ = require('lodash');
var TruckingCompany = require('./trucking-company.model');

// Get list of trucking-companys
exports.index = function(req, res) {
  TruckingCompany.find(function (err, truckingCompanys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(truckingCompanys);
  }).select('-ftl -ltl');
};

// Get a single trucking-company
exports.show = function(req, res) {
  TruckingCompany.findById(req.params.id, function (err, truckingCompany) {
    if(err) { return handleError(res, err); }
    if(!truckingCompany) { return res.status(404).send('Not Found'); }
    return res.json(truckingCompany);
  });
};

// Creates a new trucking-company in the DB.
exports.create = function(req, res) {
  TruckingCompany.create(req.body, function(err, truckingCompany) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(truckingCompany);
  });
};

// Updates an existing trucking-company in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  TruckingCompany.findById(req.params.id, function (err, truckingCompany) {
    if (err) { return handleError(res, err); }
    if(!truckingCompany) { return res.status(404).send('Not Found'); }
    var updated = _.merge(truckingCompany, req.body.company);
    console.log("merged version "+ updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(truckingCompany);
    });
  });
};

// Deletes a trucking-company from the DB.
exports.destroy = function(req, res) {
  TruckingCompany.findById(req.params.id, function (err, truckingCompany) {
    if(err) { return handleError(res, err); }
    if(!trucking-company) { return res.status(404).send('Not Found'); }
    trucking-company.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
