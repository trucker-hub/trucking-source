'use strict';

angular.module('servicesApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $location, socket, Auth, loadService, sourcingService) {

    console.log("started MainCtrl");

    $scope.awesomeThings = [];

    Auth.isLoggedInAsync(function() {
      $scope.isLoggedIn = Auth.isLoggedIn();
    });

    $scope.$on('login', function () {
      console.log("MainCtrl received broadcast on login event");
       Auth.isLoggedInAsync(function() {
         $scope.isLoggedIn = Auth.isLoggedIn();
      });
    });

    $scope.$on('logout', function () {
      console.log("MainCtrl received broadcast on logout event");
      $scope.isLoggedIn = Auth.isLoggedIn();
    });

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
            $scope.quickie.sourcesHtml = load.sources.reduce(function(str, item) {
              return str + "<span>" + item.name + ": $" + item.totalCost + "</span><br>"
            }, '');
          } else {
            $scope.quickie.description = "No Quote Found";
            $scope.quickie.sourcesHtml ="";
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
