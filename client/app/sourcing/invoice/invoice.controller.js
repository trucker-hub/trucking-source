'use strict';

angular.module('servicesApp')
  .controller('InvoiceCtrl', function ($scope, $modalInstance, load) {

      $scope.load = load;
        var computeTotalCost = function() {
            var i, sum=0;

            for(i=0; i < $scope.load.fulfilledBy.costItems.length; ++i) {
                var item = $scope.load.fulfilledBy.costItems[i];
                if(item.charge) sum += item.charge;
                if(item.adjustment) sum += item.adjustment;
            }

            for(i=0; i < $scope.load.brokerFees.length; ++i) {
                var brokerFee = $scope.load.brokerFees[i];
                if(brokerFee.charge) {
                    sum += brokerFee.charge;
                }
            }
            $scope.load.totalAmount = sum;
        };

      $scope.send = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
        computeTotalCost();
  });
