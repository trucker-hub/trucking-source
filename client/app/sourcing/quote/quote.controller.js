'use strict';

angular.module('servicesApp')
    .controller('QuoteCtrl', function ($scope, $http, $modal, $modalInstance, ngProgressFactory,
                                       sourcingService, load) {

      $scope.load = load;

      $scope.recalcAdjustments = function (source) {
        sourcingService.recalcAdjustment($scope.load, source);
      };


      var finalizeSource = function () {
        sourcingService.finalizeSource($scope.load,
            function () {
              console.log("finalizeSource succesfully ");
            },
            function () {
              console.log("finalizeSource  failed ");
            }
        );
      };

      $scope.selectSource = function (aSource) {
        $scope.selectedSource = aSource;
        sourcingService.selectSource($scope.load, $scope.selectedSource);
        finalizeSource();
      };


      $scope.sourcing = function () {

        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.start();
        sourcingService.sourcing($scope.load,
            function () {
              //after get the companies' data, we can calculate the prices on the client side.
              $scope.progressbar.complete();
            },
            function () {
              $scope.progressbar.stop();
            }
        );
      };


      $scope.createInvoice = function () {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/sourcing/invoice/invoice.html',
          controller: 'InvoiceCtrl',
          size: 'lg',
          resolve: {
            load: function () {
              return $scope.load;
            }
          }
        });
        modalInstance.result.then(
            function () {
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
        );
      };

      $scope.toggleSourceDetails = function (source) {
        if (source.showDetails) {
          source.showDetails = false;
        } else {
          sourcingService.recalcAdjustment($scope.load, source);
          source.showDetails = true;
        }
      };

      $scope.toggleLoadDetails = function (load) {
        if (load.showLoadDetails) {
          load.showLoadDetails = false;
        } else {
          load.showLoadDetails = true;
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('Close');
      };


      $scope.createDO = function () {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/tracking/do-details/do-details.html',
          controller: 'DoDetailsCtrl',
          size: 'lg',
          resolve: {
            load: function () {
              return $scope.load;
            }
          }
        });

        modalInstance.result.then(
            function () {
              var path = $scope.load.loadType == 'FTL' ? '/api/load/ftl-loads/' : '/api/load/ltl-loads/';
              $http.put(path + $scope.load._id, $scope.load).then(
                  function (response) {
                    console.log("request saved succesfully " + JSON.stringify(response));
                  },
                  function (err) {
                    console.log("request saving failed " + err);
                  }
              );
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
        );
      };
    });
