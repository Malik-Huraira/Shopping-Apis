// emailUtils.js
const nodemailer = require("nodemailer");
const Email = require("../model/email"); // Ensure this is the correct import path

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err, success) => {
    if (err) {
      logger.error("SMTP Connection FAILED:", err);
    } else {
      logger.info("SMTP Connection READY");
    }
  });

  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent:", info.messageId);

    // Save to DB after sending email
    await Email.create({
      recipient: to,
      subject,
      body: message,
      status: "sent", // Mark it as sent
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error("SMTP Error:", {
      code: error.code,
      response: error.response,
      stack: error.stack,
    });

    // Save to DB even if email sending fails
    await Email.create({
      recipient: to,
      subject,
      body: message,
      status: "failed", // Mark it as failed
    });

    return {
      success: false,
      error: "Failed to send email",
      details: error.response,
    };
  }
};

module.exports = { sendEmail };
