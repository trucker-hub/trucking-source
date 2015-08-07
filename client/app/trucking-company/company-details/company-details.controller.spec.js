'use strict';

describe('Controller: CompanyDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var CompanyDetailsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyDetailsCtrl = $controller('CompanyDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
