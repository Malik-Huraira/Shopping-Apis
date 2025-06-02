const nodemailer = require("nodemailer");
const EmailLog = require("../models/emailModel");

// Reuse transporter instead of creating it every time
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection once on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP Connection FAILED:", err.message);
  } else {
    console.log("✅ SMTP Connection READY");
  }
});

const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // Log success to MongoDB
    await EmailLog.create({
      to,
      subject,
      message,
      status: "sent",
      messageId: info.messageId,
    });

    console.log("📧 Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Log failure to MongoDB
    await EmailLog.create({
      to,
      subject,
      message,
      status: "failed",
      error: error.response || error.message,
    });

    console.error("❌ SMTP Error:", {
      name: error.name,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });

    return {
      success: false,
      error: "Failed to send email",
      details: error.response || error.message,
    };
  }
};

module.exports = { sendEmail };
