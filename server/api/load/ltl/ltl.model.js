'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LtlLoadSchema = new Schema({

  status: {
    type: String, required: true,
    enum: ['OPEN', 'FILLED', 'CONFIRMED', 'CLOSED'],
    default: 'OPEN'},

  payment: {
    type: String, required: true,
    enum: ['OPEN', 'INVOICED', 'PAID'],
    default: 'OPEN'},

  who: String,
  loadType:  { type: String, default: 'LTL'},
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
      zipCode:    {type: String, required: true},
        warehouse:  { type: Schema.Types.ObjectId, ref: 'Warehouse' }
    },
    services: [{service: {
      type: String,
      enum: [
        'Inside',
        'LifeGate',
        'TradeShow',
        'Residential',
        'OffHours',
        'Weekends',
        'Holidays'
      ]}}]
  },
  shipFrom: {
    location: {
      full_address:     String,
      state:      {type: String, required: true},
      county:     {type: String, required: true},
      city:       {type: String, required: true},
      zipCode:    {type: String, required: true},
      warehouse:  { type: Schema.Types.ObjectId, ref: 'Warehouse' }
    },
    services: [{service: {
      type: String,
      enum: [
        'Inside',
        'LifeGate',
        'TradeShow',
        'Residential',
        'OffHours',
        'Weekends',
        'Holidays'
      ]}}]
  },
  lines: [{
    weight: Number,
    quantity: Number,
    packaging: {
      type: String, required: true,
      enum: [
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
      default: 'Cartons'
    },
    length: Number,
    width: Number,
    height: Number,
    freightClass: {
      type: Number,
      enum: [
        50, 55, 60, 65, 70, 77.5, 85, 92.5,
        100, 110, 125, 150, 175, 200,
        250, 300, 400, 500
      ]
    },
    description: String
  }],

  extraServices: [{
    service: String,
    charge: Number
  }],

  brokerFees: [
    {name: String, charge: Number}
  ],

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

  invoice: {
    referenceNumber: String
  },

  deliveryOrderReference: {
    email: String,
    phone: String,
    instructions: String
  }
});

module.exports = mongoose.model('LtlLoad', LtlLoadSchema);
