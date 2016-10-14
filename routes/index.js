var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");
var urllib = require('urllib');
var async = require('async');

var credentials = require('../config/credentials.js');
var Movies = require('../models/Movie');
var Comments = require('../models/Comment');
var Users = require('../models/User');

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


/* GET home page. */
router.get('/', function(req, res, next) {
    var found = false;
    var arr = [];

    Movies.find().sort({created_at: -1}).limit(8).exec(function(err, result) {
        if(err) {
            throw err;
        }
        if(result.length < 1) {
            found = false;
        }
        else {
            found = true;
        }

        async.filter(result, function(val, callback) {
            doCall('http://www.omdbapi.com/?i='+val['omdbid']+'&plot=short&r=json', function(response) {
                arr.push(response);
                callback(null, false);
            });
        }, function(err, ret) {
            res.render('index', {
                title: 'Mavericks Movie Blog',
                login: checkLoggedIn(req),
                found: found,
                movies: arr
            });
        });

        return true;
    });
});

/*Get Comments for specific movie*/






/* Individual post*/
router.get('/post', function(req, res, next) {
  var id = req.query.id;
  var url = 'http://www.omdbapi.com/?i='+id+'&plot=full&r=json';
  var result = "";
  doCall(url, function(response){
    result = response;
      var arr = [];

    var title = "Not Found - Mavericks Movie Blog";
    if(result.Response != "False") {
      title = result.Title + " - Mavericks Movie Blog";
      checkMovieExists(result.imdbID);

        async.series([
            function(callback) {
                Comments.find({movie_id : result.imdbID}).exec(function(err, res){
                    if(err) {
                        throw err;
                    }

                    for(var temp in res){
                        if (res[temp]['parent_id'] == '-1'){
                            var pusher = {};
                            pusher['comment'] = res[temp];
                            pusher['user'] = [];
                            if(res[temp]['user_id'] != "-1") {
                                Users.findOne({_id : res[temp]['user_id']}).exec(function(err,result1){
                                    if(err)
                                        throw err;
                                    pusher['user'].push(result1);
                                });
                            }
                            pusher['replies'] = [];

                            for(var r in res) {
                                if(res[r]['parent_id'] == res[temp]['_id']) {
                                    var pusher2 = {};
                                    pusher2['comment'] = res[r];
                                    pusher2['user'] = [];
                                    if(res[r]['user_id'] != "-1") {
                                        Users.findOne({_id : res[r]['user_id']}).exec(function(err,result2){
                                            if(err)
                                                throw err;
                                            pusher2['user'].push(result2);
                                        });
                                    }

                                    pusher['replies'].push(pusher2);
                                }
                            }

                            arr.push(pusher);
                        }
                    }
                    callback(null, true);

                });
            }
        ], function(err) {
            if(err)
                throw err;

            res.render('post', {
                title: title,
                movie: result,
                login: checkLoggedIn(req),
                user: req.user,
                comments: arr
            });
        });
    }
    else {
        res.render('post', {
            title: title,
            movie: result,
            login: checkLoggedIn(req),
            user: req.user,
            comments: arr
        });
    }
  });
});

/* Search */
router.get('/search', function(req, res, next) {
  var term = req.query.term;
  var year = req.query.year;
  var url = 'http://www.omdbapi.com/?s='+term+'&y='+year;
  var result = "";
  doCall(url, function(response){
    result = response;
      var arr = [];
      if(result.Response != "False") {
            arr = result['Search'];
      }
    res.render('search', {
      term: term,
      movies: arr,
      title: 'Search - Mavericks Movie Blog',
      login: checkLoggedIn(req)
    });
  });
});

router.get('/login', notLoggedIn, function(req, res, next) {
    res.render('login', {
        message: req.flash('loginMessage'),
        login: checkLoggedIn(req)
    });
});

router.get('/signup', notLoggedIn, function(req, res) {
    res.render('signup', {
        message: req.flash('signupMessage'),
        login: checkLoggedIn(req)
    });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user: req.user,
        login: checkLoggedIn(req)
    });
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

router.post('/post', function (req, res, next) {
   var comment = new Comments();
    comment.movie_id = req.body.movieid;
    comment.parent_id = req.body.parentid;
    comment.body = req.body.body;
    comment.user_id = req.body.userid;
    comment.created_at = new Date();

    comment.save(function (err) {
        if (err)
            throw err;
        return true;
    });
    res.redirect('/post?id='+req.body.movieid);
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function checkLoggedIn(req) {
    if(req.isAuthenticated()) {
        return true;
    }
    return false;
}

function checkMovieExists(id) {
    Movies.findOne({"omdbid": id}, function(err, movie) {
        if(err) {
            throw err;
        }

        if(movie) {
            return false;
        }
        else {
            var newMovie = new Movies();
            newMovie.omdbid = id;
            newMovie.created_at = new Date();
            newMovie.save(function (err) {
                if (err)
                    throw err;
                return true;
            });
        }
    });
}

