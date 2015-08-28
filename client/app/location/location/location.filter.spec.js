'use strict';

describe('Filter: location', function () {

  // load the filter's module
  beforeEach(module('servicesApp'));

  // initialize a new instance of the filter before each test
  var location;
  beforeEach(inject(function ($filter) {
    location = $filter('location');
  }));

  it('should return the input prefixed with "location filter:"', function () {
    var text = 'angularjs';
    expect(location(text)).toBe('location filter: ' + text);
  });

});
