'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var byCitySubSchema = {
    rates: [{
        state: String,
        city: String,
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
        state: String,
        city: String,
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
    residentialCharge: Number,
    pierPassFee: Number,
    cleaningTruckFee: Number,
    congestionFee: Number,
    regions: [{
      state: String,
      county: String
    }],
    overWeightCharges: [{
      containerSize: String,
      ranges: [{
        limit: Number,
        charge: Number
      }]
    }], rateBasis: {
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
    additionalCharges: [{
      name: String,
      charge: Number
    }],
    regions: [{
      state: String,
      county: String,
      rateByCity: Boolean
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
  air: {
    fuelSurcharge: Number,
    residentialCharge: Number,
    liftGateCharge: Number,
    insideCharge: Number,
    tradeShowCharge: Number,
    additionalCharges: [{
      name: String,
      charge: Number
    }],
    regions: [{
      state: String,
      county: String,
      rateByCity: Boolean
    }],
      rateBasis: {
          type: String, required: true,
          enum: ['city', 'zipCode', 'zone'],
          default: 'zipCode'
      },
      rateDef: {
          byCity: byCitySubSchema, byZipCode: byZipCodeSubSchema, byZone: byZoneSubSchema
      }
  }
});

module.exports = mongoose.model('TruckingCompany', TruckingCompanySchema);
