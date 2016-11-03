'use strict';

/**
 * @ngdoc function
 * @name hackerNewsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hackerNewsApp
 */
angular.module('hackerNewsApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
