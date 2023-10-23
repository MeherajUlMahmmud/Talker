const User = require("../models/user.model");

exports.get_all_users = async function (req, res) {
	try {
		const users = await User.find().select('-password');
		res.json({ users });
	} catch (error) {
		res.status(500).json({
			error: error.message || "Something went wrong",
			message: 'Error getting users'
		});
	}
};

exports.get_user_profile = async function (req, res) {
	try {
		const { userId } = req.userId;
		const user = await User.findById(userId).select('-password');
		res.json({ user });
	} catch (error) {
		res.status(500).json({
			error: error.message || "Something went wrong",
			message: 'Error getting user profile'
		});
	}
};
