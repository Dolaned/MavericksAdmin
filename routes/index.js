var express = require('express');
var router = express.Router();
var request = require("request");
var urllib = require('urllib');

var body = ["", "", "", ""];

function doCall(urlToCall, callback) {
  urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {
    var statusCode = response.statusCode;
    return callback(JSON.parse(data));
  });
}

var urls = [
  "http://www.omdbapi.com/?t=jungle+book&y=2016&plot=short&r=json",
  "http://www.omdbapi.com/?t=zootopia&y=2016&plot=short&r=json",
  "http://www.omdbapi.com/?t=Sausage+party&y=&plot=short&r=json",
  "http://www.omdbapi.com/?t=kung+fu+panda&y=2016&plot=short&r=json",
  "http://www.omdbapi.com/?t=minions&y=&plot=short&r=json",
  "http://www.omdbapi.com/?t=ice+age&y=2016&plot=short&r=json",
  "http://www.omdbapi.com/?t=finding+dory&y=2016&plot=short&r=json",
  "http://www.omdbapi.com/?t=pete's+dragon&y=2016&plot=short&r=json"
];

/*
 "http://www.omdbapi.com/?t=jungle+book&y=2016&plot=short&r=json",
 "http://www.omdbapi.com/?t=secret+life+of+pets&y=2016&plot=short&r=json",
 "http://www.omdbapi.com/?t=pete's+dragon&y=2016&plot=short&r=json",
 "http://www.omdbapi.com/?t=finding+dory&y=2016&plot=short&r=json",
 "http://www.omdbapi.com/?t=zootopia&y=2016&plot=short&r=json"
 */

doCall(urls[0], function(response){
  // Here you have access to your variable
  body[0] = response;
})

doCall(urls[1], function(response){
  // Here you have access to your variable
  body[1] = response;
})

doCall(urls[2], function(response){
  // Here you have access to your variable
  body[2] = response;
})

doCall(urls[3], function(response){
  // Here you have access to your variable
  body[3] = response;
})

doCall(urls[4], function(response){
  // Here you have access to your variable
  body[4] = response;
})

doCall(urls[5], function(response){
  // Here you have access to your variable
  body[5] = response;
})

doCall(urls[6], function(response){
  // Here you have access to your variable
  body[6] = response;
})

doCall(urls[7], function(response){
  // Here you have access to your variable
  body[7] = response;
})


/*
 var http = require('http');
 var client = http.request(80, "google.com");
 request = client.request();
 request.on('response', function( res ) {
 res.on('data', function( data ) {
 console.log( data );
 } );
 } );
 request.end();
 */


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    movies: body,
  })
});

module.exports = router;