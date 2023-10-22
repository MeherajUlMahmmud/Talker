const mongoose = require('mongoose');
const schema = mongoose.Schema;

const roomSchema = new schema({
	name: {
		type: String,
		required: true,
	},
	description: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // Assuming you have a User schema for chat app users
	},
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // Assuming you have a User schema for chat app users
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
