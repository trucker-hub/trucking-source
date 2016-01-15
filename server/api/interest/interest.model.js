'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InterestSchema = new Schema({
  name: String,
  active: Boolean,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  company: { type: Schema.Types.ObjectId, ref: 'TruckingCompany' },
  loadType:  [{ type: String, required: true, enum: [ 'FTL', 'LTL', 'AIR']}],
  createdAt: { type: Date, required: true, default: Date.now },
  effectiveDate: { type: Date, required: true, default: Date.now },
  expiredBy: Date,
  notes: String,
  discountsByCity : [
    { discountAmount: Number,
      city: [ { city: String, county: String, state: String, zip: String } ]
    }
  ]
});

module.exports = mongoose.model('Interest', InterestSchema);
