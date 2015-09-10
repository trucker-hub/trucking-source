'use strict';

describe('Controller: CompanyFtlCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var CompanyFtlCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyFtlCtrl = $controller('CompanyFtlCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
