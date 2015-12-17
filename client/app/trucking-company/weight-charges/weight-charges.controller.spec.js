'use strict';

describe('Controller: WeightChargesCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var WeightChargesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WeightChargesCtrl = $controller('WeightChargesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
