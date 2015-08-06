'use strict';

angular.module('servicesApp')
  .filter('locationTypeFilter', function () {

    var locationTypes = ["Business with Dock/Fork", "Business without Dock/Fork", "Convention center or Tradeshow", " Residential", "Freight Carrier Terminal"];

    return function(index) {
      return locationTypes[index];
    };
  });
