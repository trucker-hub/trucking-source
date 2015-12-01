'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    ftlSettings: {
        brokerFees: [ {name: String, charge: Number}]
    },
    ltlSettings: {
        brokerFees: [ {name: String, charge: Number}]
    },
    airSettings: {
        brokerFees: [ {name: String, charge: Number}]
    },

    usage: {
        history: [ { type: Date, required: true, default: Date.now }],
        ftl: {
            created: Number,
            fulfilled: Number,
            value: Number
        },
        ltl: {
            created: Number,
            fulfilled: Number,
            value: Number
        },
        air: {
            created: Number,
            fulfilled: Number,
            value: Number
        }
    }

});

module.exports = mongoose.model('Setting', SettingSchema);