const { sendEmail } = require("../Services/Email");
const { createEmailContent } = require("../view/emailview");
const HTTP = require("../utils/httpStatusCodes");

const sendNotification = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(HTTP.BadRequest).json({
      error: "Missing required fields: to, subject, message",
    });
  }

  try {
    // Generate HTML email content
    const emailContent = createEmailContent(subject, message);

    // Attempt to send the email
    const result = await sendEmail(to, subject, emailContent);

    if (result.success) {
      return res.status(HTTP.OK).json({
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    }

    // If sending failed, send detailed error
    return res.status(HTTP.InternalServerError).json({
      error: "Failed to send email",
      details: result.details,
    });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    return res.status(HTTP.InternalServerError).json({
      error: "Unexpected error while sending email",
      details: err.message,
    });
  }
};

module.exports = { sendNotification };
