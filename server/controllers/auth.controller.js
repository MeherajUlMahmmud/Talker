const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require("./../database");
const User = require("../models/user.model");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async function (req, res) {
	const { username, name, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(404).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			_id: new database.Types.ObjectId(),
			username,
			name,
			password: hashedPassword,
		});

		await user.save();
		res.json({ message: 'User registered successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Error registering user' });
	}
};

exports.login = async function (req, res) {
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

		const userToSend = {
			_id: user._id,
			username: user.username,
			name: user.name,
			createdAt: user.createdAt,
		};
		res.json({ token, user: userToSend });
	} catch (error) {
		res.status(500).json({
			error: error.message || 'Something went wrong',
			message: 'Error during login',
		});
	}
};
