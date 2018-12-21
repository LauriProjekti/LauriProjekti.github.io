var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
var Stat = require('../models/stat');

// auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

	//session setup

	//serialize user
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	//deserialize user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	//facebook auth
	passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            // find the facebook user from users table
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                //if we get error
                if (err)
                    return done(err);

                // if user found then login
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // else create new user
                    var newUser = new User();

                    //also create stat entry
                    var newStat = new Stat();

                    // set user information to match the profile we got
                    newUser.facebook.id = profile.id;               
                    newUser.facebook.token = token;               
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value; //facebook allows mutliple emails. we can only handle 1

                    //values for stat entry
                    newStat.facebook = profile.name.givenName + ' ' + profile.name.familyName;
                    newStat.wins = 0;
                    newStat.losses = 0;
                    newStat.draws = 0;

                    // save user
                    newUser.save(function(err) {
                    	// if we get an error
                        if (err)
                            throw err;

                        // if successful return the user
                        return done(null, newUser);
                    });

                    //save stat entry
                    newStat.save(function(err) {
                    	// if we get an error
                        if (err)
                            throw err;

                        // if successful return stat
                        return done(null, newStat);
                    });
                }

            });
        });

    }));

	//twitter signup
	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL
	},
	function(token, tokenSecret, profile, done) {
		//wait for twitter data
		process.nextTick(function() {
			User.findOne({ 'twitter.id': profile.id }, function(err, user) {
				// if we get an error
				if (err)
					return done(err);
				//if user found successfully, login
				if (user) {
					return done(null, user);
				}
				//if no user found, create user
				else {
					var newUser = new User();

					//set data before pushing to database
					newUser.twitter.id = profile.id;
					newUser.twitter.token = token;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;

					//save
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	//local signup
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
		User.findOne({ 'local.email' : email }, function(err, user) {
			// error check
			if (err)
				return done(err);

			// check if email exists
			if (user) {
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
			}
			else {
				// if no email exists
				var newUser = new User();

				// also create stat entry for user
				var newStat = new Stat();

				// set user details
				newUser.local.email = email;
				newUser.local.password = newUser.generateHash(password);

				// set stats for user email
				newStat.email = email;
				newStat.wins = 0;
				newStat.losses = 0;
				newStat.draws = 0;

				//save to database
				newUser.save(function(err) {
					if (err)
						throw err;
					return done(null, newUser);
				});

				newStat.save(function(err) {
					if (err)
						throw err;
					return done(null, newStat);
				});
			}
		});
		});
	}));

	passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) { // callback with email and password from our form

        User.findOne({ 'local.email' :  email }, function(err, user) {
        	// check errors
            if (err)
                return done(err);

            // if no user found
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            // if pass wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            // return user if nothing wrong
            return done(null, user);
        });

    }));	

};