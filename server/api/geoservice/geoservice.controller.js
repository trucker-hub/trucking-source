'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, './data/sample-zipcodes.json');

var database = {};

function _initializeDatabase(callback) {

  if (!database.data) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      database.data = JSON.parse(data);
      console.log("read into data " + database.data)
      callback();
    });
  }
}

exports.getStates = function(req, res) {

  console.log("calling getStates");

  _initializeDatabase(function() {
    var index, states = [];

    for(index=0; index < database.data.length; ++index) {
      var state = database.data[index];
      states.push(state.code);
    }
    return res.status(201).json(states);
  });
}


exports.getCounties = function(req, res) {


  return res.status(201).json("");
}


exports.getCityZipCodes = function(req, res) {

  return res.status(201).json("");
}



function handleError(res, err) {
  return res.status(500).send(err);
}