'use strict';

describe('Controller: CompanyAirCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var CompanyAirCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyAirCtrl = $controller('CompanyAirCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
