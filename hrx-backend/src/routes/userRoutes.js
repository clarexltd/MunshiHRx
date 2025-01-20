const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/userdata", authMiddleware, userController.getUserData);

module.exports = router;