// --- D:\App\MunshiHR Application\hrx-backend\src\app.js ---
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes"); // Import the new employee routes
const attendanceRoutes = require("./routes/attendanceRoutes"); // Import the attendance routes

const logger = require("./utils/logger");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/user", userRoutes);
app.use("/api/employees", employeeRoutes); // Register the new route
app.use("/api/attendance", attendanceRoutes); // Register the attendance route

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
