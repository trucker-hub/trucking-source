'use strict';

describe('Filter: elaspedTime', function () {

  // load the filter's module
  beforeEach(module('servicesApp'));

  // initialize a new instance of the filter before each test
  var elaspedTime;
  beforeEach(inject(function ($filter) {
    elaspedTime = $filter('elaspedTime');
  }));

  it('should return the input prefixed with "elaspedTime filter:"', function () {
    var text = 'angularjs';
    expect(elaspedTime(text)).toBe('elaspedTime filter: ' + text);
  });

});
