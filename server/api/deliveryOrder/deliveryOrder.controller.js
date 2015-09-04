'use strict';

var _ = require('lodash');
var DeliveryOrder = require('./deliveryOrder.model');

// Get list of deliveryOrders
exports.index = function(req, res) {
  DeliveryOrder.find(function (err, deliveryOrders) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(deliveryOrders);
  });
};

// Get a single deliveryOrder
exports.show = function(req, res) {
  DeliveryOrder.findById(req.params.id, function (err, deliveryOrder) {
    if(err) { return handleError(res, err); }
    if(!deliveryOrder) { return res.status(404).send('Not Found'); }
    return res.json(deliveryOrder);
  });
};

// Creates a new deliveryOrder in the DB.
exports.create = function(req, res) {
  DeliveryOrder.create(req.body, function(err, deliveryOrder) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(deliveryOrder);
  });
};

// Updates an existing deliveryOrder in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DeliveryOrder.findById(req.params.id, function (err, deliveryOrder) {
    if (err) { return handleError(res, err); }
    if(!deliveryOrder) { return res.status(404).send('Not Found'); }
    var updated = _.merge(deliveryOrder, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(deliveryOrder);
    });
  });
};

// Deletes a deliveryOrder from the DB.
exports.destroy = function(req, res) {
  DeliveryOrder.findById(req.params.id, function (err, deliveryOrder) {
    if(err) { return handleError(res, err); }
    if(!deliveryOrder) { return res.status(404).send('Not Found'); }
    deliveryOrder.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}