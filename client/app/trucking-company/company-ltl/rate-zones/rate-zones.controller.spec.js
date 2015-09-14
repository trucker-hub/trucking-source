'use strict';

describe('Controller: RateZonesCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var RateZonesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RateZonesCtrl = $controller('RateZonesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
