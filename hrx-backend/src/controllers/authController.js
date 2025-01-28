const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");

const authController = {
  async checkUser(req, res) {
    const { email } = req.body;

    if (!email) {
      logger.warn("Email is required");
      return res.status(400).json({ error: "Email is required" });
    }

    logger.info(`Checking user with email: ${email}`);

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        logger.warn(`User not found: ${email}`);
        return res.status(404).json({ error: "User not found" });
      }

      const passwordExists = user.password !== null;
      res.json({ passwordExists });
    } catch (error) {
      logger.error(`Error checking user: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn("Email and password are required");
      return res.status(400).json({ error: "Email and password are required" });
    }

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

    if (!email || !newPassword) {
      logger.warn("Email and new password are required");
      return res.status(400).json({ error: "Email and new password are required" });
    }

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
  async logout(req, res) {
    try {
      // In a real-world scenario, you might invalidate the token here (e.g., using a blacklist or Redis).
      // For now, we'll just return a success message.
      logger.info(`User logged out`);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error(`Error during logout: ${error}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async validateToken(req, res) {
    const { token } = req.body;

    if (!token) {
      logger.warn("No token provided for validation");
      return res.json({ valid: false });
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findByEmail(decoded.email);
      
      if (!user) {
        logger.warn(`User not found for token validation: ${decoded.email}`);
        return res.json({ valid: false });
      }

      logger.info(`Token validated successfully for user: ${decoded.email}`);
      return res.json({ valid: true });
    } catch (error) {
      logger.warn(`Token validation failed: ${error.message}`);
      return res.json({ valid: false });
    }
  },
};

module.exports = authController;