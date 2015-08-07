'use strict';

describe('Filter: locationTypeFilter', function () {

  // load the filter's module
  beforeEach(module('servicesApp'));

  // initialize a new instance of the filter before each test
  var locationTypeFilter;
  beforeEach(inject(function ($filter) {
    locationTypeFilter = $filter('locationTypeFilter');
  }));

  it('should return the input prefixed with "locationTypeFilter filter:"', function () {
    var text = 'angularjs';
    expect(locationTypeFilter(text)).toBe('locationTypeFilter filter: ' + text);
  });

});
