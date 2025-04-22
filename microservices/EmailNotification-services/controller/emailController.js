const { sendEmail } = require('../model/emailModel');
const { createEmailContent } = require('../view/emailview');
const HTTP = require('../utils/httpStatusCodes'); // Import HTTP status codes

const sendNotification = async (req, res) => {
    const { to, subject, message } = req.body;

    // Input validation
    if (!to || !subject || !message) {
        return res.status(HTTP.BadRequest).json({ error: 'To, Subject, and Message are required.' });
    }

    try {
        // Generate email content from View layer
        const content = createEmailContent(subject, message);

        // Send the email using Model logic
        const { success, info, error } = await sendEmail(to, subject, content);

        if (success) {
            return res.status(HTTP.OK).json({ message: "Email sent successfully", info });
        }

        // Structured error response
        return res.status(HTTP.InternalServerError).json({ error: "Email sending failed", details: error });
    } catch (err) {
        console.error("Email sending error:", err);
        return res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: err.message });
    }
};

module.exports = { sendNotification };
