'use strict';

angular.module('servicesApp')
  .directive('location', function ($http) {
    return {
      templateUrl: 'app/location/location.html',
      restrict: 'E',
      scope: {
        info: '=info',
        types: '=types',
        label: '=label'

      },
      link: function (scope, element, attrs) {
        scope.isDelivery = function () {
          return scope.label == 'To';
        };
        scope.autocompleteOptions = {
          componentRestrictions: {country: 'us'}
        };

        scope.clear = function() {
          scope.info.location.raw = null;
        };

        scope.changed = function() {

          var raw = scope.info.location.raw;
          if(!scope.info.location.raw) {
            return;
          }
          var index;
          var result = {};
          for(index=0; index < raw.address_components.length; ++index) {
            var comp = raw.address_components[index];
            if(comp.types.length==2 && comp.types[0]=='administrative_area_level_1')
              result.state = comp.short_name;
            else if(comp.types.length==2 && comp.types[0]=='administrative_area_level_2')
              result.county = comp.short_name;
            else if(comp.types.length==2 && comp.types[0]=='locality')
              result.city = comp.short_name;
            else if(comp.types.length==1 && comp.types[0]=='postal_code')
              result.zipCode = comp.short_name;
          }
          result.street = raw.formatted_address;
          result.raw = raw;
          scope.info.location = result;
        }
      }
    };
  });
