'use strict';

/**
 * @ngdoc function
 * @name hackerNewsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hackerNewsApp
 */
angular.module('hackerNewsApp')
  .controller('AboutCtrl', ['$scope', '$http', '_', function ($scope, $http, _) {

		// Top 10 most occurring words in the last 600 stories

		// 1. get the https://hacker-news.firebaseio.com/v0/maxitem
		// 2. Loop from max to max-600
					// In each loop count words and accumulate them in a state

		var wordCounts = { };

		var countWords = function (text) {
			var words = text.split(/\b/);
			for(var i = 0; i < words.length; i++){
				wordCounts["_" + words[i]] = (wordCounts["_" + words[i]] || 0) + 1;
			}
		};

		var getOrderedListOfWords = function (wordCountsObj) {
			var orderedWords = _.chain(wordCountsObj).toPairs().sortBy(1).reverse().value();
			if((orderedWords.length === 10) || (orderedWords.length < 10)){
				return orderedWords;
			}
			return orderedWords.slice(1, 11);
		};

		console.log(getOrderedListOfWords({'one':1, 'ten':10, 'two':2}));

		// Test with pyramid of doom. Will move into $q.
		var wordsStories = function () {
			$http.get('https://hacker-news.firebaseio.com/v0/maxitem.json').then(function(res){
				console.log(parseInt(res.data));
			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};

		wordsStories();

		// Test API, to be deleted
    var getTopStories = function () {
      $http.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(res){
				console.log(res.data);
        $scope.results = res.data;
      }, function(err){
        console.log(err);
        $scope.error = err;
      });
    };

    $scope.querySelections = [
			{name: 'wordsStories', description: 'Top 10 most occurring words in the last 600 stories'},
			{name: 'wordsWeek', description: 'Top 10 most occurring words in the post of exactly the last week'},
			{name: 'wordsUsers', description: 'Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma'}
		];

		$scope.selectedQuery = null;
		
		$scope.selectQuery = function (selection) {
			switch (selection) {
				case 'wordsStories':
					getTopStories();
					break;
				case 'wordsWeek':

					break;
				case 'wordsUsers':

					break;
				default:
					$scope.error = 'case not found';
			}
		};







  }]);
