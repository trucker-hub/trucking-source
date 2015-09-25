/**
 * Created by jinbo on 9/24/15.
 */
'use strict';

var _ = require('lodash');

exports.weight = function(lines) {
  var index, sum=0;
  for(index=0; index < lines.length; ++index) {
    sum += lines[index].weight * lines[index].quantity;
  }
  return sum;
};
