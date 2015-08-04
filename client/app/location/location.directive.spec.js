'use strict';

describe('Directive: location', function () {

  // load the directive's module and view
  beforeEach(module('servicesApp'));
  beforeEach(module('app/location/location.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<location></location>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the location directive');
  }));
});