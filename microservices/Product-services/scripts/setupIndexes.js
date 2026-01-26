// Example using MySQL connection
const db = require("../config/db");
const { logger } = require("../utils/logger");

const queries = [
  // Order Items
  "CREATE INDEX idx_order_items_order_id ON order_items(order_id)",
  "CREATE INDEX idx_order_items_product_id ON order_items(product_id)",
];

(async () => {
  for (let q of queries) {
    try {
      await db.query(q);
      logger.info(`✅ Applied: ${q}`);
    } catch (err) {
      logger.error(`❌ Error with: ${q}`, err.message);
    }
  }
})();
