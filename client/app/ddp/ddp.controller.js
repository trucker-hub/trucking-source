'use strict';

angular.module('servicesApp')
  .controller('DdpCtrl', function ($scope) {

    $scope.freightFee=0;
    $scope.brokerageFee =0;
    $scope.insuranceFee=0;

    $scope.hmf= 0.00125;
    $scope.mpf = 0.003464;
    $scope.rows = [
      {ddp:0,  dutyRate:0.0},
      {ddp:0,  dutyRate:0.0}
    ];

    $scope.calc = function() {

      var totalDDP = $scope.rows.reduce( function(total, row) {
        return total + row.ddp;
      },0);

      $scope.totalFees = $scope.freightFee+ $scope.brokerageFee + $scope.insuranceFee;

      console.log("total DDP=" + totalDDP + " total Fee=" + $scope.totalFees);
      var index;
      for(index=0; index <$scope.rows.length; ++index) {
        var row = $scope.rows[index];
        row.adjusted = row.ddp - ($scope.totalFees*row.ddp)/totalDDP;
        row.fob = row.adjusted / (1 + row.dutyRate + $scope.hmf + $scope.mpf);
        row.duty = row.fob * row.dutyRate;
        row.hmfDuty = row.fob * $scope.hmf;
        row.mpfDuty = Math.min(485.00, row.fob * $scope.mpf);
        row.subTotal = row.duty + row.hmfDuty + row.mpfDuty;
      }

      $scope.totalHMF = $scope.rows.reduce( function(total, row) {
        return total + row.hmfDuty;
      },0);

      $scope.totalMPF = $scope.rows.reduce( function(total, row) {
        return total + row.mpfDuty;
      },0);
      $scope.totalDuty = $scope.rows.reduce( function(total, row) {
        return total + row.duty;
      },0);

      $scope.sum = $scope.totalHMF + $scope.totalMPF + $scope.totalDuty;

    }
  });
