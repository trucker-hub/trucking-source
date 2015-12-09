'use strict';

describe('Controller: SettingUpdateCtrl', function () {

  // load the controller's module
  beforeEach(module('servicesApp'));

  var SettingUpdateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingUpdateCtrl = $controller('SettingUpdateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
