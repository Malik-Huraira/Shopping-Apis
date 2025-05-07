// emailUtils.js
const nodemailer = require('nodemailer');
const Email = require('../model/email'); // Ensure this is the correct import path

const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    transporter.verify((err, success) => {
        if (err) {
            console.error('SMTP Connection FAILED:', err);
        } else {
            console.log('SMTP Connection READY');
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
        console.log('Email sent:', info.messageId);

        // Save to DB after sending email
        await Email.create({
            recipient: to,
            subject,
            body: message,
            status: 'sent', // Mark it as sent
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('SMTP Error:', {
            code: error.code,
            response: error.response,
            stack: error.stack,
        });

        // Save to DB even if email sending fails
        await Email.create({
            recipient: to,
            subject,
            body: message,
            status: 'failed', // Mark it as failed
        });

        return {
            success: false,
            error: 'Failed to send email',
            details: error.response,
        };
    }
};

module.exports = { sendEmail };
