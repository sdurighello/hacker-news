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

		// --- Api ---

		var apiGetMaxItem = function(){
			return $http.get('https://hacker-news.firebaseio.com/v0/maxitem.json');
		};

		var apiGetItemById = function(itemId){
			return $http.get('https://hacker-news.firebaseio.com/v0/item/'+ itemId +'.json');
		};

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

		var launchLastStories = function () {
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

		var unixTimeToday = Math.round((new Date()).getTime() / 1000);
		var unixTimePast = unixTimeToday - (7*24*60*60);

		var counterFromMax = 0;
		var maxItemId = null;

		var concatText = '';

		var launchLastWeek = function(){
			$scope.isResolving = true;
			$http.get('https://hacker-news.firebaseio.com/v0/maxitem.json').then(function(res){
				maxItemId = parseInt(res.data);
				recursiveApiCall()
			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};

		var recursiveApiCall = function(){
			var storyId = maxItemId - counterFromMax;
			$http.get('https://hacker-news.firebaseio.com/v0/item/'+ storyId +'.json').then(function(res){
				counterFromMax++;
				// Keep checking till you reach the post, then count the words and stop the loop
				console.log(unixTimePast);
				console.log(res.data.time);
				console.log(res.data.text);
				console.log('------');
				if(res.data.time = unixTimePast){
					concatText = concatText.concat(res.data.text.replace(/<[^>]*>?/g, ''));
					var countWords = getCountWords(concatText);
					$scope.orderedListOfWords = getOrderedListOfWords(countWords);
					$scope.isResolving = false;
				} else {
					recursiveApiCall();
				}
			}, function(err){
				counterFromMax++;
				recursiveApiCall();
				console.log(err);
				$scope.error = err;
			});
		};

		// --- ASSIGNMENT 3: Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma ---

		var createRequestBundleUsers = function(storiesWithUsers){
			var requestBundle = [];
			for(var i = 0; i < storiesWithUsers.length; i++){
				requestBundle.push(
					$http.get('https://hacker-news.firebaseio.com/v0/user/'+ storiesWithUsers[i].user +'.json')
				);
			}
			return requestBundle;
		};

		var launchLastStoriesWithKarmaUsers = function () {
			$scope.isResolving = true;
			$http.get('https://hacker-news.firebaseio.com/v0/maxitem.json').then(function(res){
				var maxItemId = parseInt(res.data);
				var requestBundle = createRequestBundle(maxItemId);
				getStories(requestBundle);
			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};

		var getStories = function(requestBundle){
			$q.all(requestBundle).then(function(res){
				var storiesWithUsers = [];
				_.forEach(res, function(r){
					if(r.data.text && r.data.by){
						storiesWithUsers.push({
							text: r.data.text,
							user: r.data.by,
							enoughKarma: false
						});
					}
				});
				var requestBundleUsers = createRequestBundleUsers(storiesWithUsers);
				getWordCountWithUsers(requestBundleUsers, storiesWithUsers);
			}, function(err){
				console.log(err);
				$scope.error = err;
			});
		};

		var getWordCountWithUsers = function(requestBundleUsers, storiesWithUsers){
			$q.all(requestBundleUsers).then(function(res2){
				// Update karma flag
				_.forEach(res2, function(r){
					if(r.data.id && r.data.karma && (parseInt(r.data.karma) >= 10000)){
						var userIndex = _.findIndex(storiesWithUsers, function(stu) { return stu.user === r.data.id })
						storiesWithUsers[userIndex].enoughKarma = true;
					}
				});
				// Concat only text belonging to karma users
				var concatText = '';
				_.forEach(storiesWithUsers, function(stu){
					if(stu.enoughKarma){
						concatText = concatText.concat(stu.text.replace(/<[^>]*>?/g, ''));
					}
				});
				// Publish the count result
				var countWords = getCountWords(concatText);
				$scope.orderedListOfWords = getOrderedListOfWords(countWords);
				$scope.isResolving = false;
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
					launchLastStories();
					break;
				case 'wordsWeek':
					launchLastWeek();
					break;
				case 'wordsUsers':
					launchLastStoriesWithKarmaUsers();
					break;
				default:
					$scope.error = 'case not found';
			}
		};







  }]);
