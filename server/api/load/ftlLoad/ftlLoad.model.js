'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var FtlLoadSchema = new Schema({
    who: String,
    createdAt: { type: Date, required: true, default: Date.now },
    expectedBy: Date,
    notes: String,
    shipTo: {
        location: {
            street:     String,
            state:      {type: String, required: true},
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
            street:     String,
            state:      {type: String, required: true},
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
            default: 'Business with Dock/Fork'
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
            default: 'Other'},
        size: String
    },

    source: { type: Schema.Types.ObjectId, ref: 'TruckingCompany' }

});
module.exports = mongoose.model('FtlLoad', FtlLoadSchema);