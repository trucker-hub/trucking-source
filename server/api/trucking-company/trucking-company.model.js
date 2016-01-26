'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var byCitySubSchema = {
  rates: [{
    state: {type: String, lowercase: true},
    city: {type:String, lowercase: true},
    rate: Number,
    dropOffCharge: Number,
    dropOffChargeOffhour: Number,
    dropOffChargeWeekend: Number,
    dropOffChargeHoliday: Number
  }]
};

var byZipCodeSubSchema = {
  rates: [{
    state: String,
    zipCode: String,
    rate: Number,
    dropOffCharge: Number,
    dropOffChargeOffhour: Number,
    dropOffChargeWeekend: Number,
    dropOffChargeHoliday: Number
  }]
};

var byZoneSubSchema = {
  zoneRateVariables: {
    weightIncrement: Number,
    zones: [{
      label: String,
      minCharge:Number,
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
  }],
  rates: [ {
    state: {type: String, lowercase: true},
    city: {type:String, lowercase: true},
    zipCode: String,
    zone: String
  }]
};

var TruckingCompanySchema = new Schema({
  name: String,
  favorite: Boolean,
  location: String,
  phone: String,
  fax: String,
  email:String,
  active: Boolean,
  ftl: {
    fuelSurcharge: Number,
    additionalCharges: [{
      description: String,
      charge: Number
    }],
    regions: [{
      state: {type:String},
      county: {type:String}
    }],
    sizeCharges: [{
      containerSize: {
        type: String, required: true,
        enum: ['20', '40', '45'],
        default: '20'
      },
      weightRanges: [{
        limit: Number,
        charge: Number
      }],
      pierPassFee: Number,
      cleanTruckFee: Number,
      congestionFee: Number
    }],
    rateBasis: {
      type: String, required: true,
      enum: ['city', 'zipCode', 'zone'],
      default: 'zipCode'
    },
    rateDef: {
      byCity: byCitySubSchema, byZipCode: byZipCodeSubSchema, byZone: byZoneSubSchema
    }
  },
  ltl: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    liftGateCharge: Number,
    insideCharge: Number,
    tradeShowCharge: Number,
    upstairsCharge: Number,
    additionalCharges: [{
      description: String,
      charge: Number
    }],
    regions: [{
      state: {type:String},
      county: {type:String},
      rateByCity: Boolean
    }],
    rateBasis: {
      type: String, required: true,
      enum: ['city', 'zipCode', 'zone'],
      default: 'zone'
    },
    rateDef: {
      byCity: byCitySubSchema, byZipCode: byZipCodeSubSchema, byZone: byZoneSubSchema
    }
  },
  air: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    liftGateCharge: Number,
    insideCharge: Number,
    tradeShowCharge: Number,
    upstairsCharge: Number,
    additionalCharges: [{
      description: String,
      charge: Number
    }],
    regions: [{
      state: {type:String},
      county: {type:String},
      rateByCity: Boolean
    }],
    rateBasis: {
      type: String, required: true,
      enum: ['city', 'zipCode', 'zone'],
      default: 'zone'
    },
    rateDef: {
      byCity: byCitySubSchema, byZipCode: byZipCodeSubSchema, byZone: byZoneSubSchema
    }
  }
});

module.exports = mongoose.model('TruckingCompany', TruckingCompanySchema);
