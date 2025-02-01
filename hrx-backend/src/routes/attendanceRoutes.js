// --- D:\App\MunshiHR Application\hrx-backend\src\routes/attendanceRoutes.js ---

const express = require("express");
const attendanceController = require("../controllers/attendanceController");

const router = express.Router();

// GET route to retrieve attendance history by employee_id
// Example: GET /api/attendance/history/employee/126
router.get("/history/employee/:employee_id", attendanceController.getAttendanceHistory);

module.exports = router;
