'use strict';

describe('Controller: LtlRatesCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var LtlRatesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LtlRatesCtrl = $controller('LtlRatesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
