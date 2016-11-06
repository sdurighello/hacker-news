"use strict";angular.module("hackerNewsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/main"})}]),angular.module("hackerNewsApp").controller("MainCtrl",["$scope","_",function(a,b){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hackerNewsApp").controller("AboutCtrl",["$scope","$http","$q","$sce","_","hackerApi",function(a,b,c,d,e,f){function g(){function d(){f.getItemById(g-h).then(function(b){console.log(b),b&&"story"===b.type&&b.url&&(m.push({userId:b.by,itemUrl:b.url,text:""}),a.progressBarPercentage=Math.round((m.length||0)/l*100)),h++,m.length<l?d():n()},function(a){console.log(a),h++,m.length<l?d():n()})}a.isResolving=!0,a.progressBarPercentage=0,a.orderedListOfWords=null;var g=0,h=0,l=5,m=[],n=function(){var d=[],f=function(a){d.push(a)},g=function(a){d.push(null)},h=e.map(m,function(a){return b({method:"GET",url:a.itemUrl}).then(f)["catch"](g)});console.log(h),c.all(h).then(function(){console.log(d),e.forEach(d,function(a,b){a&&(m[b].text=a.data)}),console.log(m);var b=i(m);console.log(b);var c=j(b);a.orderedListOfWords=k(c),a.isResolving=!1},function(b){console.log(b),a.isResolving=!1})};f.getMaxItem().then(function(a){g=parseInt(a),d()},function(b){console.log(b),a.isResolving=!1})}a.isResolving=!1;var h=function(a){return a.replace(/<[^>]*>?/g,"")},i=function(a){var b="";return a.forEach(function(a){a.text&&(b=b.concat(h(a.text)))}),b},j=function(a){for(var b={},c=a.split(/\b/),d=0;d<c.length;d++)b["_"+c[d]]=(b["_"+c[d]]||0)+1;return b},k=function(a){var b=e.chain(a).toPairs().sortBy(1).reverse().value();return 10===b.length||b.length<10?b:b.slice(1,11)},l=function(){a.isResolving=!0,a.progressBarPercentage=100,a.orderedListOfWords=null;var b=Math.round((new Date).getTime()/1e3),c=b-180,d=0,e=null,g="",h=function(){var b=e-d;d++,f.getItemById(b).then(function(b){if(console.log(c),console.log(b.time),console.log(b.text),console.log("------"),b.time===c)if("post"===b.type){b.text&&(g=b.text.replace(/<[^>]*>?/g,""));var d=j(g);a.orderedListOfWords=k(d),a.isResolving=!1}else h();else b.time>c?h():a.isResolving=!1},function(a){h(),console.log(a)})};f.getMaxItem().then(function(a){e=parseInt(a),h()},function(a){console.log(a)})},m=function(){a.isResolving=!0,a.progressBarPercentage=100,a.orderedListOfWords=null;var d=20,g=1e3,h=[],i=function(a){h.push(a)},l=function(a){h.push(null)},m=function(a){for(var c=[],e=a;e>a-d;e--)c.push(b.get("https://hacker-news.firebaseio.com/v0/item/"+e+".json").then(i)["catch"](l));return c},n=function(a){for(var c=[],d=0;d<a.length;d++)c.push(b.get("https://hacker-news.firebaseio.com/v0/user/"+a[d].user+".json").then(i)["catch"](l));return c},o=function(b){h=[],c.all(b).then(function(){var a=[];e.forEach(h,function(b){b.data.text&&b.data.by&&a.push({text:b.data.text,user:b.data.by,enoughKarma:!1})});var b=n(a);p(b,a)},function(b){console.log(b),a.error=b})},p=function(b,d){h=[],c.all(b).then(function(){e.forEach(h,function(a){if(console.log("karma: "+a.data.karma),a.data.id&&a.data.karma&&parseInt(a.data.karma)>=g){var b=e.findIndex(d,function(b){return b.user===a.data.id});d[b].enoughKarma=!0}});var b="";e.forEach(d,function(a){a.enoughKarma&&(b=b.concat(a.text.replace(/<[^>]*>?/g,"")))});var c=j(b);a.orderedListOfWords=k(c),a.isResolving=!1},function(b){console.log(b),a.error=b})};f.getMaxItem().then(function(a){var b=parseInt(a),c=m(b);o(c)},function(b){console.log(b),a.error=b})};a.querySelections=[{name:"assignment1",description:"Top 10 most occurring words in the last 600 stories"},{name:"assignment2",description:"Top 10 most occurring words in the post of exactly the last week"},{name:"assignment3",description:"Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma"}],a.selectedQuery=null,a.selectQuery=function(a){switch(a){case"assignment1":g();break;case"assignment2":l();break;case"assignment3":m();break;default:console.log("case not found")}}}]),angular.module("hackerNewsApp").factory("_",["$window",function(a){return a._}]),angular.module("hackerNewsApp").factory("hackerApi",["$http","$log","$q",function(a,b,c){function d(d){var e=c.defer();return a.get("https://hacker-news.firebaseio.com/v0/item/"+d+".json").success(function(a){e.resolve(a)}).error(function(a){e.reject(a),b.error(a)}),e.promise}function e(){var d=c.defer();return a.get("https://hacker-news.firebaseio.com/v0/maxitem.json").success(function(a){d.resolve(a)}).error(function(a){d.reject(a),b.error(a)}),d.promise}function f(d){var e=c.defer();return a.get("https://hacker-news.firebaseio.com/v0/user/"+d+".json").success(function(a){e.resolve(a)}).error(function(a){e.reject(a),b.error(a)}),e.promise}return{getMaxItem:e,getItemById:d,getUserById:f}}]);