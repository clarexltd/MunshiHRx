const transporter = require("../config/mailer");

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };