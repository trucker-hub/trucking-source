'use strict';

describe('Service: load', function () {

  // load the service's module
  beforeEach(module('servicesApp'));

  // instantiate service
  var load;
  beforeEach(inject(function (_load_) {
    load = _load_;
  }));

  it('should do something', function () {
    expect(!!load).toBe(true);
  });

});
