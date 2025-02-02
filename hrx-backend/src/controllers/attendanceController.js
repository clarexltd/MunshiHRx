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
  },
  async checkIn(req, res) {
    const { employee_id, checkInTime, inLatitude, inLongitude } = req.body;
  
    if (!employee_id || !checkInTime || !inLatitude || !inLongitude) {
      logger.warn("Employee ID, check-in time, latitude, and longitude are required");
      return res.status(400).json({ error: "Employee ID, check-in time, latitude, and longitude are required" });
    }
  
    try {
      const currentDate = new Date(checkInTime).toISOString().split("T")[0];
  
      // Check if a check-in record already exists for the day
      const existingRecord = await User.findCheckInByDate(employee_id, currentDate);
  
      if (existingRecord) {
        logger.info(`Check-in already exists for employee ID: ${employee_id} on ${currentDate}`);
        return res.status(200).json({ message: "Check-in already recorded", record: existingRecord });
      }
  
      // Create a new check-in record
      const checkInData = { checkInTime, inLatitude, inLongitude };
      const newRecord = await User.createCheckIn(employee_id, checkInData);
      logger.info(`New check-in created for employee ID: ${employee_id}`);
      res.status(201).json({ message: "Check-in successful", record: newRecord });
    } catch (error) {
      logger.error(`Error during check-in: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async checkOut(req, res) {
    const { employee_id, checkOutTime, outLatitude, outLongitude } = req.body;
  
    if (!employee_id || !checkOutTime || !outLatitude || !outLongitude) {
      logger.warn("Employee ID, check-out time, latitude, and longitude are required");
      return res.status(400).json({ error: "Employee ID, check-out time, latitude, and longitude are required" });
    }
  
    try {
      const currentDate = new Date(checkOutTime).toISOString().split("T")[0];
  
      // Check if a check-in record exists for the day
      const existingRecord = await User.findCheckInByDate(employee_id, currentDate);
  
      if (!existingRecord) {
        logger.warn(`No check-in found for employee ID: ${employee_id} on ${currentDate}`);
        return res.status(400).json({ error: "No check-in record found for today" });
      }
  
      // Update the existing record with check-out details
      const checkOutData = { checkOutTime, outLatitude, outLongitude };
      const updatedRecord = await User.updateCheckOut(employee_id, currentDate, checkOutData);
      logger.info(`Check-out updated for employee ID: ${employee_id}`);
      res.status(200).json({ message: "Check-out successful", record: updatedRecord });
    } catch (error) {
      logger.error(`Error during check-out: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = attendanceController;
