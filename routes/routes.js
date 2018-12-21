"use strict";

module.exports = function(app, passport) {
	/* GET home page. */
	app.get('/', function(req, res) {
	  res.render('index', { user: req.user });
	});

	/* GET login form */
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage'), title: 'Login'});
	});

	/* POST login form */
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));

	/* GET register form */
	app.get('/signup', function(req, res) {
	  res.render('signup', { title: 'Create account' , message: req.flash('signupMessage')});
	});

	/* POST signup form */		
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/statistics', function(req, res) {
		res.render('stats', { title: 'Statistics'});
	});

	/* GET user profile page */
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', { user: req.user});
	});

	/* get LOGOUT */
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//twitter
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/signup'
		}));

	//facebook authentication
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: ['public_profile', 'email'],
	}));

	//callback
	app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/signup'
        }));

	//facebook logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/'); //redirect user to home page after logging out
	});


};

// middleware route
function isLoggedIn(req, res, next) {
	//if user authenticated, allow next
	if (req.isAuthenticated()) {
		return next();
	}

	// if not authenticated, redirect
	res.redirect('/');
}