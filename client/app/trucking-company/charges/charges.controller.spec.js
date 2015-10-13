'use strict';

describe('Controller: ChargesCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var ChargesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChargesCtrl = $controller('ChargesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
