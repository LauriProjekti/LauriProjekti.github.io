var mongoose = require('mongoose');

var statSchema = mongoose.Schema({

	email: String,
	facebook: String,
	wins: Number,
	losses: Number,
	draws: Number,

});

// export
module.exports = mongoose.model('Stat', statSchema);