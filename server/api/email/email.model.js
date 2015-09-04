'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmailSchema = new Schema({
    to: [{type:String}],
    from: String,
    cc: [{type:String}],
    subject: String,
    body: String,
    sentOn: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Email', EmailSchema);