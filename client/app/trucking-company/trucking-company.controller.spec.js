'use strict';

describe('Controller: TruckingCompanyCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var TruckingCompanyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TruckingCompanyCtrl = $controller('TruckingCompanyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
