const express = require("express");

const UserController = require("../controllers/user.controller");
const authorizeLoggedInUser = require("../authorizeLoggedInUser");

const router = express.Router();

router.get(
	"/list",
	authorizeLoggedInUser,
	UserController.get_all_users
);
router.get(
	"/profile",
	authorizeLoggedInUser,
	UserController.get_user_profile
);

module.exports = router;