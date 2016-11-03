'use strict';

/**
 * @ngdoc function
 * @name hackerNewsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hackerNewsApp
 */
angular.module('hackerNewsApp')
  .controller('MainCtrl', ['$scope', '_', function ($scope, _) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];




  }]);
