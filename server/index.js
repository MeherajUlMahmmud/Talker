const express = require('express');
const bodyParser = require("body-parser");
const database = require("./database");
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// Models
const User = require("./models/user.model");
const Room = require("./models/room.model");
const Message = require("./models/message.model");

// Routes
const auth_routes = require("./routes/auth.route");
const user_routes = require("./routes/user.route");
const room_routes = require("./routes/room.route");

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const socket_io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

// Listen for when the client connects via socket.io-client
socket_io.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on('joinRoom', async (data) => {
		console.log("JOIN ROOM");
		console.log(data);
		const { user_id, room_id } = data;

		try {
			const user = await User.findById(user_id);
			const room = await Room.findById(room_id);

			if (!user || !room) {
				return socket.emit('error', 'User or room does not exist');
			}

			// Join the room
			socket.join(room_id);

			// Emit the room details to the user
			socket.emit('joinRoomResponse', room);

			// Emit to all users in the room that a new user has joined
			socket.to(room_id).emit('userJoinedRoom', user);
		} catch (error) {
			console.log(error);
			socket.emit('error', error.message);
		}
	});


	socket.on('message', async (data) => {
		console.log("MESSAGE");
		console.log(data);
		const { message, user_id, room_id } = data;

		try {
			const user = await User.findById(user_id);
			const room = await Room.findById(room_id);

			if (!user || !room) {
				return socket.emit('error', 'User or room does not exist');
			}

			const newMessage = new Message({
				text: message,
				sender: user_id,
				room: room_id,
			});

			await newMessage.save();

			const populatedMessage = await newMessage.populate('sender', 'username');
			// Emit the new message to the room
			// socket.emit('messageResponse', newMessage);
			socket.to(room_id).emit('messageResponse', populatedMessage);
		} catch (error) {
			console.log(error);
			socket.emit('error', error.message);
		}

	});

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
	});
});

app.get('/', (req, res) => res.send('Hello world'));
app.use("/api/auth", auth_routes);
app.use("/api/user", user_routes);
app.use("/api/room", room_routes);

server.listen(PORT, () => `Server is running on port ${PORT}`);
