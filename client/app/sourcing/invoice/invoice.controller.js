'use strict';

angular.module('servicesApp')
  .controller('InvoiceCtrl', function ($scope, $http, $uibModalInstance, load) {

    $scope.load = load;
    
    $scope.send = function () {
      $uibModalInstance.close();
    };

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
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

  });
