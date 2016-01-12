'use strict';

angular.module('servicesApp')
    .controller('MainCtrl', function ($scope, $http, socket, loadService, sourcingService) {
      $scope.awesomeThings = [];

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
      $scope.quickie = loadService.emptyFtlLoad;


      var quickQuote = function () {
        $scope.quickie.processing = true;
        $scope.quickie.lines[0].weight = $scope.quickie.weight;
        $scope.quickie.quote = {lowest: null, highest:null};
        sourcingService.quickQuote($scope.quickie,
            function (load) {
              if(load.sources.length > 0) {
                $scope.quickie.quote.lowest  = load.sources[0].totalCost;
                $scope.quickie.quote.highest = load.sources[load.sources.length-1].totalCost;
                $scope.quickie.quote.average = load.sources.reduce(function(total, item) {return total + item.totalCost;}, 0)/(load.sources.length || 1);
                $scope.quickie.description =  load.sources.length + " matches";
              }else {
                $scope.quickie.description = "No Quote Found";
              }
              $scope.quickie.processing = false;
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
