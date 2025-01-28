const User = require("../models/User");
const { verifyToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");

const userController = {
  async getProfile(req, res) {
    try {
      const { email } = req.user;

      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }

      // Sanitize user data before sending
      const userProfile = {
        id: user.id,
        name: user.name,
        email: user.work_email,
        job_title: user.job_title,
        phoneNumber: user.work_phone,
        marital: user.marital,
        gender: user.gender,
        birthday: user.birthday
      };

      logger.info(`Profile data fetched for user: ${email}`);
      res.json(userProfile);
    } catch (error) {
      logger.error(`Error fetching user profile: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = userController;