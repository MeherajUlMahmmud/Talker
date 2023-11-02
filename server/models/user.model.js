const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = schema({
	_id: mongoose.Schema.Types.ObjectId, // Automatically generated unique identifier
	username: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
