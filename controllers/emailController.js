const { sendEmail } = require('../Model/emailModel');
const { createEmailContent } = require('../view/emailview');
const HTTP = require('../utils/httpStatusCodes');

const sendNotification = async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(HTTP.BadRequest).json({ error: 'Missing required fields' });
    }

    try {
        // Create the email content (View)
        const emailContent = createEmailContent(subject, message);

        // Send the email (Model)
        const emailResponse = await sendEmail(to, subject, emailContent);

        if (emailResponse.success) {
            return res.status(HTTP.OK).json(emailResponse);
        } else {
            return res.status(HTTP.InternalServerError).json(emailResponse);
        }
    } catch (err) {
        console.error("Email sending error:", err);
        return res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: err.message });
    }
};

module.exports = { sendNotification };
