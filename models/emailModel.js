const nodemailer = require('nodemailer');
require('dotenv').config();


const sendEmail = async (to, subject, message) => {
    // Setup transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Mail options
    const mailOptions = {
        from: `"Notifier" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message,
    };

    
    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
    
};

module.exports = { sendEmail };
