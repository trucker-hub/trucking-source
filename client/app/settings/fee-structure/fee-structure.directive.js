'use strict';

angular.module('servicesApp')
  .directive('feeStructure', function () {
    return {
      templateUrl: 'app/settings/fee-structure/fee-structure.html',
      restrict: 'EA',
      scope: {
        brokerFee: '=brokerFee'
      },
      link: function (scope, element, attrs) {

        scope.newtier = {
          underAmount:0,
          brokerCharge:0
        };
        scope.addFeeTier = function(tiers, newtier) {
          tiers.push({
            underAmount:newtier.underAmount,
            brokerCharge:newtier.brokerCharge
          });
        };

        scope.removeFeeTier = function(tiers, index) {
          tiers.splice(index, 1);
        };

      }
    };
  });
