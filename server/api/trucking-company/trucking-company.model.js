'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TruckingCompanySchema = new Schema({
  name: String,
  favorite: Boolean,
  location: String,
  contact: String,
  active: Boolean,
  ftl: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    liftGateCharge: Number,
    regions:[{
      state : String,
      county: String,
      rateByCity : Boolean
    }],
    OverWeightCharges: [
      {
        containerSize: String,
        weightFrom: Number,
        weightTo: Number,
        charge: Number
      }
    ],

    rates: [
      {
        state: String,
        city: String,
        zipCode: String,
        rate: Number,
        dropOffCharge: Number
      }
    ]
  }
});

module.exports = mongoose.model('TruckingCompany', TruckingCompanySchema);
