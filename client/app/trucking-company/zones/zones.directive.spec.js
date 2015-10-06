'use strict';

describe('Directive: zones', function () {

  // load the directive's module and view
  beforeEach(module('servicesApp'));
  beforeEach(module('app/trucking-company/zones/zones.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<zones></zones>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the zones directive');
  }));
});