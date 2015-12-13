'use strict';

var _ = require('lodash');
var Counter = require('./counter.model');
var Promise = require('promise');

var getNextId = function (name, callback) {
    Counter.findOneAndUpdate(
        { name: name },
        { $inc:   { counter: 1 } },
        { upsert: true, new:true },
        function (err, idDoc) {
            callback(err, idDoc);
        });
};

var nextIdPromise = function(name) {

  var promise = new Promise(function(resolve, reject) {
    Counter.findOneAndUpdate(
      { name: name },
      { $inc:   { counter: 1 } },
      { upsert: true, new:true },
      function (err, idDoc) {
        if(err) {
          reject(err);
        }
        resolve(idDoc);
      });
  });

  return promise;
};

exports.nextId = getNextId;
exports.nextIdPromise = nextIdPromise;

// Get list of counters
exports.index = function(req, res) {
  Counter.find(function (err, counters) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(counters);
  });
};

// Get a single counter
exports.show = function(req, res) {
  Counter.findById(req.params.id, function (err, counter) {
    if(err) { return handleError(res, err); }
    if(!counter) { return res.status(404).send('Not Found'); }
    return res.json(counter);
  });
};

// Creates a new counter in the DB.
exports.create = function(req, res) {
  Counter.create(req.body, function(err, counter) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(counter);
  });
};

// Updates an existing counter in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  nextIdPromise(req.params.name).then(function(idDoc) {
    return res.status(200).json(idDoc);
  }).catch(function(err) {
    return handleError(res, err);
    console.error(err);
  });
};

// Deletes a counter from the DB.
exports.destroy = function(req, res) {
  Counter.findById(req.params.id, function (err, counter) {
    if(err) { return handleError(res, err); }
    if(!counter) { return res.status(404).send('Not Found'); }
    counter.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
