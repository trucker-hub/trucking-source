'use strict';

angular.module('servicesApp')
  .controller('InvoiceCtrl', function ($scope, $http, $modalInstance, load) {

    $scope.load = load;
    var computeTotalCost = function() {
      var i, sum=0;

      for(i=0; i < $scope.load.fulfilledBy.costItems.length; ++i) {
        var item = $scope.load.fulfilledBy.costItems[i];
        if(item.charge) {
          sum += item.charge;
        }
        if(item.adjustment) {
          sum += item.adjustment;
        }else {
          item.adjustment = 0;
        }
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


    $scope.sending = false;
    $scope.sendInvoice = function() {
      $scope.sending = true;
      var req = {
        email: "jinbo.chen@gmail.com",
        load: $scope.load
      };
      $http.post('/api/emails/invoice', req).then(
        function(response) {
          console.log(JSON.stringify(response.data));
          $scope.sending = false;
        },
        function(response) {
          console.log('ran into error ' + response);
          $scope.sending = false;
        });
    };

    computeTotalCost();

  });
