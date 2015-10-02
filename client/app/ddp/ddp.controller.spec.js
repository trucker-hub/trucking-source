'use strict';

describe('Controller: DdpCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var DdpCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DdpCtrl = $controller('DdpCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
