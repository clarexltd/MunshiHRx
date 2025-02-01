// --- D:\App\MunshiHR Application\hrx-backend\src\routes\employeeRoutes.js ---
const express = require("express");
const employeeController = require("../controllers/employeeController");

const router = express.Router();


router.get("/supervisor/:supervisor_id", employeeController.getEmployeesBySupervisor);

module.exports = router;
