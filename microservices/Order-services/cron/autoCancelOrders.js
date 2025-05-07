const cron = require('node-cron');
const Order  = require('../model/Order'); 

// Run every X minutes (e.g., every 5 min for testing)
cron.schedule('*/10 * * * *', async () => {
    console.log('🔁 Running auto-cancel cron for orders...');

    try {
        const cutoff = new Date(Date.now() - 60 * 60 * 1000); // 30 minutes ago

        const result = await Order.update(
            { status: 'cancelled' },
            {
                where: {
                    status: 'pending',
                    createdAt: { [require('sequelize').Op.lt]: cutoff }
                }
            }
        );

        console.log(`✅ Cancelled ${result[0]} orders.`);
    } catch (err) {
        console.error('❌ Cron error:', err.message);
    }
});
