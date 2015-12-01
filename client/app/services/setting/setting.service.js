'use strict';

angular.module('servicesApp')
  .service('settingService', function ($http) {
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

      return vm;
    });
