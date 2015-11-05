'use strict';

angular.module('servicesApp')
  .service('loadService', function ($http) {

    var vm = this;
    vm.loads = {
      ltl: [],
      ftl: []
    };

    vm.loadConstants = null;

    vm.emptyFtlLoad  = {
      who: 'NEW one',
      loadType:'FTL',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: {},
        locationType: "Business with Dock/Fork",
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: {},
        locationType: "Business with Dock/Fork",
        extraServices: []
      },
      lines: [],

      trailer: {
        type: "Dry Van"
      }
    };

    vm.emptyFreightLoad  = {
      who: 'NEW one',
      loadType:'LTL',
      expectedBy: null,
      notes: "",
      shipTo: {
        label: "shipTo",
        location: {},
        services: [],
        extraServices: []
      },
      shipFrom: {
        label: "shipFrom",
        location: {},
        services: [],
        extraServices: []
      },
      lines: []
    };


    vm.fetch = function(type, days, cbOK, cbErr) {

      console.log('fetch loads from the db');
      var queryType = (type || 'ALL');
      var queryDaysString = days!=-1?('&days='+days):'';

      if(queryType=='ALL' || queryType=='FTL') {
        $http.get('/api/load/ftl-loads?status=OPEN' + queryDaysString).then(
          function(response) {
            //console.log(JSON.stringify(response.data));
            vm.loads.ftl = response.data;
            cbOK();
          },
          function(response) {
            console.log('ran into error ' + response);
            cbErr();
          });
      }
      if(queryType=='ALL' || queryType=='LTL') {
        $http.get('/api/load/ltl-loads?status=OPEN' + queryDaysString).then(
          function(response) {
            //console.log(JSON.stringify(response.data));
            vm.loads.ltl = response.data;
            cbOK();
          },
          function(response) {
            console.log('ran into error ' + response);
            cbErr();
          });
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
      return;
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

    vm.getLoads = function() {
      return vm.loads;
    };

    vm.getConstants = function() {
      return vm.loadConstants;
    };

    return vm;

  });
