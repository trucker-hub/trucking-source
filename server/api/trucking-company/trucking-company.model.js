'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TruckingCompanySchema = new Schema({
  name: String,
  favorite: Boolean,
  location: String,
  phone: String,
  fax: String,
  email:String,
  active: Boolean,
  rateBasis: String,
  ftl: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    regions: [
      {
        state: String,
        county: String
      }
    ],
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
  },
  ltl: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    liftGateCharge: Number,
    regions: [
      {
        state: String,
        county: String,
        rateByCity: Boolean
      }
    ],
    zones: [
      {
        zone: String,
        tiers: [
          {
            rate: Number,
            weightFrom: Number,
            weightTo: Number,
            flat: Boolean,
            weightIncrement: Number
          }
        ]
      }
    ],
    rates: [
      {
        state: String,
        city: String,
        zipCode: String,
        rateZone: String,
        dropOffCharge: Number
      }
    ]
  }
});

module.exports = mongoose.model('TruckingCompany', TruckingCompanySchema);
