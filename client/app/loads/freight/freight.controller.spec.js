'use strict';

describe('Controller: FreightCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var FreightCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FreightCtrl = $controller('FreightCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
