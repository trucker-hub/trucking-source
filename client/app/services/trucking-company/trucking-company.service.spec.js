'use strict';

describe('Service: truckingCompany', function () {

  // load the service's module
  beforeEach(module('servicesApp'));

  // instantiate service
  var truckingCompany;
  beforeEach(inject(function (_truckingCompany_) {
    truckingCompany = _truckingCompany_;
  }));

  it('should do something', function () {
    expect(!!truckingCompany).toBe(true);
  });

});
