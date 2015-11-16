'use strict';

describe('Controller: CompanyContactCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var CompanyContactCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyContactCtrl = $controller('CompanyContactCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
