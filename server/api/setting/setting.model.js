'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var brokerFeeSubSchema = {
    minimumCharge: Number,
    //if not flatFee, the charge will be percentage of the basis rate.
    flatFee: { type: Boolean, required: true, default: false },
    tiers: [{
        underAmount: Number,
        brokerCharge: Number
    }]
};

var SettingSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    ftlSettings: {
        brokerFee: brokerFeeSubSchema
    },
    ltlSettings: {
        brokerFee: brokerFeeSubSchema
    },
    airSettings: {
        brokerFee: brokerFeeSubSchema
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