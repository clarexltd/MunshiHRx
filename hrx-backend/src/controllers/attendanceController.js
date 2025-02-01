// --- D:\App\MunshiHR Application\hrx-backend\src\controllers/attendanceController.js ---

const User = require("../models/User");
const logger = require("../utils/logger");

const attendanceController = {
  async getAttendanceHistory(req, res) {
    const { employee_id } = req.params; // Only accept employee_id

    if (!employee_id) {
      logger.warn("Employee ID is required");
      return res.status(400).json({ error: "Employee ID is required" });
    }

    try {
      const attendanceHistory = await User.findAttendanceHistoryByEmployeeId(employee_id);

      if (attendanceHistory.length === 0) {
        logger.info(`No attendance history found for employee ID: ${employee_id}`);
        // Return 200 OK with a message instead of 404
        return res.status(200).json({ message: "No attendance history found" });
      }

      logger.info(`Found ${attendanceHistory.length} attendance records for employee ID: ${employee_id}`);
      res.json(attendanceHistory);
    } catch (error) {
      logger.error(`Error fetching attendance history for employee ID ${employee_id}: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = attendanceController;
