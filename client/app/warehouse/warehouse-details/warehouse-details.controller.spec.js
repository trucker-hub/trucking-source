'use strict';

describe('Controller: WarehouseDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var WarehouseDetailsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseDetailsCtrl = $controller('WarehouseDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
