var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

	local: {
		email: String,
		password: String,
	},

	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},

	facebook: {
		id: String,
		token: String,
		name: String,
		email: String
	}

});

//generate hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// compare password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// export
module.exports = mongoose.model('User', userSchema);