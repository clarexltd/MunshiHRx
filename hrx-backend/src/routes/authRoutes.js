const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/checkuser", authController.checkUser);
router.post("/login", authController.login);
router.post("/setpassword", authController.setPassword);
router.post("/logout", authController.logout);
router.post("/validate", authController.validateToken);

module.exports = router;