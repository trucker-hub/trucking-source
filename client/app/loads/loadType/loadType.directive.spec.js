'use strict';

describe('Directive: loadType', function () {

  // load the directive's module
  beforeEach(module('servicesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<load-type></load-type>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loadType directive');
  }));
});