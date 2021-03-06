'use strict';

angular.module('servicesApp')
  .service('truckingCompany', function ($http, $q, $uibModal, ngProgressFactory) {

    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();

    vm.companiesOpened = vm.companiesOpened || {};

    vm.list = [];

    var editCompanyFunc = function(company) {
      var id = company._id;
      if(company.ftl) {
        vm.companiesOpened[id] = {data:company, active:true};
        return;
      }else {
        fetchDetailsPromise(company).then(function() {
          vm.companiesOpened[id] = {data:company, active:true};
        }).catch(function(response) {
          console.log("can't get the detail" + response);
        });
      }
    };

    vm.editCompany = function(id) {
      var detail = vm.companiesOpened[id];
      if(detail) {
        detail.active = true;
        return;
      }else {
        for (var index =0; index < vm.list.length; ++index) {
          var company = vm.list[index];
          if(company._id == id) {
            editCompanyFunc(company);
            return;
          }
        }
      }
    };

    vm.doneEditing = function(id) {
      delete vm.companiesOpened[id];
    };

    vm.fetch = function (callbackOK, callbackERR) {
      vm.progressbar.start();
      $http.get("/api/trucking-companies").then(
        function (response) {
          //console.log(JSON.stringify(response.data));
          vm.list = response.data;
          callbackOK(response);
          vm.progressbar.complete();
        },
        function (response) {
          vm.list = [];
          console.log("ran into error " + response);
          callbackERR(response);
          vm.progressbar.stop();
        });
    };

    var fetchDetailsPromise = function (company) {
      console.log("fetching settings before sourcing");
      var deferred = $q.defer();
      vm.progressbar.start();
      $http.get("/api/trucking-companies/" + company._id).then(
          function (response) {
            //console.log(JSON.stringify(response.data));
            var full = response.data;
            company.ftl = full.ftl;
            company.ltl = full.ltl;
            company.air = full.air;
            deferred.resolve(company);
            vm.progressbar.complete();
          },
          function (response) {
            console.log("ran into error " + response);
            deferred.reject("can't get details for company=" + company.name);
            vm.progressbar.stop();
          });
      return deferred.promise;
    };



    vm.newOne = {
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

    vm.delete = function (company, callbackOK, callbackERR) {
      vm.progressbar.start();
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
          vm.progressbar.complete();
        },
        function (response) {
          callbackERR(response);
          vm.progressbar.stop();
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
      vm.progressbar.start();
      $http.post("/api/trucking-companies", newOne).then(
        function (response) {
          console.log(JSON.stringify(response.data));
          vm.list.push(response.data);
          callbackOK(response);
          vm.progressbar.complete();
        },
        function (response) {
          console.log("ran into error " + response);
          callbackERR(response);
          vm.progressbar.stop();
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
      vm.progressbar.start();
      $http.post('/api/trucking-companies/util/archives').then(cb, cbE).then(function() {
        vm.progressbar.complete();
      });
    };

    vm.archiveOne = function (id, cb, cbE) {
      console.log("test archiving companies");
      vm.progressbar.start();
      $http.put('/api/trucking-companies/util/archives/' +id).then(cb, cbE).then(function() {
        vm.progressbar.complete();
      });
    };

    vm.archiveList = function (cb, cbE) {
      console.log("test archiving companies");
      $http.get('/api/trucking-companies/util/archives').then(cb, cbE);
    };

    vm.extract = function (cb, cbE) {
      vm.progressbar.start();
      console.log("test extracting companies");
      $http.post('/api/trucking-companies/util/extract').then(cb, cbE).then(function() {
        vm.progressbar.complete();
      });
    };

    vm.extractOne = function (name, cb, cbE) {
      console.log("test extracting companies");
      vm.progressbar.start();
      $http.put('/api/trucking-companies/util/extract/' + name).then(cb, cbE).then(function() {
        vm.progressbar.complete();
      });
    };


    vm.openChargesDialog = function (container, callbackOK, callbackCancel) {

      var modalInstance = $uibModal.open({
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

      var modalInstance = $uibModal.open({
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

      var modalInstance = $uibModal.open({
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
