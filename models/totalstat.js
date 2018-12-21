var mongoose = require('mongoose');

var totalstatSchema = mongoose.Schema({

	o_wins: Number,
	x_wins: Number

});

// export
module.exports = mongoose.model('Totalstat', totalstatSchema);