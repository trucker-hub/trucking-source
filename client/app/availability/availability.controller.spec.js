'use strict';

describe('Controller: AvailabilityCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var AvailabilityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AvailabilityCtrl = $controller('AvailabilityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
