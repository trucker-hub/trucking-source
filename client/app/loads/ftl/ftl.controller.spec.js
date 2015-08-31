'use strict';

describe('Controller: FtlCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var FtlCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FtlCtrl = $controller('FtlCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
