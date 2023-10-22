const express = require('express');
const bodyParser = require("body-parser");
const databse = require('./database');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const authorizeLoggedInUser = require('./authorizeLoggedInUser');
const User = require('./models/user.model');
const Room = require('./models/room.model');
const Message = require('./models/message.model');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const JWT_SECRET = process.env.JWT_SECRET;

const PORT = process.env.PORT || 8000;

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
	console.log(`User connected ${socket.id}`);

	// We can write our socket event listeners in here...
});

app.get('/', (req, res) => res.send('Hello world'));

// User Signup
app.post('/api/auth/signup', async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(404).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			_id: new databse.Types.ObjectId(),
			username,
			password: hashedPassword,
		});

		await user.save();
		res.json({ message: 'User registered successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Error registering user' });
	}
});

// User Login
app.post('/api/auth/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid password' });
		}

		const token = jwt.sign({ userId: user._id }, JWT_SECRET);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: 'Error during login' });
	}
});

// Get All Users
app.get('/api/users', authorizeLoggedInUser, async (req, res) => {
	try {
		const users = await User.find().select('-password');
		res.json({ users });
	} catch (error) {
		res.status(500).json({ error: 'Error getting users' });
	}
});

// User Profile
app.get('/api/profile', authorizeLoggedInUser, async (req, res) => {
	const { userId } = req.userId;
	const user = await User.findById(userId).select('-password');
	res.json({ user });
});

// Endpoint to create a new room
app.post('/api/room/create', authorizeLoggedInUser, async (req, res) => {
	const { userId } = req.userId;
	const { roomName } = req.body;

	if (!roomName) {
		return res.status(400).json({ error: 'Room name is required' });
	}

	// Create a new room in the database
	const room = new Room({
		name: roomName,
		owner: userId, // Assuming you have the user ID stored in a variable called userId
		members: [userId], // Add the owner to the list of members
	});

	await room.save();

	res.json({ message: 'Room created successfully' });
});

// Endpoint to get rooms associated with a user
app.get('/api/room/associated/:userId', authorizeLoggedInUser, async (req, res) => {
	const userId = req.params.userId;

	try {
		// Find all rooms where the user is a member
		const rooms = await Room.find({ members: userId }).populate('owner', 'username').populate('members', 'username');

		res.json({ rooms });
	} catch (error) {
		res.status(500).json({ error: 'Error getting user rooms' });
	}
});

// Endpoint to get all messages for a room
app.get('/api/room-messages/:roomId', authorizeLoggedInUser, async (req, res) => {
	const roomId = req.params.roomId;

	try {
		// Find all messages for the specified room (assuming you have a Message model)
		const messages = await Message.find({ room: roomId }); // Adjust the Message model and field as needed.

		res.json({ messages });
	} catch (error) {
		res.status(500).json({ error: 'Error getting room messages' });
	}
});

app.listen(PORT, () => `Server is running on port ${PORT}`);
