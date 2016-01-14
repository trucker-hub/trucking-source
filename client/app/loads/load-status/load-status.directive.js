'use strict';

angular.module('servicesApp')
  .directive('loadStatus', function ($http, $uibModal) {
    return {
      templateUrl: 'app/loads/load-status/load-status.html',
      restrict: 'E',
      scope: {
        load: '=load'
      },
      link: function (scope, element, attrs) {
        scope.showLog = false;

        scope.toggleShowLog = function() {
          scope.showLog = !scope.showLog;
        };
        scope.viewInvoice = function() {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/sourcing/invoice/invoice.html',
            controller: 'InvoiceCtrl',
            size: 'lg',
            resolve: {
              load: function () {
                return scope.load;
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


        scope.viewDO = function() {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/tracking/do-details/do-details.html',
            controller: 'DoDetailsCtrl',
            size: 'lg',
            resolve: {
              load: function () {
                return scope.load;
              }
            }
          });
          modalInstance.result.then(
            function () {
              var path = scope.load.loadType=='FTL'?'/api/load/ftl-loads/':'/api/load/ltl-loads/';
              $http.put(path +scope.load._id, scope.load).then(
                function(response) {
                  console.log("request saved succesfully " + JSON.stringify(response));
                },
                function(err) {
                  console.log("request saving failed " + err);
                }
              );
            },
            function () {
              console.log('Modal dismissed at: ' + new Date());
            }
          );
        };

      }
    };
  });
