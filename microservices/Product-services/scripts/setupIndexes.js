// Example using MySQL connection
const db = require('../config/db');

const queries = [

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
