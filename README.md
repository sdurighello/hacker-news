
In this assignment we’ll be asking you to build a small angular app that talks to a public api of HackerNews. 
(documentation on [HackerNews GitHub](https://github.com/HackerNews/API) )

It has two pages.

1. An page that introduces the app and explains what it does with instructions how to operate it

2. A page that displays a list (details specified below), a refresh button and a dropdown list

The dropdown determines which list will be shown. The options are
* Top 10 most occurring words in the last 600 stories
* Top 10 most occurring words in the post of exactly the last week
* Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma

When you press the refresh button the app fetches the latest information from the api 
(don’t reload the page, do this dynamically)

* Publish your code to a (public) git repository.
* Make sure you find a way to publish the app online so it can be viewed.
* We understand that some calculations take time, that’s ok. Just make sure the user is aware that the app is busy.
* If there is an opportunity to improve the speed of the app by applying parallel calls, take it!
