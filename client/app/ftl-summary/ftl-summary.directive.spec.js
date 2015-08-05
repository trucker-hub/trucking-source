'use strict';

describe('Directive: ftlSummary', function () {

  // load the directive's module and view
  beforeEach(module('servicesApp'));
  beforeEach(module('app/ftl-summary/ftl-summary.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ftl-summary></ftl-summary>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the ftlSummary directive');
  }));
});