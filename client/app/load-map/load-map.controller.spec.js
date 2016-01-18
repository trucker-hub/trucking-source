'use strict';

describe('Controller: LoadMapCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var LoadMapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoadMapCtrl = $controller('LoadMapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
