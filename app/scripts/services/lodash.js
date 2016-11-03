'use strict';

/**
 * @ngdoc service
 * @name hackerNewsApp.lodash
 * @description
 * # lodash
 * Factory in the hackerNewsApp.
 */
angular.module('hackerNewsApp')
  .factory('_', ['$window', function($window) {
    return $window._;
  }]);
