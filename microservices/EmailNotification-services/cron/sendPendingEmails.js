const cron = require('node-cron');
const Email = require('../model/email');
const sendEmail = require('../utils/email');

// Run every minute (change to hourly with `0 * * * *`)
cron.schedule('30 * * * *', async () => {
    console.log('📧 Checking for pending emails...');

    try {
        const pendingEmails = await Email.findAll({ where: { status: 'pending' } });
        for (const email of pendingEmails) {
            if (email.retryCount < 3) {
                try {
                    await sendEmail(email.recipient, email.subject, email.body);
                    await email.update({ status: 'sent' });
                    console.log(`✅ Sent email to ${email.recipient}`);
                } catch (err) {
                    await email.update({
                        status: 'failed',
                        retryCount: email.retryCount + 1,
                    });
                    console.error(`❌ Failed to send email to ${email.recipient}:`, err.message);
                }
            } else {
                console.warn(`🚫 Skipping ${email.recipient}, max retries reached`);
            }
        }
    } catch (err) {
        console.log('Email model type:', typeof Email); // Should be 'function'
        console.error('❌ Error fetching pending emails:', err.message);
    }
});
