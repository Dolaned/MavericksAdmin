var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");
var urllib = require('urllib');

var credentials = require('../config/credentials.js');

var body = ["", "", "", ""];

function doCall(urlToCall, callback) {
  urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {
    var statusCode = response.statusCode;
    return callback(JSON.parse(data));
  });
}

/*
 * The options object is optional, but we want to specify the keepAlive option, which will
 * prevent database connection errors for long-running applications (like a website).
 */

var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
// reading credentials from credentials.js
mongoose.connect(credentials.mongo.development.connectionString, opts);


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
});

doCall(urls[1], function(response){
  // Here you have access to your variable
  body[1] = response;
});

doCall(urls[2], function(response){
  // Here you have access to your variable
  body[2] = response;
});

doCall(urls[3], function(response){
  // Here you have access to your variable
  body[3] = response;
});

doCall(urls[4], function(response){
  // Here you have access to your variable
  body[4] = response;
});

doCall(urls[5], function(response){
  // Here you have access to your variable
  body[5] = response;
});

doCall(urls[6], function(response){
  // Here you have access to your variable
  body[6] = response;
});

doCall(urls[7], function(response){
  // Here you have access to your variable
  body[7] = response;
});


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
    title: 'Mavericks Movie Blog'
  })
});

/* Individual post*/
router.get('/post', function(req, res, next) {
  var id = req.query.id;
  var url = 'http://www.omdbapi.com/?i='+id+'&plot=full&r=json';
  var result = "";
  doCall(url, function(response){
    result = response;

    var title = "Not Found - Mavericks Movie Blog";
    if(result.Response != "False") {
      title = result.Title + " - Mavericks Movie Blog";
    }
    res.render('post', {
      title: title,
      movie: result
    });
  });
});

/* Search */
router.get('/search', function(req, res, next) {
  var term = req.query.term;
  var year = req.query.year;
  var url = 'http://www.omdbapi.com/?t=+'+term+'&y='+year+'&plot=short&r=json';
  var result = "";
  doCall(url, function(response){
    result = response;
    res.render('search', {
      term: term,
      movie: result,
      title: 'Search - Mavericks Movie Blog'
    });
  });
});

router.get('/login', function(req, res, next) {
    res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', { user: req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}