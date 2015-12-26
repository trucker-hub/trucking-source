'use strict';

angular.module('servicesApp')
  .service('customerSettingService', function ($http, $modal) {
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
    var defaultSettings = {
      ftlSettings: {
        brokerFees: [
          {name: "ABI-Customs Fee", charge: 15},
          {name: "Chassy Fee", charge: 15},
          {name: "Service Fee", charge: 50}]
      },
      ltlSettings: {
        brokerFees: [
          {name: "ABI-Customs Fee", charge: 200},
          {name: "Chassy Fee", charge: 15},
          {name: "Service Fee", charge: 50}]
      },
      airSettings: {
        brokerFees: [
          {name: "ABI-Customs Fee", charge: 15},
          {name: "Chassy Fee", charge: 15},
          {name: "Service Fee", charge: 50}]
      }
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
