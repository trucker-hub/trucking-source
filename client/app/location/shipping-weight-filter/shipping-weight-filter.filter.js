'use strict';

angular.module('servicesApp')
  .filter('shippingWeightFilter', function () {
    return function (lines) {
      var result = "";
      var index;
      var totalWeight =0.0;
      for (index=0; index < lines.length; index++) {
        var line = lines[index];
        totalWeight += line.weight * line.quantity;
        result += "[" + (index+1) + "]:" + line.weight + "lbs, " + line.quantity + " " + line.packaging + ","+ line.description;
      }
      return "Total Weight:" + totalWeight +"lbs, " + result;
    };
  });
