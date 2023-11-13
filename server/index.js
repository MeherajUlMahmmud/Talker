const express = require('express');
const bodyParser = require("body-parser");
const database = require("./database");
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

require('dotenv').config();

// Models
const User = require("./models/user.model");
const Room = require("./models/room.model");
const Message = require("./models/message.model");

// Routes
const auth_routes = require("./routes/auth.route");
const user_routes = require("./routes/user.route");
const room_routes = require("./routes/room.route");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const io = socketIO(process.env.SOCKET_PORT || 8001, {
	cors: {
		origin: '*',
		// methods: ['GET', 'POST'],
	},
});

// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on('joinRoom', (data) => {
		const { user_id, room_id } = data;

		try {
			// Join the room
			socket.join(room_id);

			// Emit the room details to the user
			// io.emit('joinRoomResponse', room);

			// Emit to all users in the room that a new user has joined
			// socket.to(room_id).emit('userJoinedRoom', user);
		} catch (error) {
			console.log(error);
			socket.emit('error', error.message);
		}
	});

	socket.on('message', async (data) => {
		const { message, user_id, username, room_id } = data;

		try {
			const newMessage = new Message({
				text: message,
				sender: user_id,
				room: room_id,
			});

			await newMessage.save();

			// Emit the new message to the room
			io.to(room_id).emit('messageResponse', {
				_id: newMessage._id,
				text: newMessage.text,
				sender: {
					_id: user_id,
					username: username,
				},
				room: room_id,
				createdAt: newMessage.createdAt,
			});
		} catch (error) {
			console.log(error);
			socket.emit('error', error.message);
		}
	});

	socket.on('disconnect', () => {
		console.log(`🔥: ${socket.id} user disconnected`);
	});
});

app.get('/', (req, res) => res.send('Hello world'));
app.use("/api/auth", auth_routes);
app.use("/api/user", user_routes);
app.use("/api/room", room_routes);

server.listen(PORT, () => `Server is running on port ${PORT}`);
