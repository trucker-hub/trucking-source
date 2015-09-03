'use strict';

describe('Filter: lineDetails', function () {

  // load the filter's module
  beforeEach(module('servicesApp'));

  // initialize a new instance of the filter before each test
  var lineDetails;
  beforeEach(inject(function ($filter) {
    lineDetails = $filter('lineDetails');
  }));

  it('should return the input prefixed with "lineDetails filter:"', function () {
    var text = 'angularjs';
    expect(lineDetails(text)).toBe('lineDetails filter: ' + text);
  });

});
