'use strict';

describe('Controller: PlaygroundCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var PlaygroundCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaygroundCtrl = $controller('PlaygroundCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
