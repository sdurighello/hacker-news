'use strict';

/**
 * @ngdoc service
 * @name hackerNewsApp.hackerApi
 * @description
 * # hackerApi
 * Factory in the hackerNewsApp.
 */
angular.module('hackerNewsApp')
  .factory('hackerApi', function($http, $log, $q) {

    function getItemById(itemId) {
      var deferred = $q.defer();
      $http.get('https://hacker-news.firebaseio.com/v0/item/'+ itemId +'.json').success(function(res) {
        deferred.resolve(res.data);
      }).error(function(err) {
        deferred.reject(err);
        $log.error(err);
      });
      return deferred.promise;
    }

    function getMaxItem() {
      var deferred = $q.defer();
      $http.get('https://hacker-news.firebaseio.com/v0/maxitem.json').success(function(res) {
        deferred.resolve(res.data);
      }).error(function(err) {
        deferred.reject(err);
        $log.error(err);
      });
      return deferred.promise;
    }

    return {
      getMaxItem : getMaxItem,
      getItemById: getItemById
    }

  });
