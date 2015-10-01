'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var FtlLoadSchema = new Schema({
  status: {
    type: String, required: true,
    enum: ['OPEN', 'FILLED', 'CONFIRMED', 'CLOSED'],
    default: 'OPEN'},

  payment: {
    type: String, required: true,
    enum: ['OPEN', 'INVOICED', 'PAID'],
    default: 'OPEN'},

  who: String,
  loadType:  { type: String, default: 'FTL'},
  createdAt: { type: Date, required: true, default: Date.now },
  email:String,
  expectedBy: Date,
  notes: String,
  shipTo: {
    location: {
      full_address:     String,
      state:      {type: String, required: true},
      county:     {type: String, required: true},
      city:       {type: String, required: true},
      zipCode:    {type: String, required: true}
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
  },
  shipFrom: {
    location: {
      full_address:     String,
      state:      {type: String, required: true},
      county:     {type: String, required: true},
      city:       {type: String, required: true},
      zipCode:    {type: String, required: true}
    },
    locationType: {
      type: String, required: true,
      enum: [
        'Port',
        'Business with Dock/Fork',
        'Business without Dock/Fork',
        'Convention center or Tradeshow',
        'Residential',
        'Freight Carrier Terminal'
      ],
      default: 'Port'}
  },
  lines: [{
    weight: Number,
    quantity: Number,
    packaging: {
      type: String, required: true,
      enum: [
        "Full container",
        "Pallets (48x40)",
        "Pallets (48x48)",
        "Pallets (60x48)",
        "Bags",
        "Bales",
        "Cartons",
        "Crates",
        "Boxes",
        "Rolls",
        "Others"
      ],
      default: 'Full container'
    },
    length: Number,
    width: Number,
    height: Number,
    description: String
  }],
  trailer: {
    type: {
      type: String, required: true,
      enum: [
        'Dry Van',
        'Refrigerated',
        'Flatbed',
        'Other'
      ],
      default: 'Dry Van'},
    size: {
      type: String, required: true,
      enum: ["20", "40", "40HQ", "48"],
      default: "40"
    }
  },

  fulfilledBy: {
    source: { type: Schema.Types.ObjectId, ref: 'TruckingCompany' },
    charge: Number,
    name: String,
    costItems: [{
      charge: Number,
      description: String,
      adjustment: {type: Number, default:0}
    }]
  },

  brokerFees: [
    {name: String, charge: Number}
  ],

  invoice: {
    referenceNumber: String
  },

  deliveryOrder: {
    email: String,
    phone: String,
    instructions: String,
    referenceNumber: String
  }


});
module.exports = mongoose.model('FtlLoad', FtlLoadSchema);
