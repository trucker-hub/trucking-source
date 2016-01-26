'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var serviceSubSchema = {
    location: {
        full_address:     String,
        state:      {type: String, required: true},
        county:     {type: String, required: true},
        city:       {type: String, required: true},
        zipCode:    {type: String, required: true},
        coordinates: [Number, Number]
    },
    locationType: {
        type: String, required: true,
        enum: [
            'Business with Dock/Fork',
            'Business without Dock/Fork',
            'Convention center or Tradeshow',
            'Residential',
            'Freight Carrier Terminal'
        ],
        default: 'Business with Dock/Fork'}
};

var FtlLoadSchema = new Schema({
  status: { type: String, required: true, enum: ['OPEN', 'FILLED', 'QUICK', 'CONFIRMED', 'CLOSED'], default: 'OPEN'},
  payment: { type: String, required: true, enum: ['OPEN', 'INVOICED', 'PAID'], default: 'OPEN'},
  who: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  loadType:  { type: String, default: 'FTL'},
  createdAt: { type: Date, required: true, default: Date.now },
  email:String,
  expectedBy: Date,
  notes: String,
  shipTo: serviceSubSchema,
  shipFrom: serviceSubSchema,
  lines: [{
    weight: Number,
    quantity: Number,
    packaging: { type: String, required: true, enum: [ "20", "40", "45"], default: '20'},
    description: String
  }],
  trailer: { type: { type: String, required: true, enum: [ 'Dry Van', 'Refrigerated', 'Flatbed', 'Other'], default: 'Dry Van'}},

  fulfilledBy: {
    source: { type: Schema.Types.ObjectId, ref: 'TruckingCompany' },
    charge: Number,
    name: String,
    costItems: [{
      charge: Number,
      description: String,
      adjustment: {type: Number, default:0}
    }],
    additionalCharges: [{
      description: String,
      charge: Number
    }]
  },

  brokerFees: [ {name: String, charge: Number}],

  invoice: { referenceNumber: String },

  deliveryOrder: {
    email: String,
    phone: String,
    instructions: String
  },

  activityLog: [ {time: Date, activity: String} ]

});

FtlLoadSchema.set('versionKey', false);

module.exports = mongoose.model('FtlLoad', FtlLoadSchema);
