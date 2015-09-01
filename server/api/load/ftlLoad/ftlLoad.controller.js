'use strict';

var _ = require('lodash');
var FtlLoad = require('./ftlLoad.model.js');

// Get list of ftlLoads
exports.index = function(req, res) {
  FtlLoad.find(function (err, ftlLoads) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(ftlLoads);
  });
};

exports.constants = function(req, res) {

  var constants = {
    toLocationTypes: FtlLoad.schema.path('shipTo.locationType').enumValues,
    fromLocationTypes: FtlLoad.schema.path('shipFrom.locationType').enumValues,
    packagings: FtlLoad.schema.path('lines').schema.path('packaging').enumValues,
    trailerTypes: FtlLoad.schema.path('trailer.type').enumValues
  }
  return res.status(200).json(constants);

};

// Get a single emptyFtlLoad
exports.show = function(req, res) {
  FtlLoad.findById(req.params.id, function (err, ftlLoad) {
    if(err) { return handleError(res, err); }
    if(!ftlLoad) { return res.status(404).send('Not Found'); }
    return res.json(ftlLoad);
  });
};

// Creates a new emptyFtlLoad in the DB.
exports.create = function(req, res) {
  FtlLoad.create(req.body, function(err, ftlLoad) {
    if(err) {
      console.log("error " + err);
      return handleError(res, err);
    }
    return res.status(201).json(ftlLoad);
  });
};

// Updates an existing emptyFtlLoad in the DB.
exports.update = function(req, res) {
  if(req.body.load._id) { delete req.body.load._id; }
  FtlLoad.findById(req.params.id, function (err, ftlLoad) {
    if (err) { return handleError(res, err); }
    if(!ftlLoad) { return res.status(404).send('Not Found'); }
    var updated = _.extend(ftlLoad, req.body.load);
    console.log("merged document is " + JSON.stringify(updated));
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(ftlLoad);
    });
  });
};

// Deletes a emptyFtlLoad from the DB.
exports.destroy = function(req, res) {
  FtlLoad.findById(req.params.id, function (err, ftlLoad) {
    if(err) { return handleError(res, err); }
    if(!ftlLoad) { return res.status(404).send('Not Found'); }
    ftlLoad.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
