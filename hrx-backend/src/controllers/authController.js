const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");

const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordMatch = verifyPassword(password, user.name, user.id, user.password);
      if (!isPasswordMatch) {
        logger.warn(`Invalid password for email: ${email}`);
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = generateToken({ id: user.id, email: user.work_email });
      logger.info(`Login successful for email: ${email}`);
      res.json({ token });
    } catch (error) {
      logger.error(`Error during login: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async setPassword(req, res) {
    const { email, newPassword } = req.body;
    logger.info(`Setting new password for email: ${email}`);

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }

      const passwordHash = hashPassword(newPassword, user.name, user.id);
      await User.updatePassword(email, passwordHash);

      const token = generateToken({ email });
      logger.info(`Password set successfully for email: ${email}`);
      res.json({ token });
    } catch (error) {
      logger.error(`Error setting password: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = authController;