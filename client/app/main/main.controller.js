'use strict';

angular.module('servicesApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $location, socket, Auth, loadService, sourcingService) {
    $scope.awesomeThings = [];

    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.isOperator = Auth.isOperator();
    $scope.isCarrier = Auth.isCarrier();

    $http.get('/api/things').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function () {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: $scope.newThing});
      $scope.newThing = '';
    };

    $scope.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.showContent = function ($fileContent) {
      $scope.content = $fileContent;
    };

    $scope.disableQuickQuote = function () {
      return !$scope.quickie.weight || !$scope.quickie.shipTo.location.full_address
    };
    $scope.quickie = loadService.create("FTL");

    $scope.editQuickie = function() {

      if ($scope.quickie.loadType == 'FTL') {
        $rootScope.loadsOpened.ftl[$scope.quickie.tabId] = {data: $scope.quickie, active: true};
      } else {
        $rootScope.loadsOpened.ltl[$scope.quickie.tabId] = {data: $scope.quickie, active: true};
      }
      $location.path('/loads');
    };


    var quickQuote = function () {
      $scope.quickie.processing = true;
      $scope.quickie.lines[0].weight = $scope.quickie.weight;
      $scope.quickie.quote = {lowest: null, highest: null};
      sourcingService.quickQuote($scope.quickie,
        function (load) {
          $scope.quickie.processing = false;
          if (load.sources.length > 0) {
            $scope.quickie.quote.lowest = load.sources[0].totalCost;
            $scope.quickie.quote.highest = load.sources[load.sources.length - 1].totalCost;
            $scope.quickie.quote.average = load.sources.reduce(function (total, item) {
                return total + item.totalCost;
              }, 0) / (load.sources.length || 1);
            $scope.quickie.description = load.sources.length + " matches";
          } else {
            $scope.quickie.description = "No Quote Found";
          }
        },
        function (load) {
          $scope.quickie.processing = false;
          $scope.quickie.description = "No Quote Found";
        });
    };

    $scope.quickFTL = function () {
      $scope.quickie.loadType = "FTL";
      quickQuote();
    };
    $scope.quickLTL = function () {
      $scope.quickie.loadType = "LTL";
      quickQuote();
    };
    $scope.quickAIR = function () {
      $scope.quickie.loadType = "AIR";
      quickQuote();
    };
  });
