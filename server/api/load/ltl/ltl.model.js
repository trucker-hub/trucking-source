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
    createdAt: { type: Date, required: true, default: Date.now },
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
                'Business with Dock/Fork',
                'Business without Dock/Fork',
                'Convention center or Tradeshow',
                'Residential',
                'Freight Carrier Terminal'
            ],
            default: 'Business with Dock/Fork'}
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
            50, 55, 60, 65.70,77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500
          ]
        },
        description: String
    }],

    extraServices: [{
       service: String,
       charge: Number
    }],

    fulfilledBy: {
        source: { type: Schema.Types.ObjectId, ref: 'TruckingCompany' },
        charge: Number,
        name: String,
        costItem: [{
            charge: Number,
            description: String
        }]
    },

    deliveryOrderContact: {
        email: String,
        phone: String
    }


});

module.exports = mongoose.model('LtlLoad', LtlLoadSchema);
