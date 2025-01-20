const pool = require("../config/db");

const User = {
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM hr_employee WHERE work_email = $1",
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
    // Delete any existing OTP for the user
    await pool.query("DELETE FROM hr_user_mobile_otps WHERE username = $1", [email]);

    // Insert the new OTP
    await pool.query(
      "INSERT INTO hr_user_mobile_otps (username, otp, expires_at) VALUES ($1, $2, $3)",
      [email, otp, expiresAt]
    );
  },

  async verifyOTP(email, otp) {
    const result = await pool.query(
      "SELECT otp, expires_at FROM hr_user_mobile_otps WHERE username = $1",
      [email]
    );
    return result.rows[0];
  },
};

module.exports = User;