const Message = require("../models/message.model");
const Room = require("../models/room.model");
const User = require("../models/user.model");

exports.create_room = async function (req, res) {
	const { userId } = req.userId;
	const { roomName } = req.body;

	try {
		if (!roomName) {
			return res.status(400).json({ message: 'Room name is required' });
		}

		// Create a new room in the database
		const room = new Room({
			name: roomName,
			owner: userId, // Assuming you have the user ID stored in a variable called userId
			members: [userId], // Add the owner to the list of members
		});

		await room.save();

		res.json({ message: 'Room created successfully' });
	}
	catch (error) {
		res.status(500).json({ error: error.message || 'Something went wrong', message: 'Error creating room' });
	};
};

exports.get_user_rooms = async function (req, res) {
	const userId = req.params.userId;

	try {
		// Find all rooms where the user is a member
		const rooms = await Room.find({ members: userId }).populate('owner', 'username').populate('members', 'username');

		res.json({ rooms });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error getting user rooms'
		});
	}
};

exports.get_room_members = async function (req, res) {
	const roomId = req.params.roomId;

	try {
		// Find the room by ID and populate the members field
		const room = await Room.findById(roomId).populate('members', 'username');

		res.json({ members: room.members });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error getting room members'
		});
	}
};

exports.get_room_messages = async function (req, res) {
	const roomId = req.params.roomId;

	try {
		// Find all messages for the specified room (assuming you have a Message model)
		const messages = await Message.find({ room: roomId }).populate('sender', 'username');

		res.json({ messages });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error getting room messages'
		});
	}
};

exports.add_room_member = async function (req, res) {
	const { userId, roomId } = req.body;

	try {
		const user = await User.findById(userId);
		const room = await Room.findById(roomId);

		if (!user || !room) {
			return res.status(400).json({ error: 'User or room does not exist' });
		}

		// Add the user to the room's members array if they are not already a member
		if (room.members.includes(userId)) {
			return res.status(400).json({ error: 'User is already a member of the room' });
		}
		room.members.push(userId);

		await room.save();

		res.json({ message: 'User added to room successfully' });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error adding user to room'
		});
	}
};
