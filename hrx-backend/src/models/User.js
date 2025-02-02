// --- D:\App\MunshiHR Application\hrx-backend\src\models\User.js ---
const pool = require("../config/db");

const User = {
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        work_email,
        password,
        job_title,
        work_phone,
        marital,
        gender,
        birthday
      FROM hr_employee 
      WHERE work_email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async updatePassword(email, passwordHash) {
    await pool.query(
      "UPDATE hr_employee SET password = $1 WHERE work_email = $2",
      [passwordHash, email]
    );
  },

  async createOTP(email, otp, expiresAt) {
    const existingOTP = await pool.query(
      "SELECT * FROM hr_user_mobile_otps WHERE username = $1",
      [email]
    );

    if (existingOTP.rows.length > 0) {
      await pool.query(
        "UPDATE hr_user_mobile_otps SET otp = $1, expires_at = $2 WHERE username = $3",
        [otp, expiresAt, email]
      );
    } else {
      await pool.query(
        "INSERT INTO hr_user_mobile_otps (username, otp, expires_at) VALUES ($1, $2, $3)",
        [email, otp, expiresAt]
      );
    }
  },

  async verifyOTP(email, otp) {
    const result = await pool.query(
      "SELECT otp, expires_at FROM hr_user_mobile_otps WHERE username = $1",
      [email]
    );
    return result.rows[0];
  },

  // New method: Find employees by supervisor ID
  async findBySupervisor(supervisorId) {
    const result = await pool.query(
      `SELECT 
         id, 
         name, 
         work_email,
         job_title,
         work_phone,
         mobile_phone,
         department_id,
         supervisor_id,
         create_date,
         write_date
       FROM hr_employee
       WHERE supervisor_id = $1`,
      [supervisorId]
    );
    return result.rows;
  },
  async findAttendanceHistoryByEmployeeId(employeeId) {
    const result = await pool.query(
      `SELECT 
         id, 
         employee_id, 
         check_in, 
         check_out, 
         worked_hours, 
         overtime_hours,
         in_country_name, 
         in_city, 
         in_ip_address, 
         in_browser, 
         in_mode, 
         out_country_name, 
         out_city, 
         out_ip_address, 
         out_browser, 
         out_mode,
         in_latitude, 
         in_longitude, 
         out_latitude, 
         out_longitude, 
         create_date, 
         write_date
       FROM hr_attendance
       WHERE employee_id = $1
       ORDER BY check_in DESC`,
      [employeeId]
    );
    return result.rows;
  },
  // Find check-in record by employee ID and date
  async findCheckInByDate(employeeId, date) {
    const result = await pool.query(
      `SELECT * FROM hr_attendance 
       WHERE employee_id = $1 AND DATE(check_in) = $2`,
      [employeeId, date]
    );
    return result.rows[0]; // Returns the record if it exists, otherwise null
  },

  // Create a new check-in record
  async createCheckIn(employeeId, checkInData) {
    const { checkInTime, inLatitude, inLongitude } = checkInData;

    const result = await pool.query(
      `INSERT INTO hr_attendance (
         employee_id, 
         check_in, 
         in_latitude, 
         in_longitude, 
         create_date, 
         write_date
       ) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [employeeId, checkInTime, inLatitude, inLongitude]
    );
    return result.rows[0];
  },

  // Update an existing check-in record with check-out details
  async updateCheckOut(employeeId, date, checkOutData) {
    const { checkOutTime, outLatitude, outLongitude } = checkOutData;

    const result = await pool.query(
      `UPDATE hr_attendance 
       SET 
         check_out = $1, 
         out_latitude = $2, 
         out_longitude = $3, 
         worked_hours = EXTRACT(EPOCH FROM ($1 - check_in)) / 3600, 
         write_date = NOW()
       WHERE employee_id = $4 AND DATE(check_in) = $5 
       RETURNING *`,
      [checkOutTime, outLatitude, outLongitude, employeeId, date]
    );
    return result.rows[0];
  },
};

module.exports = User;
