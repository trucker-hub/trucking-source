'use strict';

var _ = require('lodash');
var Ltl = require('./ltl.model.js');

// Get list of ltls
exports.index = function(req, res) {

  var options = {}
  if(req.query.status) {
    options.status = req.query.status;
  }

  if(req.query.days) {
    var time = new Date();
    time.setDate(time.getDate() - req.query.days);
    options.createdAt = {$gt: time};
  }

  Ltl.find(options).sort({expectedBy:1}).exec( function (err, ltlLoads) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(ltlLoads);
  });
};

// Get a single ltl
exports.show = function(req, res) {
  Ltl.findById(req.params.id, function (err, ltl) {
    if(err) { return handleError(res, err); }
    if(!ltl) { return res.status(404).send('Not Found'); }
    return res.json(ltl);
  });
};

// Creates a new ltl in the DB.
exports.create = function(req, res) {
  console.log("req + " + JSON.stringify(req.body));
  Ltl.create(req.body, function(err, ltl) {
    if(err) {
      return handleError(res, err);
    }
    return res.status(201).json(ltl);
  });
};

// Updates an existing ltl in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Ltl.findById(req.params.id, function (err, ltl) {
    if (err) { return handleError(res, err); }
    if(!ltl) { return res.status(404).send('Not Found'); }
    var updated = _.extend(ltl, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(ltl);
    });
  });
};

// Deletes a ltl from the DB.
exports.destroy = function(req, res) {
  Ltl.findById(req.params.id, function (err, ltl) {
    if(err) { return handleError(res, err); }
    if(!ltl) { return res.status(404).send('Not Found'); }
    ltl.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
