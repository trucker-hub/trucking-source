'use strict';

var _ = require('lodash');
var Ups = require('./ups.model');
var upsAPI = require('shipping-ups');

var ups = new upsAPI({
  environment: 'sandbox', // sandbox or live
  currency: 'USD',
  username: 'jinbo.chen',
  password: 'Dmkr1234%',
  access_key: 'DCFE113E3A254DF5',
  imperial: true // set to false for metric
});

exports.time = function(req, res) {
  var data = req.body;
  console.log("about calling UPS API");
  ups.time_in_transit(data, function(err, time) {
    console.error(err);
    if(err) { return handleError(time, err); }
    res.json(time);
  });
};

exports.rates = function(req, res) {
  var data = req.body;
  ups.freight_rate(data, function(err, rates) {
    console.error(err);
    if(err) { return handleError(res, err); }
    res.json(rates);
  });
};

// Get list of upss
exports.index = function(req, res) {
  Ups.find(function (err, upss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(upss);
  });
};

// Get a single ups
exports.show = function(req, res) {
  Ups.findById(req.params.id, function (err, ups) {
    if(err) { return handleError(res, err); }
    if(!ups) { return res.status(404).send('Not Found'); }
    return res.json(ups);
  });
};

// Creates a new ups in the DB.
exports.create = function(req, res) {
  Ups.create(req.body, function(err, ups) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(ups);
  });
};

// Updates an existing ups in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Ups.findById(req.params.id, function (err, ups) {
    if (err) { return handleError(res, err); }
    if(!ups) { return res.status(404).send('Not Found'); }
    var updated = _.merge(ups, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(ups);
    });
  });
};

// Deletes a ups from the DB.
exports.destroy = function(req, res) {
  Ups.findById(req.params.id, function (err, ups) {
    if(err) { return handleError(res, err); }
    if(!ups) { return res.status(404).send('Not Found'); }
    ups.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}