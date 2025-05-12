const cron = require('node-cron');
const db = require('../model/index');
const { Op } = require('sequelize');

// Runs every minute
cron.schedule('30 * * * *', async () => {
    try {
        console.log('🧹 Cleaning up expired sessions...');

        const now = new Date();

        // Delete expired sessions
        const deleted = await db.Session.destroy({
            where: {
                expiresAt: {
                    [Op.lt]: now
                }
            }
        });

        if (deleted > 0) {
            console.log(`✅ Cleaned up ${deleted} expired sessions.`);
        } else {
            console.log('❌ No expired sessions found to clean.');
        }
    } catch (error) {
        console.error('❌ Failed to clean sessions:', error.stack || error.message);
    }
});
