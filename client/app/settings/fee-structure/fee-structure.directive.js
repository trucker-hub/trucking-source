'use strict';

angular.module('servicesApp')
  .directive('feeStructure', function () {
    return {
      templateUrl: 'app/settings/fee-structure/fee-structure.html',
      restrict: 'EA',
      scope: {
        brokerFee: '=brokerFee',
        title: '=title'
      },
      link: function (scope, element, attrs) {

        scope.addFeeTier = function(tiers, newtier) {
          tiers.push({
            underAmount:newtier.underAmount,
            brokerCharge:newtier.brokerFee
          });
        };

        scope.removeFeeTier = function(tiers, index) {
          tiers.splice(index, 1);
        };

      }
    };
  });
