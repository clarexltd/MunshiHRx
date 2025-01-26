const User = require("../models/User");
const { sendEmail } = require("../services/mailService");
const crypto = require("crypto");
const logger = require("../utils/logger");

const otpController = {
  async sendOTP(req, res) {
    const { email } = req.body;

    if (!email) {
      logger.warn("Email is required");
      return res.status(400).json({ error: "Email is required" });
    }

    logger.info(`Sending OTP to email: ${email}`);

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

      await User.createOTP(email, otp, expiresAt);
      await sendEmail(email, "Your OTP for Password Reset", `Your OTP is: ${otp}`);

      logger.info(`OTP sent to ${email} ${otp}`);
      res.json({ message: "OTP sent" });
    } catch (error) {
      logger.error(`Error sending OTP: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async verifyOTP(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      logger.warn("Email and OTP are required");
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    logger.info(`Verifying OTP for email: ${email}`);

    try {
      const otpData = await User.verifyOTP(email, otp);
      if (!otpData || otpData.otp !== otp || new Date() > otpData.expires_at) {
        logger.warn(`Invalid OTP or OTP expired for email: ${email}`);
        return res.status(400).json({ error: "Invalid OTP or OTP expired" });
      }

      logger.info(`OTP verified for email: ${email}`);
      res.json({ message: "OTP verified" });
    } catch (error) {
      logger.error(`Error verifying OTP: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = otpController;