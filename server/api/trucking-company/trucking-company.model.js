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
    regions: [{
      state: String,
      county: String
    }],
    OverWeightCharges: [{
      containerSize: String,
      ranges: [{
        limit: Number,
        charge: Number
      }]
    }],
    rates: [{
      state: String,
      city: String,
      zipCode: String,
      rate: Number,
      dropOffCharge: Number,
      dropOffChargeOffhour: Number,
      dropOffChargeWeekend: Number,
      dropOffChargeHoliday: Number
    }]
  },
  ltl: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    liftGateCharge: Number,
    additionalCharges: [{
      name: String,
      charge: Number
    }],
    regions: [{
      state: String,
      county: String,
      rateByCity: Boolean
    }],
    zoneRateVariables: {
      weightIncrement: Number,
      zones: [{
        label: String,
        dropOffCharge: Number,
        dropOffChargeOffhour: Number,
        dropOffChargeWeekend: Number,
        dropOffChargeHoliday: Number
      }]
    },
    flatRates: [{
      tier: String,
      ranges: [Number],
      rates:[
        {zone: String, rate:Number}
      ]
    }],
    weightRates: [{
      tier: String,
      ranges: [Number],
      rates: [{zone: String, rate: Number}]
    }]
  }
});

module.exports = mongoose.model('TruckingCompany', TruckingCompanySchema);
