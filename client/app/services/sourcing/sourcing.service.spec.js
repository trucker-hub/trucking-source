'use strict';

describe('Service: sourcing', function () {

  // load the service's module
  beforeEach(module('servicesApp'));

  // instantiate service
  var sourcing;
  beforeEach(inject(function (_sourcing_) {
    sourcing = _sourcing_;
  }));

  it('should do something', function () {
    expect(!!sourcing).toBe(true);
  });

});
