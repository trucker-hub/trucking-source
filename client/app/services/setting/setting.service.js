'use strict';

angular.module('servicesApp')
  .service('customerSettingService', function ($http, $uibModal) {
    var vm = this;

    var settingsRepo = {};

    vm.updateCustomerSettings = function (settings, userId, cbOK, cbError) {
        var url = (settings._id) ? ('/api/settings/' + settings._id) : ('/api/settings/');
        if (settings._id) {
            $http.put(url, settings).then(cbOK, cbError);
        } else {
            $http.post(url, settings).then(cbOK, cbError);
        }
    };

    var baseBrokerFee = {
      minimumCharge: 20,
      flatFee: false,
      tiers: [
        {underAmount: 200, brokerCharge: 30},
        {underAmount: 500, brokerCharge: 25},
        {underAmount: 1000, brokerCharge: 15},
        {underAmount: 10000, brokerCharge: 10}
      ]
    };

    var defaultSettings = {
      ftlSettings: {
        brokerFee: angular.copy(baseBrokerFee)
      },
      ltlSettings: {
        brokerFee: angular.copy(baseBrokerFee)
      },
      airSettings: {
        brokerFee: angular.copy(baseBrokerFee)
      }
    };

    vm.getDefaultFeeSetting = function() {
      return defaultSettings;
    };

    vm.getCustomerSettings = function (userId, cbOK, cbError) {

      var settings = (userId)?settingsRepo[userId]:defaultSettings;
      if (settings) {
        cbOK(settings);
        return;
      }

      $http.get('/api/settings/user/' + userId).then(function (response) {
          console.log("response =" + JSON.stringify(response));
          settings = response.data;
          settingsRepo[userId] = settings;
          cbOK(settings);
        },
        function (response) {
          settings = angular.copy(defaultSettings);
          settings.user_id = userId;
          console.error(JSON.stringify(response));
          settingsRepo[userId] = settings;
          cbError(settings);
        });
    };


    vm.openCustomerSettingsDialog = function (customer, callbackOK, callbackCancel) {

      var modalInstance = $uibModal.open({
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
