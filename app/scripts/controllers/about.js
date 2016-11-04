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

    var getTopStories = function () {
      $http.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(res){
        console.log(res);
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
