const express = require("express");
const otpController = require("../controllers/otpController");

const router = express.Router();

router.post("/sendotp", otpController.sendOTP);
router.post("/verifyotp", otpController.verifyOTP);

module.exports = router;