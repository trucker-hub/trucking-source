'use strict';

describe('Controller: CompanyLtlCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var CompanyLtlCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyLtlCtrl = $controller('CompanyLtlCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
