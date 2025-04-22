// Example using MySQL connection
const db = require('../config/db');

const queries = [
    // Orders
    "CREATE INDEX idx_orders_user_id ON orders(user_id)",
    "CREATE INDEX idx_orders_created_at ON orders(created_at)",

    // Order Items
    "CREATE INDEX idx_order_items_order_id ON order_items(order_id)",
    "CREATE INDEX idx_order_items_product_id ON order_items(product_id)"
];

(async () => {
    for (let q of queries) {
        try {
            await db.query(q);
            console.log(`✅ Applied: ${q}`);
        } catch (err) {
            console.error(`❌ Error with: ${q}`, err.message);
        }
    }
})();
