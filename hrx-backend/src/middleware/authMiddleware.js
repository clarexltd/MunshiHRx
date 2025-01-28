const { verifyToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      logger.warn("No Authorization header present");
      return res.status(401).json({ error: "Authorization header required" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      logger.warn("Invalid Authorization header format");
      return res.status(401).json({ error: "Invalid authorization format" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;