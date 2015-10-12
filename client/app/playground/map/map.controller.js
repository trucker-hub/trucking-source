'use strict';

angular.module('servicesApp')
  .controller('MapCtrl', function ($scope) {

        $scope.map = { center: { latitude: 33.83 ,  longitude: -118.34}, zoom: 11 };

  });
