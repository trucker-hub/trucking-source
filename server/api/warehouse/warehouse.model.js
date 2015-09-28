'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WarehouseSchema = new Schema({
    name: String,
    info: String,
    active: Boolean,
    contact: {
        phone: String,
        fax: String,
        email: String
    },
    location: {
        full_address: String,
        state: {type: String, required: true},
        county: {type: String, required: true},
        city: {type: String, required: true},
        zipCode: {type: String, required: true}
    },
    fees: {
        terminal: {
            forklift: {fee: Number, cbm: Number, weight: Number, minimum: Number},
            receiving:{fee: Number, cbm: Number, weight: Number, minimum: Number}
        },
        minimum: Number,
        maximum:Number,
        doc: Number,
        it: Number,
        freeTime: Number,
        storageFee: Number
    },
    fdaReg: String,
    lastUpdated: String
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);