'use strict';

describe('Filter: shippingWeightFilter', function () {

  // load the filter's module
  beforeEach(module('servicesApp'));

  // initialize a new instance of the filter before each test
  var shippingWeightFilter;
  beforeEach(inject(function ($filter) {
    shippingWeightFilter = $filter('shippingWeightFilter');
  }));

  it('should return the input prefixed with "shippingWeightFilter filter:"', function () {
    var text = 'angularjs';
    expect(shippingWeightFilter(text)).toBe('shippingWeightFilter filter: ' + text);
  });

});
