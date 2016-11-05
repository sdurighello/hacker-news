'use strict';

/**
 * @ngdoc function
 * @name hackerNewsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hackerNewsApp
 */
angular.module('hackerNewsApp')
  .controller('AboutCtrl', ['$scope', '$http', '$q', '_', function ($scope, $http, $q, _) {

  	$scope.isResolving = false;

		// --- Utilities ---

		var getCountWords = function (text) {
			var wordCounts = { };
			var words = text.split(/\b/);
			for(var i = 0; i < words.length; i++){
				wordCounts["_" + words[i]] = (wordCounts["_" + words[i]] || 0) + 1;
			}
			return wordCounts
		};

		var getOrderedListOfWords = function (wordCountsObj) {
			var orderedWords = _.chain(wordCountsObj).toPairs().sortBy(1).reverse().value();
			if((orderedWords.length === 10) || (orderedWords.length < 10)){
				return orderedWords;
			}
			return orderedWords.slice(1, 11);
		};

		// --- ASSIGNMENT 1: Top 10 most occurring words in the last 600 stories ---

		// 1. get the https://hacker-news.firebaseio.com/v0/maxitem
		// 2. Loop from max to max-600
					// In each loop count words and accumulate them in a state

		var createRequestBundle = function(maxItemId){
			var requestBundle = [];
			for(var i = maxItemId; i >= maxItemId - 600; i--){
				requestBundle.push(
					$http.get('https://hacker-news.firebaseio.com/v0/item/'+ i +'.json')
				);
			}
			return requestBundle;
		};

		var getMaxItem = function () {
			$scope.isResolving = true;
			$http.get('https://hacker-news.firebaseio.com/v0/maxitem.json').then(function(res){
				var maxItemId = parseInt(res.data);
				var requestBundle = createRequestBundle(maxItemId);
				getLastStoriesWordCount(requestBundle);
			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};

		var getLastStoriesWordCount = function(requestBundle){
			$q.all(requestBundle).then(function(res){
				var concatText = '';
				_.forEach(res, function(r){
					if(r.data.text){
						concatText = concatText.concat(r.data.text.replace(/<[^>]*>?/g, ''));
					}
				});
				var countWords = getCountWords(concatText);
				$scope.orderedListOfWords = getOrderedListOfWords(countWords);
				$scope.isResolving = false;
			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};

		// --- ASSIGNMENT 2: Top 10 most occurring words in the post of exactly the last week ---

		var launchLastWeek = function(){
			$scope.isResolving = true;

			var unixTimeToday = (new Date()).getTime();
			var unixTimePast = unixTimeToday - (7*24*60*60);



			$http.get('https://hacker-news.firebaseio.com/v0/maxitem.json').then(function(res){
				var maxItemId = parseInt(res.data);

			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};


		// --- 	VIEW  ---

    $scope.querySelections = [
			{name: 'wordsStories', description: 'Top 10 most occurring words in the last 600 stories'},
			{name: 'wordsWeek', description: 'Top 10 most occurring words in the post of exactly the last week'},
			{name: 'wordsUsers', description: 'Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma'}
		];

		$scope.selectedQuery = null;
		
		$scope.selectQuery = function (selection) {
			switch (selection) {
				case 'wordsStories':
					getMaxItem();
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
