'use strict';

/**
 * @ngdoc function
 * @name hackerNewsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hackerNewsApp
 */
angular.module('hackerNewsApp')
  .controller('AboutCtrl', ['$scope', '$http', '$q', '$sce', '_', 'hackerApi', function ($scope, $http, $q, $sce, _, hackerApi) {

  	$scope.isResolving = false;

		// --- Utilities ---

		var scrapeHtml = function(text){
			return text.replace(/<[^>]*>?/g, '');
		};

		var createConcatTextFromFoundStories = function(storiesFound){
			var concatText = '';
			storiesFound.forEach(function(s){
				if(s.text){
					concatText = concatText.concat(scrapeHtml(s.text));
				}
			});
			return concatText;
		};

		var getCountWords = function (concatText) {
			var wordCounts = { };
			var words = concatText.split(/\b/);
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

		function assignment1(){

			$scope.isResolving = true;
			$scope.progressBarPercentage = 0;
			$scope.orderedListOfWords = null;

			var maxItemId = 0;
			var idCounter = 0;
			var maxNumberOfStories = 5; // 600
			var storiesFound = [
				// { userId: ... , itemUrl: ... , text: ... , enoughKarma: false }
			];

			var processItemText = function(){

				var results = [];
				var pushResult = function (r) {
					results.push(r);
				};
				var pushError = function (e) {
					results.push(null);
				};

				var bundleRequestsArticles = _.map(storiesFound, function (s) {
					return $http({method: 'GET', url: s.itemUrl}).then(pushResult).catch(pushError);
				});
				console.log(bundleRequestsArticles);

				$q.all(bundleRequestsArticles).then(function(){
					console.log(results);

					_.forEach(results, function(r, i){
						if(r){ storiesFound[i].text = r.data; }
					});
					console.log(storiesFound);

					var concatText = createConcatTextFromFoundStories(storiesFound);
					console.log(concatText);
					var countWords = getCountWords(concatText);
					$scope.orderedListOfWords = getOrderedListOfWords(countWords);

					$scope.isResolving = false;

				}, function(err){
					console.log(err);
					$scope.isResolving = false;
				});
			};

			function recursivelyGetItem(){

				hackerApi.getItemById(maxItemId - idCounter).then(function(data){
					console.log(data);
					if(data && (data.type === 'story') && data.url){
						storiesFound.push({
							userId: data.by,
							itemUrl: data.url,
							text: ''
						});
						$scope.progressBarPercentage = Math.round(((storiesFound.length || 0) / maxNumberOfStories) * 100);
					}
					idCounter++;
					if(storiesFound.length < maxNumberOfStories){
						recursivelyGetItem();
					} else {
						processItemText();
					}
				}, function(err){
					console.log(err);
					idCounter++;
					if(storiesFound.length < maxNumberOfStories){
						recursivelyGetItem();
					} else {
						processItemText();
					}
				});
			}

			hackerApi.getMaxItem().then(function(data){

				maxItemId = parseInt(data);
				recursivelyGetItem();
			}, function(err){
				console.log(err);
				$scope.isResolving = false;
			});

		}

		// --- ASSIGNMENT 2: Top 10 most occurring words in the post of exactly the last week ---

		var assignment2 = function(){

			$scope.isResolving = true;
			$scope.progressBarPercentage = 100;
			$scope.orderedListOfWords = null;

			var daysAgo = 7;
			var unixTimeToday = Math.round((new Date()).getTime() / 1000);
			// var unixTimePast = unixTimeToday - (daysAgo*24*60*60);
			var unixTimePast = unixTimeToday - (3*60);

			var counterFromMax = 0;
			var maxItemId = null;
			var foundText = '';

			var recursiveApiCall = function(){
				// Keep checking till you reach the post, then count the words and stop the loop
				var itemId = maxItemId - counterFromMax;
				counterFromMax++;
				hackerApi.getItemById(itemId).then(function(data){
					console.log(unixTimePast);
					console.log(data.time);
					console.log(data.text);
					console.log('------');
					if(data.time === unixTimePast){
						if(data.type === 'post'){
							if(data.text){ foundText = data.text.replace(/<[^>]*>?/g, ''); }
							var countWords = getCountWords(foundText);
							$scope.orderedListOfWords = getOrderedListOfWords(countWords);
							$scope.isResolving = false;
						} else {
							recursiveApiCall();
						}
					} else if(data.time > unixTimePast) {
						recursiveApiCall();
					} else {
						$scope.isResolving = false;
					}
				}, function(err){
					recursiveApiCall();
					console.log(err);
				});
			};

			hackerApi.getMaxItem().then(function(data){
				maxItemId = parseInt(data);
				recursiveApiCall()
			}, function(err){
				console.log(err);
			});

		};

		// --- ASSIGNMENT 3: Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma ---

		var assignment3 = function(){

			$scope.isResolving = true;
			$scope.progressBarPercentage = 100;
			$scope.orderedListOfWords = null;

			var numberOfItems = 20; // 600
			var minimumKarma = 1000; // 10000

			var results = [];
			var pushResult = function (r) {
				results.push(r);
			};
			var pushError = function (e) {
				results.push(null);
			};

			var createRequestBundleItems = function(maxItemId){
				var requestBundle = [];
				for(var i = maxItemId; i > maxItemId - numberOfItems; i--){
					requestBundle.push(
						$http.get('https://hacker-news.firebaseio.com/v0/item/'+ i +'.json').then(pushResult).catch(pushError)
					);
				}
				return requestBundle;
			};

			var createRequestBundleUsers = function(storiesFound){
				var requestBundle = [];
				for(var i = 0; i < storiesFound.length; i++){
					requestBundle.push(
						$http.get('https://hacker-news.firebaseio.com/v0/user/'+ storiesFound[i].user +'.json').then(pushResult).catch(pushError)
					);
				}
				return requestBundle;
			};

			var getStories = function(requestBundle){
				results = [];
				$q.all(requestBundle).then(function(){
					var storiesWithUsers = [];
					_.forEach(results, function(r){
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
				results = [];
				$q.all(requestBundleUsers).then(function(){
					// Update karma flag
					_.forEach(results, function(r){
						console.log('karma: ' + r.data.karma);
						if(r.data.id && r.data.karma && (parseInt(r.data.karma) >= minimumKarma)){
							var userIndex = _.findIndex(storiesWithUsers, function(stu) { return stu.user === r.data.id });
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

			hackerApi.getMaxItem().then(function(data){
				var maxItemId = parseInt(data);
				var requestBundleItems = createRequestBundleItems(maxItemId);
				getStories(requestBundleItems);
			}, function(err){
				console.log(err);
				$scope.error = err;
			});

		};

		// --- 	VIEW  ---

    $scope.querySelections = [
			{name: 'assignment1', description: 'Top 10 most occurring words in the last 600 stories'},
			{name: 'assignment2', description: 'Top 10 most occurring words in the post of exactly the last week'},
			{name: 'assignment3', description: 'Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma'}
		];

		$scope.selectedQuery = null;
		
		$scope.selectQuery = function (selection) {
			switch (selection) {
				case 'assignment1':
					// launchLastStories();
					assignment1();
					break;
				case 'assignment2':
					assignment2();
					break;
				case 'assignment3':
					assignment3();
					break;
				default:
					console.log('case not found');
			}
		};


  }]);
