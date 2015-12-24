'use strict';

var _ = require('lodash');
var TruckingCompany = require('./trucking-company.model');
var async = require('async');
var path = require('path');
var fs = require("fs");
var Promise = require('promise');

var archiveCompanyPromise = function(company) {

  var promise = new Promise(function(resolve, reject) {
    var name = company.name;
    name = name.replace(/\s+/g, '-').toLowerCase();

    var fileName = name + ".json";
    var archiveDir = path.join(__dirname, 'archives', fileName);

    fs.writeFile(archiveDir,
        JSON.stringify(company, function (key, value) {
          if (key == '_id') { return undefined; }
          return value;
        }, 2),
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(fileName);
          }
        });
  });
  return promise;
};

var importCompanyPromise = function(file) {

  var promise = new Promise(function(resolve, reject) {

    console.log("import company based on file=" + file);
    var archiveDir = path.join(__dirname, 'archives', file);

    fs.readFile(archiveDir, function(err, data) {
      if(err) { reject(err); }

      var obj = JSON.parse(data);
      TruckingCompany.create(obj, function(err, truckingCompany) {
        if(err) { return reject(err); }
        resolve(truckingCompany);
      });
    });
  });

  return promise;
};

exports.archiveList = function(req, res) {
  var archiveDir = path.join(__dirname, 'archives');
  fs.readdir(archiveDir, function(err, files) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(files);
  });
};


exports.archive = function(req, res) {

  TruckingCompany.find(function (err, truckingCompanys) {
    if(err) { return handleError(res, err); }
    var tasks = [];
    for(var i=0; i<truckingCompanys.length; ++i) {
      tasks.push(archiveCompanyPromise(truckingCompanys[i]));
    }
    Promise.all(tasks).then(function() {
      return res.status(200).json("{'status':'OK'}");
    }).catch(function(errors) {
      return handleError(res, errors);
    });
  });
};

exports.archiveOne = function(req, res) {

  TruckingCompany.findById(req.params.id, function (err, truckingCompany) {
    if(err) { return handleError(res, err); }
    if(!truckingCompany) { return res.status(404).send('Not Found'); }
    archiveCompanyPromise(truckingCompany).then(function() {
      return res.json(truckingCompany);
    }).catch(function(error) {
      return handleError(res, error);
    });
  });
};

exports.extractAll = function(req, res) {
  var archivesDir = path.join(__dirname, 'archives');
  fs.readdir(archivesDir, function(err, files) {
    if(err) {
      if(err) { return handleError(res, err); }
    }
    var tasks = [];
    for( var i=0; i < files.length; ++i) {
      tasks.push(importCompanyPromise(files[i]));
    }
    Promise.all(tasks).then(function() {
      return res.status(200).json("{'status':'OK'}");
    }).catch(function(err) {
      return handleError(res, err);
    });
  });
};

exports.extractOne = function(req, res) {
  console.log("file name" + req.params.name);
  var archivePath = path.join(__dirname, 'archives', req.params.name);
  fs.stat(archivePath, function (err, stats) {
    if (err || !stats.isFile()) {
      return handleError(res, err);
    }
    importCompanyPromise(req.params.name).then(function() {
      return res.status(200).json("{'status':'OK'}");
    }).catch(function(err) {
      return handleError(res, err);
    });
  });
};


// Get list of trucking-companys
exports.index = function(req, res) {
  TruckingCompany.find(function (err, truckingCompanys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(truckingCompanys);
  });
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

    //console.log("merged version "+ JSON.stringify(updated));
    truckingCompany.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(truckingCompany);
    });
  });
};

// Deletes a trucking-company from the DB.
exports.destroy = function(req, res) {
  TruckingCompany.findById(req.params.id, function (err, truckingCompany) {
    if(err) { return handleError(res, err); }
    if(!truckingCompany) { return res.status(404).send('Not Found'); }
    truckingCompany.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
