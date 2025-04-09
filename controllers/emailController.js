const { sendEmail } = require('../models/emailModel');
const { createEmailContent } = require('../view/emailview');

const sendNotification = async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the email content (View)
    const emailContent = createEmailContent(subject, message);

    // Send the email (Model)
    const emailResponse = await sendEmail(to, subject, emailContent);

    if (emailResponse.success) {
        return res.status(200).json(emailResponse);
    } else {
        return res.status(500).json(emailResponse);
    }
    
};

module.exports = { sendNotification };
