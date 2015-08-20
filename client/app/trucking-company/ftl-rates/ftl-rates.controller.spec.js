'use strict';

describe('Controller: FtlRatesCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var FtlRatesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FtlRatesCtrl = $controller('FtlRatesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
