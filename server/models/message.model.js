const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = new schema({
	text: String,
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	room: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Room',
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
