'use strict';

angular.module('servicesApp')
  .service('truckingCompany', function ($http, $modal) {

    var vm = this;
    this.fetch = function (callbackOK, callbackERR) {
      $http.get("/api/trucking-companies").then(
        function (response) {
          //console.log(JSON.stringify(response.data));
          vm.list = response.data;
          callbackOK(response);
        },
        function (response) {
          vm.list = [];
          console.log("ran into error " + response);
          callbackERR(response);
        });
    };

    this.newOne = {
      name: "",
      location: "",
      phone: "(999)999-9999",
      favorite: false,
      ftl: {
        sizeCharges: [
          {
            containerSize: "20",
            weightRanges: [
              { limit:13000, charge:100},
              { limit:16000, charge:150}
            ],
            pierPassFee: 66.50,
            cleanTruckFee: 35,
            congestionFee: 150
          },
          {
            containerSize: "40",
            weightRanges: [
              { limit:13000, charge:100},
              { limit:16000, charge:150}
            ],
            pierPassFee: 66.50,
            cleanTruckFee: 35,
            congestionFee: 150
          },
          {
            containerSize: "45",
            weightRanges: [
              { limit:13000, charge:100},
              { limit:16000, charge:150}
            ],
            pierPassFee: 66.50,
            cleanTruckFee: 35,
            congestionFee: 150
          }
        ]
      },
      ltl: {},
      air: {}
    };

    this.delete = function (company, callbackOK, callbackERR) {
      $http.delete('/api/trucking-companies/' + company._id).then(
        function (response) {
          var index;
          for (index = 0; index < vm.list.length; ++index) {
            var x = vm.list[index];
            if (x._id == company._id) {
              vm.list.splice(index, 1);
              break;
            }
          }
          callbackOK(response);
        },
        function (response) {
          callbackERR(response);
        }
      );
    };
    vm.save = function (company, callbackOK, callbackERR) {
      $http.put('/api/trucking-companies/' + company._id, {company: company}).then(
        function (response) {
          callbackOK(response);
        },
        function (response) {
          callbackERR(response);
        }
      );
    };

    vm.toggleFavorite = function (id) {
      var index;
      for (index = 0; index < vm.list.length; ++index) {
        var company = vm.list[index];
        if (company._id == id) {
          company.favorite = !company.favorite;
          vm.save(company,
            function (response) {
              console.log(JSON.stringify(response.data));
            },
            function (response) {
              console.log("ran into error during update");
              //if error, revert the change
              company.favorite = !company.favorite;
            }
          );
          break;
        }
      }
      return;
    };

    vm.add = function (newOne, callbackOK, callbackERR) {
      $http.post("/api/trucking-companies", newOne).then(
        function (response) {
          console.log(JSON.stringify(response.data));
          vm.list.push(response.data);
          callbackOK(response);
        },
        function (response) {
          console.log("ran into error " + response);
          callbackERR(response);
        }
      );
    };

    this.get = function () {
      return vm.list;
    };

    vm.regions = [];
    vm.fetchRegions = function (callbackOK, callbackERR) {
      if (vm.regions.length > 0) {
        callbackOK();
        return;
      }

      return $http.get('/api/geoservice/regions').then(function (response) {
          vm.regions = response.data;
          callbackOK();
        },

        function (response) {
          console.log("Error=" + response);
          callbackERR();
        }
      );
    };

    vm.getRegions = function () {
      return vm.regions;
    };

    vm.archive = function (cb, cbE) {
      console.log("test archiving companies");
      $http.post('/api/trucking-companies/util/archives').then(cb, cbE);
    };

    vm.extract = function (cb, cbE) {
      console.log("test extracting companies");
      $http.post('/api/trucking-companies/util/extract').then(cb, cbE);
    };

    vm.openChargesDialog = function (container, callbackOK, callbackCancel) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/trucking-company/charges/charges.html',
        controller: 'ChargesCtrl',
        size: 'lg',
        resolve: {
          container: function () {
            return container;
          }
        }
      });

      modalInstance.result.then(
        function () {
          console.log("saved the charge");
          callbackOK();
        },
        function () {
          console.log('Modal dismissed at: ' + new Date());
          callbackCancel();
        }
      );
    };

    vm.openWeightChargesDialog = function (sizeCharge, callbackOK, callbackCancel) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/trucking-company/weight-charges/weight-charges.html',
        controller: 'WeightChargesCtrl',
        resolve: {
          sizeCharge: function () {
            return sizeCharge;
          }
        }
      });
      modalInstance.result.then(
        function (result) {
          console.log('Modal saved at: ' + new Date());
          callbackOK();
        },
        function () {
          console.log('Modal dismissed at: ' + new Date());
          callbackCancel();
        }
      );
    };

    vm.openContactDialog = function (company, callbackOK, callbackCancel) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/trucking-company/company-contact/company-contact.html',
        controller: 'CompanyContactCtrl',
        resolve: {
          company: function () {
            return company;
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
