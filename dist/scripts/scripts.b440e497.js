"use strict";angular.module("hackerNewsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"views/main.html"})}]),angular.module("hackerNewsApp").controller("MainCtrl",["$scope","_",function(a,b){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hackerNewsApp").controller("AboutCtrl",["$scope","$http","_",function(a,b,c){var d=function(){b.get("https://hacker-news.firebaseio.com/v0/topstories.json").then(function(b){console.log(b),a.results=b.data},function(b){console.log(b),a.error=b})};a.querySelections=[{name:"wordsStories",description:"Top 10 most occurring words in the last 600 stories"},{name:"wordsWeek",description:"Top 10 most occurring words in the post of exactly the last week"},{name:"wordsUsers",description:"Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma"}],a.selectedQuery=null,a.selectQuery=function(b){switch(b){case"wordsStories":d();break;case"wordsWeek":break;case"wordsUsers":break;default:a.error="case not found"}}}]),angular.module("hackerNewsApp").factory("_",["$window",function(a){return a._}]);