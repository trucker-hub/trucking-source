'use strict';

angular.module('servicesApp')
  .directive('location', function ($http) {
    return {
      templateUrl: 'app/location/location.html',
      restrict: 'E',
      scope: {
        info: '=info',
        type: '=type',
        label: '=label'

      },
      link: function (scope, element, attrs) {
        scope.isDelivery = function() {
          return scope.label=='To';
        }

        scope.isFTL = function() {
          return scope.type=='FTL';
        }

        scope.fetchCityAndCounty = function() {

          if(!scope.info.location || scope.info.location.length!=5) {
            scope.info.validated = false;
            return;
          }
          var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + scope.info.location;

          $http.get(url).then(
            function(response) {
              var results = response.data.results;
              console.log(JSON.stringify(results));
              var addressComponents = results[0].address_components;
              console.log(JSON.stringify(addressComponents));
              scope.info.city = addressComponents[1].short_name;
              scope.info.county = addressComponents[2].short_name;
              scope.info.validated = true;
            },
            function(response) {
              console.log(response);
              scope.info.validated = false;
            }
          )

        }
      }

    };
  });
