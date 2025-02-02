const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const router = express.Router();

// Check-in route
router.post("/checkin", attendanceController.checkIn);

// Check-out route
router.post("/checkout", attendanceController.checkOut);

// Attendance history route
router.get("/history/employee/:employee_id", attendanceController.getAttendanceHistory);

module.exports = router;