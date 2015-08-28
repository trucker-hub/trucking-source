'use strict';

describe('Controller: LoadsCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var LoadsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoadsCtrl = $controller('LoadsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
