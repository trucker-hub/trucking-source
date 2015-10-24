'use strict';

describe('Directive: loadStatus', function () {

  // load the directive's module and view
  beforeEach(module('servicesApp'));
  beforeEach(module('app/loads/load-status/load-status.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<load-status></load-status>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the loadStatus directive');
  }));
});