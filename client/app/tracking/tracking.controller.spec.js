'use strict';

describe('Controller: DeliveryOrderCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var DeliveryOrderCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeliveryOrderCtrl = $controller('DeliveryOrderCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
