'use strict';

angular.module('servicesApp')
  .service('loadService', function ($http, $q, $rootScope, socket, ngProgressFactory) {

    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();
    vm.newLoadId =0;
    vm.loads = {
      ltl: [],
      ftl: []
    };

    $rootScope.loadsOpened = $rootScope.loadsOpened || {ftl: {}, ltl: {}, air: {}};

    vm.filters = {
      period: 1,
      types: {ftl: true, ltl: true, air: true},
      status: {open: true, filled: false, paid: false}
    };


    var ltlPromise = function () {
      console.log("started query ltl");
      var deferred = $q.defer();
      if(vm.filters.types.ltl || vm.filters.types.air) {
        var typesString = '';
        if(vm.filters.types.ltl && vm.filters.types.air) {
          typesString='&types=LTL,AIR';
        }else if(vm.filters.types.ltl && !vm.filters.types.air) {
          typesString='&types=LTL';
        }else if(!vm.filters.types.ltl && vm.filters.types.air) {
          typesString='&types=AIR';
        }
        var url = '/api/load/ltl-loads?' + vm.filters.statusString + vm.filters.queryDaysString + typesString;
        console.log("ltl/air loads url=" + url);
        $http.get(url).then(
            function(response) {
              //console.log(JSON.stringify(response.data));
              vm.loads.ltl = response.data;
              socket.syncUpdates('ltl', vm.loads.ltl, vm.loads.cb);
              deferred.resolve(vm.loads.ltl);
            },
            function(response) {
              deferred.reject(response);
            });
      }else {
        deferred.resolve(vm.loads);
      }
      return deferred.promise;
    };

    var ftlPromise = function () {
      console.log("started query ftl");
      var deferred = $q.defer();
      if(vm.filters.types.ftl) {
        var url = '/api/load/ftl-loads?' + vm.filters.statusString + vm.filters.queryDaysString;
        console.log("load url =" + url);
        $http.get(url).then(
            function(response) {
              //console.log(JSON.stringify(response.data));
              vm.loads.ftl = response.data;
              socket.syncUpdates('ftl', vm.loads.ftl, vm.loads.cb);
              deferred.resolve(vm.loads.ftl);
            },
            function(response) {
              deferred.reject(response);
            });
      }else {
        deferred.resolve(vm.loads.ftl);
      }
      return deferred.promise;
    };

    vm.fetch = function(cbOK, cbErr) {

      vm.progressbar.start();
      vm.loads = {
        ltl: [],
        ftl: [],
        cb: cbOK
      };

      console.log('fetch loads from the db');
      vm.filters.queryDaysString = vm.filters.period!=-1?('&days='+vm.filters.period):'';

      var statusString ='status=';
      if(vm.filters.status.open) {
        statusString +='OPEN,'
      }
      if(vm.filters.status.filled) {
        statusString +='FILLED,'
      } if(vm.filters.status.paid) {
        statusString +='PAID,'
      }
      vm.filters.statusString = statusString.substring(0, statusString.length-1);

      ltlPromise().then(ftlPromise).then(function() {
        cbOK();
        vm.progressbar.complete();
      }).catch(function(response) {
        console.log('ran into error ' + response);
        cbErr();
        vm.progressbar.stop();
      });
    };

    var setEditingAttribute = function(id, xx) {
      var index;
      for (index = 0; index < vm.loads.ftl.length; ++index) {
        var load = vm.loads.ftl[index];
        if (load._id == id) {
          xx[id] = {data: load, active: true};
          return;
        }
      }
      for (index = 0; index < vm.loads.ltl.length; ++index) {
        var load = vm.loads.ltl[index];
        if (load._id == id) {
          xx[id] = {data: load, active: true};
          return;
        }
      }
    };

    vm.editLoad = function (id, type) {

      var xx = {};
      if (type == 'FTL') {
        xx = $rootScope.loadsOpened.ftl;
      } else if (type == 'LTL' || type == 'AIR') {
        xx = $rootScope.loadsOpened.ltl;
      }
      console.log("edit a load whose id/tab is " + id);
      var detail = xx[id];
      if (detail) {
        detail.active = true;
        return;
      }
      setEditingAttribute(id, xx);
    };

    vm.closeTab = function (id, type) {

      if (type == 'FTL') {
        delete $rootScope.loadsOpened.ftl[id];
      } else if (type == 'LTL' || type == 'AIR') {
        delete $rootScope.loadsOpened.ltl[id];
      }
      console.log("close tab =" + id);
    };

    vm.editNewFTLLoad = function () {
      console.log("calling createFTLLoad");
      var load = vm.create('FTL');
      $rootScope.loadsOpened.ftl[load.tabId] = {data: load, active: true};
    };

    vm.editNewFreightLoad = function () {
      console.log("calling createLTLLoad");
      var load = vm.create('LTL');
      $rootScope.loadsOpened.ltl[load.tabId] = {data: load, active: true};
    };

    vm.editNewAirLoad = function () {
      console.log("calling create AIR Load");
      var load = vm.create('AIR');
      $rootScope.loadsOpened.ltl[load.tabId] = {data: load, active: true};
    };

    vm.create = function(type) {
      var load;
      if(type=='FTL') {
        load = angular.copy(vm.emptyFtlLoad);
      }else if(type=='LTL' || type=='AIR') {
        load = angular.copy(vm.emptyFreightLoad);
      }
      load.loadType=type;
      load.tabId = (vm.newLoadId++);
      load.new = true;

      console.log("calling create");
      return load;
    };

    vm.loadConstants = null;

    vm.emptyFtlLoad  = {
      who: 'Your Consignee Name',
      loadType:'FTL',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: {},
        locationType: "Business with Dock/Fork",
        services: []
      },
      shipFrom: {
        label: "shipFrom",
        location: {},
        locationType: "Business with Dock/Fork",
        services: []
      },
      lines: [{weight: 20000,
        quantity: 1,
        packaging: '20',
        description: ''}],

      trailer: {
        type: "Dry Van"
      },

      fulfilledBy: {
        source: null,
        charge: null,
        name: null,
        costItems: [],
        additionalCharges: []
      }

    };

    vm.emptyFreightLoad  = {
      who: 'Your Consignee Name',
      loadType:'LTL',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: {},
        services: []
      },
      shipFrom: {
        label: "shipFrom",
        location: {},
        services: []
      },
      lines: [ {weight: 1000,
      quantity: 1,
      packaging: "Cartons",
      length: 20,
      width: 20,
      height: 20,
      description: ""}],
      fulfilledBy: {
        source: null,
        charge: null,
        name: null,
        costItems: [],
        additionalCharges: []
      }
    };

    vm.computeClass = function(line) {
      if(line.width && line.length && line.height && line.weight) {
        var density = line.weight * 1728.0 / (line.width * line.length * line.height);
        console.log("density = " + density);
        if(density < 1) {
          line.freightClass= 400;
        }else if (density < 2) {
          line.freightClass= 300;
        } else if (density < 4) {
          line.freightClass= 250;
        } else if (density < 6) {
          line.freightClass =250;
        } else if (density < 8) {
          line.freightClass = 125;
        } else if (density < 10) {
          line.freightClass = 100;
        } else if (density < 12) {
          line.freightClass = 92.5;
        } else if (density < 15 ) {
          line.freightClass = 85;
        } else if (density < 15 ) {
          line.freightClass = 85;
        } else if (density < 22.5) {
          line.freightClass = 70;
        } else if (density < 30) {
          line.freightClass = 65;
        } else if (density >= 30) {
          line.freightClass = 60;
        }
      } else {
        line.freightClass = -1;
      }
      return line.freightClass;
    };

    vm.fetchConstants = function(callbackOK, callbackERR) {
      if(!vm.loadConstants) {
        $http.get('/api/load/ftl-loads/util/constants').then(
          function(response) {
            var data = response.data;
            //console.log("constants are " + JSON.stringify((data)));
            vm.loadConstants = {
              ftl: {
                packagings: data.packagings,
                toLocationTypes: data.toLocationTypes,
                fromLocationTypes: data.fromLocationTypes,
                trailerTypes: data.trailerTypes
              },
              ltl: {
                toServices: data.toServices.map(function(item) {
                  return {service:item};
                }),
                fromServices: data.fromServices.map(function(item) {
                  return {service:item};
                }),
                packagings: data.ltlPackagings
              }
            };
            callbackOK();
          }, function(err) {
            console.log(err);
            callbackERR();
          }
        );
      }else {
        callbackOK();
      }
    };

    vm.save = function(load, cb, cbE) {

      vm.progressbar.start();
      var url = load.loadType=='FTL'?'/api/load/ftl-loads':'/api/load/ltl-loads';
      if(!load.new) {
        url = url + "/" + load._id;
        $http.put(url, load).then(cb, cbE).then(function() {
          vm.progressbar.complete();
        });
      }else {
        $http.post(url, load).then(function(response) {
          console.log("created load " + JSON.stringify(response));
          var created = response.data;
          created.tabId = load.tabId;
          load.fulfilledBy = created.fulfilledBy;
          load._id = created._id;
          console.log("created load " + JSON.stringify(created));
          cb(response);
        }, cbE).then(function() {
          vm.progressbar.complete();
        });
      }
    };


    vm.getLoads = function() {
      return vm.loads;
    };

    vm.getCombinedLoads = function() {
        return vm.loads.ftl.concat(vm.loads.ltl);
    };

    vm.getConstants = function() {
      return vm.loadConstants;
    };

    return vm;

  });
