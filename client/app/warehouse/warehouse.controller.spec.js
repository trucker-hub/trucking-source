'use strict';

describe('Controller: WarehouseCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var WarehouseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseCtrl = $controller('WarehouseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
