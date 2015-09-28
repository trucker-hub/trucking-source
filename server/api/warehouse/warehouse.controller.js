'use strict';

var _ = require('lodash');
var Warehouse = require('./warehouse.model');

// Get list of warehouses
exports.index = function(req, res) {
  Warehouse.find(function (err, warehouses) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(warehouses);
  });
};

// Get a single warehouse
exports.show = function(req, res) {
  Warehouse.findById(req.params.id, function (err, warehouse) {
    if(err) { return handleError(res, err); }
    if(!warehouse) { return res.status(404).send('Not Found'); }
    return res.json(warehouse);
  });
};

// Creates a new warehouse in the DB.
exports.create = function(req, res) {
  Warehouse.create(req.body, function(err, warehouse) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(warehouse);
  });
};

// Updates an existing warehouse in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Warehouse.findById(req.params.id, function (err, warehouse) {
    if (err) { return handleError(res, err); }
    if(!warehouse) { return res.status(404).send('Not Found'); }
    var updated = _.merge(warehouse, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(warehouse);
    });
  });
};

// Deletes a warehouse from the DB.
exports.destroy = function(req, res) {
  Warehouse.findById(req.params.id, function (err, warehouse) {
    if(err) { return handleError(res, err); }
    if(!warehouse) { return res.status(404).send('Not Found'); }
    warehouse.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}