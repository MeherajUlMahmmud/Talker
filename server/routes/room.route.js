const express = require("express");

const RoomController = require("../controllers/room.controller");
const authorizeLoggedInUser = require("../authorizeLoggedInUser");

const router = express.Router();

router.post(
	"/create",
	authorizeLoggedInUser,
	RoomController.create_room
);
router.get(
	"/associated/:userId",
	authorizeLoggedInUser,
	RoomController.get_user_rooms
);
router.get(
	"/members/:roomId",
	authorizeLoggedInUser,
	RoomController.get_room_members
);
router.get(
	"/messages/:roomId",
	authorizeLoggedInUser,
	RoomController.get_room_messages
);
router.post(
	"/add-member",
	authorizeLoggedInUser,
	RoomController.add_room_member
);
router.post(
	"/remove-member",
	authorizeLoggedInUser,
	RoomController.remove_room_member
);
router.patch(
	"/update/:roomId",
	authorizeLoggedInUser,
	RoomController.update_room
);
router.delete(
	"/delete/:roomId",
	authorizeLoggedInUser,
	RoomController.delete_room
);

module.exports = router;