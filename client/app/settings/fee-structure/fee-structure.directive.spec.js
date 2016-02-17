'use strict';

describe('Directive: feeStructure', function () {

  // load the directive's module and view
  beforeEach(module('servicesApp'));
  beforeEach(module('app/settings/fee-structure/fee-structure.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fee-structure></fee-structure>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
