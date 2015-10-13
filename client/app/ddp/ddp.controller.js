'use strict';

angular.module('servicesApp')
  .controller('DdpCtrl', function ($scope) {

    $scope.freightFee=0;
    $scope.brokerageFee =0;
    $scope.insuranceFee=0;

    $scope.hmf= 0.00125;
    $scope.mpf = 0.003464;
    $scope.rows = [
      {ddp:0.0,  dutyRate:0.0},
      {ddp:0.0,  dutyRate:0.0},
      {ddp:0.0,  dutyRate:0.0},
      {ddp:0.0,  dutyRate:0.0}
    ];

    $scope.maxMPF = 485;
    $scope.minMPF = 25;


    var sum = function(a, b) {
      return a + b;
    };
    $scope.calc = function() {

      var index;
      $scope.totalDDP =  $scope.rows.map(function(row) {
        return row.ddp;
      }).reduce(sum);

      $scope.totalFees = $scope.freightFee+ $scope.brokerageFee + $scope.insuranceFee;

      for(index=0; index <$scope.rows.length; ++index) {
        var row = $scope.rows[index];
        row.adjusted = row.ddp - ($scope.totalFees*row.ddp)/$scope.totalDDP;
        row.fob = row.adjusted / (1 + row.dutyRate + $scope.hmf + $scope.mpf);
        row.duty = row.fob * row.dutyRate;
        row.hmfDuty = row.fob * $scope.hmf;
        row.mpfDuty = row.fob * $scope.mpf;
        row.subTotal = row.duty + row.hmfDuty + row.mpfDuty;
      }

      $scope.totalHMF = $scope.rows.map(function(row) {
        return row.hmfDuty;
      }).reduce(sum);

      $scope.totalMPF =  $scope.rows.map(function(row) {
        return row.mpfDuty;
      }).reduce(sum);

      $scope.totalDuty =  $scope.rows.map(function(row) {
        return row.duty;
      }).reduce(sum);

      $scope.totalMPF = Math.min($scope.maxMPF, $scope.totalMPF);
      $scope.totalMPF = Math.max($scope.minMPF, $scope.totalMPF);

      console.log(" reduced result " + $scope.totalHMF +"," + $scope.totalMPF + "," + $scope.totalDuty);
      $scope.sum = $scope.totalHMF + $scope.totalMPF + $scope.totalDuty;

    }
  });
