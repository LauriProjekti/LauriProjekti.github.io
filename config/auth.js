module.exports = {
	'twitterAuth': {
		'consumerKey': 'pZZ9pXYjadv9vqfHmgEhqwkqR',
		'consumerSecret': 'zeqbR5buEeNlLfq1UCrM81E3aqFKXk6L8TnBUalvBj30XVK4D8',
		'callbackURL': 'http://localhost:3000/auth/twitter/callback'
	},

	'facebookAuth': {
		'clientID': '2002288236505254',
		'clientSecret': '7b2f531bd6e2753bcc96fe5725d0eb5c',
		'callbackURL': 'http://localhost:3000/auth/facebook/callback',
		'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
		'profileFields' : ['id', 'email', 'name']
	}
};