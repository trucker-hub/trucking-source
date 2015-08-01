'use strict';

var _ = require('lodash');
var Sourcing = require('./sourcing.model');

// Get list of sourcings
exports.index = function(req, res) {
  Sourcing.find(function (err, sourcings) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(sourcings);
  });
};

// Get a single sourcing
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