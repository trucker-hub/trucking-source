'use strict';

describe('Directive: loadDetails', function () {

  // load the directive's module and view
  beforeEach(module('servicesApp'));
  beforeEach(module('app/loads/load-details/load-details.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<load-details></load-details>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the loadDetails directive');
  }));
});