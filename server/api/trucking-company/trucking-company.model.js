'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TruckingCompanySchema = new Schema({
  name: String,
  favorite: Boolean,
  location: String,
  contact: String,
  active: Boolean
});

module.exports = mongoose.model('TruckingCompany', TruckingCompanySchema);
