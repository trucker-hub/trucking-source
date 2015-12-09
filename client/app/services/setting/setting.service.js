'use strict';

angular.module('servicesApp')
  .service('customerSettingService', function ($http, $modal) {
      var vm = this;

      vm.updateSetting = function(setting, userId) {
        if(setting._id) {
          $http.put('/api/settings/' + settings._id, setting).then(function(response) {
            console.log("update response =" + JSON.stringify(response));
            cbOK(response);
          }, function(response) {
            console.error(JSON.stringify(response));
            cbError();
          });
        }else {
          $http.post('/api/settings/', setting).then(function(response) {
            console.log("creation response =" + JSON.stringify(response));
            cbOK(response);
          }, function(response) {
            console.error(JSON.stringify(response));
            cbError();
          });
        }
      };

      vm.getSetting = function(userId, cbOK, cbError) {

        $http.get('/api/settings/user/' + userId).then(function(response) {
          console.log("response =" + JSON.stringify(response));
          cbOK(response);
        }, function(response) {
          console.error(JSON.stringify(response));
          cbError();
        });
      };

      this.openCustomerSettingsDialog = function (customer, callbackOK, callbackCancel) {

          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'app/settings/setting-update/setting-update.html',
              controller: 'CustomerSettingUpdateCtrl',
              size: 'lg',
              resolve: {
                  customer: function () {
                      return customer;
                  }
              }
          });

          modalInstance.result.then(
              function (result) {
                  callbackOK();
              },
              function () {
                  console.log('Modal dismissed at: ' + new Date());
                  callbackCancel();
              }
          );
      };


      return vm;
    });
