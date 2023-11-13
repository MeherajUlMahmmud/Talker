const Message = require("../models/message.model");
const Room = require("../models/room.model");
const User = require("../models/user.model");

exports.create_room = async function (req, res) {
	const { userId } = req.userId;
	const { name } = req.body;

	try {
		if (!name) {
			return res.status(400).json({ message: 'Room name is required' });
		}

		// Create a new room in the database
		const room = new Room({
			name: name,
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
	const { ownerId } = req.userId;
	const { userId, roomId } = req.body;

	try {
		const user = await User.findById(userId);
		const room = await Room.findById(roomId);

		if (!user || !room) {
			return res.status(400).json({ error: 'User or room does not exist' });
		}

		// Check if the requested user is the owner of the room
		if (room.owner !== ownerId) {
			return res.status(400).json({ message: 'You are not the owner of this room' });
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

exports.remove_room_member = async function (req, res) {
	const { userId } = req.userId;
	const { memberId, roomId } = req.body;

	if (!memberId || !roomId) {
		return res.status(400).json({ error: 'Member ID and room ID are required' });
	}

	try {
		const member = await User.findById(memberId);
		const room = await Room.findById(roomId);

		if (!member || !room) {
			return res.status(400).json({ error: 'Member or room does not exist' });
		}

		// Check if the requested user is the owner of the room
		const ownerId = room.owner._id.toString();
		if (ownerId !== userId) {
			return res.status(400).json({ message: 'You are not the owner of this room' });
		}

		// Remove the user from the room's members array if they are already a member
		if (!room.members.includes(memberId)) {
			return res.status(400).json({ error: 'User is not a member of the room' });
		}
		room.members.pull(memberId);

		await room.save();

		res.json({ message: 'User removed from room successfully' });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error removing user from room'
		});
	}
}

exports.update_room = async function (req, res) {
	const { userId } = req.userId;
	const { roomId } = req.params;
	const { roomName, roomDescription } = req.body;

	try {
		if (!roomName) {
			return res.status(400).json({ message: 'Room name is required' });
		}

		// Find the room by ID
		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(400).json({ message: 'Room does not exist' });
		}

		// Check if the requested user is the owner of the room
		if (room.owner !== userId) {
			return res.status(400).json({ message: 'You are not the owner of this room' });
		}

		// Update the room name and description
		room.name = roomName;
		room.description = roomDescription;

		await room.save();

		res.json({ message: 'Room updated successfully' });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error updating room'
		});
	}
}

exports.delete_room = async function (req, res) {
	const roomId = req.params.roomId;

	try {
		// Find the room by ID and delete it
		await Room.findByIdAndDelete(roomId);

		// Delete all messages for the room
		await Message.deleteMany({ room: roomId });

		res.json({ message: 'Room deleted successfully' });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error deleting room'
		});
	}
}
