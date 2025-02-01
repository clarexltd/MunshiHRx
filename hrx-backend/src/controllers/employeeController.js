// --- D:\App\MunshiHR Application\hrx-backend\src\controllers\employeeController.js ---
const User = require("../models/User");
const logger = require("../utils/logger");

const employeeController = {
  async getEmployeesBySupervisor(req, res) {
    const { supervisor_id } = req.params; // supervisor_id is passed as a URL parameter

    if (!supervisor_id) {
      logger.warn("Supervisor ID is required");
      return res.status(400).json({ error: "Supervisor ID is required" });
    }

    try {
      const employees = await User.findBySupervisor(supervisor_id);

      logger.info(`Found ${employees.length} employee(s) for supervisor ID: ${supervisor_id}`);
      res.json(employees);
    } catch (error) {
      logger.error(`Error fetching employees for supervisor ${supervisor_id}: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },
    async getAttendanceHistory(req, res) {
    const { employee_id, user_id } = req.params; // Check for employee_id or user_id as parameters

    if (!employee_id && !user_id) {
      logger.warn("Employee ID or User ID is required");
      return res.status(400).json({ error: "Employee ID or User ID is required" });
    }

    const id = employee_id || user_id; // Use the provided ID (employee_id or user_id)

    try {
      const attendanceHistory = await User.getAttendanceHistory(id);

      if (attendanceHistory.length === 0) {
        logger.info(`No attendance history found for ID: ${id}`);
        return res.status(404).json({ message: "No attendance history found" });
      }

      logger.info(`Found ${attendanceHistory.length} attendance record(s) for ID: ${id}`);
      res.json(attendanceHistory);
    } catch (error) {
      logger.error(`Error fetching attendance history for ID ${id}: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = employeeController;
