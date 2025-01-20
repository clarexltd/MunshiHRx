const User = require("../models/User");
const { verifyToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");

const userController = {
  async getUserData(req, res) {
    const { token } = req.body;

    try {
      const decoded = verifyToken(token);
      const { email } = decoded;

      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }

      logger.info(`User data fetched for email: ${email}`);
      res.json({ data: user });
    } catch (error) {
      logger.error(`Error fetching user data: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;