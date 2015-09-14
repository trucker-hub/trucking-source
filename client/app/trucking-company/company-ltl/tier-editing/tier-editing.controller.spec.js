'use strict';

describe('Controller: TierEditingCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var TierEditingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TierEditingCtrl = $controller('TierEditingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
