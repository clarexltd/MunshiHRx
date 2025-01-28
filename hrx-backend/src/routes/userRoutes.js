const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

// Changed from /userdata to /profile to match frontend
router.get("/profile", authMiddleware, userController.getProfile);

module.exports = router;