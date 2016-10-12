var LocalStrategy = require('passport-local').Strategy; //local login
var mongoose = require('mongoose');
var User = require('../models/User');

// Passport also needs to serialize and deserialize user instance from a session
// store in order to support login sessions, so that every subsequent request
// will not contain the user credentials.
module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /*
   * The first parameter to passport.use() is the name of the strategy which will be used to
   * identify this strategy when applied later. The second parameter is the type of
   * strategy that you want to create, here we use the username-password or the LocalStrategy.
   * Next, we use the Mongoose API to find the User in our underlying collection of Users to check
   * if the user is a valid user or not. The last parameter in our callback :
   * done denotes a useful method using which we could signal success or failure to Passport module.
   * To specify failure either the first parameter should contain the error, or the second parameter
   * should evaluate to false. To signify success the first parameter should be null and the second parameter
   * should evaluate to a truth value, in which case it will be made available on the request object.
   *
   * process.nextTick(callback) which will defer the execution of the callback until the next
   * pass around the event loop.
   * The callback will fire on the main thread in the same way that callbacks from asynchronous actions do.
   */
  passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ 'local.email':  email }, function(err, user) {
            if (err)
              return done(err);
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);
              newUser.save(function(err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }));

  passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      function(req, email, password, done) {
        User.findOne({ 'local.email':  email }, function(err, user) {
          if (err)
            return done(err);
          if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
          return done(null, user);
        });
      }));

};
