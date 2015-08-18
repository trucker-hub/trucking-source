'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, './data/regions.json');

var database = {};

function _initializeDatabase(callback) {

  if (!database.data) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      database.data = JSON.parse(data);
      console.log("read into data " + JSON.stringify(database.data));
      callback();
    });
  } else {
    callback();
  }
}

exports.getRegions = function(req, res) {

  console.log("calling regions");

  _initializeDatabase(function() {
    return res.status(201).json(database.data);
  });
}



function handleError(res, err) {
  return res.status(500).send(err);
}