// emailModel.js - Updated with better error handling
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'malikhurara123@gmail.com',
            pass: 'wwblpgltokemruay'
        }
    });
    transporter.verify((err, success) => {
        if (err) {
            console.error("SMTP Connection FAILED:", err);
        } else {
            console.log("SMTP Connection READY");
        }
    });

    const mailOptions = {
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message,
        html: `<p>${message}</p>` // Optional HTML version
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('SMTP Error:', {
            code: error.code,
            response: error.response,
            stack: error.stack
        });
        return {
            success: false,
            error: 'Failed to send email',
            details: error.response
        };
    }
};
module.exports = { sendEmail }; 