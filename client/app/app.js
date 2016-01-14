'use strict';

angular.module('servicesApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'ngAnimate',
  'ngProgress',
  'ngTable',
  'ui.mask',
  'ui.select',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.cellNav',
  'ngCookies',
  'ngCsv',
  'ngCsvImport',
  'google.places',
  'AngularPrint', 'uiGmapgoogle-maps', 'nvd3'
])
  .directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
        element.on('change', function (onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function (onLoadEvent) {
            scope.$apply(function () {
              fn(scope, {$fileContent: onLoadEvent.target.result});
            });
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  })
  .filter('propsFilter', function () {
    return function (items, props) {
      var out = [];
      if (angular.isArray(items)) {
        items.forEach(function (item) {
          var itemMatches = false;
          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }
          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }
      return out;
    };
  })
  .filter('tel', function () {
    return function (tel) {
      if (!tel) { return ''; }

      var value = tel.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
        return tel;
      }

      var country, city, number;

      switch (value.length) {
        case 1:
        case 2:
        case 3:
          city = value;
          break;

        default:
          city = value.slice(0, 3);
          number = value.slice(3);
      }

      if(number){
        if(number.length>3){
          number = number.slice(0, 3) + '-' + number.slice(3,7);
        }
        else{
          number = number;
        }

        return ("(" + city + ") " + number).trim();
      }
      else{
        return "(" + city;
      }

    };
  })
    .filter('containerWeightCharge', function () {
      return function (weightRanges) {

        if (!weightRanges || weightRanges.length==0) { return 'N/A'; }

        return weightRanges.map(function(range) {
          return range.limit + ", +$" + range.charge;
        }).join(";  ");
      };
    })
    .filter('additionalCharges', function () {
      return function (charges) {

        if (!charges || charges.length==0) { return 'N/A'; }

        var str = charges.map(function(x) {
          return "$"+x.charge + ":" + x.name;
        }).join(";  ");
        if(str.length > 30) {
          str = str.substring(0,28);
          str += "..";
        }
        return str;
      };
    })


  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },
      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
