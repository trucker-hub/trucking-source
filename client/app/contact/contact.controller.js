'use strict';

angular.module('servicesApp')
    .controller('ContactCtrl', function ($scope, $http, ngProgressFactory) {
      $scope.message = 'Hello';

      $scope.alerts = [];

      $scope.contact = {
          name: '',
          from: '',
          phone:'',
          subject: 'Web Inquery',
          message: ''
      };
      $scope.send = function() {
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        $http.post('/api/emails/contact', $scope.contact).then(
            function(response) {
              console.log(JSON.stringify(response.data));
              $scope.progressbar.complete();
              $scope.contact.message =' ';
              $scope.alerts.push({type: 'success', msg: 'Your inquiry has been sent.  We will contact you shortly!'});
            },
            function(response) {
              console.log('ran into error ' + response);
              $scope.progressbar.stop();
            });
      };

      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
    });
