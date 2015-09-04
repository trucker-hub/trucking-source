'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeliveryOrderSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('DeliveryOrder', DeliveryOrderSchema);