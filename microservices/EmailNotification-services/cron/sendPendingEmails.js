const cron = require('node-cron');
const Email = require('../model/email');
const sendEmail = require('../utils/email');

// Run every minute (change to hourly with `0 * * * *`)
cron.schedule('30 * * * *', async () => {
    logger.info('📧 Checking for pending emails...');

    try {
        const pendingEmails = await Email.findAll({ where: { status: 'pending' } });
        for (const email of pendingEmails) {
            if (email.retryCount < 3) {
                try {
                    await sendEmail(email.recipient, email.subject, email.body);
                    await email.update({ status: 'sent' });
                    logger.info(`✅ Sent email to ${email.recipient}`);
                } catch (err) {
                    await email.update({
                        status: 'failed',
                        retryCount: email.retryCount + 1,
                    });
                    logger.error(`❌ Failed to send email to ${email.recipient}:`, err.message);
                }
            } else {
                logger.warn(`🚫 Skipping ${email.recipient}, max retries reached`);
            }
        }
    } catch (err) {
        logger.info('Email model type:', typeof Email); // Should be 'function'
        logger.error('❌ Error fetching pending emails:', err.message);
    }
});

