'use strict';

describe('Controller: DoDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var DoDetailsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DoDetailsCtrl = $controller('DoDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
