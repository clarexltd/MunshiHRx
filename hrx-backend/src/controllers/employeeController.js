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
  }
};

module.exports = employeeController;
